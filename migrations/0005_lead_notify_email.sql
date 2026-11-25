-- Where lead emails go once a listing is claimed (falls back to the public listing email).
ALTER TABLE `operators` ADD `lead_notify_email` text;
--> statement-breakpoint
-- Verified email of the person who requested the claim; copied to lead_notify_email on approval.
ALTER TABLE `operators` ADD `claim_requested_by_email` text;
