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
import { BUNDLED_TRACKS, MUSIC_MOODS, MusicMoodKey, MusicTrack } from "@shared/music";

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

// True when the configured database could not be reached (or is not configured).
// In this mode every data-access layer falls back to bundled demo fixtures so
// the whole product surface stays viewable on localhost without a live Postgres.
export let demoMode = false;
let _probePromise: Promise<ReturnType<typeof drizzle> | null> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
// Probes connectivity once; an unreachable host (de-provisioned Supabase
// project, offline network) flips demo mode instead of throwing per query.
export async function getDb() {
  if (_db) return _db;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    demoMode = true;
    return null;
  }
  if (!_probePromise) {
    _probePromise = (async () => {
      try {
        const client = postgres(databaseUrl, { max: 5, connect_timeout: 5 });
        await client`select 1`;
        _db = drizzle(client);
        console.log("[Database] Connected.");
      } catch (error) {
        console.warn(
          "[Database] Unavailable — running in demo mode:",
          (error as Error).message ?? String(error)
        );
        _db = null;
        demoMode = true;
      }
      return _db;
    })();
  }
  return _probePromise;
}

// ============================================================================
// DEMO MODE FIXTURES
// ============================================================================

const DAY_MS = 24 * 60 * 60 * 1000;
const daysAgo = (days: number) => new Date(Date.now() - days * DAY_MS);
const localDateDaysAgo = (days: number) =>
  daysAgo(days).toISOString().split("T")[0];

const DEMO_USER_ID = 1;

const DEMO_DIMENSIONS = [
  { id: 1, slug: "work-career", label: "Work & Career", order: 1 },
  { id: 2, slug: "aspirations-goals", label: "Aspirations & Goals", order: 2 },
  { id: 3, slug: "impact-loved-ones", label: "Impact on Loved Ones", order: 3 },
  { id: 4, slug: "behavioral-changes", label: "Behavioural Changes", order: 4 },
  { id: 5, slug: "who-before", label: "Who They Were Before", order: 5 },
  { id: 6, slug: "escaping-from", label: "What They Were Escaping", order: 6 },
  { id: 7, slug: "getting-back-to", label: "What They Were Trying to Get Back To", order: 7 },
  { id: 8, slug: "when-using", label: "What They Were Like When Using", order: 8 },
  { id: 9, slug: "short-term-changes", label: "Short-Term Changes", order: 9 },
  { id: 10, slug: "long-term-changes", label: "Long-Term Changes", order: 10 },
  { id: 11, slug: "going-for", label: "What They Were Going For", order: 11 },
  { id: 12, slug: "faith-relationship", label: "Relationship with God/Faith", order: 12 },
  { id: 13, slug: "relationships", label: "Relationship with Others", order: 13 },
  { id: 14, slug: "avoiding", label: "What They Were Avoiding", order: 14 },
  { id: 15, slug: "not-avoiding", label: "What They Were NOT Avoiding", order: 15 },
  { id: 16, slug: "physical-health", label: "Physical Health", order: 16 },
  { id: 17, slug: "mental-health", label: "Mental Health", order: 17 },
  { id: 18, slug: "financial", label: "Financial Situation", order: 18 },
  { id: 19, slug: "daily-routines", label: "Daily Routines", order: 19 },
  { id: 20, slug: "social-environment", label: "Social Environment", order: 20 },
  { id: 21, slug: "self-image", label: "Self-Image", order: 21 },
].map(dim => ({
  ...dim,
  description: null,
  createdAt: daysAgo(120),
}));

// Latest score (0-100) per dimension — deliberately mid-flight so the progress
// map reads as a story in motion, not a clean slate or a finished one.
const DEMO_SCORE_BY_DIMENSION: Record<number, number> = {
  1: 42, 2: 55, 3: 61, 4: 58, 5: 48, 6: 39, 7: 52, 8: 34, 9: 64, 10: 47,
  11: 56, 12: 71, 13: 59, 14: 44, 15: 51, 16: 63, 17: 57, 18: 38, 19: 60,
  20: 53, 21: 49,
};

