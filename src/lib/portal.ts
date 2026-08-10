import { and, eq } from 'drizzle-orm';
import type { AppDb } from './db';
import { operators, type Operator } from './schema';

export async function getOperatorForOrg(
  db: AppDb,
  orgId: string | null | undefined,
): Promise<Operator | null> {
  if (!orgId) return null;
  const op = await db.query.operators.findFirst({
    where: and(eq(operators.clerkOrgId, orgId), eq(operators.claimStatus, 'approved')),
  });
  return op ?? null;
}

export async function getPendingClaimForOrg(
  db: AppDb,
  orgId: string | null | undefined,
): Promise<Operator | null> {
  if (!orgId) return null;
  const op = await db.query.operators.findFirst({
    where: and(eq(operators.clerkOrgId, orgId), eq(operators.claimStatus, 'pending')),
  });
  return op ?? null;
}
