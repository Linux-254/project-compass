import { eq, and, desc } from "drizzle-orm";
import {
  newsletterSubscriptions,
  newsletterIssues,
  newsletterSends,
  InsertNewsletterSubscription,
} from "../../drizzle/schema";
import { getDb } from "./client";

export async function subscribeToNewsletter(
  email: string,
  userId?: number,
  source?: string
) {
  const db = await getDb();
  if (!db) return;

  const existing = await db
    .select()
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(newsletterSubscriptions)
      .set({
        status: "subscribed",
        userId: userId ?? existing[0].userId,
        source: source ?? existing[0].source,
        unsubscribedAt: null,
        subscribedAt: new Date(),
      })
      .where(eq(newsletterSubscriptions.email, email));
    return;
  }

  await db.insert(newsletterSubscriptions).values({
    email,
    userId,
    source,
    status: "subscribed",
  });
}

export async function unsubscribeFromNewsletter(email: string) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(newsletterSubscriptions)
    .set({ status: "unsubscribed", unsubscribedAt: new Date() })
    .where(eq(newsletterSubscriptions.email, email));
}

export async function getSubscriptionByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email))
    .limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateSubscriptionPreferences(
  email: string,
  preferences: InsertNewsletterSubscription["preferences"]
) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(newsletterSubscriptions)
    .set({ preferences })
    .where(eq(newsletterSubscriptions.email, email));
}

export async function createNewsletterIssue(
  type: "daily" | "weekly" | "milestone" | "dimension" | "situation",
  subject: string,
  body: string,
  scheduledFor?: Date
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(newsletterIssues).values({
    type,
    subject,
    body,
    scheduledFor,
  });
}

export async function listNewsletterIssues(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(newsletterIssues)
    .orderBy(desc(newsletterIssues.scheduledFor))
    .limit(limit)
    .offset(offset);
}

export async function recordNewsletterSend(
  issueId: number,
  subscriptionId: number,
  dedupeKey: string
) {
  const db = await getDb();
  if (!db) return;

  await db
    .insert(newsletterSends)
    .values({ issueId, subscriptionId, sentAt: new Date(), dedupeKey })
    .onConflictDoNothing({ target: newsletterSends.dedupeKey });
}
