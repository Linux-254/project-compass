import { randomBytes } from "node:crypto";
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
  source?: string,
  preferences?: InsertNewsletterSubscription["preferences"]
) {
  const db = await getDb();
  if (!db) return;

  const confirmationToken = randomBytes(32).toString("hex");
  const existing = await db
    .select()
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, email))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(newsletterSubscriptions)
      .set({
        status: "pending",
        userId: userId ?? existing[0].userId,
        source: source ?? existing[0].source,
        preferences: preferences ?? existing[0].preferences,
        confirmationToken,
        confirmedAt: null,
        unsubscribedAt: null,
      })
      .where(eq(newsletterSubscriptions.email, email));
    return { status: "pending" as const };
  }

  await db.insert(newsletterSubscriptions).values({
    email,
    userId,
    source,
    preferences,
    status: "pending",
    confirmationToken,
    confirmedAt: null,
  });
  return { status: "pending" as const };
}

export async function confirmNewsletterSubscription(token: string) {
  const db = await getDb();
  if (!db) return false;

  const result = await db
    .select({ id: newsletterSubscriptions.id })
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.confirmationToken, token))
    .limit(1);
  if (result.length === 0) return false;

  await db
    .update(newsletterSubscriptions)
    .set({
      status: "subscribed",
      confirmedAt: new Date(),
      subscribedAt: new Date(),
      confirmationToken: null,
    })
    .where(eq(newsletterSubscriptions.id, result[0].id));
  return true;
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

export async function updateNewsletterIssue(
  id: number,
  input: {
    type?: "daily" | "weekly" | "milestone" | "dimension" | "situation";
    subject?: string;
    body?: string;
    scheduledFor?: Date | null;
  }
) {
  const db = await getDb();
  if (!db) return false;

  await db
    .update(newsletterIssues)
    .set(input)
    .where(eq(newsletterIssues.id, id));
  return true;
}

export async function deleteNewsletterIssue(id: number) {
  const db = await getDb();
  if (!db) return false;

  await db.delete(newsletterIssues).where(eq(newsletterIssues.id, id));
  return true;
}
