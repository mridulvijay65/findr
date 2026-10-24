import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/broadcasts - Create a broadcast radar alert
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { itemTitle, quadrant, minutesAgo, details, contactMethod } = body;

    if (!itemTitle) {
      return NextResponse.json(
        { error: 'Item title is required' },
        { status: 400 }
      );
    }

    const userId = 'user-aarav';

    const broadcast = await prisma.broadcast.create({
      data: {
        itemTitle,
        quadrant: quadrant || 'Central Library Quad',
        minutesAgo: minutesAgo || '15',
        details: details || '',
        contactMethod: contactMethod || 'app',
        broadcasterId: userId,
      },
    });

    // Create notifications for nearby ambassadors (simulated)
    await prisma.notification.create({
      data: {
        title: `🚨 Urgent Radar: ${itemTitle}`,
        description: `Lost item alert broadcast in ${quadrant}. Student ambassadors have been notified.`,
        badge: 'Urgent',
        userId,
      },
    });

    return NextResponse.json(
      {
        ...broadcast,
        ambassadorsNotified: 38,
        securityPostsNotified: 6,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating broadcast:', error);
    return NextResponse.json({ error: 'Failed to create broadcast' }, { status: 500 });
  }
}

// GET /api/broadcasts - List recent broadcasts
export async function GET() {
  try {
    const broadcasts = await prisma.broadcast.findMany({
      include: {
        broadcaster: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    return NextResponse.json(broadcasts);
  } catch (error) {
    console.error('Error fetching broadcasts:', error);
    return NextResponse.json({ error: 'Failed to fetch broadcasts' }, { status: 500 });
  }
}
