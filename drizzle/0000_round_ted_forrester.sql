CREATE TYPE "public"."approach" AS ENUM('quit', 'reduce');--> statement-breakpoint
CREATE TYPE "public"."check_in_part" AS ENUM('morning', 'evening');--> statement-breakpoint
CREATE TYPE "public"."consent_scope" AS ENUM('dashboard_only', 'dashboard_and_journal', 'full_access');--> statement-breakpoint
CREATE TYPE "public"."energy_level" AS ENUM('low', 'medium', 'high');--> statement-breakpoint
CREATE TYPE "public"."faith" AS ENUM('faith', 'secular', 'both');--> statement-breakpoint
CREATE TYPE "public"."faith_variant" AS ENUM('faith', 'secular', 'neutral');--> statement-breakpoint
CREATE TYPE "public"."frequency" AS ENUM('daily', 'weekly', 'occasional');--> statement-breakpoint
CREATE TYPE "public"."full_role" AS ENUM('user', 'supporter', 'mentor', 'moderator', 'admin');--> statement-breakpoint
CREATE TYPE "public"."goal_horizon" AS ENUM('30', '90', '180');--> statement-breakpoint
CREATE TYPE "public"."goal_status" AS ENUM('active', 'completed', 'abandoned');--> statement-breakpoint
CREATE TYPE "public"."link_status" AS ENUM('pending', 'active', 'revoked');--> statement-breakpoint
CREATE TYPE "public"."newsletter_status" AS ENUM('subscribed', 'unsubscribed', 'bounced');--> statement-breakpoint
CREATE TYPE "public"."newsletter_type" AS ENUM('daily', 'weekly', 'milestone', 'dimension', 'situation');--> statement-breakpoint
CREATE TYPE "public"."pairing_status" AS ENUM('pending', 'active', 'completed');--> statement-breakpoint
CREATE TYPE "public"."phase" AS ENUM('phase1', 'phase2', 'phase3', 'phase4');--> statement-breakpoint
CREATE TYPE "public"."resource_type" AS ENUM('activity_guide', 'situation_guide', 'relationship_guide', 'devotional', 'article');--> statement-breakpoint
CREATE TYPE "public"."review_cadence" AS ENUM('daily', 'weekly', 'monthly');--> statement-breakpoint
CREATE TYPE "public"."substance" AS ENUM('alcohol', 'nicotine', 'marijuana', 'codeine', 'prescription');--> statement-breakpoint
CREATE TYPE "public"."time_available" AS ENUM('5min', '15min', '30min', '1hour', 'flexible');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "activity_guides" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "activity_guides_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"resourceId" integer NOT NULL,
	"jobType" varchar(255),
	"energyLevel" "energy_level",
	"timeAvailable" time_available,
	"interests" varchar(500),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessment_responses" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "assessment_responses_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"assessmentId" integer NOT NULL,
	"dimensionId" integer NOT NULL,
	"payload" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "assessments" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "assessments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"version" integer DEFAULT 1,
	"completedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "challenge_participants" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "challenge_participants_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"challengeId" integer NOT NULL,
	"userId" integer NOT NULL,
	"completedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "check_ins" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "check_ins_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"localDate" varchar(10) NOT NULL,
	"part" "check_in_part" NOT NULL,
	"mood" integer,
	"energy" integer,
	"cravings" integer,
	"payload" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "community_membership" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "community_membership_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"unlockedAt" timestamp with time zone,
	"readinessMilestone" integer DEFAULT 0,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "community_membership_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "dimension_scores" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "dimension_scores_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"dimensionId" integer NOT NULL,
	"score" integer NOT NULL,
	"capturedOn" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goal_steps" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "goal_steps_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"goalId" integer NOT NULL,
	"title" varchar(255) NOT NULL,
	"doneAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "goals" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "goals_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"horizon" "goal_horizon" NOT NULL,
	"dimensionId" integer,
	"title" varchar(255) NOT NULL,
	"description" text,
	"status" "goal_status" DEFAULT 'active',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"completedAt" timestamp with time zone,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "group_challenges" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "group_challenges_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"title" varchar(255) NOT NULL,
	"description" text,
	"startDate" timestamp with time zone NOT NULL,
	"endDate" timestamp with time zone NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "journal_entries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "journal_entries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"promptId" integer,
	"dimensionId" integer,
	"body" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "life_dimensions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "life_dimensions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"slug" varchar(64) NOT NULL,
	"label" varchar(255) NOT NULL,
	"description" text,
	"order" integer NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "life_dimensions_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "mentor_pairings" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mentor_pairings_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"mentorId" integer NOT NULL,
	"menteeId" integer NOT NULL,
	"status" "pairing_status" DEFAULT 'active',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "milestones" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "milestones_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"dayCount" integer NOT NULL,
	"achievedAt" timestamp with time zone NOT NULL,
	"celebratedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "music_profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "music_profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"triggerGenres" varchar(500),
	"triggerArtists" varchar(500),
	"safeGenres" varchar(500),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "music_profiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "newsletter_issues" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "newsletter_issues_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "newsletter_type" NOT NULL,
	"subject" varchar(255) NOT NULL,
	"body" text NOT NULL,
	"scheduledFor" timestamp with time zone,
	"sentAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_sends" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "newsletter_sends_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"issueId" integer NOT NULL,
	"subscriptionId" integer NOT NULL,
	"sentAt" timestamp with time zone DEFAULT now(),
	"openedAt" timestamp with time zone,
	"dedupeKey" varchar(255),
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "newsletter_sends_dedupeKey_unique" UNIQUE("dedupeKey")
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscriptions" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "newsletter_subscriptions_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"email" varchar(320) NOT NULL,
	"userId" integer,
	"status" "newsletter_status" DEFAULT 'subscribed',
	"source" varchar(255),
	"preferences" jsonb,
	"subscribedAt" timestamp with time zone DEFAULT now(),
	"unsubscribedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "playlists" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "playlists_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"context" varchar(255),
	"title" varchar(255) NOT NULL,
	"tracks" jsonb,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "profiles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "profiles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"displayName" varchar(255),
	"avatar" text,
	"timezone" varchar(64) DEFAULT 'UTC',
	"locale" varchar(10) DEFAULT 'en',
	"journeyStartDate" timestamp with time zone DEFAULT now(),
	"currentPhase" "phase" DEFAULT 'phase1',
	"faithPreference" "faith" DEFAULT 'both',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "profiles_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "resources" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "resources_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"type" "resource_type" NOT NULL,
	"dimensionId" integer,
	"title" varchar(255) NOT NULL,
	"body" text,
	"tags" varchar(500),
	"faithVariant" "faith_variant" DEFAULT 'neutral',
	"publishedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rule_reviews" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rule_reviews_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"ruleId" integer NOT NULL,
	"reviewDate" timestamp with time zone NOT NULL,
	"kept" boolean NOT NULL,
	"notes" text,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "rules_boundaries" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "rules_boundaries_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"text" text NOT NULL,
	"active" boolean DEFAULT true,
	"reviewCadence" "review_cadence" DEFAULT 'daily',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "streaks" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "streaks_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"current" integer DEFAULT 0,
	"longest" integer DEFAULT 0,
	"lastCountedDate" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "streaks_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "substance_focus" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "substance_focus_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"substance" "substance" NOT NULL,
	"frequency" "frequency",
	"duration" varchar(255),
	"approach" "approach" DEFAULT 'quit',
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "substance_focus_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "supporter_links" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "supporter_links_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"supporterId" integer NOT NULL,
	"memberId" integer NOT NULL,
	"consentScope" "consent_scope" DEFAULT 'dashboard_only',
	"status" "link_status" DEFAULT 'pending',
	"revokedAt" timestamp with time zone,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_preferences" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_preferences_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"morningCheckInTime" varchar(5),
	"eveningCheckInTime" varchar(5),
	"notificationsEnabled" boolean DEFAULT true,
	"emailNotifications" boolean DEFAULT true,
	"musicConsent" boolean DEFAULT false,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	CONSTRAINT "user_preferences_userId_unique" UNIQUE("userId")
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "user_roles_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"userId" integer NOT NULL,
	"role" "full_role" NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "users_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"openId" varchar(64) NOT NULL,
	"name" text,
	"email" varchar(320),
	"loginMethod" varchar(64),
	"role" "user_role" DEFAULT 'user' NOT NULL,
	"createdAt" timestamp with time zone DEFAULT now() NOT NULL,
	"updatedAt" timestamp with time zone DEFAULT now(),
	"lastSignedIn" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_openId_unique" UNIQUE("openId"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE INDEX "activity_guides_resourceId_idx" ON "activity_guides" USING btree ("resourceId");--> statement-breakpoint
