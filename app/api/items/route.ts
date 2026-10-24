import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/items - List items with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const status = searchParams.get('status') || '';
    const sector = searchParams.get('sector') || '';

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { title: { contains: search } },
        { location: { contains: search } },
        { description: { contains: search } },
      ];
    }

    if (category && category !== 'All') {
      where.category = category;
    }

    if (status && status !== 'All') {
      where.status = status;
    }

    if (sector && sector !== 'All') {
      where.sector = sector;
    }

    const items = await prisma.item.findMany({
      where,
      include: {
        reporter: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Transform to match the frontend CampusItem interface
    const transformedItems = items.map((item) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      status: item.status,
      location: item.location,
      sector: item.sector,
      timeAgo: getTimeAgo(item.createdAt),
      image: item.image,
      description: item.description,
      lockerNumber: item.lockerNumber,
      lockerOtp: item.lockerOtp,
      karmaReward: item.karmaReward,
      reporter: item.reporter.name,
      verificationQuestion: item.verificationQuestion,
    }));

    return NextResponse.json(transformedItems);
  } catch (error) {
    console.error('Error fetching items:', error);
    return NextResponse.json({ error: 'Failed to fetch items' }, { status: 500 });
  }
}

// POST /api/items - Create a new lost/found item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      title,
      category,
      sector,
      location,
      description,
      verificationQuestion,
      reportType,
      handoverOption,
      reporterId,
    } = body;

    if (!title || !location) {
      return NextResponse.json({ error: 'Title and location are required' }, { status: 400 });
    }

    // Determine status based on report type and handover option
    let status = 'Lost';
    if (reportType === 'found') {
      status = handoverOption === 'locker' ? 'In Locker' : 'Awaiting Owner';
    }

    // Generate locker details if applicable
    const lockerNumber = handoverOption === 'locker' ? 'Safe Locker #05' : undefined;
    const lockerOtp = handoverOption === 'locker'
      ? Math.floor(100000 + Math.random() * 900000).toString()
      : undefined;

    const userId = reporterId || 'user-aarav';

    const item = await prisma.item.create({
      data: {
        title,
        category: category || 'Electronics',
        status,
        location,
        sector: sector || 'Central Library & Cafes',
        image: body.image || `https://picsum.photos/seed/${Math.random().toString(36).substring(7)}/400/300`,
        description: description || '',
        lockerNumber,
        lockerOtp,
        karmaReward: reportType === 'found' ? 50 : 25,
        verificationQuestion: verificationQuestion || 'Describe unique identifying features',
        handoverOption: handoverOption || 'locker',
        reporterId: userId,
      },
      include: {
        reporter: {
          select: { id: true, name: true },
        },
      },
    });

    // Award karma for found items
    if (reportType === 'found') {
      await prisma.user.update({
        where: { id: userId },
        data: {
          karmaPoints: { increment: 50 },
        },
      });
    }

    // Transform to match frontend
    const transformedItem = {
      id: item.id,
      title: item.title,
      category: item.category,
      status: item.status,
      location: item.location,
      sector: item.sector,
      timeAgo: 'Just now',
      image: item.image,
      description: item.description,
      lockerNumber: item.lockerNumber,
      lockerOtp: item.lockerOtp,
      karmaReward: item.karmaReward,
      reporter: item.reporter.name,
      verificationQuestion: item.verificationQuestion,
    };

    return NextResponse.json(transformedItem, { status: 201 });
  } catch (error) {
    console.error('Error creating item:', error);
    return NextResponse.json({ error: 'Failed to create item' }, { status: 500 });
  }
}

// Helper: Calculate relative time
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
