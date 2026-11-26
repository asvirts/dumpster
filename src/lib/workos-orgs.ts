import type { APIContext } from 'astro';
import { env } from 'cloudflare:workers';
import { getWorkOS, switchToOrganization } from '@workos/authkit-astro';
import { orgRemapStatements, runRemap, userRemapStatements } from './auth-remap';

export type UserOrganization = { id: string; name: string };

/** Active WorkOS organization memberships of a user. */
export async function listUserOrganizations(userId: string): Promise<UserOrganization[]> {
  const memberships = await getWorkOS().userManagement.listOrganizationMemberships({
    userId,
    statuses: ['active'],
    limit: 100,
  });
  return memberships.data
    .map((m) => ({ id: m.organizationId, name: m.organizationName }))
    .sort((a, b) => a.name.localeCompare(b.name));
}

/** Create a company organization and make the user a member. */
export async function createOrganizationForUser(
  userId: string,
  name: string,
): Promise<UserOrganization> {
  const workos = getWorkOS();
  const org = await workos.organizations.createOrganization({ name });
  await workos.userManagement.createOrganizationMembership({
    organizationId: org.id,
    userId,
  });
  return { id: org.id, name: org.name };
}

/**
 * Swap Clerk ids for WorkOS ids in D1 for this user (and org, if any).
 * Never throws: a failed remap must not block sign-in.
 */
export async function remapClerkIds(opts: {
  user?: { id: string; externalId?: string | null } | null;
  organizationId?: string | null;
}): Promise<void> {
  try {
    const statements = opts.user?.externalId
      ? userRemapStatements(opts.user.externalId, opts.user.id)
      : [];
    if (opts.organizationId) {
      const org = await getWorkOS().organizations.getOrganization(opts.organizationId);
      statements.push(...orgRemapStatements(org.externalId, org.id));
    }
    const changed = await runRemap(env.DB, statements);
    if (changed > 0) {
      console.log(`[auth] remapped ${changed} Clerk id reference(s) to WorkOS ids`);
    }
  } catch (err) {
    console.error('[auth] Clerk → WorkOS id remap failed', err);
  }
}

/**
 * Make `organizationId` the session's active organization after checking the
 * user is an active member, then remap that org's Clerk id in D1.
 */
export async function switchActiveOrganization(
  context: Pick<APIContext, 'cookies' | 'url' | 'redirect' | 'locals'>,
  organizationId: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const user = context.locals.auth?.user;
  if (!user) return { ok: false, error: 'Sign in first.' };
  const orgs = await listUserOrganizations(user.id);
  if (!orgs.some((o) => o.id === organizationId)) {
    return { ok: false, error: 'You are not a member of that organization.' };
  }
  try {
    await switchToOrganization(context, organizationId);
  } catch (err) {
    console.error('[auth] switchToOrganization failed', err);
    return { ok: false, error: 'Could not switch organization.' };
  }
  await remapClerkIds({ organizationId });
  return { ok: true };
}
