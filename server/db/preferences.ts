import { eq } from "drizzle-orm";
import { userPreferences } from "../../drizzle/schema";
import { getDb } from "./client";

export async function getOrCreateUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  let prefs = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);

  if (prefs.length === 0) {
    await db.insert(userPreferences).values({
      userId,
      notificationsEnabled: true,
      emailNotifications: true,
      musicConsent: false,
    });
    prefs = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId))
      .limit(1);
  }

  return prefs.length > 0 ? prefs[0] : undefined;
}

export async function updateUserPreferences(
  userId: number,
  data: Partial<typeof userPreferences.$inferInsert>
) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(userPreferences)
    .set(data)
    .where(eq(userPreferences.userId, userId));
  return getOrCreateUserPreferences(userId);
}
