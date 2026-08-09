CREATE TABLE `cities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`state` text NOT NULL,
	`slug` text NOT NULL,
	`state_slug` text NOT NULL,
	`lat` real NOT NULL,
	`lng` real NOT NULL,
	`local_permit_summary` text,
	`typical_pricing_notes` text,
	`special_rules` text,
	`is_priority` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cities_state_slug_idx` ON `cities` (`state`,`slug`);
--> statement-breakpoint
CREATE INDEX `cities_priority_idx` ON `cities` (`is_priority`);
--> statement-breakpoint
CREATE TABLE `operators` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`slug` text NOT NULL,
	`phone` text,
	`email` text,
	`website` text,
	`description` text,
	`hq_city` text,
	`hq_state` text,
	`hq_lat` real,
	`hq_lng` real,
	`pricing_min` real,
	`pricing_max` real,
	`pricing_notes` text,
	`included_tonnage` real,
	`overage_rate` real,
	`driveway_suitable` integer DEFAULT false,
	`driveway_notes` text,
	`same_day_capable` integer DEFAULT false,
	`is_broker` integer DEFAULT false NOT NULL,
	`verification_status` text DEFAULT 'pending' NOT NULL,
	`last_verified_at` text,
	`verified_by` text,
	`verification_notes` text,
	`insurance_verified` integer DEFAULT false,
	`license_notes` text,
	`quality_score` real DEFAULT 50,
	`is_published` integer DEFAULT false NOT NULL,
	`is_demo` integer DEFAULT false NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `operators_slug_idx` ON `operators` (`slug`);
--> statement-breakpoint
CREATE INDEX `operators_status_idx` ON `operators` (`verification_status`);
--> statement-breakpoint
CREATE INDEX `operators_published_idx` ON `operators` (`is_published`);
--> statement-breakpoint
CREATE INDEX `operators_broker_idx` ON `operators` (`is_broker`);
--> statement-breakpoint
CREATE TABLE `operator_sizes` (
	`id` text PRIMARY KEY NOT NULL,
	`operator_id` text NOT NULL,
	`yards` integer NOT NULL,
	FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `operator_sizes_unique` ON `operator_sizes` (`operator_id`,`yards`);
--> statement-breakpoint
CREATE INDEX `operator_sizes_yards_idx` ON `operator_sizes` (`yards`);
--> statement-breakpoint
CREATE TABLE `operator_materials` (
	`id` text PRIMARY KEY NOT NULL,
	`operator_id` text NOT NULL,
	`material` text NOT NULL,
	FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `operator_materials_unique` ON `operator_materials` (`operator_id`,`material`);
--> statement-breakpoint
CREATE INDEX `operator_materials_material_idx` ON `operator_materials` (`material`);
--> statement-breakpoint
CREATE TABLE `operator_service_areas` (
	`id` text PRIMARY KEY NOT NULL,
	`operator_id` text NOT NULL,
	`city_id` text,
	`zip` text,
	FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`city_id`) REFERENCES `cities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `osa_operator_idx` ON `operator_service_areas` (`operator_id`);
--> statement-breakpoint
CREATE INDEX `osa_city_idx` ON `operator_service_areas` (`city_id`);
--> statement-breakpoint
CREATE INDEX `osa_zip_idx` ON `operator_service_areas` (`zip`);
--> statement-breakpoint
CREATE TABLE `leads` (
	`id` text PRIMARY KEY NOT NULL,
	`operator_id` text NOT NULL,
	`seeker_name` text NOT NULL,
	`seeker_email` text NOT NULL,
	`seeker_phone` text,
	`project_size` text,
	`material` text,
	`address_or_zip` text,
	`timeline` text,
	`notes` text,
	`status` text DEFAULT 'new' NOT NULL,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX `leads_operator_idx` ON `leads` (`operator_id`);
--> statement-breakpoint
CREATE INDEX `leads_status_idx` ON `leads` (`status`);
--> statement-breakpoint
CREATE TABLE `events` (
	`id` text PRIMARY KEY NOT NULL,
	`type` text NOT NULL,
	`path` text,
	`query_json` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
--> statement-breakpoint
CREATE INDEX `events_type_idx` ON `events` (`type`);
--> statement-breakpoint
CREATE TABLE `admin_audit` (
	`id` text PRIMARY KEY NOT NULL,
	`action` text NOT NULL,
	`entity_type` text NOT NULL,
	`entity_id` text,
	`actor` text,
	`notes` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL
);
