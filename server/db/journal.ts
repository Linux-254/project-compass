import { eq, and, desc } from "drizzle-orm";
import { journalEntries } from "../../drizzle/schema";
import { encryptText, decryptText } from "../lib/encryption";
import { getDb } from "./client";

export async function createJournalEntry(
  userId: number,
  body: string,
  dimensionId?: number,
  promptId?: number
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(journalEntries).values({
    userId,
    body: encryptText(body) ?? undefined,
    dimensionId,
    promptId,
  });
}

export async function getJournalEntries(
  userId: number,
  limit = 20,
  offset = 0
) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, userId))
    .orderBy(desc(journalEntries.createdAt))
    .limit(limit)
    .offset(offset);

  return rows.map(entry => ({
    ...entry,
    body: decryptText(entry.body),
  }));
}

export async function updateJournalEntry(
  userId: number,
  entryId: number,
  body: string
) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(journalEntries)
    .set({ body: encryptText(body) ?? undefined })
    .where(
      and(eq(journalEntries.id, entryId), eq(journalEntries.userId, userId))
    );
}

export async function deleteJournalEntry(userId: number, entryId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .delete(journalEntries)
    .where(
      and(eq(journalEntries.id, entryId), eq(journalEntries.userId, userId))
    );
}
