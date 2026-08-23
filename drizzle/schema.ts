import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  varchar,
} from "drizzle-orm/pg-core";

/**
 * ReForge Database Schema
 * A comprehensive schema for a whole-life recovery platform with 21 life dimensions,
 * assessment tracking, daily check-ins, journal entries, goals, and community features.
 *
 * Postgres (Supabase) dialect. All timestamps are timestamptz. Tier-1 sensitive
 * columns are encrypted at rest by the application layer (see server/lib/encryption.ts).
 */

// ============================================================================
// ENUM TYPES
// ============================================================================

export const userRoleEnum = pgEnum("user_role", ["user", "admin"]);
export const fullRoleEnum = pgEnum("full_role", [
  "user",
  "supporter",
  "mentor",
  "moderator",
  "admin",
]);
export const consentScopeEnum = pgEnum("consent_scope", [
  "dashboard_only",
  "dashboard_and_journal",
  "full_access",
]);
export const linkStatusEnum = pgEnum("link_status", [
  "pending",
  "active",
  "revoked",
]);
export const substanceEnum = pgEnum("substance", [
  "alcohol",
  "nicotine",
  "marijuana",
  "codeine",
  "prescription",
]);
export const frequencyEnum = pgEnum("frequency", [
  "daily",
  "weekly",
  "occasional",
]);
export const approachEnum = pgEnum("approach", ["quit", "reduce"]);
export const phaseEnum = pgEnum("phase", [
  "phase1",
  "phase2",
  "phase3",
  "phase4",
]);
export const faithEnum = pgEnum("faith", ["faith", "secular", "both"]);
export const checkInPartEnum = pgEnum("check_in_part", ["morning", "evening"]);
export const reviewCadenceEnum = pgEnum("review_cadence", [
  "daily",
  "weekly",
  "monthly",
]);
export const goalHorizonEnum = pgEnum("goal_horizon", ["30", "90", "180"]);
export const goalStatusEnum = pgEnum("goal_status", [
  "active",
  "completed",
  "abandoned",
]);
export const resourceTypeEnum = pgEnum("resource_type", [
  "activity_guide",
  "situation_guide",
  "relationship_guide",
  "devotional",
  "article",
]);
export const faithVariantEnum = pgEnum("faith_variant", [
  "faith",
  "secular",
  "neutral",
]);
export const energyLevelEnum = pgEnum("energy_level", [
  "low",
  "medium",
  "high",
]);
export const timeAvailableEnum = pgEnum("time_available", [
  "5min",
  "15min",
  "30min",
  "1hour",
  "flexible",
]);
export const newsletterStatusEnum = pgEnum("newsletter_status", [
  "pending",
  "subscribed",
  "unsubscribed",
  "bounced",
]);
export const newsletterTypeEnum = pgEnum("newsletter_type", [
  "daily",
  "weekly",
  "milestone",
  "dimension",
  "situation",
]);
export const pairingStatusEnum = pgEnum("pairing_status", [
  "pending",
  "active",
  "completed",
]);

