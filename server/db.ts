import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import {
  InsertUser,
  users,
  profiles,
  userRoles,
  lifeDimensions,
  assessments,
  assessmentResponses,
  dimensionScores,
  checkIns,
  streaks,
  milestones,
  journalEntries,
  rulesBoundaries,
  goals,
  goalSteps,
  resources,
  musicProfiles,
  newsletterSubscriptions,
  newsletterIssues,
  playlists,
  substanceFocus,
  userPreferences,
  supporterLinks,
  adminAuditLogs,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

const SENSITIVE_PREFIX = "enc:v1:";
const sensitiveKey = createHash("sha256").update(ENV.cookieSecret || "reforge-development-key").digest();

export function encryptSensitive(value: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", sensitiveKey, iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${SENSITIVE_PREFIX}${iv.toString("base64url")}:${tag.toString("base64url")}:${ciphertext.toString("base64url")}`;
}

export function decryptSensitive(value: string | null): string | null {
  if (!value) return null;
  if (!value.startsWith(SENSITIVE_PREFIX)) return value;
  const [, , ivEncoded, tagEncoded, ciphertextEncoded] = value.split(":");
  if (!ivEncoded || !tagEncoded || !ciphertextEncoded) return null;
  try {
    const decipher = createDecipheriv("aes-256-gcm", sensitiveKey, Buffer.from(ivEncoded, "base64url"));
    decipher.setAuthTag(Buffer.from(tagEncoded, "base64url"));
    return Buffer.concat([
      decipher.update(Buffer.from(ciphertextEncoded, "base64url")),
      decipher.final(),
    ]).toString("utf8");
  } catch {
    return null;
  }
}

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      const client = postgres(process.env.DATABASE_URL, { max: 5 });
      _db = drizzle(client);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

// ============================================================================
// USER MANAGEMENT
// ============================================================================

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  let attempts = 2;
  while (attempts > 0) {
    attempts--;
    const activeDb = await getDb();
    if (!activeDb) {
      console.warn("[Database] Cannot upsert user: database not available");
      return;
    }

    try {
      const values: InsertUser = {
        openId: user.openId,
      };
      const updateSet: Record<string, unknown> = {};

      const textFields = ["name", "email", "loginMethod"] as const;
      type TextField = (typeof textFields)[number];

      const assignNullable = (field: TextField) => {
        const value = user[field];
        if (value === undefined) return;
        const normalized = value ?? null;
        values[field] = normalized;
        updateSet[field] = normalized;
      };

      textFields.forEach(assignNullable);

      if (user.lastSignedIn !== undefined) {
        values.lastSignedIn = user.lastSignedIn;
        updateSet.lastSignedIn = user.lastSignedIn;
      }
      if (user.role !== undefined) {
        values.role = user.role;
        updateSet.role = user.role;
      } else if (user.openId === ENV.ownerOpenId) {
        values.role = "admin";
        updateSet.role = "admin";
      }

      if (!values.lastSignedIn) {
        values.lastSignedIn = new Date();
      }

      if (Object.keys(updateSet).length === 0) {
        updateSet.lastSignedIn = new Date();
      }

      await activeDb.insert(users).values(values).onConflictDoUpdate({
        target: users.openId,
        set: updateSet,
      });
      return;
    } catch (error) {
      console.error("[Database] Failed to upsert user (attempt remaining: " + attempts + "):", error);
      if (attempts === 0) {
        throw error;
      }
      // Reset cached db instance on connection drop
      // @ts-ignore
      _db = null;
    }
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

export async function getOrCreateProfile(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  let profile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);

  if (profile.length === 0) {
    await db.insert(profiles).values({
      userId,
      displayName: null,
      timezone: "UTC",
      locale: "en",
      faithPreference: "both",
    });
    profile = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
  }

  return profile.length > 0 ? profile[0] : undefined;
}

export async function updateProfile(userId: number, data: Partial<typeof profiles.$inferInsert>) {
  const db = await getDb();
  if (!db) return undefined;

  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
  return getOrCreateProfile(userId);
}

// ============================================================================
// LIFE DIMENSIONS
// ============================================================================

export async function getLifeDimensions() {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(lifeDimensions).orderBy(asc(lifeDimensions.order));
}

export async function seedLifeDimensions() {
  const db = await getDb();
  if (!db) return;

  const dimensionData = [
    { slug: "work-career", label: "Work & Career", order: 1 },
    { slug: "aspirations-goals", label: "Aspirations & Goals", order: 2 },
    { slug: "impact-loved-ones", label: "Impact on Loved Ones", order: 3 },
    { slug: "behavioral-changes", label: "Behavioural Changes", order: 4 },
    { slug: "who-before", label: "Who They Were Before", order: 5 },
    { slug: "escaping-from", label: "What They Were Escaping", order: 6 },
    { slug: "getting-back-to", label: "What They Were Trying to Get Back To", order: 7 },
    { slug: "when-using", label: "What They Were Like When Using", order: 8 },
    { slug: "short-term-changes", label: "Short-Term Changes", order: 9 },
    { slug: "long-term-changes", label: "Long-Term Changes", order: 10 },
    { slug: "going-for", label: "What They Were Going For", order: 11 },
    { slug: "faith-relationship", label: "Relationship with God/Faith", order: 12 },
    { slug: "relationships", label: "Relationship with Others", order: 13 },
    { slug: "avoiding", label: "What They Were Avoiding", order: 14 },
    { slug: "not-avoiding", label: "What They Were NOT Avoiding", order: 15 },
    { slug: "physical-health", label: "Physical Health", order: 16 },
    { slug: "mental-health", label: "Mental Health", order: 17 },
    { slug: "financial", label: "Financial Situation", order: 18 },
    { slug: "daily-routines", label: "Daily Routines", order: 19 },
    { slug: "social-environment", label: "Social Environment", order: 20 },
    { slug: "self-image", label: "Self-Image", order: 21 },
  ];

  for (const dim of dimensionData) {
    const existing = await db
      .select()
      .from(lifeDimensions)
      .where(eq(lifeDimensions.slug, dim.slug))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(lifeDimensions).values(dim);
    }
  }
}

