/**
 * Clerk → WorkOS id remapping.
 *
 * Existing accounts were imported into WorkOS with `externalId` = the Clerk id
 * (scripts/import-clerk-to-workos.mjs). D1 still holds Clerk ids, so on each
 * sign-in / org switch we swap them for the WorkOS ids. Every statement is
 * idempotent: once remapped, nothing matches the Clerk id any more.
 *
 * Columns that store auth ids:
 * - operators.clerk_org_id                (org id; legacy column name)
 * - operators.claim_requested_by_user_id  (user id)
 * - leads.passed_by                       (user id when an operator unlocked in the portal)
 * - admin_audit.actor                     (user id for portal actions)
 * - admin_audit.notes                     (free text that embeds "org <id>")
 */

export type RemapStatement = { sql: string; params: string[] };

function valid(from: string | null | undefined, to: string | null | undefined): from is string {
  return !!from && !!to && from !== to;
}

export function userRemapStatements(
  clerkUserId: string | null | undefined,
  workosUserId: string,
): RemapStatement[] {
  if (!valid(clerkUserId, workosUserId)) return [];
  const params = [clerkUserId, workosUserId];
  return [
    {
      sql: 'UPDATE operators SET claim_requested_by_user_id = ?2 WHERE claim_requested_by_user_id = ?1',
      params,
    },
    { sql: 'UPDATE leads SET passed_by = ?2 WHERE passed_by = ?1', params },
    { sql: 'UPDATE admin_audit SET actor = ?2 WHERE actor = ?1', params },
  ];
}

export function orgRemapStatements(
  clerkOrgId: string | null | undefined,
  workosOrgId: string,
): RemapStatement[] {
  if (!valid(clerkOrgId, workosOrgId)) return [];
  const params = [clerkOrgId, workosOrgId];
  return [
    {
      // clerk_org_id is UNIQUE: never collide with a row that already holds the WorkOS id.
      sql:
        'UPDATE operators SET clerk_org_id = ?2 WHERE clerk_org_id = ?1 ' +
        'AND NOT EXISTS (SELECT 1 FROM operators WHERE clerk_org_id = ?2)',
      params,
    },
    {
      sql: 'UPDATE admin_audit SET notes = REPLACE(notes, ?1, ?2) WHERE instr(notes, ?1) > 0',
      params,
    },
  ];
}

export async function runRemap(db: D1Database, statements: RemapStatement[]): Promise<number> {
  if (statements.length === 0) return 0;
  const results = await db.batch(statements.map((s) => db.prepare(s.sql).bind(...s.params)));
  return results.reduce((n, r) => n + (r.meta?.changes ?? 0), 0);
}
