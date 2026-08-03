CREATE TABLE `activity_guides` (
	`id` int AUTO_INCREMENT NOT NULL,
	`resourceId` int NOT NULL,
	`jobType` varchar(255),
	`energyLevel` enum('low','medium','high'),
	`timeAvailable` enum('5min','15min','30min','1hour','flexible'),
	`interests` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `activity_guides_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessment_responses` (
	`id` int AUTO_INCREMENT NOT NULL,
	`assessmentId` int NOT NULL,
	`dimensionId` int NOT NULL,
	`payload` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessment_responses_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `assessments` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`version` int DEFAULT 1,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `assessments_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `challenge_participants` (
	`id` int AUTO_INCREMENT NOT NULL,
	`challengeId` int NOT NULL,
	`userId` int NOT NULL,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `challenge_participants_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `check_ins` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`localDate` varchar(10) NOT NULL,
	`part` enum('morning','evening') NOT NULL,
	`mood` int,
	`energy` int,
	`cravings` int,
	`payload` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `check_ins_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `community_membership` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`unlockedAt` timestamp,
	`readinessMilestone` int DEFAULT 0,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `community_membership_id` PRIMARY KEY(`id`),
	CONSTRAINT `community_membership_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `community_membership_userId_idx` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `dimension_scores` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dimensionId` int NOT NULL,
	`score` int NOT NULL,
	`capturedOn` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `dimension_scores_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goal_steps` (
	`id` int AUTO_INCREMENT NOT NULL,
	`goalId` int NOT NULL,
	`title` varchar(255) NOT NULL,
	`doneAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `goal_steps_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `goals` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`horizon` enum('30','90','180') NOT NULL,
	`dimensionId` int,
	`title` varchar(255) NOT NULL,
	`description` text,
	`status` enum('active','completed','abandoned') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`completedAt` timestamp,
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `goals_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `group_challenges` (
	`id` int AUTO_INCREMENT NOT NULL,
	`title` varchar(255) NOT NULL,
	`description` text,
	`startDate` timestamp NOT NULL,
	`endDate` timestamp NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `group_challenges_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `journal_entries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`promptId` int,
	`dimensionId` int,
	`body` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `journal_entries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `life_dimensions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`slug` varchar(64) NOT NULL,
	`label` varchar(255) NOT NULL,
	`description` text,
	`order` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `life_dimensions_id` PRIMARY KEY(`id`),
	CONSTRAINT `life_dimensions_slug_unique` UNIQUE(`slug`)
);
--> statement-breakpoint
CREATE TABLE `mentor_pairings` (
	`id` int AUTO_INCREMENT NOT NULL,
	`mentorId` int NOT NULL,
	`menteeId` int NOT NULL,
	`status` enum('pending','active','completed') DEFAULT 'active',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `mentor_pairings_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `milestones` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`dayCount` int NOT NULL,
	`achievedAt` timestamp NOT NULL,
	`celebratedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `milestones_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `music_profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`triggerGenres` varchar(500),
	`triggerArtists` varchar(500),
	`safeGenres` varchar(500),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `music_profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `music_profiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `music_profiles_userId_idx` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_issues` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('daily','weekly','milestone','dimension','situation') NOT NULL,
	`subject` varchar(255) NOT NULL,
	`body` text NOT NULL,
	`scheduledFor` timestamp,
	`sentAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_issues_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_sends` (
	`id` int AUTO_INCREMENT NOT NULL,
	`issueId` int NOT NULL,
	`subscriptionId` int NOT NULL,
	`sentAt` timestamp DEFAULT (now()),
	`openedAt` timestamp,
	`dedupeKey` varchar(255),
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_sends_id` PRIMARY KEY(`id`),
	CONSTRAINT `newsletter_sends_dedupeKey_unique` UNIQUE(`dedupeKey`)
);
--> statement-breakpoint
CREATE TABLE `newsletter_subscriptions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`email` varchar(320) NOT NULL,
	`userId` int,
	`status` enum('subscribed','unsubscribed','bounced') DEFAULT 'subscribed',
	`source` varchar(255),
	`subscribedAt` timestamp DEFAULT (now()),
	`unsubscribedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `newsletter_subscriptions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `playlists` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`context` varchar(255),
	`title` varchar(255) NOT NULL,
	`tracks` json,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `playlists_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `profiles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`displayName` varchar(255),
	`avatar` text,
	`timezone` varchar(64) DEFAULT 'UTC',
	`locale` varchar(10) DEFAULT 'en',
	`journeyStartDate` timestamp DEFAULT (now()),
	`currentPhase` enum('phase1','phase2','phase3','phase4') DEFAULT 'phase1',
	`faithPreference` enum('faith','secular','both') DEFAULT 'both',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `profiles_id` PRIMARY KEY(`id`),
	CONSTRAINT `profiles_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `profiles_userId_idx` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `resources` (
	`id` int AUTO_INCREMENT NOT NULL,
	`type` enum('activity_guide','situation_guide','relationship_guide','devotional','article') NOT NULL,
	`dimensionId` int,
	`title` varchar(255) NOT NULL,
	`body` text,
	`tags` varchar(500),
	`faithVariant` enum('faith','secular','neutral') DEFAULT 'neutral',
	`publishedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `resources_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rule_reviews` (
	`id` int AUTO_INCREMENT NOT NULL,
	`ruleId` int NOT NULL,
	`reviewDate` timestamp NOT NULL,
	`kept` boolean NOT NULL,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `rule_reviews_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `rules_boundaries` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`text` text NOT NULL,
	`active` boolean DEFAULT true,
	`reviewCadence` enum('daily','weekly','monthly') DEFAULT 'daily',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `rules_boundaries_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `streaks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`current` int DEFAULT 0,
	`longest` int DEFAULT 0,
	`lastCountedDate` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `streaks_id` PRIMARY KEY(`id`),
	CONSTRAINT `streaks_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `streaks_userId_idx` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `substance_focus` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`substance` enum('alcohol','nicotine','marijuana','codeine','prescription') NOT NULL,
	`frequency` enum('daily','weekly','occasional'),
	`duration` varchar(255),
	`approach` enum('quit','reduce') DEFAULT 'quit',
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `substance_focus_id` PRIMARY KEY(`id`),
	CONSTRAINT `substance_focus_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `substance_focus_userId_idx` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `supporter_links` (
	`id` int AUTO_INCREMENT NOT NULL,
	`supporterId` int NOT NULL,
	`memberId` int NOT NULL,
	`consentScope` enum('dashboard_only','dashboard_and_journal','full_access') DEFAULT 'dashboard_only',
	`status` enum('pending','active','revoked') DEFAULT 'pending',
	`revokedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `supporter_links_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `user_preferences` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`morningCheckInTime` varchar(5),
	`eveningCheckInTime` varchar(5),
	`notificationsEnabled` boolean DEFAULT true,
	`emailNotifications` boolean DEFAULT true,
	`musicConsent` boolean DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `user_preferences_id` PRIMARY KEY(`id`),
	CONSTRAINT `user_preferences_userId_unique` UNIQUE(`userId`),
	CONSTRAINT `user_preferences_userId_idx` UNIQUE(`userId`)
);
--> statement-breakpoint
CREATE TABLE `user_roles` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`role` enum('user','supporter','mentor','moderator','admin') NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `user_roles_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD CONSTRAINT `users_email_unique` UNIQUE(`email`);--> statement-breakpoint
CREATE INDEX `activity_guides_resourceId_idx` ON `activity_guides` (`resourceId`);--> statement-breakpoint
CREATE INDEX `assessment_responses_assessmentId_idx` ON `assessment_responses` (`assessmentId`);--> statement-breakpoint
CREATE INDEX `assessment_responses_dimensionId_idx` ON `assessment_responses` (`dimensionId`);--> statement-breakpoint
CREATE INDEX `assessments_userId_idx` ON `assessments` (`userId`);--> statement-breakpoint
CREATE INDEX `challenge_participants_challengeId_idx` ON `challenge_participants` (`challengeId`);--> statement-breakpoint
CREATE INDEX `challenge_participants_userId_idx` ON `challenge_participants` (`userId`);--> statement-breakpoint
CREATE INDEX `check_ins_userId_localDate_part_idx` ON `check_ins` (`userId`,`localDate`,`part`);--> statement-breakpoint
CREATE INDEX `dimension_scores_userId_dimensionId_idx` ON `dimension_scores` (`userId`,`dimensionId`);--> statement-breakpoint
CREATE INDEX `dimension_scores_capturedOn_idx` ON `dimension_scores` (`capturedOn`);--> statement-breakpoint
CREATE INDEX `goal_steps_goalId_idx` ON `goal_steps` (`goalId`);--> statement-breakpoint
CREATE INDEX `goals_userId_idx` ON `goals` (`userId`);--> statement-breakpoint
CREATE INDEX `journal_entries_userId_idx` ON `journal_entries` (`userId`);--> statement-breakpoint
CREATE INDEX `journal_entries_userId_createdAt_idx` ON `journal_entries` (`userId`,`createdAt`);--> statement-breakpoint
CREATE INDEX `mentor_pairings_mentorId_idx` ON `mentor_pairings` (`mentorId`);--> statement-breakpoint
CREATE INDEX `mentor_pairings_menteeId_idx` ON `mentor_pairings` (`menteeId`);--> statement-breakpoint
CREATE INDEX `milestones_userId_idx` ON `milestones` (`userId`);--> statement-breakpoint
CREATE INDEX `newsletter_issues_type_idx` ON `newsletter_issues` (`type`);--> statement-breakpoint
CREATE INDEX `newsletter_issues_scheduledFor_idx` ON `newsletter_issues` (`scheduledFor`);--> statement-breakpoint
CREATE INDEX `newsletter_sends_issueId_idx` ON `newsletter_sends` (`issueId`);--> statement-breakpoint
CREATE INDEX `newsletter_sends_subscriptionId_idx` ON `newsletter_sends` (`subscriptionId`);--> statement-breakpoint
CREATE INDEX `newsletter_subscriptions_email_idx` ON `newsletter_subscriptions` (`email`);--> statement-breakpoint
CREATE INDEX `newsletter_subscriptions_userId_idx` ON `newsletter_subscriptions` (`userId`);--> statement-breakpoint
CREATE INDEX `playlists_userId_idx` ON `playlists` (`userId`);--> statement-breakpoint
CREATE INDEX `resources_type_idx` ON `resources` (`type`);--> statement-breakpoint
CREATE INDEX `resources_dimensionId_idx` ON `resources` (`dimensionId`);--> statement-breakpoint
CREATE INDEX `rule_reviews_ruleId_idx` ON `rule_reviews` (`ruleId`);--> statement-breakpoint
CREATE INDEX `rules_boundaries_userId_idx` ON `rules_boundaries` (`userId`);--> statement-breakpoint
CREATE INDEX `supporter_links_supporterId_idx` ON `supporter_links` (`supporterId`);--> statement-breakpoint
CREATE INDEX `supporter_links_memberId_idx` ON `supporter_links` (`memberId`);--> statement-breakpoint
CREATE INDEX `user_roles_userId_idx` ON `user_roles` (`userId`);