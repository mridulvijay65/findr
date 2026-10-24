import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/users - List available demo users
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      take: 10,
      orderBy: { karmaPoints: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        department: true,
        avatar: true,
        karmaPoints: true,
        badge: true,
        rank: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

// POST /api/users - Login or register a user by email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, department, role } = body;

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) {
      // Create new student/faculty profile
      user = await prisma.user.create({
        data: {
          name: name || email.split('@')[0],
          email: email.toLowerCase().trim(),
          department: department || 'General Studies · Class of 2027',
          avatar: `https://images.unsplash.com/photo-${Math.random() > 0.5 ? '1539571696357-5a69c17a67c6' : '1534528741775-53994a69daeb'}?w=200&h=200&fit=crop&crop=faces`,
          karmaPoints: 100, // Starter karma bonus
          badge: role === 'security' ? 'Campus Guard' : 'Freshman Scout',
          rank: 15,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error in user auth:', error);
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
