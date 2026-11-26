import type { APIRoute } from 'astro';
import { handleSignIn } from '@workos/authkit-astro';
import { authNotConfigured, ensureAuthKit } from '../lib/workos';

/** Redirects to WorkOS AuthKit sign-in (`?returnTo=/path` to come back). */
export const GET: APIRoute = async (context) => {
  if (!(await ensureAuthKit())) return authNotConfigured();
  return handleSignIn(context);
};
