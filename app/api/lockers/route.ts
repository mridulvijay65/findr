import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// GET /api/lockers - List all locker stations
export async function GET() {
  try {
    const stations = await prisma.lockerStation.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json(stations);
  } catch (error) {
    console.error('Error fetching locker stations:', error);
    return NextResponse.json({ error: 'Failed to fetch locker stations' }, { status: 500 });
  }
}
