import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/items/[id] - Get single item
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        reporter: {
          select: { id: true, name: true },
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    return NextResponse.json({
      id: item.id,
      title: item.title,
      category: item.category,
      itemType: item.itemType,
      status: item.status,
      location: item.location,
      sector: item.sector,
      image: item.image,
      description: item.description,
      brand: item.brand,
      color: item.color,
      lockerNumber: item.lockerNumber,
      // lockerOtp is excluded for zero-trust security
      karmaReward: item.karmaReward,
      reporter: item.reporter.name,
      reporterId: item.reporter.id,
      verificationQuestion: item.verificationQuestion,
      createdAt: item.createdAt,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

// PATCH /api/items/[id] - Update item status with authorization
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, userId } = body;

    if (!status) {
      return NextResponse.json({ error: 'Status is required' }, { status: 400 });
    }

    // Verify item exists
    const existing = await prisma.item.findUnique({
      where: { id },
      include: { reporter: true },
    });

    if (!existing) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    // If caller provided userId, check authorization
    if (userId) {
      const user = await prisma.user.findUnique({ where: { id: userId } });
      const isOwner = existing.reporterId === userId;
      const isSecurity = user?.role === 'security';
      if (!isOwner && !isSecurity) {
        return NextResponse.json(
          { error: 'Forbidden: You are not authorized to update this item status.' },
          { status: 403 }
        );
      }
    }

    const item = await prisma.item.update({
      where: { id },
      data: {
        status,
        resolvedAt: status === 'Recovered' || status === 'Claimed' ? new Date() : undefined,
      },
      include: {
        reporter: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json({
      id: item.id,
      title: item.title,
      category: item.category,
      itemType: item.itemType,
      status: item.status,
      location: item.location,
      sector: item.sector,
      image: item.image,
      description: item.description,
      brand: item.brand,
      color: item.color,
      lockerNumber: item.lockerNumber,
      // lockerOtp is excluded for zero-trust security
      karmaReward: item.karmaReward,
      reporter: item.reporter.name,
      reporterId: item.reporter.id,
      verificationQuestion: item.verificationQuestion,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
