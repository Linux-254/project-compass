import { eq, and, desc } from "drizzle-orm";
import { checkIns, streaks, milestones } from "../../drizzle/schema";
import { encryptText, decryptText } from "../lib/encryption";
import { getDb } from "./client";

const MILESTONE_DAYS = [7, 14, 30, 60, 90, 180];

function toUtcDay(dateStr: string): number {
  return Date.UTC(
    Number(dateStr.slice(0, 4)),
    Number(dateStr.slice(5, 7)) - 1,
    Number(dateStr.slice(8, 10))
  );
}

function todayUtcDay(): number {
  return toUtcDay(new Date().toISOString().split("T")[0]);
}

async function recomputeStreak(
  db: NonNullable<Awaited<ReturnType<typeof getDb>>>,
  userId: number
) {
  const rows = await db
    .select({ localDate: checkIns.localDate })
    .from(checkIns)
    .where(eq(checkIns.userId, userId));

  const daySet = new Set(rows.map(r => toUtcDay(r.localDate)));
  const today = todayUtcDay();
  const dayMs = 24 * 60 * 60 * 1000;

  let current = 0;
  let cursor = today;
  while (daySet.has(cursor)) {
    current += 1;
    cursor -= dayMs;
  }

  const existing = await db
    .select()
    .from(streaks)
    .where(eq(streaks.userId, userId))
    .limit(1);

  if (existing.length > 0) {
    const longest = Math.max(existing[0].longest ?? 0, current);
    await db
      .update(streaks)
      .set({ current, longest, lastCountedDate: new Date() })
      .where(eq(streaks.userId, userId));
  } else {
    await db.insert(streaks).values({ userId, current, longest: current });
  }

  // Record milestones as they are reached (idempotent).
  for (const day of MILESTONE_DAYS) {
    if (current < day) continue;
    const hit = await db
      .select()
      .from(milestones)
      .where(and(eq(milestones.userId, userId), eq(milestones.dayCount, day)))
      .limit(1);
    if (hit.length === 0) {
      await db.insert(milestones).values({
        userId,
        dayCount: day,
        achievedAt: new Date(),
      });
    }
  }
}

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

  const payload = data.notes ? { notes: encryptText(data.notes) } : undefined;

  await db
    .insert(checkIns)
    .values({
      userId,
      localDate,
      part,
      mood: data.mood,
      energy: data.energy,
      cravings: data.cravings,
      payload,
    })
    .onConflictDoUpdate({
      target: [checkIns.userId, checkIns.localDate, checkIns.part],
      set: {
        mood: data.mood,
        energy: data.energy,
        cravings: data.cravings,
        payload,
      },
    });

  await recomputeStreak(db, userId);
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

  return result.length > 0 ? decryptCheckIn(result[0]) : undefined;
}

export async function listCheckIns(userId: number, limit = 30, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(checkIns)
    .where(eq(checkIns.userId, userId))
    .orderBy(desc(checkIns.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(decryptCheckIn);
}

function decryptCheckIn(checkIn: typeof checkIns.$inferSelect) {
  const payload = checkIn.payload as { notes?: string } | null;
  if (payload?.notes) {
    return {
      ...checkIn,
      payload: { notes: decryptText(payload.notes) },
    };
  }
  return checkIn;
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
