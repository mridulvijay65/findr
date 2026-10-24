import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// PATCH /api/users/me/karma - Redeem karma perks
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { perkTitle, cost } = body;

    if (!perkTitle || !cost) {
      return NextResponse.json(
        { error: 'Perk title and cost are required' },
        { status: 400 }
      );
    }

    const userId = 'user-aarav';

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (user.karmaPoints < cost) {
      return NextResponse.json(
        { error: 'Insufficient karma points' },
        { status: 400 }
      );
    }

    // Deduct karma points
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        karmaPoints: { decrement: cost },
      },
    });

    // Create a notification for the redemption
    await prisma.notification.create({
      data: {
        title: `Perk Redeemed: ${perkTitle}`,
        description: `Voucher for "${perkTitle}" sent to ${user.email}. -${cost} Karma deducted.`,
        badge: 'Reward',
        userId,
      },
    });

    return NextResponse.json({
      success: true,
      perkTitle,
      remainingKarma: updatedUser.karmaPoints,
      email: user.email,
    });
  } catch (error) {
    console.error('Error redeeming karma:', error);
    return NextResponse.json({ error: 'Failed to redeem karma' }, { status: 500 });
  }
}
