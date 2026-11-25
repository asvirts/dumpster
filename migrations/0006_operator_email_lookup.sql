-- Inbound replies match the sender against either operator address, case-insensitively.
CREATE INDEX IF NOT EXISTS `operators_email_lower_idx` ON `operators` (lower(`email`));
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `operators_lead_notify_email_lower_idx` ON `operators` (lower(`lead_notify_email`));