const DEMO_USER = {
  id: DEMO_USER_ID,
  openId: "local_demo_user",
  name: "ReForge Demo Browser",
  email: null,
  loginMethod: "demo",
  role: "admin" as const,
  createdAt: daysAgo(60),
  updatedAt: daysAgo(60),
  lastSignedIn: daysAgo(0),
};

const DEMO_PROFILE = {
  id: DEMO_USER_ID,
  userId: DEMO_USER_ID,
  displayName: "Maya",
  avatar: null,
  timezone: "Africa/Nairobi",
  locale: "en",
  journeyStartDate: daysAgo(42),
  currentPhase: "phase2" as const,
  faithPreference: "both" as const,
  createdAt: daysAgo(60),
  updatedAt: daysAgo(2),
};

const DEMO_STREAK = {
  id: DEMO_USER_ID,
  userId: DEMO_USER_ID,
  current: 14,
  longest: 32,
  lastCountedDate: daysAgo(0),
  createdAt: daysAgo(42),
  updatedAt: daysAgo(0),
};

const DEMO_SUBSTANCE_FOCUS = {
  id: DEMO_USER_ID,
  userId: DEMO_USER_ID,
  substance: "alcohol",
  frequency: "weekly",
  duration: "about six years, on and off",
  approach: "quit",
  createdAt: daysAgo(42),
  updatedAt: daysAgo(42),
};

const DEMO_PREFERENCES = {
  id: DEMO_USER_ID,
  userId: DEMO_USER_ID,
  morningCheckInTime: "07:00",
  eveningCheckInTime: "21:00",
  notificationsEnabled: true,
  emailNotifications: true,
  musicConsent: true,
  createdAt: daysAgo(42),
  updatedAt: daysAgo(42),
};

const DEMO_MUSIC_PROFILE = {
  id: DEMO_USER_ID,
  userId: DEMO_USER_ID,
  triggerGenres: "trap, drill, phonk",
  triggerArtists: "artists linked to the old evenings",
  safeGenres: "lofi, ambient, gospel, soft r&b",
  createdAt: daysAgo(30),
  updatedAt: daysAgo(6),
};

const DEMO_MILESTONES = [
  { id: 1, userId: DEMO_USER_ID, dayCount: 7, achievedAt: daysAgo(35), celebratedAt: null, createdAt: daysAgo(35) },
  { id: 2, userId: DEMO_USER_ID, dayCount: 14, achievedAt: daysAgo(21), celebratedAt: null, createdAt: daysAgo(21) },
  { id: 3, userId: DEMO_USER_ID, dayCount: 30, achievedAt: daysAgo(5), celebratedAt: daysAgo(5), createdAt: daysAgo(5) },
];

const DEMO_CHECK_INS = Array.from({ length: 14 }, (_, i) => {
  const mood = 6 + ((i * 3) % 4);
  const energy = 5 + ((i * 5) % 4);
  const cravings = Math.max(1, 7 - Math.floor(i / 2));
  const notes = "Steady. I let an old familiar tug pass without making a scene.";
  return [
    {
      id: i * 2 + 1,
      userId: DEMO_USER_ID,
      localDate: localDateDaysAgo(i),
      part: "morning",
      mood,
      energy,
      cravings: Math.min(9, cravings + 1),
      payload: { notes: i % 3 === 0 ? notes : null },
      createdAt: daysAgo(i),
      updatedAt: daysAgo(i),
    },
    {
      id: i * 2 + 2,
      userId: DEMO_USER_ID,
      localDate: localDateDaysAgo(i),
      part: "evening",
      mood,
      energy,
      cravings,
      payload: { notes: i % 2 === 0 ? "Grateful for the rhythm I am rebuilding." : null },
      createdAt: daysAgo(i),
      updatedAt: daysAgo(i),
    },
  ];
}).flat();

