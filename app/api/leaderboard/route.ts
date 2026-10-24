import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/leaderboard - Get karma leaderboard
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const currentUserId = searchParams.get('userId');

    const users = await prisma.user.findMany({
      orderBy: { karmaPoints: 'desc' },
      take: 20,
      select: {
        id: true,
        name: true,
        department: true,
        avatar: true,
        karmaPoints: true,
        itemsReunited: true,
        badge: true,
        rank: true,
      },
    });

    // Recalculate ranks based on karma order
    const leaderboard = users.map((user, index) => {
      const isCurrentUser = currentUserId ? user.id === currentUserId : user.id === 'user-aarav';
      return {
        rank: index + 1,
        name: user.name + (isCurrentUser ? ' (You)' : ''),
        department: user.department,
        itemsReunited: user.itemsReunited,
        karmaPoints: user.karmaPoints,
        avatar: user.avatar,
        badge: user.badge,
      };
    });

    return NextResponse.json(leaderboard);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Failed to fetch leaderboard' }, { status: 500 });
  }
}
