import { eq } from "drizzle-orm";
import { musicProfiles, playlists } from "../../drizzle/schema";
import { getDb } from "./client";

export async function getOrCreateMusicProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  let profile = await db
    .select()
    .from(musicProfiles)
    .where(eq(musicProfiles.userId, userId))
    .limit(1);

  if (profile.length === 0) {
    await db.insert(musicProfiles).values({ userId });
    profile = await db
      .select()
      .from(musicProfiles)
      .where(eq(musicProfiles.userId, userId))
      .limit(1);
  }

  return profile.length > 0 ? profile[0] : undefined;
}

export async function updateMusicProfile(
  userId: number,
  data: Partial<typeof musicProfiles.$inferInsert>
) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(musicProfiles)
    .set(data)
    .where(eq(musicProfiles.userId, userId));
  return getOrCreateMusicProfile(userId);
}

export async function createPlaylist(
  userId: number,
  title: string,
  context?: string,
  tracks?: unknown[]
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(playlists).values({
    userId,
    title,
    context,
    tracks: tracks ?? [],
  });
}

export async function getPlaylists(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(playlists).where(eq(playlists.userId, userId));
}
