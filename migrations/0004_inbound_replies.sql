-- Replies to lead emails, received through Resend Inbound (reply-to leads@reply.findadumpster.net).
CREATE TABLE `inbound_emails` (
	`id` text PRIMARY KEY NOT NULL,
	`resend_email_id` text NOT NULL,
	`from_email` text NOT NULL,
	`from_header` text,
	`subject` text,
	`message_id` text,
	`reply_text` text,
	`full_text` text,
	`operator_id` text,
	`auto_action` text,
	`handled_at` text,
	`answered_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	FOREIGN KEY (`operator_id`) REFERENCES `operators`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE UNIQUE INDEX `inbound_emails_resend_id_idx` ON `inbound_emails` (`resend_email_id`);
--> statement-breakpoint
CREATE INDEX `inbound_emails_created_idx` ON `inbound_emails` (`created_at`);
