ALTER TABLE `newsletter_subscriptions` MODIFY COLUMN `status` enum('pending','subscribed','unsubscribed','bounced') NOT NULL DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE `newsletter_subscriptions` MODIFY COLUMN `subscribedAt` timestamp;--> statement-breakpoint
ALTER TABLE `newsletter_subscriptions` ADD `confirmationToken` varchar(128);--> statement-breakpoint
ALTER TABLE `newsletter_subscriptions` ADD `confirmedAt` timestamp;--> statement-breakpoint
ALTER TABLE `newsletter_subscriptions` ADD `sendTypes` json;