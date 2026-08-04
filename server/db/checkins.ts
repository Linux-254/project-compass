import { eq, and, desc } from "drizzle-orm";
import { checkIns, streaks, milestones } from "../../drizzle/schema";
import { getDb } from "./client";

export async function getOrCreateStreak(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  let streak = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1);

  if (streak.length === 0) {
    await db.insert(streaks).values({ userId, current: 0, longest: 0 });
    streak = await db
      .select()
      .from(streaks)
      .where(eq(streaks.userId, userId))
      .limit(1);
  }

  return streak.length > 0 ? streak[0] : undefined;
}

export async function createCheckIn(
  userId: number,
  localDate: string,
  part: "morning" | "evening",
  data: { mood?: number; energy?: number; cravings?: number; notes?: string }
) {
  const db = await getDb();
  if (!db) return;

  await db
    .insert(checkIns)
    .values({
      userId,
      localDate,
      part,
      mood: data.mood,
      energy: data.energy,
      cravings: data.cravings,
      payload: data.notes ? { notes: data.notes } : undefined,
    })
    .onConflictDoUpdate({
      target: [checkIns.userId, checkIns.localDate, checkIns.part],
      set: {
        mood: data.mood,
        energy: data.energy,
        cravings: data.cravings,
        payload: data.notes ? { notes: data.notes } : undefined,
      },
    });
}

export async function getTodayCheckIn(
  userId: number,
  part: "morning" | "evening"
) {
  const db = await getDb();
  if (!db) return undefined;

  const today = new Date().toISOString().split("T")[0];
  const result = await db
    .select()
    .from(checkIns)
    .where(
      and(
        eq(checkIns.userId, userId),
        eq(checkIns.localDate, today),
        eq(checkIns.part, part)
      )
    )
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function listCheckIns(userId: number, limit = 30, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(checkIns)
    .where(eq(checkIns.userId, userId))
    .orderBy(desc(checkIns.createdAt))
    .limit(limit)
    .offset(offset);
}

export async function getMilestones(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(milestones)
    .where(eq(milestones.userId, userId))
    .orderBy(desc(milestones.dayCount));
}