// ============================================================================
// ASSESSMENTS
// ============================================================================

export async function createAssessment(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db.insert(assessments).values({ userId, version: 1 });
  const assessmentId = (result as any).insertId;

  return db.select().from(assessments).where(eq(assessments.id, assessmentId)).limit(1);
}

export async function saveAssessmentResponse(
  userId: number,
  assessmentId: number,
  dimensionId: number,
  payload: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) return;

  const ownedAssessment = await db
    .select({ id: assessments.id })
    .from(assessments)
    .where(and(eq(assessments.id, assessmentId), eq(assessments.userId, userId)))
    .limit(1);
  if (!ownedAssessment[0]) throw new Error("Assessment not found");

  await db.insert(assessmentResponses).values({ assessmentId, dimensionId, payload });
}

export async function completeAssessment(userId: number, assessmentId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(assessments)
    .set({ completedAt: new Date() })
    .where(and(eq(assessments.id, assessmentId), eq(assessments.userId, userId)));
}

// ============================================================================
// CHECK-INS & STREAKS
// ============================================================================

export async function getOrCreateStreak(userId: number) {
  const db = await getDb();
  if (!db) return undefined;

  let streak = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);

  if (streak.length === 0) {
    await db.insert(streaks).values({ userId, current: 0, longest: 0 });
    streak = await db.select().from(streaks).where(eq(streaks.userId, userId)).limit(1);
  }

  return streak.length > 0 ? streak[0] : undefined;
}

export async function getMilestones(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(milestones).where(eq(milestones.userId, userId));
}

export async function createMilestone(userId: number, title: string, targetDays: number) {
  const db = await getDb();
  if (!db) return;
  await db.insert(milestones).values({ userId, dayCount: targetDays, achievedAt: new Date() });
}

export async function listCheckIns(userId: number, limit = 30, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  const rows = await db.select().from(checkIns).where(eq(checkIns.userId, userId)).orderBy(desc(checkIns.createdAt)).limit(limit).offset(offset);
  return rows.map(row => {
    const notes = typeof row.payload === "object" && row.payload && "notes" in row.payload
      ? decryptSensitive(String((row.payload as { notes?: string }).notes ?? ""))
      : null;
    return { ...row, payload: notes ? { notes } : row.payload };
  });
}

