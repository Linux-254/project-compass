import { eq } from "drizzle-orm";
import {
  assessments,
  assessmentResponses,
  substanceFocus,
} from "../../drizzle/schema";
import { encryptText, decryptText } from "../lib/encryption";
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

async function assertAssessmentOwner(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  assessmentId: number,
  userId: number
) {
  const row = await db
    .select({ userId: assessments.userId })
    .from(assessments)
    .where(eq(assessments.id, assessmentId))
    .limit(1);
  if (row.length === 0 || row[0].userId !== userId) {
    const error = new Error("Assessment not found");
    (error as Error & { code?: string }).code = "NOT_FOUND";
    throw error;
  }
}

export async function saveAssessmentResponse(
  userId: number,
  assessmentId: number,
  dimensionId: number,
  payload: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) return;

  await assertAssessmentOwner(db, assessmentId, userId);

  await db.insert(assessmentResponses).values({
    assessmentId,
    dimensionId,
    payload: encryptText(JSON.stringify(payload)) ?? "{}",
  });
}

export async function getAssessmentResponses(
  userId: number,
  assessmentId: number
) {
  const db = await getDb();
  if (!db) return [];

  await assertAssessmentOwner(db, assessmentId, userId);

  const rows = await db
    .select()
    .from(assessmentResponses)
    .where(eq(assessmentResponses.assessmentId, assessmentId));

  return rows.map(row => ({
    ...row,
    payload: parseEncryptedPayload(row.payload),
  }));
}

function parseEncryptedPayload(payload: unknown): Record<string, unknown> {
  if (!payload) return {};
  if (typeof payload === "object") return payload as Record<string, unknown>;
  const decrypted = decryptText(String(payload));
  if (!decrypted) return {};
  try {
    return JSON.parse(decrypted) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function completeAssessment(userId: number, assessmentId: number) {
  const db = await getDb();
  if (!db) return;

  await assertAssessmentOwner(db, assessmentId, userId);

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

export async function getSubstanceFocus(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(substanceFocus)
    .where(eq(substanceFocus.userId, userId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}
