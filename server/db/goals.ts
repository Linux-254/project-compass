import { eq, and, desc } from "drizzle-orm";
import { goals, goalSteps } from "../../drizzle/schema";
import { getDb } from "./client";

async function assertGoalOwner(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  goalId: number,
  userId: number
) {
  const row = await db
    .select({ userId: goals.userId })
    .from(goals)
    .where(eq(goals.id, goalId))
    .limit(1);
  if (row.length === 0 || row[0].userId !== userId) {
    const error = new Error("Goal not found");
    (error as Error & { code?: string }).code = "NOT_FOUND";
    throw error;
  }
}

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

export async function getGoalById(userId: number, goalId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(goals)
    .where(and(eq(goals.id, goalId), eq(goals.userId, userId)))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function addGoalStep(
  userId: number,
  goalId: number,
  title: string
) {
  const db = await getDb();
  if (!db) return;

  await assertGoalOwner(db, goalId, userId);

  await db.insert(goalSteps).values({ goalId, title });
}

export async function getGoalSteps(userId: number, goalId: number) {
  const db = await getDb();
  if (!db) return [];

  await assertGoalOwner(db, goalId, userId);

  return db
    .select()
    .from(goalSteps)
    .where(eq(goalSteps.goalId, goalId))
    .orderBy(desc(goalSteps.createdAt));
}

export async function toggleGoalStep(
  userId: number,
  goalId: number,
  stepId: number
) {
  const db = await getDb();
  if (!db) return;

  await assertGoalOwner(db, goalId, userId);

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
  userId: number,
  goalId: number,
  status: "active" | "completed" | "abandoned"
) {
  const db = await getDb();
  if (!db) return;

  await assertGoalOwner(db, goalId, userId);

  await db
    .update(goals)
    .set({ status, completedAt: status === "completed" ? new Date() : null })
    .where(eq(goals.id, goalId));
}

export async function deleteGoal(userId: number, goalId: number) {
  const db = await getDb();
  if (!db) return;

  await assertGoalOwner(db, goalId, userId);

  await db.delete(goals).where(eq(goals.id, goalId));
}