export async function createCheckIn(
  userId: number,
  localDate: string,
  part: "morning" | "evening",
  data: { mood?: number; energy?: number; cravings?: number; notes?: string }
) {
  const db = await getDb();
  if (!db) return;

  const existing = await db
    .select()
    .from(checkIns)
    .where(and(eq(checkIns.userId, userId), eq(checkIns.localDate, localDate), eq(checkIns.part, part)))
    .limit(1);
  const payload = data.notes ? { notes: encryptSensitive(data.notes) } : undefined;
  if (existing[0]) {
    await db
      .update(checkIns)
      .set({ mood: data.mood, energy: data.energy, cravings: data.cravings, payload })
      .where(eq(checkIns.id, existing[0].id));
    return existing[0].id;
  }
  const result = await db.insert(checkIns).values({
    userId,
    localDate,
    part,
    mood: data.mood,
    energy: data.energy,
    cravings: data.cravings,
    payload,
  });
  return Number((result as { insertId?: number }).insertId ?? 1);
}

export async function getTodayCheckIn(userId: number, part: "morning" | "evening") {
  const db = await getDb();
  if (!db) return undefined;

  const today = new Date().toISOString().split("T")[0];
  const result = await db
    .select()
    .from(checkIns)
    .where(and(eq(checkIns.userId, userId), eq(checkIns.localDate, today), eq(checkIns.part, part)))
    .limit(1);

  if (!result[0]) return undefined;
  const row = result[0];
  const notes = typeof row.payload === "object" && row.payload && "notes" in row.payload
    ? decryptSensitive(String((row.payload as { notes?: string }).notes ?? ""))
    : null;
  return { ...row, payload: notes ? { notes } : null };
}

// ============================================================================
// JOURNAL
// ============================================================================

export async function createJournalEntry(
  userId: number,
  body: string,
  dimensionId?: number,
  promptId?: number
) {
  const db = await getDb();
  if (!db) return;

  const result = await db.insert(journalEntries).values({
    userId,
    body: encryptSensitive(body),
    dimensionId,
    promptId,
  });
  return (result as { insertId?: number }).insertId;
}

export async function getJournalEntries(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, userId))
    .orderBy(desc(journalEntries.createdAt))
    .limit(limit)
    .offset(offset);
  return rows.map((row) => ({ ...row, body: decryptSensitive(row.body) ?? "" }));
}

export async function deleteJournalEntry(userId: number, entryId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(journalEntries).where(and(eq(journalEntries.id, entryId), eq(journalEntries.userId, userId)));
}

export async function updateJournalEntry(userId: number, entryId: number, body: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(journalEntries).set({ body: encryptSensitive(body) }).where(and(eq(journalEntries.id, entryId), eq(journalEntries.userId, userId)));
}

// ============================================================================
// GOALS
// ============================================================================

export async function createGoal(
  userId: number,
  title: string,
  horizon: "30" | "90" | "180",
  dimensionId?: number,
  description?: string
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(goals).values({
    userId,
    title,
    horizon,
    dimensionId,
    description,
    status: "active",
  });
}

export async function getActiveGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(goals)
    .where(and(eq(goals.userId, userId), eq(goals.status, "active")))
    .orderBy(desc(goals.createdAt));
}

export async function deleteGoal(userId: number, goalId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(goals).where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
}

export async function updateGoalStatus(userId: number, goalId: number, status: "active" | "completed" | "abandoned") {
  const db = await getDb();
  if (!db) return;
  await db.update(goals).set({ status }).where(and(eq(goals.id, goalId), eq(goals.userId, userId)));
}

export async function getGoals(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(goals).where(eq(goals.userId, userId));
}

export async function addGoalStep(userId: number, goalId: number, title: string) {
  const db = await getDb();
  if (!db) return;

  await db.insert(goalSteps).values({ goalId, title });
}

