-- Autopilot: automatic lead routing, auto-buy (saved card), reminders, operator email opt-out.
ALTER TABLE `operators` ADD `lead_emails_opt_out` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `operators` ADD `auto_unlock_enabled` integer DEFAULT 0 NOT NULL;
--> statement-breakpoint
ALTER TABLE `operators` ADD `auto_unlock_weekly_cap` integer DEFAULT 10 NOT NULL;
--> statement-breakpoint
ALTER TABLE `operators` ADD `stripe_payment_method_id` text;
--> statement-breakpoint
ALTER TABLE `operators` ADD `stripe_payment_method_label` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `stripe_payment_intent_id` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `reminder_sent_at` text;
--> statement-breakpoint
ALTER TABLE `leads` ADD `expanded_at` text;
--> statement-breakpoint
CREATE INDEX `leads_offered_at_idx` ON `leads` (`offered_at`);