const DEMO_GOALS = [
  {
    id: 1, userId: DEMO_USER_ID, horizon: "30" as const, dimensionId: 16,
    title: "Walk for twenty minutes most mornings",
    description: "Movement before the phone. It changes the whole shape of the day.",
    status: "active" as const, createdAt: daysAgo(14), completedAt: null, updatedAt: daysAgo(1),
  },
  {
    id: 2, userId: DEMO_USER_ID, horizon: "90" as const, dimensionId: 17,
    title: "Rebuild a consistent sleep rhythm",
    description: "Lights off by ten-thirty, no screens in bed, tea instead of noise.",
    status: "active" as const, createdAt: daysAgo(21), completedAt: null, updatedAt: daysAgo(2),
  },
  {
    id: 3, userId: DEMO_USER_ID, horizon: "180" as const, dimensionId: 1,
    title: "Return to work with honesty and calm",
    description: "Open, focused, and unashamed about the journey.",
    status: "active" as const, createdAt: daysAgo(40), completedAt: null, updatedAt: daysAgo(7),
  },
];

const DEMO_GOAL_STEPS = [
  { id: 1, goalId: 1, title: "Shoes by the door the night before", doneAt: daysAgo(1), createdAt: daysAgo(13) },
  { id: 2, goalId: 1, title: "Ten minutes, no destination", doneAt: daysAgo(3), createdAt: daysAgo(13) },
  { id: 3, goalId: 1, title: "Twenty minutes with the evening playlist", doneAt: null, createdAt: daysAgo(13) },
];

const DEMO_RULES = [
  { id: 1, userId: DEMO_USER_ID, text: "No alcohol in the house — full stop.", active: true, reviewCadence: "daily" as const, createdAt: daysAgo(20), updatedAt: daysAgo(20) },
  { id: 2, userId: DEMO_USER_ID, text: "I check in before I open any social feed.", active: true, reviewCadence: "daily" as const, createdAt: daysAgo(18), updatedAt: daysAgo(18) },
  { id: 3, userId: DEMO_USER_ID, text: "No plans to meet people who actively use.", active: true, reviewCadence: "weekly" as const, createdAt: daysAgo(16), updatedAt: daysAgo(16) },
  { id: 4, userId: DEMO_USER_ID, text: "I am honest with my sponsor every week.", active: true, reviewCadence: "weekly" as const, createdAt: daysAgo(12), updatedAt: daysAgo(12) },
];

const DEMO_JOURNAL_ENTRIES = [
  {
    id: 1, userId: DEMO_USER_ID, promptId: null, dimensionId: 17,
    body: "Day fourteen. The craving came at lunch, familiar as an old voice. I named it, drank water, and let it pass. That is the whole victory and it is real.",
    createdAt: daysAgo(1), updatedAt: daysAgo(1),
  },
  {
    id: 2, userId: DEMO_USER_ID, promptId: null, dimensionId: 16,
    body: "Walked twenty minutes before work for the first time in years. My body remembered the path even when my mind did not.",
    createdAt: daysAgo(4), updatedAt: daysAgo(4),
  },
  {
    id: 3, userId: DEMO_USER_ID, promptId: null, dimensionId: 3,
    body: "Called my sister. She said my voice sounds like it did before. That sentence is carrying me today.",
    createdAt: daysAgo(9), updatedAt: daysAgo(9),
  },
];

const DEMO_PLAYLISTS = [
  { id: 1, userId: DEMO_USER_ID, context: "tough evenings", title: "How the light comes back", tracks: [{ title: "Sample — Morning Loop" }, { title: "Sample — Still Water" }] },
  { id: 2, userId: DEMO_USER_ID, context: "Sunday reset", title: "Sabbath headspace", tracks: [{ title: "Sample — As One" }] },
];

const DEMO_SUBSCRIBERS = [
  { id: 1, userId: DEMO_USER_ID, email: "demo@reforge.local", status: "subscribed", preferences: { sendTypes: ["daily", "weekly", "milestone"] }, createdAt: daysAgo(28) },
];

