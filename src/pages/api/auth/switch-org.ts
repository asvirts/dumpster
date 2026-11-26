import type { APIRoute } from 'astro';
import { safeReturnTo } from '../../../lib/workos';
import { switchActiveOrganization } from '../../../lib/workos-orgs';

/** Form POST: organizationId (+ optional returnTo). Sets the session's active organization. */
export const POST: APIRoute = async (context) => {
  const form = await context.request.formData();
  const organizationId = form.get('organizationId')?.toString() ?? '';
  const returnTo = safeReturnTo(form.get('returnTo')?.toString(), '/portal');
  if (!context.locals.auth?.user) {
    return context.redirect(`/login?returnTo=${encodeURIComponent(returnTo)}`);
  }
  const result = organizationId
    ? await switchActiveOrganization(context, organizationId)
    : ({ ok: false, error: 'Choose an organization.' } as const);
  if (!result.ok) {
    return context.redirect(`/portal/select-org?err=${encodeURIComponent(result.error)}`);
  }
  return context.redirect(returnTo);
};
