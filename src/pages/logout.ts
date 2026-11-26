import type { APIRoute } from 'astro';
import { handleSignOut } from '@workos/authkit-astro';
import { ensureAuthKit } from '../lib/workos';

/** Clears the session and ends the WorkOS session; lands on `/` (or `?returnTo=`). */
export const GET: APIRoute = async (context) => {
  if (!(await ensureAuthKit())) return context.redirect('/');
  return handleSignOut(context);
};
