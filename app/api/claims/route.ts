import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/claims - Get claims for current user
export async function GET() {
  try {
    // Using hardcoded user for now (no auth)
    const userId = 'user-aarav';

    const claims = await prisma.claim.findMany({
      where: { claimantId: userId },
      include: {
        item: {
          include: {
            reporter: {
              select: { id: true, name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(claims);
  } catch (error) {
    console.error('Error fetching claims:', error);
    return NextResponse.json({ error: 'Failed to fetch claims' }, { status: 500 });
  }
}

// POST /api/claims - Submit a claim for an item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemId, proofAnswer, handoverMethod } = body;

    if (!itemId || !proofAnswer) {
      return NextResponse.json(
        { error: 'Item ID and proof answer are required' },
        { status: 400 }
      );
    }

    const userId = 'user-aarav';

    // Get the item
    const item = await prisma.item.findUnique({
      where: { id: itemId },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // Generate OTP for locker retrieval
    const otpCode = item.lockerOtp || Math.floor(100000 + Math.random() * 900000).toString();

    // Create the claim
    const claim = await prisma.claim.create({
      data: {
        proofAnswer,
        handoverMethod: handoverMethod || 'locker',
        status: 'approved', // Auto-approve for demo
        otpCode,
        itemId,
        claimantId: userId,
      },
    });

    // Update item status to Claimed
    await prisma.item.update({
      where: { id: itemId },
      data: { status: 'Claimed' },
    });

    // Award karma to the reporter
    await prisma.user.update({
      where: { id: item.reporterId },
      data: {
        karmaPoints: { increment: item.karmaReward },
        itemsReunited: { increment: 1 },
      },
    });

    // Create notification for reporter
    await prisma.notification.create({
      data: {
        title: `Item Claimed: ${item.title}`,
        description: `Your reported item "${item.title}" has been claimed and verified. +${item.karmaReward} Karma awarded!`,
        badge: 'Claimed',
        userId: item.reporterId,
      },
    });

    return NextResponse.json(
      {
        ...claim,
        otpCode,
        item: {
          id: item.id,
          title: item.title,
          lockerNumber: item.lockerNumber,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating claim:', error);
    return NextResponse.json({ error: 'Failed to create claim' }, { status: 500 });
  }
}
