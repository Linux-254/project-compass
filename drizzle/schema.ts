import {
  int,
  mysqlEnum,
  mysqlTable,
  text,
  timestamp,
  varchar,
  decimal,
  json,
  boolean,
  uniqueIndex,
  index,
} from "drizzle-orm/mysql-core";

/**
 * ReForge Database Schema
 * A comprehensive schema for a whole-life recovery platform with 21 life dimensions,
 * assessment tracking, daily check-ins, journal entries, goals, and community features.
 */

// ============================================================================
// IDENTITY & ACCESS
// ============================================================================

/**
 * Core user table backing auth flow.
 * Managed by Manus OAuth.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }).unique(),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * User roles table for RBAC.
 * Separate from profiles to support multiple roles per user.
 */
export const userRoles = mysqlTable(
  "user_roles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    role: mysqlEnum("role", ["user", "supporter", "mentor", "moderator", "admin"]).notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("user_roles_userId_idx").on(table.userId),
  })
);

export type UserRole = typeof userRoles.$inferSelect;
export type InsertUserRole = typeof userRoles.$inferInsert;

/**
 * User profiles with personal details and preferences.
 */
export const profiles = mysqlTable(
  "profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    displayName: varchar("displayName", { length: 255 }),
    avatar: text("avatar"),
    timezone: varchar("timezone", { length: 64 }).default("UTC"),
    locale: varchar("locale", { length: 10 }).default("en"),
    journeyStartDate: timestamp("journeyStartDate").defaultNow(),
    currentPhase: mysqlEnum("currentPhase", ["phase1", "phase2", "phase3", "phase4"]).default("phase1"),
    faithPreference: mysqlEnum("faithPreference", ["faith", "secular", "both"]).default("both"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("profiles_userId_idx").on(table.userId),
  })
);

export type Profile = typeof profiles.$inferSelect;
export type InsertProfile = typeof profiles.$inferInsert;

/**
 * Supporter links for The Supporter profile.
 * Enables supporters to view member progress within consented scope.
 */
export const supporterLinks = mysqlTable(
  "supporter_links",
  {
    id: int("id").autoincrement().primaryKey(),
    supporterId: int("supporterId").notNull(),
    memberId: int("memberId").notNull(),
    consentScope: mysqlEnum("consentScope", [
      "dashboard_only",
      "dashboard_and_journal",
      "full_access",
    ]).default("dashboard_only"),
    status: mysqlEnum("status", ["pending", "active", "revoked"]).default("pending"),
    revokedAt: timestamp("revokedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    supporterIdIdx: index("supporter_links_supporterId_idx").on(table.supporterId),
    memberIdIdx: index("supporter_links_memberId_idx").on(table.memberId),
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
export const substanceFocus = mysqlTable(
  "substance_focus",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    substance: mysqlEnum("substance", [
      "alcohol",
      "nicotine",
      "marijuana",
      "codeine",
      "prescription",
    ]).notNull(),
    frequency: mysqlEnum("frequency", ["daily", "weekly", "occasional"]),
    duration: varchar("duration", { length: 255 }),
    approach: mysqlEnum("approach", ["quit", "reduce"]).default("quit"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("substance_focus_userId_idx").on(table.userId),
  })
);

export type SubstanceFocus = typeof substanceFocus.$inferSelect;
export type InsertSubstanceFocus = typeof substanceFocus.$inferInsert;

/**
 * User preferences for check-in times, notifications, and content.
 */
export const userPreferences = mysqlTable(
  "user_preferences",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    morningCheckInTime: varchar("morningCheckInTime", { length: 5 }),
    eveningCheckInTime: varchar("eveningCheckInTime", { length: 5 }),
    notificationsEnabled: boolean("notificationsEnabled").default(true),
    emailNotifications: boolean("emailNotifications").default(true),
    musicConsent: boolean("musicConsent").default(false),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("user_preferences_userId_idx").on(table.userId),
  })
);

export type UserPreferences = typeof userPreferences.$inferSelect;
export type InsertUserPreferences = typeof userPreferences.$inferInsert;

/**
 * Reference table for the 21 life dimensions.
 * Immutable across all users.
 */
