import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/recovery-stories - Get community recovery stories
export async function GET() {
  try {
    const stories = await prisma.recoveryStory.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
    });

    // Transform to include relative time
    const transformedStories = stories.map((s) => ({
      id: s.id,
      itemTitle: s.itemTitle,
      quote: s.quote,
      timeAgo: getTimeAgo(s.createdAt),
      handoverBy: s.handoverBy,
      karma: s.karma,
    }));

    return NextResponse.json(transformedStories);
  } catch (error) {
    console.error('Error fetching recovery stories:', error);
    return NextResponse.json({ error: 'Failed to fetch recovery stories' }, { status: 500 });
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