const id = () => integer("id").generatedAlwaysAsIdentity().primaryKey();
const createdAt = () =>
  timestamp("createdAt", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () =>
  timestamp("updatedAt", { withTimezone: true })
    .defaultNow()
    .$onUpdate(() => new Date());

// ============================================================================
// IDENTITY & ACCESS
// ============================================================================

/**
 * Core user table backing auth flow.
 * Managed by Manus OAuth.
 */
export const users = pgTable("users", {
  id: id(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: userRoleEnum("role").default("user").notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User roles table for RBAC.
 * Separate from profiles to support multiple roles per user.
 */
export const userRoles = pgTable(
  "user_roles",
  {
    id: id(),
    userId: integer("userId").notNull(),
    role: fullRoleEnum("role").notNull(),
    createdAt: createdAt(),
  },
  table => ({
    userIdIdx: index("user_roles_userId_idx").on(table.userId),
  })
);

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;

/**
 * User profiles with personal details and preferences.
 */
export const profiles = pgTable(
  "profiles",
  {
    id: id(),
    userId: integer("userId").notNull().unique(),
    displayName: varchar("displayName", { length: 255 }),
    avatar: text("avatar"),
    timezone: varchar("timezone", { length: 64 }).default("UTC"),
    locale: varchar("locale", { length: 10 }).default("en"),
    journeyStartDate: timestamp("journeyStartDate", {
      withTimezone: true,
    }).defaultNow(),
    currentPhase: phaseEnum("currentPhase").default("phase1"),
    faithPreference: faithEnum("faithPreference").default("both"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: uniqueIndex("profiles_userId_idx").on(table.userId),
  })
);

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * Supporter links for The Supporter profile.
 * Enables supporters to view member progress within consented scope.
 */
export const supporterLinks = pgTable(
  "supporter_links",
  {
    id: id(),
    supporterId: integer("supporterId").notNull(),
    memberId: integer("memberId").notNull(),
    consentScope: consentScopeEnum("consentScope").default("dashboard_only"),
    status: linkStatusEnum("status").default("pending"),
    // Null for revoked links so the unique key permits future re-invites.
    liveKey: varchar("liveKey", { length: 100 }),
    revokedAt: timestamp("revokedAt", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    supporterIdIdx: index("supporter_links_supporterId_idx").on(
      table.supporterId
    ),
    memberIdIdx: index("supporter_links_memberId_idx").on(table.memberId),
    livePairUniqueIdx: uniqueIndex("supporter_links_live_pair_idx").on(table.liveKey),
  })
);

export type SupporterLink = typeof supporterLinks.$inferSelect;
export type InsertSupporterLink = typeof supporterLinks.$inferInsert;

// ============================================================================
// PROGRAM CONFIGURATION
// ============================================================================

/**
 * Substance focus for each user.
 * Tracks primary substance and recovery approach.
 */
export const substanceFocus = pgTable(
  "substance_focus",
  {
    id: id(),
    userId: integer("userId").notNull().unique(),
    substance: substanceEnum("substance").notNull(),
    frequency: frequencyEnum("frequency"),
    duration: varchar("duration", { length: 255 }),
    approach: approachEnum("approach").default("quit"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: uniqueIndex("substance_focus_userId_idx").on(table.userId),
  })
);

export type SubstanceFocus = typeof substanceFocus.$inferSelect;
export type InsertSubstanceFocus = typeof substanceFocus.$inferInsert;

/**
 * User preferences for check-in times, notifications, and content.
 */
export const userPreferences = pgTable(
  "user_preferences",
  {
    id: id(),
    userId: integer("userId").notNull().unique(),
    morningCheckInTime: varchar("morningCheckInTime", { length: 5 }),
    eveningCheckInTime: varchar("eveningCheckInTime", { length: 5 }),
    notificationsEnabled: boolean("notificationsEnabled").default(true),
    emailNotifications: boolean("emailNotifications").default(true),
    musicConsent: boolean("musicConsent").default(false),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: uniqueIndex("user_preferences_userId_idx").on(table.userId),
  })
);

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

/**
 * Reference table for the 21 life dimensions.
 * Immutable across all users.
 */
export const lifeDimensions = pgTable("life_dimensions", {
  id: id(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  order: integer("order").notNull(),
  createdAt: createdAt(),
});

export type LifeDimension = typeof lifeDimensions.$inferSelect;
export type InsertLifeDimension = typeof lifeDimensions.$inferInsert;

// ============================================================================
// ASSESSMENT & TRACKING
// ============================================================================

/**
 * Assessment records for onboarding and periodic re-assessment.
 */
export const assessments = pgTable(
  "assessments",
  {
    id: id(),
    userId: integer("userId").notNull(),
    version: integer("version").default(1),
    completedAt: timestamp("completedAt", { withTimezone: true }),
    createdAt: createdAt(),
  },
  table => ({
    userIdIdx: index("assessments_userId_idx").on(table.userId),
  })
);

export type Assessment = typeof assessments.$inferSelect;
export type InsertAssessment = typeof assessments.$inferInsert;

/**
 * Assessment responses for each dimension.
 * JSONB payload allows flexible question/answer structures.
 * Tier-1 sensitive: encrypted at rest, never logged.
 */
export const assessmentResponses = pgTable(
  "assessment_responses",
  {
    id: id(),
    assessmentId: integer("assessmentId").notNull(),
    dimensionId: integer("dimensionId").notNull(),
    payload: jsonb("payload"),
    createdAt: createdAt(),
  },
  table => ({
    assessmentIdIdx: index("assessment_responses_assessmentId_idx").on(
      table.assessmentId
    ),
    dimensionIdIdx: index("assessment_responses_dimensionId_idx").on(
      table.dimensionId
    ),
  })
);

export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAssessmentResponse = typeof assessmentResponses.$inferInsert;

/**
 * Dimension scores tracking progress across the 21 dimensions.
 * Captured at regular intervals (daily check-in, weekly, or on-demand).
 */
export const dimensionScores = pgTable(
  "dimension_scores",
  {
    id: id(),
    userId: integer("userId").notNull(),
    dimensionId: integer("dimensionId").notNull(),
    score: integer("score").notNull(), // 0-100
    capturedOn: timestamp("capturedOn", { withTimezone: true }).notNull(),
    createdAt: createdAt(),
  },
  table => ({
    userIdDimensionIdIdx: index("dimension_scores_userId_dimensionId_idx").on(
      table.userId,
      table.dimensionId
    ),
    capturedOnIdx: index("dimension_scores_capturedOn_idx").on(
      table.capturedOn
    ),
  })
);

export type DimensionScore = typeof dimensionScores.$inferSelect;
export type InsertDimensionScore = typeof dimensionScores.$inferInsert;

/**
 * Daily check-ins (morning and evening).
 * One check-in per user per date per part.
 * Tier-1 sensitive: free-text entries encrypted at rest.
 */
export const checkIns = pgTable(
  "check_ins",
  {
    id: id(),
    userId: integer("userId").notNull(),
    localDate: varchar("localDate", { length: 10 }).notNull(), // YYYY-MM-DD
    part: checkInPartEnum("part").notNull(),
    mood: integer("mood"), // 1-10 scale
    energy: integer("energy"), // 1-10 scale
    cravings: integer("cravings"), // 1-10 scale
    payload: jsonb("payload"), // Free-text notes, encrypted
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdLocalDatePartIdx: uniqueIndex(
      "check_ins_userId_localDate_part_unique"
    ).on(table.userId, table.localDate, table.part),
  })
);

export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = typeof checkIns.$inferInsert;

/**
 * Streaks and milestones.
 * Tracks sober-day streaks and milestone achievements.
 */
export const streaks = pgTable(
  "streaks",
  {
    id: id(),
    userId: integer("userId").notNull().unique(),
    current: integer("current").default(0),
    longest: integer("longest").default(0),
    lastCountedDate: timestamp("lastCountedDate", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: uniqueIndex("streaks_userId_idx").on(table.userId),
  })
);

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = typeof streaks.$inferInsert;

/**
 * Milestones (7, 14, 30, 60, 90, 180 days).
 */
export const milestones = pgTable(
  "milestones",
  {
    id: id(),
    userId: integer("userId").notNull(),
    dayCount: integer("dayCount").notNull(),
    achievedAt: timestamp("achievedAt", { withTimezone: true }).notNull(),
    celebratedAt: timestamp("celebratedAt", { withTimezone: true }),
    createdAt: createdAt(),
  },
  table => ({
    userIdIdx: index("milestones_userId_idx").on(table.userId),
  })
);

export type Milestone = typeof milestones.$inferSelect;
export type InsertMilestone = typeof milestones.$inferInsert;

// ============================================================================
// CONTENT THE USER CREATES
// ============================================================================

/**
 * Journal entries.
 * Tier-1 sensitive: encrypted at rest, never logged, owner-only access.
 */
export const journalEntries = pgTable(
  "journal_entries",
  {
    id: id(),
    userId: integer("userId").notNull(),
    promptId: integer("promptId"),
    dimensionId: integer("dimensionId"),
    body: text("body"), // Encrypted at rest
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: index("journal_entries_userId_idx").on(table.userId),
    userIdCreatedAtIdx: index("journal_entries_userId_createdAt_idx").on(
      table.userId,
      table.createdAt
    ),
  })
);

export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertJournalEntry = typeof journalEntries.$inferInsert;

/**
 * Rules and boundaries.
 * User-defined rules for recovery and daily structure.
 */
export const rulesBoundaries = pgTable(
  "rules_boundaries",
  {
    id: id(),
    userId: integer("userId").notNull(),
    text: text("text").notNull(),
    active: boolean("active").default(true),
    reviewCadence: reviewCadenceEnum("reviewCadence").default("daily"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: index("rules_boundaries_userId_idx").on(table.userId),
  })
);

export type RuleBoundary = typeof rulesBoundaries.$inferSelect;
export type InsertRuleBoundary = typeof rulesBoundaries.$inferInsert;

/**
 * Rule reviews tracking daily/weekly/monthly reviews.
 */
export const ruleReviews = pgTable(
  "rule_reviews",
  {
    id: id(),
    ruleId: integer("ruleId").notNull(),
    reviewDate: timestamp("reviewDate", { withTimezone: true }).notNull(),
    kept: boolean("kept").notNull(),
    notes: text("notes"),
    createdAt: createdAt(),
  },
  table => ({
    ruleIdIdx: index("rule_reviews_ruleId_idx").on(table.ruleId),
  })
);

export type RuleReview = typeof ruleReviews.$inferSelect;
export type InsertRuleReview = typeof ruleReviews.$inferInsert;

/**
 * Goals with 30/90/180 day horizons.
 */
export const goals = pgTable(
  "goals",
  {
    id: id(),
    userId: integer("userId").notNull(),
    horizon: goalHorizonEnum("horizon").notNull(),
    dimensionId: integer("dimensionId"),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: goalStatusEnum("status").default("active"),
    createdAt: createdAt(),
    completedAt: timestamp("completedAt", { withTimezone: true }),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: index("goals_userId_idx").on(table.userId),
  })
);

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * Goal steps for daily breakdown.
 */
export const goalSteps = pgTable(
  "goal_steps",
  {
    id: id(),
    goalId: integer("goalId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    doneAt: timestamp("doneAt", { withTimezone: true }),
    createdAt: createdAt(),
  },
  table => ({
    goalIdIdx: index("goal_steps_goalId_idx").on(table.goalId),
  })
);

export type GoalStep = typeof goalSteps.$inferSelect;
export type InsertGoalStep = typeof goalSteps.$inferInsert;

// ============================================================================
// CONTENT THE PLATFORM SERVES
// ============================================================================

/**
 * Resources (guides, articles, etc.).
 */
export const resources = pgTable(
  "resources",
  {
    id: id(),
    type: resourceTypeEnum("type").notNull(),
    dimensionId: integer("dimensionId"),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body"),
    tags: varchar("tags", { length: 500 }),
    faithVariant: faithVariantEnum("faithVariant").default("neutral"),
    publishedAt: timestamp("publishedAt", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    typeIdx: index("resources_type_idx").on(table.type),
    dimensionIdIdx: index("resources_dimensionId_idx").on(table.dimensionId),
  })
);

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Activity guides with context tags.
 */
export const activityGuides = pgTable(
  "activity_guides",
  {
    id: id(),
    resourceId: integer("resourceId").notNull(),
    jobType: varchar("jobType", { length: 255 }),
    energyLevel: energyLevelEnum("energyLevel"),
    timeAvailable: timeAvailableEnum("timeAvailable"),
    interests: varchar("interests", { length: 500 }),
    createdAt: createdAt(),
  },
  table => ({
    resourceIdIdx: index("activity_guides_resourceId_idx").on(table.resourceId),
  })
);

export type ActivityGuide = typeof activityGuides.$inferSelect;
export type InsertActivityGuide = typeof activityGuides.$inferInsert;

/**
 * Music profiles for music rehabilitation feature.
 */
export const musicProfiles = pgTable(
  "music_profiles",
  {
    id: id(),
    userId: integer("userId").notNull().unique(),
    triggerGenres: varchar("triggerGenres", { length: 500 }),
    triggerArtists: varchar("triggerArtists", { length: 500 }),
    safeGenres: varchar("safeGenres", { length: 500 }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  table => ({
    userIdIdx: uniqueIndex("music_profiles_userId_idx").on(table.userId),
  })
);

export type MusicProfile = typeof musicProfiles.$inferSelect;
export type InsertMusicProfile = typeof musicProfiles.$inferInsert;

/**
 * Playlists for music rehabilitation.
 */
export const playlists = pgTable(
  "playlists",
  {
    id: id(),
    userId: integer("userId").notNull(),
    context: varchar("context", { length: 255 }),
    title: varchar("title", { length: 255 }).notNull(),
    tracks: jsonb("tracks"), // Array of track metadata
    createdAt: createdAt(),
  },
  table => ({
    userIdIdx: index("playlists_userId_idx").on(table.userId),
  })
);

export type Playlist = typeof playlists.$inferSelect;
export type InsertPlaylist = typeof playlists.$inferInsert;

// ============================================================================
// NEWSLETTER
// ============================================================================

/**
 * Newsletter subscriptions.
 */
export const newsletterSubscriptions = pgTable(
  "newsletter_subscriptions",
  {
    id: id(),
    email: varchar("email", { length: 320 }).notNull(),
    userId: integer("userId"),
    status: newsletterStatusEnum("status").default("subscribed"),
    source: varchar("source", { length: 255 }),
    preferences: jsonb("preferences"), // frequency/topics preferences
    confirmationToken: varchar("confirmationToken", { length: 128 }),
    confirmedAt: timestamp("confirmedAt", { withTimezone: true }),
    subscribedAt: timestamp("subscribedAt", {
      withTimezone: true,
    }).defaultNow(),
    unsubscribedAt: timestamp("unsubscribedAt", { withTimezone: true }),
    createdAt: createdAt(),
  },
  table => ({
    emailIdx: index("newsletter_subscriptions_email_idx").on(table.email),
    userIdIdx: index("newsletter_subscriptions_userId_idx").on(table.userId),
  })
);

export type NewsletterSubscription =
  typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription =
  typeof newsletterSubscriptions.$inferInsert;

/**
 * Newsletter issues (daily, weekly, milestone, dimension, situation).
 */
export const newsletterIssues = pgTable(
  "newsletter_issues",
  {
    id: id(),
    type: newsletterTypeEnum("type").notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    body: text("body").notNull(),
    scheduledFor: timestamp("scheduledFor", { withTimezone: true }),
    sentAt: timestamp("sentAt", { withTimezone: true }),
    createdAt: createdAt(),
  },
  table => ({
    typeIdx: index("newsletter_issues_type_idx").on(table.type),
    scheduledForIdx: index("newsletter_issues_scheduledFor_idx").on(
      table.scheduledFor
    ),
  })
);

export type NewsletterIssue = typeof newsletterIssues.$inferSelect;
export type InsertNewsletterIssue = typeof newsletterIssues.$inferInsert;

/**
 * Newsletter sends tracking.
 */
export const newsletterSends = pgTable(
  "newsletter_sends",
  {
    id: id(),
    issueId: integer("issueId").notNull(),
    subscriptionId: integer("subscriptionId").notNull(),
    sentAt: timestamp("sentAt", { withTimezone: true }).defaultNow(),
    openedAt: timestamp("openedAt", { withTimezone: true }),
    dedupeKey: varchar("dedupeKey", { length: 255 }).unique(),
    createdAt: createdAt(),
  },
  table => ({
    issueIdIdx: index("newsletter_sends_issueId_idx").on(table.issueId),
    subscriptionIdIdx: index("newsletter_sends_subscriptionId_idx").on(
      table.subscriptionId
    ),
  })
);

export type NewsletterSend = typeof newsletterSends.$inferSelect;
export type InsertNewsletterSend = typeof newsletterSends.$inferInsert;

// ============================================================================
// COMMUNITY (Phase 2+)
// ============================================================================

/**
 * Community membership.
 */
export const communityMembership = pgTable(
  "community_membership",
  {
    id: id(),
    userId: integer("userId").notNull().unique(),
    unlockedAt: timestamp("unlockedAt", { withTimezone: true }),
    readinessMilestone: integer("readinessMilestone").default(0),
    createdAt: createdAt(),
  },
  table => ({
    userIdIdx: uniqueIndex("community_membership_userId_idx").on(table.userId),
  })
);

export type CommunityMembership = typeof communityMembership.$inferSelect;
export type InsertCommunityMembership = typeof communityMembership.$inferInsert;

/**
 * Mentor pairings.
 */
export const mentorPairings = pgTable(
  "mentor_pairings",
  {
    id: id(),
    mentorId: integer("mentorId").notNull(),
    menteeId: integer("menteeId").notNull(),
    status: pairingStatusEnum("status").default("active"),
    createdAt: createdAt(),
  },
  table => ({
    mentorIdIdx: index("mentor_pairings_mentorId_idx").on(table.mentorId),
    menteeIdIdx: index("mentor_pairings_menteeId_idx").on(table.menteeId),
  })
);

export type MentorPairing = typeof mentorPairings.$inferSelect;
export type InsertMentorPairing = typeof mentorPairings.$inferInsert;

/**
 * Group challenges.
 */
export const groupChallenges = pgTable("group_challenges", {
  id: id(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  startDate: timestamp("startDate", { withTimezone: true }).notNull(),
  endDate: timestamp("endDate", { withTimezone: true }).notNull(),
  createdAt: createdAt(),
});

export type GroupChallenge = typeof groupChallenges.$inferSelect;
export type InsertGroupChallenge = typeof groupChallenges.$inferInsert;

/**
 * Group challenge participation.
 */
export const challengeParticipants = pgTable(
  "challenge_participants",
  {
    id: id(),
    challengeId: integer("challengeId").notNull(),
    userId: integer("userId").notNull(),
    completedAt: timestamp("completedAt", { withTimezone: true }),
    createdAt: createdAt(),
  },
  table => ({
    challengeIdIdx: index("challenge_participants_challengeId_idx").on(
      table.challengeId
    ),
    userIdIdx: index("challenge_participants_userId_idx").on(table.userId),
  })
);

export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant =
  typeof challengeParticipants.$inferInsert;

/**
 * Non-sensitive audit trail for privileged administrative mutations.
 * Never store journal, check-in, or newsletter body content here.
 */
export const adminAuditLogs = pgTable(
  "admin_audit_logs",
  {
    id: id(),
    actorUserId: integer("actorUserId").notNull(),
    action: varchar("action", { length: 64 }).notNull(),
    targetType: varchar("targetType", { length: 64 }).notNull(),
    targetId: integer("targetId"),
    outcome: varchar("outcome", { length: 32 }).notNull(),
    createdAt: createdAt(),
  },
  table => ({
    actorIdx: index("admin_audit_logs_actor_idx").on(table.actorUserId),
    actionIdx: index("admin_audit_logs_action_idx").on(table.action),
    createdAtIdx: index("admin_audit_logs_createdAt_idx").on(table.createdAt),
  })
);
export type AdminAuditLog = typeof adminAuditLogs.$inferSelect;
export type InsertAdminAuditLog = typeof adminAuditLogs.$inferInsert;
