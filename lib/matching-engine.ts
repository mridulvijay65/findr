/**
 * findr.campus — Multi-Signal Explainable AI Matching Pipeline
 * 
 * Compares Lost and Found campus item reports across 5 independent signals:
 * 1. Category Compatibility (25%)
 * 2. Text & Keyword Semantic Overlap (30%)
 * 3. Color & Brand Attributes (20%)
 * 4. Spatial Campus Proximity (15%)
 * 5. Temporal Consistency (10%)
 */

import { prisma } from '@/lib/db';

export interface MatchingWeights {
  category: number;
  text: number;
  attributes: number;
  spatial: number;
  temporal: number;
}

export const DEFAULT_WEIGHTS: MatchingWeights = {
  category: 0.25,
  text: 0.30,
  attributes: 0.20,
  spatial: 0.15,
  temporal: 0.10,
};

// Campus Sectors Spatial Proximity Graph (normalized distance: 1.0 = same sector, 0.7 = adjacent, 0.3 = distant)
export const SECTOR_ADJACENCY: Record<string, Record<string, number>> = {
  'Central Library & Cafes': {
    'Central Library & Cafes': 1.0,
    'North Academic Quad': 0.8,
    'Engineering Cluster': 0.7,
    'Sports Complex': 0.6,
    'Hostel Village': 0.3,
  },
  'North Academic Quad': {
    'North Academic Quad': 1.0,
    'Central Library & Cafes': 0.8,
    'Engineering Cluster': 0.75,
    'Sports Complex': 0.4,
    'Hostel Village': 0.3,
  },
  'Engineering Cluster': {
    'Engineering Cluster': 1.0,
    'North Academic Quad': 0.75,
    'Central Library & Cafes': 0.7,
    'Hostel Village': 0.6,
    'Sports Complex': 0.35,
  },
  'Sports Complex': {
    'Sports Complex': 1.0,
    'Hostel Village': 0.8,
    'Central Library & Cafes': 0.6,
    'North Academic Quad': 0.4,
    'Engineering Cluster': 0.35,
  },
  'Hostel Village': {
    'Hostel Village': 1.0,
    'Sports Complex': 0.8,
    'Engineering Cluster': 0.6,
    'Central Library & Cafes': 0.3,
    'North Academic Quad': 0.3,
  },
};

export interface MatchSignalBreakdown {
  categoryScore: number;
  textScore: number;
  attributeScore: number;
  spatialScore: number;
  temporalScore: number;
  reasons: string[];
  warnings: string[];
}

export interface MatchEvaluationResult {
  lostItemId: string;
  foundItemId: string;
  score: number;
  confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNLIKELY';
  signals: MatchSignalBreakdown;
}

/**
 * Text Tokenizer with Stop-Word Filtering
 */
function tokenize(text: string): string[] {
  const stopWords = new Set([
    'a', 'an', 'the', 'in', 'on', 'at', 'by', 'for', 'with', 'about', 'against',
    'between', 'into', 'through', 'during', 'before', 'after', 'above', 'below',
    'to', 'from', 'up', 'down', 'is', 'am', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'and', 'or', 'but', 'if',
    'this', 'that', 'these', 'those', 'my', 'your', 'his', 'her', 'its', 'left',
    'lost', 'found', 'misplaced', 'item'
  ]);

  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !stopWords.has(w));
}

/**
 * Jaccard Similarity on token sets
 */
function computeJaccard(tokensA: string[], tokensB: string[]): number {
  if (tokensA.length === 0 || tokensB.length === 0) return 0;
  const setA = new Set(tokensA);
  const setB = new Set(tokensB);

  let intersectionCount = 0;
  for (const token of setA) {
    if (setB.has(token)) {
      intersectionCount++;
    } else {
      // Partial sub-token or stem match (e.g., 'headphone' vs 'headphones')
      for (const tB of setB) {
        if (token.includes(tB) || tB.includes(token)) {
          intersectionCount += 0.75;
          break;
        }
      }
    }
  }

  const unionSize = setA.size + setB.size - Math.floor(intersectionCount);
  return unionSize > 0 ? Math.min(intersectionCount / unionSize, 1.0) : 0;
}

/**
 * Evaluates match compatibility between two items
 */
