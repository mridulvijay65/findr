import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/stats - Get campus dashboard stats
export async function GET() {
  try {
    const [totalItems, lostItems, inLockerItems, awaitingOwnerItems, claimedItems, totalUsers, totalRecoveries] =
      await Promise.all([
        prisma.item.count(),
        prisma.item.count({ where: { status: 'Lost' } }),
        prisma.item.count({ where: { status: 'In Locker' } }),
        prisma.item.count({ where: { status: 'Awaiting Owner' } }),
        prisma.item.count({ where: { status: 'Claimed' } }),
        prisma.user.count(),
        prisma.recoveryStory.count(),
      ]);

    const returnRate =
      totalItems > 0
        ? (((claimedItems + inLockerItems) / totalItems) * 100).toFixed(1)
        : '0.0';

    return NextResponse.json({
      totalItems,
      lostItems,
      inLockerItems,
      awaitingOwnerItems,
      claimedItems,
      totalUsers,
      totalRecoveries,
      returnRate: `${returnRate}%`,
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    return NextResponse.json({ error: 'Failed to fetch stats' }, { status: 500 });
  }
}
