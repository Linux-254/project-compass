import { eq, and, desc } from "drizzle-orm";
import { dimensionScores, lifeDimensions } from "../../drizzle/schema";
import { getDb } from "./client";
import { getLifeDimensions } from "./dimensions";

export async function saveDimensionScore(
  userId: number,
  dimensionId: number,
  score: number,
  capturedOn: Date
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(dimensionScores).values({
    userId,
    dimensionId,
    score,
    capturedOn,
  });
}

export async function getDimensionScores(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(dimensionScores)
    .where(eq(dimensionScores.userId, userId))
    .orderBy(desc(dimensionScores.capturedOn));
}

// Latest score per dimension via a single query, deduped in JS.
export async function getLatestDimensionScores(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const dimensions = await getLifeDimensions();

  const rows = await db
    .select({
      dimensionId: dimensionScores.dimensionId,
      dimensionLabel: lifeDimensions.label,
      score: dimensionScores.score,
      capturedOn: dimensionScores.capturedOn,
    })
    .from(dimensionScores)
    .innerJoin(
      lifeDimensions,
      eq(dimensionScores.dimensionId, lifeDimensions.id)
    )
    .where(eq(dimensionScores.userId, userId))
    .orderBy(desc(dimensionScores.capturedOn));

  const seen = new Set<number>();
  const latest: typeof rows = [];
  for (const row of rows) {
    if (!seen.has(row.dimensionId)) {
      seen.add(row.dimensionId);
      latest.push(row);
    }
  }

  const byDimension = new Map(latest.map(row => [row.dimensionId, row]));

  return dimensions.map(dim => {
    const latest = byDimension.get(dim.id);
    return {
      dimensionId: dim.id,
      dimensionLabel: dim.label,
      score: latest?.score ?? 0,
      capturedOn: latest?.capturedOn ?? null,
    };
  });
}

export async function getDimensionScoreHistory(
  userId: number,
  dimensionId: number,
  limit = 30
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(dimensionScores)
    .where(
      and(
        eq(dimensionScores.userId, userId),
        eq(dimensionScores.dimensionId, dimensionId)
      )
    )
    .orderBy(desc(dimensionScores.capturedOn))
    .limit(limit);
}
