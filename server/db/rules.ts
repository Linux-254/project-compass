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

export async function recordRuleReview(
  ruleId: number,
  kept: boolean,
  notes?: string
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(ruleReviews).values({
    ruleId,
    reviewDate: new Date(),
    kept,
    notes,
  });
}

export async function listRuleReviews(ruleId: number, limit = 10) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(ruleReviews)
    .where(eq(ruleReviews.ruleId, ruleId))
    .orderBy(desc(ruleReviews.reviewDate))
    .limit(limit);
}