const DEMO_NEWSLETTER_ISSUES = [
  {
    id: 1, type: "daily", subject: "Grounding in the morning light",
    body: "Breathe in for four, out for six.\n\nYou are not behind. You are exactly where today begins.",
    scheduledFor: daysAgo(1), sentAt: daysAgo(1), createdAt: daysAgo(1),
  },
  {
    id: 2, type: "weekly", subject: "The Friday-night gap",
    body: "The hardest hour is the one you first crossed alone. Plan for it before it arrives: a message to send, a place to go, a reason already in your pocket.",
    scheduledFor: daysAgo(5), sentAt: daysAgo(5), createdAt: daysAgo(5),
  },
  {
    id: 3, type: "milestone", subject: "Thirty days — a quiet landmark",
    body: "Thirty days is not the finish line; it is proof of a pattern. Notice who you phone differently now.",
    scheduledFor: daysAgo(5), sentAt: daysAgo(5), createdAt: daysAgo(5),
  },
];

const DEMO_RESOURCES_BY_TYPE: Record<string, { id: number; type: string; dimensionId: number | null; title: string; body: string; tags: string | null; faithVariant: string | null; publishedAt: Date }[]> = {
  activity_guide: [
    { id: 1, type: "activity_guide", dimensionId: 16, title: "A gentle walk with no destination", body: "Ten to twenty minutes, no phone, no goal but to move.\n\n1. Step outside, even to the end of the road.\n2. Let the breath settle into its own rhythm.\n3. Notice one thing you have not noticed in months — a tree, a door colour, a bird call.", tags: "move, fresh air, morning", faithVariant: "neutral", publishedAt: daysAgo(12) },
    { id: 2, type: "activity_guide", dimensionId: 17, title: "Box-breathing before the trigger hour", body: "Breathe in for four, hold for four, out for four, hold for four. Repeat for two minutes.\n\nDo it before you need it, not when you are already at the edge.", tags: "breath, urges, calm", faithVariant: "neutral", publishedAt: daysAgo(20) },
    { id: 3, type: "activity_guide", dimensionId: 19, title: "Tidy one surface, slowly", body: "A single kitchen surface or desk drawer. Not a project — a ritual. Finishing one small thing rewires the sense of what a good day is.", tags: "ritual, order, small wins", faithVariant: "neutral", publishedAt: daysAgo(30) },
  ],
  situation_guide: [
    { id: 4, type: "situation_guide", dimensionId: 6, title: "The Friday-night gap", body: "Friday evenings arrive with permission written all over them.\n\nHave a plan before the hour: a message you will send, a place you will go, a song that steadies you. Write down what you will say aloud when the thought arrives to 'just this once'.\n\nThe thought is not the command. You are the one who decides.", tags: "urges, weekends, planning", faithVariant: "neutral", publishedAt: daysAgo(10) },
    { id: 5, type: "situation_guide", dimensionId: 20, title: "Holiday gatherings", body: "You can love people and still guard your doorstep.\n\nDecide your boundary in advance: arrive late, leave early, have your own transport, keep a non-alcoholic drink in hand. If you need a reason, 'I am taking a season off' is a complete sentence.", tags: "family, boundaries, holidays", faithVariant: "neutral", publishedAt: daysAgo(24) },
    { id: 6, type: "situation_guide", dimensionId: 6, title: "When an old friend calls", body: "The friend who used to drink with you calling at the old hour. You do not need to decide the whole friendship tonight.\n\nAnswer if you can, keep it short and true: 'Good to hear your voice. I am not drinking these days.' The honest sentence protects you and gives them room to honour it.", tags: "friendship, honesty", faithVariant: "neutral", publishedAt: daysAgo(40) },
  ],
  relationship_guide: [
    { id: 7, type: "relationship_guide", dimensionId: 3, title: "Telling someone you are in recovery", body: "You get to choose who knows and when.\n\nStart with the people who already see it. A sentence like 'I have stopped drinking, and I am rebuilding my life' is enough. You do not need to perform certainty or answer for your past.", tags: "trust, family, disclosure", faithVariant: "neutral", publishedAt: daysAgo(15) },
    { id: 8, type: "relationship_guide", dimensionId: 13, title: "Rebuilding trust in small actions", body: "Trust is not rebuilt by grand speeches. It is rebuilt by small, boring, repeated reliability: the returned call, the kept promise, the on-time arrival.\n\nChoose one relationship and one tiny promise you can keep this week. Keep it.", tags: "trust, repair, small steps", faithVariant: "neutral", publishedAt: daysAgo(28) },
    { id: 9, type: "relationship_guide", dimensionId: 20, title: "Guarding the doorstep", body: "Part of recovery is choosing your company. It is not cruelty to step back from people who pull you toward the old life.\n\nYou do not have to announce it. You can simply become a person who is unexpectedly busy, in a good way, building a life worth protecting.", tags: "boundaries, social", faithVariant: "neutral", publishedAt: daysAgo(36) },
  ],
  devotional: [
    { id: 10, type: "devotional", dimensionId: 12, title: "A morning word", body: "Rest is not a reward you have to earn; it is the ground you build on.\n\nClose your eyes for one minute. Let the shoulders drop. You do not have to be braver than you are today — only one step more honest.", tags: "faith, rest, honesty", faithVariant: "faith", publishedAt: daysAgo(1) },
    { id: 11, type: "devotional", dimensionId: 12, title: "The second chance", body: "Every surrender is a small letting go of the thing that held you — and a turning toward something that has a future.\n\nGive yourself the same mercy you would give a friend who stumbled yesterday and got up today.", tags: "faith, mercy, renewal", faithVariant: "both", publishedAt: daysAgo(2) },
    { id: 12, type: "devotional", dimensionId: 12, title: "The steady work", body: "The sacred is often found in the unremarkable: a kept promise, a crossed off boundary, a hand on a shoulder.\n\nToday's sacred work may simply be the next small thing done gently.", tags: "faith, steady, presence", faithVariant: "secular", publishedAt: daysAgo(3) },
  ],
  article: [
    { id: 13, type: "article", dimensionId: 17, title: "What actually changes during the first thirty days", body: "The first month is less about willpower and more about repair. Sleep deepens, the body thanks you, and the brain starts trusting words like 'tomorrow' again.\n\nExpect the second week to feel harder than the first — that is the pattern, not a failure on your part.\n\nYou are not looking for a clean upward line. You are looking for a direction.", tags: "science, month one", faithVariant: "neutral", publishedAt: daysAgo(18) },
    { id: 14, type: "article", dimensionId: 14, title: "Why we reach for a substance at six o'clock", body: "Six o'clock is not about the substance — it is the hinge between the demands of the day and the silence of the evening.\n\nThe fix is rarely fighting the craving. It is filling the hinge with something that speaks to you: a walk, a call, a song, a kitchen that smells like garlic.\n\nPlan the hinge and the craving finds less to grip.", tags: "triggers, routines, evening", faithVariant: "neutral", publishedAt: daysAgo(34) },
    { id: 15, type: "article", dimensionId: 13, title: "Relationships grow back, one returnable call at a time", body: "People are not waiting for you to be finished to love you again. They are waiting for you to be real.\n\nReturn the call. Take the small invitation. The relationship you are mourning is not gone — it is awaiting a quieter you.", tags: "family, repair, hope", faithVariant: "neutral", publishedAt: daysAgo(45) },
  ],
};

