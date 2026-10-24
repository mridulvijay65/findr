import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/users/me - Get current user profile
export async function GET() {
  try {
    const userId = 'user-aarav';

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        avatar: true,
        karmaPoints: true,
        itemsReunited: true,
        badge: true,
        rank: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}
