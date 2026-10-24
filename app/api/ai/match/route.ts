import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

// POST /api/ai/match - Find similarity matches between lost and found items
export async function POST(request: NextRequest) {
  try {
    const { title, category, sector } = await request.json();

    if (!title) {
      return NextResponse.json({ matches: [] });
    }

    // Find opposite items in the same or nearby category
    const candidates = await prisma.item.findMany({
      where: {
        category: category || undefined,
      },
      take: 10,
    });

    // Score candidates based on title keyword overlap and sector
    const queryWords = title.toLowerCase().split(/\s+/).filter((w: string) => w.length > 2);

    const scored = candidates.map((candidate) => {
      let score = 0;
      const candidateTitle = candidate.title.toLowerCase();
      const candidateDesc = (candidate.description || '').toLowerCase();

      // Keyword match score
      for (const word of queryWords) {
        if (candidateTitle.includes(word)) score += 35;
        if (candidateDesc.includes(word)) score += 15;
      }

      // Sector match bonus
      if (sector && candidate.sector === sector) score += 20;

      // Category match bonus
      if (category && candidate.category === category) score += 20;

      const confidence = Math.min(Math.max(score, 15), 98);

      return {
        id: candidate.id,
        title: candidate.title,
        status: candidate.status,
        sector: candidate.sector,
        image: candidate.image,
        location: candidate.location,
        confidence: `${confidence}%`,
      };
    });

    const topMatches = scored
      .filter((s) => parseInt(s.confidence) >= 40)
      .sort((a, b) => parseInt(b.confidence) - parseInt(a.confidence))
      .slice(0, 3);

    return NextResponse.json({ matches: topMatches });
  } catch (error) {
    console.error('Error finding AI matches:', error);
    return NextResponse.json({ matches: [] });
  }
}