export function evaluatePair(
  lostItem: {
    id: string;
    title: string;
    category: string;
    description?: string | null;
    sector: string;
    location: string;
    brand?: string | null;
    color?: string | null;
    dateLostOrFound?: Date | string;
    reporterId: string;
  },
  foundItem: {
    id: string;
    title: string;
    category: string;
    description?: string | null;
    sector: string;
    location: string;
    brand?: string | null;
    color?: string | null;
    dateLostOrFound?: Date | string;
    reporterId: string;
  },
  weights: MatchingWeights = DEFAULT_WEIGHTS
): MatchEvaluationResult {
  // Self-match prevention
  if (lostItem.id === foundItem.id || lostItem.reporterId === foundItem.reporterId) {
    return {
      lostItemId: lostItem.id,
      foundItemId: foundItem.id,
      score: 0,
      confidence: 'UNLIKELY',
      signals: {
        categoryScore: 0,
        textScore: 0,
        attributeScore: 0,
        spatialScore: 0,
        temporalScore: 0,
        reasons: [],
        warnings: ['Self-match prevented: cannot match against own report'],
      },
    };
  }

  const reasons: string[] = [];
  const warnings: string[] = [];

  // 1. Category Signal (Weight: 25%)
  let categoryScore = 0;
  if (lostItem.category.toLowerCase() === foundItem.category.toLowerCase()) {
    categoryScore = 1.0;
    reasons.push(`Identical Category: ${lostItem.category}`);
  } else {
    // Cross-category penalty
    categoryScore = 0.15;
    warnings.push(`Category Discrepancy: ${lostItem.category} vs ${foundItem.category}`);
  }

  // 2. Text & Description Signal (Weight: 30%)
  const lostTokens = tokenize(`${lostItem.title} ${lostItem.description || ''} ${lostItem.location}`);
  const foundTokens = tokenize(`${foundItem.title} ${foundItem.description || ''} ${foundItem.location}`);
  const textScore = computeJaccard(lostTokens, foundTokens);

  if (textScore > 0.4) {
    reasons.push(`High textual similarity in titles and descriptions (${Math.round(textScore * 100)}% term overlap)`);
  } else if (textScore > 0.2) {
    reasons.push(`Moderate descriptive similarity between reports`);
  }

  // 3. Attributes Signal (Brand & Color) (Weight: 20%)
  let attributeScore = 0.5; // neutral baseline if unstated
  let attributesEvaluated = 0;

  // Check Brand
  const lostBrand = (lostItem.brand || extractBrand(lostItem.title)).toLowerCase();
  const foundBrand = (foundItem.brand || extractBrand(foundItem.title)).toLowerCase();
  if (lostBrand && foundBrand) {
    attributesEvaluated++;
    if (lostBrand === foundBrand) {
      attributeScore += 0.3;
      reasons.push(`Matching Brand: ${lostBrand.toUpperCase()}`);
    } else {
      attributeScore -= 0.3;
      warnings.push(`Brand mismatch: ${lostBrand} vs ${foundBrand}`);
    }
  }

  // Check Color
  const lostColor = (lostItem.color || extractColor(lostItem.title + ' ' + (lostItem.description || ''))).toLowerCase();
  const foundColor = (foundItem.color || extractColor(foundItem.title + ' ' + (foundItem.description || ''))).toLowerCase();
  if (lostColor && foundColor) {
    attributesEvaluated++;
    if (lostColor === foundColor) {
      attributeScore += 0.2;
      reasons.push(`Matching Color: ${lostColor}`);
    } else {
      attributeScore -= 0.2;
      warnings.push(`Color difference: ${lostColor} vs ${foundColor}`);
    }
  }

  attributeScore = Math.max(0, Math.min(1.0, attributeScore));

  // 4. Spatial Proximity Signal (Weight: 15%)
  const spatialMatrix = SECTOR_ADJACENCY[lostItem.sector] || {};
  const spatialScore = spatialMatrix[foundItem.sector] ?? 0.3;

  if (spatialScore >= 0.9) {
    reasons.push(`Same campus zone: ${lostItem.sector}`);
  } else if (spatialScore >= 0.7) {
    reasons.push(`Adjacent campus sectors: ${lostItem.sector} ↔ ${foundItem.sector}`);
  } else {
    warnings.push(`Opposite campus areas: ${lostItem.sector} vs ${foundItem.sector}`);
  }

  // 5. Temporal Signal (Weight: 10%)
  const lostDate = new Date(lostItem.dateLostOrFound || Date.now()).getTime();
  const foundDate = new Date(foundItem.dateLostOrFound || Date.now()).getTime();
  const timeDeltaHours = (foundDate - lostDate) / (1000 * 60 * 60);

  let temporalScore = 0.5;
  if (timeDeltaHours < -48) {
    // Found more than 2 days before lost -> impossible or unlikely
    temporalScore = 0.1;
    warnings.push(`Timeline discrepancy: Item was logged as discovered before report was filed`);
  } else if (timeDeltaHours >= -48 && timeDeltaHours <= 72) {
    // Discovered within a plausible 3-day recovery window
    temporalScore = 1.0;
    reasons.push(`Timeline matched: Discovered within close temporal proximity of loss`);
  } else {
    // Found weeks after
    temporalScore = Math.max(0.2, 1.0 - Math.abs(timeDeltaHours) / (24 * 30));
  }

  // Calculate Weighted Aggregate Score (0 - 100)
  const rawScore =
    categoryScore * weights.category +
    textScore * weights.text +
    attributeScore * weights.attributes +
    spatialScore * weights.spatial +
    temporalScore * weights.temporal;

  const score = Math.round(rawScore * 100);

  let confidence: 'HIGH' | 'MEDIUM' | 'LOW' | 'UNLIKELY' = 'UNLIKELY';
  if (score >= 70 && categoryScore >= 0.9) {
    confidence = 'HIGH';
  } else if (score >= 50) {
    confidence = 'MEDIUM';
  } else if (score >= 32) {
    confidence = 'LOW';
  }

  return {
    lostItemId: lostItem.id,
    foundItemId: foundItem.id,
    score,
    confidence,
    signals: {
      categoryScore: Math.round(categoryScore * 100),
      textScore: Math.round(textScore * 100),
      attributeScore: Math.round(attributeScore * 100),
      spatialScore: Math.round(spatialScore * 100),
      temporalScore: Math.round(temporalScore * 100),
      reasons,
      warnings,
    },
  };
}