CREATE INDEX "assessment_responses_assessmentId_idx" ON "assessment_responses" USING btree ("assessmentId");--> statement-breakpoint
CREATE INDEX "assessment_responses_dimensionId_idx" ON "assessment_responses" USING btree ("dimensionId");--> statement-breakpoint
CREATE INDEX "assessments_userId_idx" ON "assessments" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "challenge_participants_challengeId_idx" ON "challenge_participants" USING btree ("challengeId");--> statement-breakpoint
CREATE INDEX "challenge_participants_userId_idx" ON "challenge_participants" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "check_ins_userId_localDate_part_unique" ON "check_ins" USING btree ("userId","localDate","part");--> statement-breakpoint
CREATE UNIQUE INDEX "community_membership_userId_idx" ON "community_membership" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "dimension_scores_userId_dimensionId_idx" ON "dimension_scores" USING btree ("userId","dimensionId");--> statement-breakpoint
CREATE INDEX "dimension_scores_capturedOn_idx" ON "dimension_scores" USING btree ("capturedOn");--> statement-breakpoint
CREATE INDEX "goal_steps_goalId_idx" ON "goal_steps" USING btree ("goalId");--> statement-breakpoint
CREATE INDEX "goals_userId_idx" ON "goals" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "journal_entries_userId_idx" ON "journal_entries" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "journal_entries_userId_createdAt_idx" ON "journal_entries" USING btree ("userId","createdAt");--> statement-breakpoint
CREATE INDEX "mentor_pairings_mentorId_idx" ON "mentor_pairings" USING btree ("mentorId");--> statement-breakpoint
CREATE INDEX "mentor_pairings_menteeId_idx" ON "mentor_pairings" USING btree ("menteeId");--> statement-breakpoint
CREATE INDEX "milestones_userId_idx" ON "milestones" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "music_profiles_userId_idx" ON "music_profiles" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "newsletter_issues_type_idx" ON "newsletter_issues" USING btree ("type");--> statement-breakpoint
CREATE INDEX "newsletter_issues_scheduledFor_idx" ON "newsletter_issues" USING btree ("scheduledFor");--> statement-breakpoint
CREATE INDEX "newsletter_sends_issueId_idx" ON "newsletter_sends" USING btree ("issueId");--> statement-breakpoint
CREATE INDEX "newsletter_sends_subscriptionId_idx" ON "newsletter_sends" USING btree ("subscriptionId");--> statement-breakpoint
CREATE INDEX "newsletter_subscriptions_email_idx" ON "newsletter_subscriptions" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletter_subscriptions_userId_idx" ON "newsletter_subscriptions" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "playlists_userId_idx" ON "playlists" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "profiles_userId_idx" ON "profiles" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "resources_type_idx" ON "resources" USING btree ("type");--> statement-breakpoint
CREATE INDEX "resources_dimensionId_idx" ON "resources" USING btree ("dimensionId");--> statement-breakpoint
CREATE INDEX "rule_reviews_ruleId_idx" ON "rule_reviews" USING btree ("ruleId");--> statement-breakpoint
CREATE INDEX "rules_boundaries_userId_idx" ON "rules_boundaries" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "streaks_userId_idx" ON "streaks" USING btree ("userId");--> statement-breakpoint
CREATE UNIQUE INDEX "substance_focus_userId_idx" ON "substance_focus" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "supporter_links_supporterId_idx" ON "supporter_links" USING btree ("supporterId");--> statement-breakpoint
CREATE INDEX "supporter_links_memberId_idx" ON "supporter_links" USING btree ("memberId");--> statement-breakpoint
CREATE UNIQUE INDEX "user_preferences_userId_idx" ON "user_preferences" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "user_roles_userId_idx" ON "user_roles" USING btree ("userId");