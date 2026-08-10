ALTER TABLE `operators` ADD `clerk_org_id` text;
--> statement-breakpoint
ALTER TABLE `operators` ADD `claim_status` text DEFAULT 'unclaimed' NOT NULL;
--> statement-breakpoint
ALTER TABLE `operators` ADD `claim_requested_at` text;
--> statement-breakpoint
ALTER TABLE `operators` ADD `claim_requested_by_user_id` text;
--> statement-breakpoint
ALTER TABLE `operators` ADD `claim_message` text;
--> statement-breakpoint
ALTER TABLE `operators` ADD `stripe_customer_id` text;
--> statement-breakpoint
ALTER TABLE `operators` ADD `complimentary_leads_remaining` integer DEFAULT 1 NOT NULL;
--> statement-breakpoint
CREATE UNIQUE INDEX `operators_clerk_org_idx` ON `operators` (`clerk_org_id`);
--> statement-breakpoint
CREATE INDEX `operators_claim_status_idx` ON `operators` (`claim_status`);
--> statement-breakpoint
ALTER TABLE `leads` ADD `requested_operator_id` text REFERENCES `operators`(`id`) ON DELETE SET NULL;
--> statement-breakpoint
ALTER TABLE `leads` ADD `unlock_method` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `offered_at` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `unlocked_at` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `passed_by` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `stripe_checkout_session_id` text;
--> statement-breakpoint
CREATE INDEX `leads_requested_operator_idx` ON `leads` (`requested_operator_id`);
--> statement-breakpoint
UPDATE `leads` SET `requested_operator_id` = `operator_id` WHERE `requested_operator_id` IS NULL;
--> statement-breakpoint
UPDATE `leads` SET `status` = 'unlocked' WHERE `status` = 'notified';
