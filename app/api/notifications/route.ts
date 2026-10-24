import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/notifications - Get user notifications
export async function GET() {
  try {
    const userId = 'user-aarav';

    const notifications = await prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });

    // Transform to include relative time
    const transformedNotifications = notifications.map((n) => ({
      id: n.id,
      title: n.title,
      desc: n.description,
      badge: n.badge,
      read: n.read,
      time: getTimeAgo(n.createdAt),
    }));

    return NextResponse.json(transformedNotifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    return NextResponse.json({ error: 'Failed to fetch notifications' }, { status: 500 });
  }
}

function getTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays}d ago`;
}