export const lifeDimensions = mysqlTable("life_dimensions", {
  id: int("id").autoincrement().primaryKey(),
  slug: varchar("slug", { length: 64 }).notNull().unique(),
  label: varchar("label", { length: 255 }).notNull(),
  description: text("description"),
  order: int("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LifeDimension = typeof lifeDimensions.$inferSelect;
export type InsertLifeDimension = typeof lifeDimensions.$inferInsert;

// ============================================================================
// ASSESSMENT & TRACKING
// ============================================================================

/**
 * Assessment records for onboarding and periodic re-assessment.
 */
export const assessments = mysqlTable(
  "assessments",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    version: int("version").default(1),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
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
export const assessmentResponses = mysqlTable(
  "assessment_responses",
  {
    id: int("id").autoincrement().primaryKey(),
    assessmentId: int("assessmentId").notNull(),
    dimensionId: int("dimensionId").notNull(),
    payload: json("payload"), // Flexible structure for answers
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    assessmentIdIdx: index("assessment_responses_assessmentId_idx").on(table.assessmentId),
    dimensionIdIdx: index("assessment_responses_dimensionId_idx").on(table.dimensionId),
  })
);

export type AssessmentResponse = typeof assessmentResponses.$inferSelect;
export type InsertAssessmentResponse = typeof assessmentResponses.$inferInsert;

/**
 * Dimension scores tracking progress across the 21 dimensions.
 * Captured at regular intervals (daily check-in, weekly, or on-demand).
 */
export const dimensionScores = mysqlTable(
  "dimension_scores",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    dimensionId: int("dimensionId").notNull(),
    score: int("score").notNull(), // 0-100
    capturedOn: timestamp("capturedOn").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdDimensionIdIdx: index("dimension_scores_userId_dimensionId_idx").on(
      table.userId,
      table.dimensionId
    ),
    capturedOnIdx: index("dimension_scores_capturedOn_idx").on(table.capturedOn),
  })
);

export type DimensionScore = typeof dimensionScores.$inferSelect;
export type InsertDimensionScore = typeof dimensionScores.$inferInsert;

/**
 * Daily check-ins (morning and evening).
 * Tier-1 sensitive: free-text entries encrypted at rest.
 */
export const checkIns = mysqlTable(
  "check_ins",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    localDate: varchar("localDate", { length: 10 }).notNull(), // YYYY-MM-DD
    part: mysqlEnum("part", ["morning", "evening"]).notNull(),
    mood: int("mood"), // 1-10 scale
    energy: int("energy"), // 1-10 scale
    cravings: int("cravings"), // 1-10 scale
    payload: json("payload"), // Free-text notes, encrypted
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdLocalDatePartIdx: index("check_ins_userId_localDate_part_idx").on(
      table.userId,
      table.localDate,
      table.part
    ),
  })
);

export type CheckIn = typeof checkIns.$inferSelect;
export type InsertCheckIn = typeof checkIns.$inferInsert;

/**
 * Streaks and milestones.
 * Tracks sober-day streaks and milestone achievements.
 */
export const streaks = mysqlTable(
  "streaks",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    current: int("current").default(0),
    longest: int("longest").default(0),
    lastCountedDate: timestamp("lastCountedDate"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("streaks_userId_idx").on(table.userId),
  })
);

export type Streak = typeof streaks.$inferSelect;
export type InsertStreak = typeof streaks.$inferInsert;

/**
 * Milestones (7, 14, 30, 60, 90, 180 days).
 */
