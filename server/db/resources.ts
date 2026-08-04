import { eq, and, desc } from "drizzle-orm";
import { resources } from "../../drizzle/schema";
import { getDb } from "./client";

export async function getResourcesByDimension(
  dimensionId: number,
  type?: string
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [
    eq(resources.dimensionId, dimensionId),
    type
      ? eq(resources.type, type as typeof resources.$inferSelect.type)
      : undefined,
  ];

  return db
    .select()
    .from(resources)
    .where(
      and(...conditions.filter((c): c is ReturnType<typeof eq> => Boolean(c)))
    )
    .orderBy(desc(resources.publishedAt));
}

export async function getResourcesByType(type: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(resources)
    .where(eq(resources.type, type as typeof resources.$inferSelect.type))
    .orderBy(desc(resources.publishedAt))
    .limit(limit);
}

export async function getResourceById(resourceId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(resources)
    .where(eq(resources.id, resourceId))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}
