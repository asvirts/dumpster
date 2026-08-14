-- Lead capture: attribution, match-mode (nullable operator), group fan-out, qualification JSON.
PRAGMA foreign_keys=OFF;
--> statement-breakpoint
CREATE TABLE `leads_new` (
	`id` text PRIMARY KEY NOT NULL,
	`operator_id` text,
	`requested_operator_id` text,
	`seeker_name` text NOT NULL,
	`seeker_email` text NOT NULL,
	`seeker_phone` text,
	`project_size` text,
	`material` text,
	`address_or_zip` text,
	`timeline` text,
	`notes` text,
	`status` text DEFAULT 'new' NOT NULL,
	`unlock_method` text,
	`offered_at` text,
	`unlocked_at` text,
	`passed_by` text,
	`stripe_checkout_session_id` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`mode` text DEFAULT 'direct' NOT NULL,
	`source_path` text,
	`source_city_id` text,
	`utm_source` text,
	`utm_medium` text,
	`utm_campaign` text,
	`utm_content` text,
	`utm_term` text,
	`referrer` text,
	`preferred_contact` text,
	`budget_range` text,
	`how_found` text,
	`qualification_json` text,
	`admin_notes` text,
	`seeker_ip_hash` text,
	`group_id` text,
	`duplicate_of_lead_id` text,
	`price_cents` integer,
	FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`requested_operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE set null,
	FOREIGN KEY (`source_city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
INSERT INTO `leads_new` (
	`id`, `operator_id`, `requested_operator_id`, `seeker_name`, `seeker_email`, `seeker_phone`,
	`project_size`, `material`, `address_or_zip`, `timeline`, `notes`, `status`, `unlock_method`,
	`offered_at`, `unlocked_at`, `passed_by`, `stripe_checkout_session_id`, `created_at`,
	`mode`, `group_id`, `qualification_json`
)
SELECT
	`id`, `operator_id`, `requested_operator_id`, `seeker_name`, `seeker_email`, `seeker_phone`,
	`project_size`, `material`, `address_or_zip`, `timeline`, `notes`, `status`, `unlock_method`,
	`offered_at`, `unlocked_at`, `passed_by`, `stripe_checkout_session_id`, `created_at`,
	'direct',
	`id`,
	CASE
		WHEN `project_size` IS NOT NULL OR `material` IS NOT NULL
		THEN json_object('niche', 'dumpster', 'projectSize', `project_size`, 'material', `material`)
		ELSE NULL
	END
FROM `leads`;
--> statement-breakpoint
DROP TABLE `leads`;
--> statement-breakpoint
ALTER TABLE `leads_new` RENAME TO `leads`;
--> statement-breakpoint
CREATE INDEX `leads_operator_idx` ON `leads` (`operator_id`);
--> statement-breakpoint
CREATE INDEX `leads_requested_operator_idx` ON `leads` (`requested_operator_id`);
--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);
--> statement-breakpoint
CREATE INDEX `leads_mode_idx` ON `leads` (`mode`);
--> statement-breakpoint
CREATE INDEX `leads_group_idx` ON `leads` (`group_id`);
--> statement-breakpoint
CREATE INDEX `leads_email_idx` ON `leads` (`seeker_email`);
--> statement-breakpoint
CREATE INDEX `leads_created_idx` ON `leads` (`created_at`);
--> statement-breakpoint
CREATE INDEX `leads_ip_hash_idx` ON `leads` (`seeker_ip_hash`);
--> statement-breakpoint
CREATE INDEX `leads_city_idx` ON `leads` (`source_city_id`);
--> statement-breakpoint
PRAGMA foreign_keys=ON;
