import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { evaluatePair } from '@/lib/matching-engine';

// POST /api/ai/match - Run real multi-signal evaluation between query item and candidate items
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, category, sector, location, description, brand, color, dateLostOrFound, itemId } = body;

    if (!title && !itemId) {
      return NextResponse.json({ matches: [] });
    }

    // If itemId provided, use DB item
    let baseItem = null;
    if (itemId) {
      baseItem = await prisma.item.findUnique({ where: { id: itemId } });
    }

    const queryTitle = baseItem ? baseItem.title : title;
    const queryCategory = baseItem ? baseItem.category : category || 'Electronics';
    const querySector = baseItem ? baseItem.sector : sector || 'Central Library & Cafes';
    const queryLocation = baseItem ? baseItem.location : location || 'Campus Area';
    const queryDesc = baseItem ? baseItem.description : description || '';
    const queryBrand = baseItem ? baseItem.brand : brand || '';
    const queryColor = baseItem ? baseItem.color : color || '';
    const queryDate = baseItem ? baseItem.dateLostOrFound : dateLostOrFound ? new Date(dateLostOrFound) : new Date();

    // Find candidate opposite items (or items in system)
    const candidates = await prisma.item.findMany({
      where: {
        id: itemId ? { not: itemId } : undefined,
        status: { notIn: ['Claimed', 'Recovered'] },
      },
      include: {
        reporter: {
          select: { id: true, name: true },
        },
      },
      take: 20,
    });

    const matches = [];

    for (const candidate of candidates) {
      const evaluation = evaluatePair(
        {
          id: itemId || 'query-draft',
          title: queryTitle,
          category: queryCategory,
          description: queryDesc,
          sector: querySector,
          location: queryLocation,
          brand: queryBrand,
          color: queryColor,
          dateLostOrFound: queryDate,
          reporterId: 'query-user',
        },
        {
          id: candidate.id,
          title: candidate.title,
          category: candidate.category,
          description: candidate.description,
          sector: candidate.sector,
          location: candidate.location,
          brand: candidate.brand,
          color: candidate.color,
          dateLostOrFound: candidate.dateLostOrFound,
          reporterId: candidate.reporterId,
        }
      );

      if (evaluation.score >= 30) {
        matches.push({
          id: candidate.id,
          title: candidate.title,
          category: candidate.category,
          status: candidate.status,
          sector: candidate.sector,
          location: candidate.location,
          image: candidate.image,
          score: evaluation.score,
          confidence: `${evaluation.score}%`,
          confidenceTier: evaluation.confidence,
          signals: evaluation.signals,
          reasons: evaluation.signals.reasons,
          warnings: evaluation.signals.warnings,
          reporter: candidate.reporter.name,
        });
      }
    }

    matches.sort((a, b) => b.score - a.score);

    return NextResponse.json({
      matches: matches.slice(0, 6),
      totalCandidatesEvaluated: candidates.length,
      algorithm: 'Multi-Signal 5-Factor Weighted Fusion',
    });
  } catch (error) {
    console.error('Error finding AI matches:', error);
    return NextResponse.json({ matches: [], error: 'Matching evaluation failed' }, { status: 500 });
  }
}
