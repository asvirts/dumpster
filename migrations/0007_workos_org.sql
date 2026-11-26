-- Operator companies move from Clerk organizations to WorkOS organizations.
-- No production listing was linked to a Clerk org, so only the column name changes.
DROP INDEX IF EXISTS `operators_clerk_org_idx`;--> statement-breakpoint
ALTER TABLE `operators` RENAME COLUMN `clerk_org_id` TO `org_id`;--> statement-breakpoint
CREATE UNIQUE INDEX `operators_org_idx` ON `operators` (`org_id`);
