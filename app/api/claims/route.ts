import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/claims - Get claims for current user or incoming claims to review
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId') || 'user-aarav';
    const type = searchParams.get('type') || 'all'; // 'submitted' | 'incoming' | 'all'

    // Fetch user role to check if security officer
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    const isSecurity = user?.role === 'security';

    // 1. Claims submitted by this user
    let submittedClaims: any[] = [];
    if (type === 'all' || type === 'submitted') {
      submittedClaims = await prisma.claim.findMany({
        where: { claimantId: userId },
        include: {
          item: {
            include: {
              reporter: {
                select: { id: true, name: true, department: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
    }

    // 2. Incoming claims for items reported by this user (or all if security officer)
    let incomingReviews: any[] = [];
    if (type === 'all' || type === 'incoming') {
      incomingReviews = await prisma.claim.findMany({
        where: isSecurity
          ? { status: 'pending' }
          : {
              item: { reporterId: userId },
            },
        include: {
          claimant: {
            select: { id: true, name: true, department: true, badge: true },
          },
          item: {
            select: {
              id: true,
              title: true,
              category: true,
              location: true,
              sector: true,
              image: true,
              status: true,
              verificationQuestion: true,
              reporterId: true,
              lockerNumber: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      // Mask OTP codes in incoming reviews (finder does NOT get claimant's retrieval OTP!)
      incomingReviews = incomingReviews.map((rev) => ({
        ...rev,
        otpCode: undefined,
      }));
    }

    return NextResponse.json({
      submittedClaims,
      incomingReviews,
    });
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

// POST /api/claims - Submit a claim for an item with security checks
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, proofAnswer, handoverMethod, claimantId } = body;

    if (!itemId || !proofAnswer) {
      return NextResponse.json(
        { error: 'Item ID and proof answer are required' },
        { status: 400 }
      );
    }

    const userId = claimantId || 'user-aarav';

    // 1. Verify item exists
    const item = await prisma.item.findUnique({
      where: { id: itemId },
      include: { reporter: true },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // 2. Security Check: Prevent self-claiming
    if (item.reporterId === userId) {
      return NextResponse.json(
        { error: 'Security Violation: You cannot file an ownership claim on an item you reported.' },
        { status: 400 }
      );
    }

    // 3. Prevent duplicate active claims by same user on same item
    const existingActiveClaim = await prisma.claim.findFirst({
      where: {
        itemId,
        claimantId: userId,
        status: { in: ['pending', 'approved'] },
      },
    });

    if (existingActiveClaim) {
      return NextResponse.json(
        {
          error: `You already have an active claim (${existingActiveClaim.status}) for this item.`,
          claimId: existingActiveClaim.id,
          status: existingActiveClaim.status,
        },
        { status: 409 }
      );
    }

    // 4. Create claim in PENDING state (NEVER auto-approve without human confirmation)
    const claim = await prisma.claim.create({
      data: {
        proofAnswer,
        handoverMethod: handoverMethod || 'locker',
        status: 'pending',
        otpCode: null, // Issued only upon approval
        attemptCount: 0,
        itemId,
        claimantId: userId,
      },
      include: {
        item: {
          select: {
            id: true,
            title: true,
            location: true,
            sector: true,
            image: true,
            lockerNumber: true,
          },
        },
      },
    });

    // 5. Create Audit Trail Entry
    await prisma.auditLog.create({
      data: {
        action: 'CLAIM_SUBMITTED',
        userId,
        targetId: claim.id,
        details: {
          itemId: item.id,
          itemTitle: item.title,
          handoverMethod: claim.handoverMethod,
          reporterId: item.reporterId,
        },
      },
    });

    // 6. Notify item reporter
    await prisma.notification.create({
      data: {
        title: `New Claim on "${item.title}"`,
        description: `A student submitted ownership proof for your reported item. Review and approve in My Claims.`,
        badge: 'Pending Review',
        userId: item.reporterId,
      },
    });

    return NextResponse.json(
      {
        ...claim,
        message: 'Ownership claim submitted for review. You will receive an OTP once approved by the reporter or campus security.',
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
  }
}
