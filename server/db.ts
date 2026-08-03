import { eq, and, desc, asc, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
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
  substanceFocus,
  userPreferences,
  supporterLinks,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
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

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
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
  assessmentId: number,
  dimensionId: number,
  payload: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(assessmentResponses).values({
    assessmentId,
    dimensionId,
    payload,
  });
}

export async function completeAssessment(assessmentId: number) {
  const db = await getDb();
  if (!db) return;

  await db
    .update(assessments)
    .set({ completedAt: new Date() })
    .where(eq(assessments.id, assessmentId));
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

export async function createCheckIn(
  userId: number,
  localDate: string,
  part: "morning" | "evening",
  data: { mood?: number; energy?: number; cravings?: number; notes?: string }
) {
  const db = await getDb();
  if (!db) return;

  await db.insert(checkIns).values({
    userId,
    localDate,
    part,
    mood: data.mood,
    energy: data.energy,
    cravings: data.cravings,
    payload: data.notes ? { notes: data.notes } : undefined,
  });
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

  return result.length > 0 ? result[0] : undefined;
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

  await db.insert(journalEntries).values({
    userId,
    body,
    dimensionId,
    promptId,
  });
}

export async function getJournalEntries(userId: number, limit = 20, offset = 0) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(journalEntries)
    .where(eq(journalEntries.userId, userId))
    .orderBy(desc(journalEntries.createdAt))
    .limit(limit)
    .offset(offset);
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

export async function addGoalStep(goalId: number, title: string) {
  const db = await getDb();
  if (!db) return;

  await db.insert(goalSteps).values({ goalId, title });
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

export async function subscribeToNewsletter(email: string, userId?: number, source?: string) {
  const db = await getDb();
  if (!db) return;

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
