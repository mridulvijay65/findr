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
      status: item.status,
      location: item.location,
      sector: item.sector,
      image: item.image,
      description: item.description,
      lockerNumber: item.lockerNumber,
      lockerOtp: item.lockerOtp,
      karmaReward: item.karmaReward,
      reporter: item.reporter.name,
      verificationQuestion: item.verificationQuestion,
      createdAt: item.createdAt,
    });
  } catch (error) {
    console.error('Error fetching item:', error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

// PATCH /api/items/[id] - Update item status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status } = body;

    const item = await prisma.item.update({
      where: { id },
      data: { status },
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
      status: item.status,
      location: item.location,
      sector: item.sector,
      image: item.image,
      description: item.description,
      lockerNumber: item.lockerNumber,
      lockerOtp: item.lockerOtp,
      karmaReward: item.karmaReward,
      reporter: item.reporter.name,
      verificationQuestion: item.verificationQuestion,
    });
  } catch (error) {
    console.error('Error updating item:', error);
    return NextResponse.json({ error: 'Failed to update item' }, { status: 500 });
  }
}
