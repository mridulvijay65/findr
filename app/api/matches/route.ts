import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { runMatchingForReport } from '@/lib/matching-engine';

// GET /api/matches - Retrieve multi-signal AI matches from database
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const minScore = searchParams.get('minScore') ? parseInt(searchParams.get('minScore')!) : 30;
    const userId = searchParams.get('userId');

    const where: any = {
      score: { gte: minScore },
    };

    if (status && status !== 'ALL') {
      where.status = status;
    }

    if (userId) {
      where.OR = [
        { lostItem: { reporterId: userId } },
        { foundItem: { reporterId: userId } },
      ];
    }

    let matches = await prisma.match.findMany({
      where,
      include: {
        lostItem: {
          include: {
            reporter: { select: { id: true, name: true, department: true } },
          },
        },
        foundItem: {
          include: {
            reporter: { select: { id: true, name: true, department: true } },
          },
        },
        reviewedBy: {
          select: { id: true, name: true },
        },
      },
      orderBy: { score: 'desc' },
      take: 50,
    });

    // If matches table is empty (e.g. freshly seeded DB), automatically evaluate and populate!
    if (matches.length === 0) {
      const items = await prisma.item.findMany({
        where: { status: { notIn: ['Claimed', 'Recovered'] } },
        take: 10,
      });

      for (const item of items) {
        await runMatchingForReport(item.id);
      }

      matches = await prisma.match.findMany({
        where,
        include: {
          lostItem: {
            include: {
              reporter: { select: { id: true, name: true, department: true } },
            },
          },
          foundItem: {
            include: {
              reporter: { select: { id: true, name: true, department: true } },
            },
          },
          reviewedBy: {
            select: { id: true, name: true },
          },
        },
        orderBy: { score: 'desc' },
        take: 50,
      });
    }

    return NextResponse.json({
      matches,
      totalCount: matches.length,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
}

// PATCH /api/matches - Human confirmation or false-positive marking of AI matches
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { matchId, status, reviewerId } = body;

    if (!matchId || !status || !['CONFIRMED', 'DISMISSED'].includes(status)) {
      return NextResponse.json(
        { error: 'Valid matchId and status ("CONFIRMED" | "DISMISSED") are required' },
        { status: 400 }
      );
    }

    const updatedMatch = await prisma.match.update({
      where: { id: matchId },
      data: {
        status,
        reviewedById: reviewerId || null,
      },
      include: {
        lostItem: true,
        foundItem: true,
      },
    });

    // Record Audit Trail
    await prisma.auditLog.create({
      data: {
        action: status === 'CONFIRMED' ? 'MATCH_CONFIRMED' : 'MATCH_DISMISSED',
        userId: reviewerId || null,
        targetId: matchId,
        details: {
          lostItemId: updatedMatch.lostItemId,
          foundItemId: updatedMatch.foundItemId,
          score: updatedMatch.score,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: `Match status marked as ${status}`,
      match: updatedMatch,
    });
  } catch (error) {
    console.error('Error updating match:', error);
    return NextResponse.json({ error: 'Failed to update match' }, { status: 500 });
  }
}

// POST /api/matches - Run batch reindexing across all items
export async function POST(request: NextRequest) {
  try {
    const items = await prisma.item.findMany({
      where: { status: { notIn: ['Claimed', 'Recovered'] } },
    });

    let totalNewEvaluations = 0;
    for (const item of items) {
      const results = await runMatchingForReport(item.id);
      totalNewEvaluations += results.length;
    }

    return NextResponse.json({
      success: true,
      scannedItems: items.length,
      evaluatedPairs: totalNewEvaluations,
      message: 'Campus AI matching index successfully refreshed.',
    });
  } catch (error) {
    console.error('Error running batch matching:', error);
    return NextResponse.json({ error: 'Failed to reindex matches' }, { status: 500 });
  }
}
