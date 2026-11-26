import type { APIRoute } from 'astro';
import { handleSignUp } from '@workos/authkit-astro';
import { authNotConfigured, ensureAuthKit } from '../lib/workos';

/** Redirects to WorkOS AuthKit sign-up (`?returnTo=/path` to come back). */
export const GET: APIRoute = async (context) => {
  if (!(await ensureAuthKit())) return authNotConfigured();
  return handleSignUp(context);
};
