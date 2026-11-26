import { defineHandler, defineHead, type InferProps } from 'void';
import type { Href } from 'void/routes';
import { safeReturnTo, switchOrganization, workos } from '../../src/lib/auth';
import { cookieJar } from '../../src/lib/cookies';
import { portalAuth, portalGuard } from '../../src/server/portal-guard';
import { portalHead } from '../../src/server/portal-head';
import { setFeedback } from '../../src/server/shared';

export const revalidate = 0;

// Operator accounts are companies = WorkOS organizations. The chosen one becomes the
// session's active organization (auth.orgId), which the portal and claims key off.

export const loader = defineHandler(portalGuard, async (c) => {
  const auth = portalAuth(c);
  const feedback = c.get('shared')?.feedback;
  // After a failed POST the page re-renders at ?select / ?create; keep the posted returnTo.
  const returnTo = safeReturnTo(c.req.query('returnTo') ?? feedback?.values?.returnTo, '/portal');

  const memberships = await workos().userManagement.listOrganizationMemberships({
    userId: auth.userId,
    statuses: ['active'],
    limit: 100,
  });
  return {
    orgs: memberships.data.map((m) => ({ id: m.organizationId, name: m.organizationName ?? m.organizationId })),
    currentOrgId: auth.orgId,
    returnTo,
  };
});

export type Props = InferProps<typeof loader>;

export const head = defineHead(() => portalHead('/portal/select-org'));

/** Select or create a company, then switch the session to it and go to returnTo (303). */
const choose = (intent: 'select' | 'create') =>
  defineHandler(portalGuard, async (c) => {
    const auth = portalAuth(c);
    const body = await c.req.parseBody();
    const text = (key: string) => (typeof body[key] === 'string' ? (body[key] as string) : undefined);
    const returnTo = safeReturnTo(text('returnTo'), '/portal');
    try {
      let organizationId = text('organizationId') ?? '';
      if (intent === 'create') {
        const name = text('name')?.trim() ?? '';
        if (name.length < 2 || name.length > 120) {
          throw new Error('Enter a company name (2–120 characters).');
        }
        const org = await workos().organizations.createOrganization({ name });
        await workos().userManagement.createOrganizationMembership({
          organizationId: org.id,
          userId: auth.userId,
        });
        organizationId = org.id;
      }
      if (!organizationId) throw new Error('Choose a company.');
      if (!(await switchOrganization(cookieJar(c), new URL(c.req.url), organizationId))) {
        throw new Error('Could not switch to that company. Try signing in again.');
      }
      return c.redirect(returnTo as Href, 303);
    } catch (err) {
      console.error('[portal] select-org', err);
      setFeedback(c, {
        form: 'select-org',
        ok: false,
        message: err instanceof Error ? err.message : 'Something went wrong.',
        values: { returnTo },
      });
    }
  });

export const actions = {
  select: choose('select'),
  create: choose('create'),
};