export async function getGoalSteps(userId: number, goalId: number) {
  const db = await getDb();
  if (!db) return [];

  return db.select().from(goalSteps).where(eq(goalSteps.goalId, goalId));
}

export async function toggleGoalStep(userId: number, goalId: number, stepId: number) {
  const db = await getDb();
  if (!db) return;

  const step = await db.select().from(goalSteps).where(and(eq(goalSteps.id, stepId), eq(goalSteps.goalId, goalId))).limit(1);
  if (step[0]) {
    const nextDoneAt = step[0].doneAt ? null : new Date();
    await db.update(goalSteps).set({ doneAt: nextDoneAt }).where(eq(goalSteps.id, stepId));
  }
}

// ============================================================================
// RULES & BOUNDARIES
// ============================================================================

export async function createRule(userId: number, text: string, reviewCadence = "daily") {
  const db = await getDb();
  if (!db) return;

  await db.insert(rulesBoundaries).values({
    userId,
    text,
    reviewCadence: reviewCadence as "daily" | "weekly" | "monthly",
    active: true,
  });
}

export async function getActiveRules(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(rulesBoundaries)
    .where(and(eq(rulesBoundaries.userId, userId), eq(rulesBoundaries.active, true)))
    .orderBy(desc(rulesBoundaries.createdAt));
}

// ============================================================================
// DIMENSION SCORES
// ============================================================================

export async function saveDimensionScore(
  userId: number,
  dimensionId: number,
  score: number,
  capturedOn: Date
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(dimensionScores).values({
    userId,
    dimensionId,
    score,
    capturedOn,
  });
}

export async function getDimensionScores(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(dimensionScores)
    .where(eq(dimensionScores.userId, userId))
    .orderBy(desc(dimensionScores.capturedOn));
}

export async function getLatestDimensionScores(userId: number) {
  const db = await getDb();
  if (!db) return [];

  const dimensions = await getLifeDimensions();
  const scores = [];

  for (const dim of dimensions) {
    const latestScore = await db
      .select()
      .from(dimensionScores)
      .where(
        and(
          eq(dimensionScores.userId, userId),
          eq(dimensionScores.dimensionId, dim.id)
        )
      )
      .orderBy(desc(dimensionScores.capturedOn))
      .limit(1);

    scores.push({
      dimensionId: dim.id,
      dimensionLabel: dim.label,
      score: latestScore.length > 0 ? latestScore[0].score : 0,
      capturedOn: latestScore.length > 0 ? latestScore[0].capturedOn : null,
    });
  }

  return scores;
}

// ============================================================================
// MUSIC PROFILES
// ============================================================================

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
    profile = await db.select().from(musicProfiles).where(eq(musicProfiles.userId, userId)).limit(1);
  }

  return profile.length > 0 ? profile[0] : undefined;
}

export async function updateMusicProfile(
  userId: number,
  data: Partial<typeof musicProfiles.$inferInsert>
) {
  const db = await getDb();
  if (!db) return;

  await db.update(musicProfiles).set(data).where(eq(musicProfiles.userId, userId));
  return getOrCreateMusicProfile(userId);
}

// ============================================================================
// NEWSLETTER
// ============================================================================

export async function subscribeToNewsletter(
  email: string,
  userId?: number,
  source?: string,
  sendTypes: string[] = ["daily", "weekly"],
) {
  const db = await getDb();
  if (!db) return { confirmationRequired: true } as const;

  const normalizedEmail = email.trim().toLowerCase();
  const confirmationToken = randomBytes(32).toString("hex");
  const existing = await db
    .select()
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.email, normalizedEmail))
    .limit(1);

  if (existing[0]) {
    await db
      .update(newsletterSubscriptions)
      .set({
        userId,
        source,
        status: "pending",
        confirmationToken,
        confirmedAt: null,
        preferences: { sendTypes },
        subscribedAt: null,
        unsubscribedAt: null,
      })
      .where(eq(newsletterSubscriptions.id, existing[0].id));
  } else {
    await db.insert(newsletterSubscriptions).values({
      email: normalizedEmail,
      userId,
      source,
      status: "pending",
      confirmationToken,
      preferences: { sendTypes },
    });
  }

  return { confirmationRequired: true } as const;
}

