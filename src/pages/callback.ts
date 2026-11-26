import type { APIRoute } from 'astro';
import { createCallbackHandler } from '@workos/authkit-astro';
import { authNotConfigured, ensureAuthKit } from '../lib/workos';
import { remapClerkIds } from '../lib/workos-orgs';

const handleCallback = createCallbackHandler({
  // Users imported from Clerk carry externalId = Clerk id; swap those ids in D1.
  onSuccess: async (_context, { authResponse }) => {
    await remapClerkIds({
      user: authResponse.user,
      organizationId: authResponse.organizationId,
    });
  },
  onError: (_context, err) => {
    console.error('[auth] callback failed', err);
  },
});

/** WorkOS redirect URI (WORKOS_REDIRECT_URI must point here). */
export const GET: APIRoute = async (context) => {
  if (!(await ensureAuthKit())) return authNotConfigured();
  return handleCallback(context);
};
