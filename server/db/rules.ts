import { eq, and, desc } from "drizzle-orm";
import { rulesBoundaries, ruleReviews } from "../../drizzle/schema";
import { getDb } from "./client";

export async function createRule(
  userId: number,
  text: string,
  reviewCadence = "daily"
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(rulesBoundaries).values({
    userId,
    text,
    reviewCadence: reviewCadence as "daily" | "weekly" | "monthly",
    active: true,
  });
}

export async function getActiveRules(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(rulesBoundaries)
    .where(
      and(eq(rulesBoundaries.userId, userId), eq(rulesBoundaries.active, true))
    )
    .orderBy(desc(rulesBoundaries.createdAt));
}

export async function getRules(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(rulesBoundaries)
    .where(eq(rulesBoundaries.userId, userId))
    .orderBy(desc(rulesBoundaries.createdAt));
}

export async function updateRule(
  userId: number,
  ruleId: number,
  data: { text?: string; active?: boolean }
) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(rulesBoundaries)
    .set(data)
    .where(
      and(eq(rulesBoundaries.id, ruleId), eq(rulesBoundaries.userId, userId))
    );
}

export async function deleteRule(userId: number, ruleId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .delete(rulesBoundaries)
    .where(
      and(eq(rulesBoundaries.id, ruleId), eq(rulesBoundaries.userId, userId))
    );
}

async function assertRuleOwner(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  ruleId: number,
  userId: number
) {
  const row = await db
    .select({ userId: rulesBoundaries.userId })
    .from(rulesBoundaries)
    .where(eq(rulesBoundaries.id, ruleId))
    .limit(1);
  if (row.length === 0 || row[0].userId !== userId) {
    const error = new Error("Rule not found");
    (error as Error & { code?: string }).code = "NOT_FOUND";
    throw error;
  }
}

export async function recordRuleReview(
  userId: number,
  ruleId: number,
  kept: boolean,
  notes?: string
) {
  const db = await getDb();
  if (!db) return;

  await assertRuleOwner(db, ruleId, userId);

  await db.insert(ruleReviews).values({
    ruleId,
    reviewDate: new Date(),
    kept,
    notes,
  });
}

export async function listRuleReviews(
  userId: number,
  ruleId: number,
  limit = 10
) {
  const db = await getDb();
  if (!db) return [];

  await assertRuleOwner(db, ruleId, userId);

  return db
    .select()
    .from(ruleReviews)
    .where(eq(ruleReviews.ruleId, ruleId))
    .orderBy(desc(ruleReviews.reviewDate))
    .limit(limit);
}