export async function confirmNewsletterSubscription(token: string) {
  const db = await getDb();
  if (!db) return false;

  const subscription = await db
    .select()
    .from(newsletterSubscriptions)
    .where(eq(newsletterSubscriptions.confirmationToken, token))
    .limit(1);
  if (!subscription[0]) return false;

  await db
    .update(newsletterSubscriptions)
    .set({
      status: "subscribed",
      confirmedAt: new Date(),
      subscribedAt: new Date(),
      confirmationToken: null,
    })
    .where(eq(newsletterSubscriptions.id, subscription[0].id));
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

// ============================================================================
// SUBSTANCE FOCUS
// ============================================================================

export async function savSubstanceFocus(
  userId: number,
  substance: "alcohol" | "nicotine" | "marijuana" | "codeine" | "prescription",
  frequency?: string,
  duration?: string,
  approach: "quit" | "reduce" = "quit"
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(substanceFocus).values({
    userId,
    substance,
    frequency: frequency as "daily" | "weekly" | "occasional" | undefined,
    duration,
    approach,
  });
}

// ============================================================================
// USER PREFERENCES
// ============================================================================

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

  await db.update(userPreferences).set(data).where(eq(userPreferences.userId, userId));
  return getOrCreateUserPreferences(userId);
}

// ============================================================================
// RESOURCES
// ============================================================================

export async function getSubscriptionByEmail(email: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(newsletterSubscriptions).where(eq(newsletterSubscriptions.email, email)).limit(1);
  return result[0];
}

export async function updateSubscriptionPreferences(email: string, prefs: Record<string, unknown>) {
  const db = await getDb();
  if (!db) return;
  await db.update(newsletterSubscriptions).set({ preferences: prefs }).where(eq(newsletterSubscriptions.email, email));
}

export async function recordAdminAudit(input: {
  actorUserId: number;
  action: string;
  targetType: string;
  targetId?: number;
  outcome: "success" | "rejected" | "failed";
}) {
  const db = await getDb();
  if (!db) return false;
  try {
    await db.insert(adminAuditLogs).values({
      actorUserId: input.actorUserId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      outcome: input.outcome,
    });
    return true;
  } catch {
    // Audit failures must never expose sensitive payloads or break the primary admin flow.
    return false;
  }
}

export async function listNewsletterIssues(limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(newsletterIssues).orderBy(desc(newsletterIssues.createdAt)).limit(limit).offset(offset);
}

export async function createNewsletterIssue(type: string, subject: string, body: string, scheduledFor?: Date) {
  const db = await getDb();
  if (!db) return;
  await db.insert(newsletterIssues).values({ type: type as "daily" | "weekly" | "milestone" | "dimension" | "situation", subject, body, scheduledFor });
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
  await db.update(newsletterIssues).set(input).where(eq(newsletterIssues.id, id));
  return true;
}

export async function deleteNewsletterIssue(id: number) {
  const db = await getDb();
  if (!db) return false;
  await db.delete(newsletterIssues).where(eq(newsletterIssues.id, id));
  return true;
}

export async function getResourcesByType(type: string, limit = 20) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(resources).where(eq(resources.type, type as "activity_guide" | "situation_guide" | "relationship_guide" | "devotional" | "article")).limit(limit);
}

export async function getResourceById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const res = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return res[0];
}

export async function listUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).limit(limit).offset(offset);
}

export async function getUserRoles(userId: number) {
  const db = await getDb();
  if (!db) return [];
  const u = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  return u[0] ? [u[0].role] : ["user"];
}

export async function grantUserRole(userId: number, role: "user" | "admin" | "supporter" | "mentor" | "moderator") {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role: role === "admin" ? "admin" : "user" }).where(eq(users.id, userId));
}

export async function revokeUserRole(userId: number, role: string) {
  const db = await getDb();
  if (!db) return;
  await db.update(users).set({ role: "user" }).where(eq(users.id, userId));
}

export async function getRules(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(rulesBoundaries).where(eq(rulesBoundaries.userId, userId));
}