const DEMO_LATEST_SCORES = DEMO_DIMENSIONS.map(dim => ({
  dimensionId: dim.id,
  dimensionLabel: dim.label,
  score: DEMO_SCORE_BY_DIMENSION[dim.id],
  capturedOn: daysAgo(1),
}));

const demoResources = () =>
  Object.values(DEMO_RESOURCES_BY_TYPE)
    .flat()
    .map(resource => ({
      ...resource,
      createdAt: resource.publishedAt,
      updatedAt: resource.publishedAt,
    }));

const demoScoreHistory = (dimensionId: number) =>
  [12, 8, 5, 3, 1, 0].map((offset, index) => {
    const latest = DEMO_SCORE_BY_DIMENSION[dimensionId] ?? 50;
    return {
      id: index + 1,
      userId: DEMO_USER_ID,
      dimensionId,
      score: Math.max(5, Math.min(95, latest - (5 - index) * 4)),
      capturedOn: daysAgo(offset),
      createdAt: daysAgo(offset),
    };
  });

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
  if (demoMode) return openId === DEMO_USER.openId ? DEMO_USER : undefined;
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (demoMode) return id === DEMO_USER_ID ? DEMO_USER : undefined;
  if (!db) return undefined;

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

// ============================================================================
// PROFILE MANAGEMENT
// ============================================================================

