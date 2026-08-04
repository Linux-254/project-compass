import { eq, and, desc } from "drizzle-orm";
import { goals, goalSteps } from "../../drizzle/schema";
import { getDb } from "./client";

export async function createGoal(
  userId: number,
  title: string,
  horizon: "30" | "90" | "180",
  dimensionId?: number,
  description?: string
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(goals).values({
    userId,
    title,
    horizon,
    dimensionId,
    description,
    status: "active",
  });
}

export async function getActiveGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.status, "active")))
    .orderBy(desc(goals.createdAt));
}

export async function getGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(goals)
    .where(eq(goals.userId, userId))
    .orderBy(desc(goals.createdAt));
}

export async function getGoalById(goalId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(goals)
    .where(eq(goals.id, goalId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function addGoalStep(goalId: number, title: string) {
  const db = await getDb();
  if (!db) return;

  await db.insert(goalSteps).values({ goalId, title });
}

export async function toggleGoalStep(goalId: number, stepId: number) {
  const db = await getDb();
  if (!db) return;

  const rows = await db
    .select()
    .from(goalSteps)
    .where(and(eq(goalSteps.id, stepId), eq(goalSteps.goalId, goalId)))
    .limit(1);
  if (rows.length === 0) return;

  const step = rows[0];
  await db
    .update(goalSteps)
    .set({ doneAt: step.doneAt ? null : new Date() })
    .where(eq(goalSteps.id, stepId));
}

export async function updateGoalStatus(
  goalId: number,
  status: "active" | "completed" | "abandoned"
) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(goals)
    .set({ status, completedAt: status === "completed" ? new Date() : null })
    .where(eq(goals.id, goalId));
}
