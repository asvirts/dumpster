/**
 * Resend tags on outgoing email, so webhook events (delivered, opened, bounced…)
 * can be tied back to this site, the lead and the operator. Pure: no env, no DB.
 */

export type EmailTag = { name: string; value: string };

/** What an email is about. `leadId` is the lead group id (see `leadTagId`). */
export type EmailRefs = {
  leadId?: string | null;
  operatorId?: string | null;
};

export const SITE_TAG = 'dumpster';

/** Resend tag values allow only ASCII letters, digits, `_` and `-`, max 256 chars. */
export function sanitizeTagValue(value: string): string {
  return value.replace(/[^A-Za-z0-9_-]/g, '_').slice(0, 256);
}

/** A match lead fans out to several rows sharing `group_id`; the group id is the lead. */
export function leadTagId(lead: { id: string; groupId?: string | null }): string {
  return lead.groupId ?? lead.id;
}

export function emailTags(kind: string, refs: EmailRefs = {}): EmailTag[] {
  const tags: EmailTag[] = [
    { name: 'site', value: SITE_TAG },
    { name: 'kind', value: kind },
  ];
  if (refs.leadId) tags.push({ name: 'lead_id', value: refs.leadId });
  if (refs.operatorId) tags.push({ name: 'operator_id', value: refs.operatorId });
  return tags
    .map((t) => ({ name: t.name, value: sanitizeTagValue(t.value) }))
    .filter((t) => t.value.length > 0);
}