export async function getOrCreateProfile(userId: number) {
  const db = await getDb();
  if (demoMode) return { ...DEMO_PROFILE, userId };
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
  if (demoMode) return { ...DEMO_PROFILE, ...data, userId };
  if (!db) return undefined;

  await db.update(profiles).set(data).where(eq(profiles.userId, userId));
  return getOrCreateProfile(userId);
}

// ============================================================================
// LIFE DIMENSIONS
// ============================================================================

export async function getLifeDimensions() {
  const db = await getDb();
  if (demoMode) return [...DEMO_DIMENSIONS];
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
  if (demoMode) {
    return [
      {
        id: 1,
        userId,
        version: 1,
        completedAt: null,
        createdAt: daysAgo(42),
      },
    ];
  }
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
  if (demoMode) return { ...DEMO_STREAK, userId };
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
  if (demoMode) return [...DEMO_MILESTONES];
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
  if (demoMode) return DEMO_CHECK_INS.slice(offset, offset + limit);
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
  if (demoMode) {
    const match = DEMO_CHECK_INS.find(c => c.localDate === localDateDaysAgo(0) && c.part === part);
    if (!match) return undefined;
    const notes = match.payload && "notes" in match.payload ? String((match.payload as { notes?: string }).notes ?? "") : "";
    return { ...match, userId, payload: notes ? { notes } : null };
  }
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
  if (demoMode) return DEMO_JOURNAL_ENTRIES.slice(offset, offset + limit);
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
  if (demoMode) return [...DEMO_GOALS];
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
  if (demoMode) return [...DEMO_GOALS];
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
  if (demoMode) return DEMO_GOAL_STEPS.filter(step => step.goalId === goalId);
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
  if (demoMode) return [...DEMO_RULES];
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
  if (demoMode) return DEMO_LATEST_SCORES.map((s, index) => ({
    id: index + 1,
    userId,
    dimensionId: s.dimensionId,
    score: s.score,
    capturedOn: s.capturedOn as Date,
    createdAt: s.capturedOn as Date,
  }));
  if (!db) return [];

  return db
    .select()
    .from(dimensionScores)
    .where(eq(dimensionScores.userId, userId))
    .orderBy(desc(dimensionScores.capturedOn));
}

export async function getLatestDimensionScores(userId: number) {
  const db = await getDb();
  if (demoMode) return DEMO_LATEST_SCORES;
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
  if (demoMode) return { ...DEMO_MUSIC_PROFILE, userId };
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
  if (demoMode) return { ...DEMO_MUSIC_PROFILE, ...data, userId };
  if (!db) return;

  await db.update(musicProfiles).set(data).where(eq(musicProfiles.userId, userId));
  return getOrCreateMusicProfile(userId);
}

// ============================================================================
// MUSIC LIBRARY
// ============================================================================

// Bundled tracks always ship; user-added tracks live in-memory keyed by user so
// both demo and DB modes behave identically for the browsing sessions.
const customTracksByUser = new Map<number, MusicTrack[]>();

export function getMusicLibrary(userId: number) {
  return {
    moods: MUSIC_MOODS,
    tracks: [...BUNDLED_TRACKS, ...(customTracksByUser.get(userId) ?? [])],
  };
}

export function addMusicTrack(
  userId: number,
  input: { title: string; mood: MusicMoodKey; url: string }
): MusicTrack {
  const track: MusicTrack = {
    id: `custom_${randomBytes(6).toString("hex")}`,
    title: input.title.trim(),
    mood: input.mood,
    url: input.url.trim(),
    source: "custom",
  };
  const list = customTracksByUser.get(userId) ?? [];
  list.push(track);
  customTracksByUser.set(userId, list);
  return track;
}