/**
 * Intelligent attribute extractors
 */
const COMMON_BRANDS = ['apple', 'sony', 'casio', 'samsung', 'hydro flask', 'hydroflask', 'nalgene', 'north face', 'fitbit', 'dell', 'lenovo', 'bose', 'anker', 'kryptonite'];
function extractBrand(text: string): string {
  const lower = text.toLowerCase();
  for (const b of COMMON_BRANDS) {
    if (lower.includes(b)) return b;
  }
  return '';
}

const COMMON_COLORS = ['black', 'grey', 'gray', 'white', 'blue', 'red', 'green', 'sage', 'yellow', 'silver', 'matte'];
function extractColor(text: string): string {
  const lower = text.toLowerCase();
  for (const c of COMMON_COLORS) {
    if (lower.includes(c)) return c;
  }
  return '';
}

/**
 * Run pipeline for an item against all active candidates in DB and upsert matches
 */
export async function runMatchingForReport(itemId: string): Promise<MatchEvaluationResult[]> {
  const targetItem = await prisma.item.findUnique({
    where: { id: itemId },
    include: { reporter: true },
  });

  if (!targetItem) return [];

  const isLost = targetItem.itemType === 'LOST' || targetItem.status === 'Lost';
  const oppositeType = isLost ? 'FOUND' : 'LOST';

  // Find candidate items of opposite type
  const candidates = await prisma.item.findMany({
    where: {
      id: { not: itemId },
      status: { notIn: ['Claimed', 'Recovered'] },
      OR: [
        { itemType: oppositeType },
        { status: isLost ? { in: ['In Locker', 'Awaiting Owner'] } : 'Lost' },
      ],
    },
    include: { reporter: true },
    take: 25,
  });

  const results: MatchEvaluationResult[] = [];

  for (const candidate of candidates) {
    const lost = isLost ? targetItem : candidate;
    const found = isLost ? candidate : targetItem;

    const evaluation = evaluatePair(
      {
        id: lost.id,
        title: lost.title,
        category: lost.category,
        description: lost.description,
        sector: lost.sector,
        location: lost.location,
        brand: lost.brand,
        color: lost.color,
        dateLostOrFound: lost.dateLostOrFound,
        reporterId: lost.reporterId,
      },
      {
        id: found.id,
        title: found.title,
        category: found.category,
        description: found.description,
        sector: found.sector,
        location: found.location,
        brand: found.brand,
        color: found.color,
        dateLostOrFound: found.dateLostOrFound,
        reporterId: found.reporterId,
      }
    );

    // Filter out low noise matches (< 30)
    if (evaluation.score >= 30) {
      results.push(evaluation);

      // Persist in DB (deduplicated via @@unique([lostItemId, foundItemId]))
      try {
        await prisma.match.upsert({
          where: {
            lostItemId_foundItemId: {
              lostItemId: lost.id,
              foundItemId: found.id,
            },
          },
          update: {
            score: evaluation.score,
            confidence: evaluation.confidence,
            signals: evaluation.signals as any,
          },
          create: {
            lostItemId: lost.id,
            foundItemId: found.id,
            score: evaluation.score,
            confidence: evaluation.confidence,
            signals: evaluation.signals as any,
          },
        });
      } catch (e) {
        console.warn('Match upsert non-critical warning:', e);
      }
    }
  }

  return results.sort((a, b) => b.score - a.score);
}
