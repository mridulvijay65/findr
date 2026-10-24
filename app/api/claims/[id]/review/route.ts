import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import crypto from 'crypto';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// POST /api/claims/[id]/review - Approve or reject an ownership claim
export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { action, reviewerId, reviewNotes } = body;

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Valid action ("approve" | "reject") is required' },
        { status: 400 }
      );
    }

    if (!reviewerId) {
      return NextResponse.json(
        { error: 'Reviewer ID is required for authorization' },
        { status: 401 }
      );
    }

    // 1. Fetch claim and associated item
    const claim = await prisma.claim.findUnique({
      where: { id },
      include: {
        item: {
          include: {
            reporter: true,
          },
        },
        claimant: true,
      },
    });

    if (!claim) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    // 2. Fetch reviewer details to check role
    const reviewer = await prisma.user.findUnique({
      where: { id: reviewerId },
    });

    if (!reviewer) {
      return NextResponse.json({ error: 'Reviewer not found' }, { status: 404 });
    }

    // 3. Authorization check: Must be the original item reporter OR campus security
    const isReporter = claim.item.reporterId === reviewerId;
    const isSecurity = reviewer.role === 'security';

    if (!isReporter && !isSecurity) {
      return NextResponse.json(
        { error: 'Forbidden: You are not authorized to review this claim.' },
        { status: 403 }
      );
    }

    // 4. Prevent review if already resolved
    if (claim.status === 'approved' && action === 'approve') {
      return NextResponse.json(
        { error: 'This claim has already been approved.' },
        { status: 400 }
      );
    }

    if (action === 'approve') {
      // Generate cryptographically secure 6-digit OTP
      const secureOtp = crypto.randomInt(100000, 999999).toString();
      const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours expiry

      const updatedClaim = await prisma.claim.update({
        where: { id },
        data: {
          status: 'approved',
          otpCode: secureOtp,
          otpExpiresAt: expiresAt,
          attemptCount: 0,
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || 'Ownership proof verified successfully.',
        },
      });

      // Update item status and lock-in the OTP
      await prisma.item.update({
        where: { id: claim.itemId },
        data: {
          status: 'Claimed',
          lockerOtp: secureOtp,
        },
      });

      // Award Good Karma points to the item reporter
      await prisma.user.update({
        where: { id: claim.item.reporterId },
        data: {
          karmaPoints: { increment: claim.item.karmaReward },
          itemsReunited: { increment: 1 },
        },
      });

      // Record Audit Trail
      await prisma.auditLog.create({
        data: {
          action: 'CLAIM_APPROVED',
          userId: reviewerId,
          targetId: claim.id,
          details: {
            itemId: claim.itemId,
            claimantId: claim.claimantId,
            reviewerRole: reviewer.role,
            handoverMethod: claim.handoverMethod,
          },
        },
      });

      // Send In-App Notification to Claimant
      await prisma.notification.create({
        data: {
          title: `Claim Approved: ${claim.item.title}`,
          description: `Your ownership proof was approved by ${reviewer.name}. Retrieve via locker using OTP: ${secureOtp}`,
          badge: 'Verified',
          userId: claim.claimantId,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Claim approved successfully. Locker OTP generated for claimant.',
        claim: updatedClaim,
      });
    } else {
      // Reject claim
      const updatedClaim = await prisma.claim.update({
        where: { id },
        data: {
          status: 'rejected',
          reviewedAt: new Date(),
          reviewNotes: reviewNotes || 'Provided details do not match item custody record.',
        },
      });

      // Record Audit Trail
      await prisma.auditLog.create({
        data: {
          action: 'CLAIM_REJECTED',
          userId: reviewerId,
          targetId: claim.id,
          details: {
            itemId: claim.itemId,
            claimantId: claim.claimantId,
            reason: reviewNotes,
          },
        },
      });

      // Notify Claimant
      await prisma.notification.create({
        data: {
          title: `Claim Declined: ${claim.item.title}`,
          description: `Verification answers could not be confirmed: ${reviewNotes || 'Insufficient proof'}.`,
          badge: 'Declined',
          userId: claim.claimantId,
        },
      });

      return NextResponse.json({
        success: true,
        message: 'Claim rejected.',
        claim: updatedClaim,
      });
    }
  } catch (error) {
    console.error('Error reviewing claim:', error);
    return NextResponse.json({ error: 'Failed to review claim' }, { status: 500 });
  }
}