export const milestones = mysqlTable(
  "milestones",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    dayCount: int("dayCount").notNull(),
    achievedAt: timestamp("achievedAt").notNull(),
    celebratedAt: timestamp("celebratedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
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
export const journalEntries = mysqlTable(
  "journal_entries",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    promptId: int("promptId"),
    dimensionId: int("dimensionId"),
    body: text("body"), // Encrypted at rest
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
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
export const rulesBoundaries = mysqlTable(
  "rules_boundaries",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    text: text("text").notNull(),
    active: boolean("active").default(true),
    reviewCadence: mysqlEnum("reviewCadence", ["daily", "weekly", "monthly"]).default("daily"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("rules_boundaries_userId_idx").on(table.userId),
  })
);

export type RuleBoundary = typeof rulesBoundaries.$inferSelect;
export type InsertRuleBoundary = typeof rulesBoundaries.$inferInsert;

/**
 * Rule reviews tracking daily/weekly/monthly reviews.
 */
export const ruleReviews = mysqlTable(
  "rule_reviews",
  {
    id: int("id").autoincrement().primaryKey(),
    ruleId: int("ruleId").notNull(),
    reviewDate: timestamp("reviewDate").notNull(),
    kept: boolean("kept").notNull(),
    notes: text("notes"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    ruleIdIdx: index("rule_reviews_ruleId_idx").on(table.ruleId),
  })
);

export type RuleReview = typeof ruleReviews.$inferSelect;
export type InsertRuleReview = typeof ruleReviews.$inferInsert;

/**
 * Goals with 30/90/180 day horizons.
 */
export const goals = mysqlTable(
  "goals",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    horizon: mysqlEnum("horizon", ["30", "90", "180"]).notNull(),
    dimensionId: int("dimensionId"),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    status: mysqlEnum("status", ["active", "completed", "abandoned"]).default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    completedAt: timestamp("completedAt"),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: index("goals_userId_idx").on(table.userId),
  })
);

export type Goal = typeof goals.$inferSelect;
export type InsertGoal = typeof goals.$inferInsert;

/**
 * Goal steps for daily breakdown.
 */