export async function updateRule(userId: number, ruleId: number, data: { text?: string; isCompleted?: boolean; reviewCadence?: string }) {
  const db = await getDb();
  if (!db) return;
  await db.update(rulesBoundaries).set({ text: data.text, active: data.isCompleted === undefined ? undefined : data.isCompleted, reviewCadence: data.reviewCadence as "daily" | "weekly" | "monthly" | undefined }).where(and(eq(rulesBoundaries.id, ruleId), eq(rulesBoundaries.userId, userId)));
}

export async function deleteRule(userId: number, ruleId: number) {
  const db = await getDb();
  if (!db) return;
  await db.delete(rulesBoundaries).where(and(eq(rulesBoundaries.id, ruleId), eq(rulesBoundaries.userId, userId)));
}

export async function getPlaylists(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(playlists).where(eq(playlists.userId, userId));
}

export async function createPlaylist(userId: number, title: string, context?: string, tracks?: unknown[]) {
  const db = await getDb();
  if (!db) return;
  await db.insert(playlists).values({ userId, title, context, tracks: tracks ?? [] });
}

export async function getResourcesByDimension(dimensionId: number, type?: string) {
  const db = await getDb();
  if (!db) return [];

  let query = db
    .select()
    .from(resources)
    .where(
      and(
        eq(resources.dimensionId, dimensionId),
        type ? eq(resources.type, type as any) : undefined
      )
    );

  return query.orderBy(desc(resources.publishedAt));
}
export async function getSubstanceFocus(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const res = await db.select().from(substanceFocus).where(eq(substanceFocus.userId, userId)).limit(1);
  return res[0];
}

export async function saveSubstanceFocus(
  userId: number,
  substance: "alcohol" | "nicotine" | "marijuana" | "codeine" | "prescription",
  frequency?: "daily" | "weekly" | "occasional",
  duration?: string,
  approach: "quit" | "reduce" = "quit"
) {
  const db = await getDb();
  if (!db) return;
  const existing = await getSubstanceFocus(userId);
  const values = { userId, substance, frequency, duration, approach };
  if (existing) {
    await db.update(substanceFocus).set({ substance, frequency, duration, approach }).where(eq(substanceFocus.userId, userId));
  } else {
    await db.insert(substanceFocus).values(values);
  }
}
export async function getDimensionScoreHistory(userId: number, dimensionId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(dimensionScores).where(and(eq(dimensionScores.userId, userId), eq(dimensionScores.dimensionId, dimensionId))).orderBy(desc(dimensionScores.capturedOn)).limit(30);
}

export function supporterScopeAllowsJournal(scope: string | null | undefined) {
  return scope === "dashboard_and_journal" || scope === "full_access";
}

export function supporterCanAccessJournal(link: { status: string | null; consentScope: string | null } | null | undefined) {
  return Boolean(link?.status === "active" && supporterScopeAllowsJournal(link.consentScope));
}

export async function listSupporterLinks(supporterId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(supporterLinks)
    .where(eq(supporterLinks.supporterId, supporterId))
    .orderBy(desc(supporterLinks.createdAt));
}

export async function getActiveSupporterLink(supporterId: number, memberId: number) {
  const db = await getDb();
  if (!db) return null;
  const rows = await db
    .select()
    .from(supporterLinks)
    .where(
      and(
        eq(supporterLinks.supporterId, supporterId),
        eq(supporterLinks.memberId, memberId),
        eq(supporterLinks.status, "active"),
      ),
    )
    .limit(1);
  return rows[0] ?? null;
}

export async function revokeSupporterLink(linkId: number, supporterId: number) {
  const db = await getDb();
  if (!db) return false;
  const existing = await db
    .select({ id: supporterLinks.id })
    .from(supporterLinks)
    .where(
      and(
        eq(supporterLinks.id, linkId),
        eq(supporterLinks.supporterId, supporterId),
        eq(supporterLinks.status, "active"),
      ),
    )
    .limit(1);
  if (!existing[0]) return false;

  await db
    .update(supporterLinks)
    .set({ status: "revoked", revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(supporterLinks.id, linkId));
  return true;
}