export function removeMusicTrack(userId: number, trackId: string) {
  const list = customTracksByUser.get(userId) ?? [];
  customTracksByUser.set(userId, list.filter(t => t.id !== trackId));
  return { success: true };
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
  if (demoMode) return { ...DEMO_PREFERENCES, userId };
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
  if (demoMode) return { ...DEMO_PREFERENCES, ...data, userId };
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
  if (demoMode) return DEMO_NEWSLETTER_ISSUES.slice(offset, offset + limit);
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
  if (demoMode) {
    return demoResources().filter(r => r.type === type).slice(0, limit);
  }
  if (!db) return [];
  return db.select().from(resources).where(eq(resources.type, type as "activity_guide" | "situation_guide" | "relationship_guide" | "devotional" | "article")).limit(limit);
}

export async function getResourceById(id: number) {
  const db = await getDb();
  if (demoMode) {
    const all = demoResources();
    return all.find(r => r.id === id) ?? all[0];
  }
  if (!db) return undefined;
  const res = await db.select().from(resources).where(eq(resources.id, id)).limit(1);
  return res[0];
}

export async function listUsers(limit = 50, offset = 0) {
  const db = await getDb();
  if (demoMode) {
    const others = [
      { id: 2, openId: "sample_member_01", name: "Samuel Wachira", email: "samuel@example.com", role: "user", createdAt: daysAgo(55), updatedAt: daysAgo(9), lastSignedIn: daysAgo(9) },
      { id: 3, openId: "sample_member_02", name: "Amara Okafor", email: "amara@example.com", role: "user", createdAt: daysAgo(48), updatedAt: daysAgo(3), lastSignedIn: daysAgo(3) },
      { id: 4, openId: "sample_supporter_01", name: "Grace Njeri", email: "grace@example.com", role: "user", createdAt: daysAgo(90), updatedAt: daysAgo(6), lastSignedIn: daysAgo(6) },
    ];
    return [DEMO_USER, ...others].slice(offset, offset + limit);
  }
  if (!db) return [];
  return db.select().from(users).limit(limit).offset(offset);
}

export async function getUserRoles(userId: number) {
  const db = await getDb();
  if (demoMode) return ["admin"];
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
  if (demoMode) return [...DEMO_RULES];
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
  if (demoMode) return [...DEMO_PLAYLISTS];
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
  if (demoMode) {
    return demoResources().filter(r =>
      r.dimensionId === dimensionId &&
      (type ? r.type === type : true)
    );
  }
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
  if (demoMode) return { ...DEMO_SUBSTANCE_FOCUS, userId };
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
  if (demoMode) return demoScoreHistory(dimensionId);
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

export async function createSupporterLink(
  supporterId: number,
  memberId: number,
  consentScope: "dashboard_only" | "dashboard_and_journal" | "full_access" = "dashboard_only",
) {
  const db = await getDb();
  if (!db || supporterId === memberId) return undefined;

  const member = await db.select({ id: users.id }).from(users).where(eq(users.id, memberId)).limit(1);
  if (!member[0]) return undefined;

  const existing = await db
    .select({ id: supporterLinks.id, status: supporterLinks.status })
    .from(supporterLinks)
    .where(and(eq(supporterLinks.supporterId, supporterId), eq(supporterLinks.memberId, memberId)))
    .orderBy(desc(supporterLinks.createdAt))
    .limit(1);
  if (existing[0] && (existing[0].status === "active" || existing[0].status === "pending")) return undefined;

  const liveKey = `${supporterId}:${memberId}`;
  try {
    // TiDB/MySQL does not provide PostgreSQL RETURNING semantics; select by the
    // unique live key after insert so the persisted row is returned reliably.
    await db.insert(supporterLinks).values({ supporterId, memberId, consentScope, status: "pending", liveKey });
    const [created] = await db.select().from(supporterLinks).where(eq(supporterLinks.liveKey, liveKey)).limit(1);
    return created;
  } catch (error) {
    // The nullable unique live key turns concurrent pending/active requests into a safe no-op.
    if (error instanceof Error && /supporter_links_live_pair_idx|duplicate key|unique constraint/i.test(error.message)) {
      return undefined;
    }
    throw error;
  }
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
    .set({ status: "revoked", liveKey: null, revokedAt: new Date(), updatedAt: new Date() })
    .where(eq(supporterLinks.id, linkId));
  return true;
}