export const goalSteps = mysqlTable(
  "goal_steps",
  {
    id: int("id").autoincrement().primaryKey(),
    goalId: int("goalId").notNull(),
    title: varchar("title", { length: 255 }).notNull(),
    doneAt: timestamp("doneAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
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
export const resources = mysqlTable(
  "resources",
  {
    id: int("id").autoincrement().primaryKey(),
    type: mysqlEnum("type", [
      "activity_guide",
      "situation_guide",
      "relationship_guide",
      "devotional",
      "article",
    ]).notNull(),
    dimensionId: int("dimensionId"),
    title: varchar("title", { length: 255 }).notNull(),
    body: text("body"),
    tags: varchar("tags", { length: 500 }),
    faithVariant: mysqlEnum("faithVariant", ["faith", "secular", "neutral"]).default("neutral"),
    publishedAt: timestamp("publishedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    typeIdx: index("resources_type_idx").on(table.type),
    dimensionIdIdx: index("resources_dimensionId_idx").on(table.dimensionId),
  })
);

export type Resource = typeof resources.$inferSelect;
export type InsertResource = typeof resources.$inferInsert;

/**
 * Activity guides with context tags.
 */
export const activityGuides = mysqlTable(
  "activity_guides",
  {
    id: int("id").autoincrement().primaryKey(),
    resourceId: int("resourceId").notNull(),
    jobType: varchar("jobType", { length: 255 }),
    energyLevel: mysqlEnum("energyLevel", ["low", "medium", "high"]),
    timeAvailable: mysqlEnum("timeAvailable", ["5min", "15min", "30min", "1hour", "flexible"]),
    interests: varchar("interests", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    resourceIdIdx: index("activity_guides_resourceId_idx").on(table.resourceId),
  })
);

export type ActivityGuide = typeof activityGuides.$inferSelect;
export type InsertActivityGuide = typeof activityGuides.$inferInsert;

/**
 * Music profiles for music rehabilitation feature.
 */
export const musicProfiles = mysqlTable(
  "music_profiles",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    triggerGenres: varchar("triggerGenres", { length: 500 }),
    triggerArtists: varchar("triggerArtists", { length: 500 }),
    safeGenres: varchar("safeGenres", { length: 500 }),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("music_profiles_userId_idx").on(table.userId),
  })
);

export type MusicProfile = typeof musicProfiles.$inferSelect;
export type InsertMusicProfile = typeof musicProfiles.$inferInsert;

/**
 * Playlists for music rehabilitation.
 */
export const playlists = mysqlTable(
  "playlists",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull(),
    context: varchar("context", { length: 255 }),
    title: varchar("title", { length: 255 }).notNull(),
    tracks: json("tracks"), // Array of track metadata
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
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
export const newsletterSubscriptions = mysqlTable(
  "newsletter_subscriptions",
  {
    id: int("id").autoincrement().primaryKey(),
    email: varchar("email", { length: 320 }).notNull(),
    userId: int("userId"),
    status: mysqlEnum("status", ["subscribed", "unsubscribed", "bounced"]).default("subscribed"),
    source: varchar("source", { length: 255 }),
    subscribedAt: timestamp("subscribedAt").defaultNow(),
    unsubscribedAt: timestamp("unsubscribedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    emailIdx: index("newsletter_subscriptions_email_idx").on(table.email),
    userIdIdx: index("newsletter_subscriptions_userId_idx").on(table.userId),
  })
);

export type NewsletterSubscription = typeof newsletterSubscriptions.$inferSelect;
export type InsertNewsletterSubscription = typeof newsletterSubscriptions.$inferInsert;

/**
 * Newsletter issues (daily, weekly, milestone, dimension, situation).
 */
export const newsletterIssues = mysqlTable(
  "newsletter_issues",
  {
    id: int("id").autoincrement().primaryKey(),
    type: mysqlEnum("type", ["daily", "weekly", "milestone", "dimension", "situation"]).notNull(),
    subject: varchar("subject", { length: 255 }).notNull(),
    body: text("body").notNull(),
    scheduledFor: timestamp("scheduledFor"),
    sentAt: timestamp("sentAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    typeIdx: index("newsletter_issues_type_idx").on(table.type),
    scheduledForIdx: index("newsletter_issues_scheduledFor_idx").on(table.scheduledFor),
  })
);

export type NewsletterIssue = typeof newsletterIssues.$inferSelect;
export type InsertNewsletterIssue = typeof newsletterIssues.$inferInsert;

/**
 * Newsletter sends tracking.
 */
export const newsletterSends = mysqlTable(
  "newsletter_sends",
  {
    id: int("id").autoincrement().primaryKey(),
    issueId: int("issueId").notNull(),
    subscriptionId: int("subscriptionId").notNull(),
    sentAt: timestamp("sentAt").defaultNow(),
    openedAt: timestamp("openedAt"),
    dedupeKey: varchar("dedupeKey", { length: 255 }).unique(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    issueIdIdx: index("newsletter_sends_issueId_idx").on(table.issueId),
    subscriptionIdIdx: index("newsletter_sends_subscriptionId_idx").on(table.subscriptionId),
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
export const communityMembership = mysqlTable(
  "community_membership",
  {
    id: int("id").autoincrement().primaryKey(),
    userId: int("userId").notNull().unique(),
    unlockedAt: timestamp("unlockedAt"),
    readinessMilestone: int("readinessMilestone").default(0),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    userIdIdx: uniqueIndex("community_membership_userId_idx").on(table.userId),
  })
);

export type CommunityMembership = typeof communityMembership.$inferSelect;
export type InsertCommunityMembership = typeof communityMembership.$inferInsert;

/**
 * Mentor pairings.
 */
export const mentorPairings = mysqlTable(
  "mentor_pairings",
  {
    id: int("id").autoincrement().primaryKey(),
    mentorId: int("mentorId").notNull(),
    menteeId: int("menteeId").notNull(),
    status: mysqlEnum("status", ["pending", "active", "completed"]).default("active"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    mentorIdIdx: index("mentor_pairings_mentorId_idx").on(table.mentorId),
    menteeIdIdx: index("mentor_pairings_menteeId_idx").on(table.menteeId),
  })
);

export type MentorPairing = typeof mentorPairings.$inferSelect;
export type InsertMentorPairing = typeof mentorPairings.$inferInsert;

/**
 * Group challenges.
 */
export const groupChallenges = mysqlTable(
  "group_challenges",
  {
    id: int("id").autoincrement().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    startDate: timestamp("startDate").notNull(),
    endDate: timestamp("endDate").notNull(),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  }
);

export type GroupChallenge = typeof groupChallenges.$inferSelect;
export type InsertGroupChallenge = typeof groupChallenges.$inferInsert;

/**
 * Group challenge participation.
 */
export const challengeParticipants = mysqlTable(
  "challenge_participants",
  {
    id: int("id").autoincrement().primaryKey(),
    challengeId: int("challengeId").notNull(),
    userId: int("userId").notNull(),
    completedAt: timestamp("completedAt"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
  },
  (table) => ({
    challengeIdIdx: index("challenge_participants_challengeId_idx").on(table.challengeId),
    userIdIdx: index("challenge_participants_userId_idx").on(table.userId),
  })
);

export type ChallengeParticipant = typeof challengeParticipants.$inferSelect;
export type InsertChallengeParticipant = typeof challengeParticipants.$inferInsert;
