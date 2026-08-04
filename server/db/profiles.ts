import { eq } from "drizzle-orm";
import { profiles } from "../../drizzle/schema";
import { getDb } from "./client";

export async function getOrCreateProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  let profile = await db
    .select()
    .from(profiles)
    .where(eq(profiles.userId, userId))
    .limit(1);

  if (profile.length === 0) {
    await db.insert(profiles).values({
      userId,
      displayName: null,
      timezone: "UTC",
      locale: "en",
      faithPreference: "both",
    });
    profile = await db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
  }

  return profile.length > 0 ? profile[0] : undefined;
}

export async function updateProfile(
  userId: number,
  data: Partial<typeof profiles.$inferInsert>
) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
  return getOrCreateProfile(userId);
}
