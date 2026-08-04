import { eq } from "drizzle-orm";
import {
  assessments,
  assessmentResponses,
  substanceFocus,
} from "../../drizzle/schema";
import { getDb } from "./client";

export async function createAssessment(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const [created] = await db
    .insert(assessments)
    .values({ userId, version: 1 })
    .returning({ id: assessments.id });

  if (!created) return undefined;

  return db
    .select()
    .from(assessments)
    .where(eq(assessments.id, created.id))
    .limit(1);
}

export async function saveAssessmentResponse(
  assessmentId: number,
  dimensionId: number,
  payload: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(assessmentResponses).values({
    assessmentId,
    dimensionId,
    payload,
  });
}

export async function completeAssessment(assessmentId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(assessments)
    .set({ completedAt: new Date() })
    .where(eq(assessments.id, assessmentId));
}

export async function saveSubstanceFocus(
  userId: number,
  substance: "alcohol" | "nicotine" | "marijuana" | "codeine" | "prescription",
  frequency?: string,
  duration?: string,
  approach: "quit" | "reduce" = "quit"
) {
  const db = await getDb();
  if (!db) return;

  await db
    .insert(substanceFocus)
    .values({
      userId,
      substance,
      frequency: frequency as "daily" | "weekly" | "occasional" | undefined,
      duration,
      approach,
    })
    .onConflictDoUpdate({
      target: substanceFocus.userId,
      set: {
        substance,
        frequency: frequency as "daily" | "weekly" | "occasional" | undefined,
        duration,
        approach,
      },
    });
}
