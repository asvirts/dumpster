import type { CloudContext, HeadConfig } from 'void';
import { processNewLead } from '../lib/autopilot';
import { getDb } from '../lib/db';
import { quoteInputSchema } from '../lib/lead-fields';
import { clientIpFromRequest, createHeldLead } from '../lib/leads';
import { turnstileSiteKey, verifyTurnstile } from '../lib/turnstile';
import { pageQuery, readFeedback, redirectWithFeedback } from './flash';
import { setFeedback, type FormFeedback } from './shared';

/**
 * Quote form (submitQuote) for the public pages that show <QuoteForm>: search, city and operator.
 * Each page's server file exports `actions = { submitQuote: defineHandler(withShared, (c) => submitQuote(c, 'quote')) }`
 * and passes `quoteFormContext(c)` to the island. The action redirects back to the page (see flash.ts).
 */

export const QUOTE_FORM = 'quote';

/** Native form action for a named page action that keeps the page's query (and an optional #hash). */
export function pageActionUrl(c: CloudContext, action: string, hash?: string): string {
  const url = new URL(c.req.url);
  const rest = pageQuery(url);
  return `${url.pathname}?${action}${rest ? `&${rest}` : ''}${hash ? `#${hash}` : ''}`;
}

/** Feedback for one form after its action redirected back here (null on a plain GET). */
export function formFeedback(c: CloudContext, form: string): FormFeedback | null {
  return readFeedback(c, form);
}

/** Request-derived props for the QuoteForm island (hidden fields, Turnstile key, action result). */
export function quoteFormContext(c: CloudContext, opts: { hash?: string } = {}) {
  const url = new URL(c.req.url);
  const rest = pageQuery(url);
  const feedback = formFeedback(c, QUOTE_FORM);
  // After a failed submit, keep the attribution the form was first rendered with
  // (this request's URL and Referer are the action POST, not the visitor's landing).
  const echoed = feedback && !feedback.ok ? feedback.values : undefined;
  const q = (name: string) => url.searchParams.get(name) ?? '';
  const pick = (field: string, fallback: string) => (echoed ? (echoed[field] ?? '') : fallback);
  return {
    actionUrl: pageActionUrl(c, 'submitQuote', opts.hash),
    sourcePath: pick('sourcePath', url.pathname + (rest ? `?${rest}` : '')),
    utmSource: pick('utmSource', q('utm_source')),
    utmMedium: pick('utmMedium', q('utm_medium')),
    utmCampaign: pick('utmCampaign', q('utm_campaign')),
    utmContent: pick('utmContent', q('utm_content')),
    utmTerm: pick('utmTerm', q('utm_term')),
    referrer: pick('referrer', c.req.header('referer') ?? ''),
    turnstileKey: turnstileSiteKey(),
    feedback,
  };
}

export type QuoteFormContext = ReturnType<typeof quoteFormContext>;

/** Turnstile loader for the page head (only when a site key is set and the form is showing). */
export function turnstileHead(quote: QuoteFormContext): NonNullable<HeadConfig['script']> {
  if (!quote.turnstileKey || quote.feedback?.ok) return [];
  return [{ src: 'https://challenges.cloudflare.com/turnstile/v0/api.js', async: '', defer: '' }];
}

/** Fields echoed back into the form after a failed submit. */
const ECHO_FIELDS = [
  'projectSize',
  'material',
  'addressOrZip',
  'timeline',
  'seekerName',
  'seekerEmail',
  'seekerPhone',
  'preferredContact',
  'budgetRange',
  'howFound',
  'notes',
  'sourcePath',
  'utmSource',
  'utmMedium',
  'utmCampaign',
  'utmContent',
  'utmTerm',
  'referrer',
] as const;

/** Page action: validate, store a held lead, route it after the response. Re-renders the page. */
/** submitQuote page action: validate, store the lead, then 303 back to the page (`#hash`) with feedback. */
export async function submitQuote(c: CloudContext, hash?: string): Promise<Response> {
  await handleQuote(c);
  return redirectWithFeedback(c, hash);
}

async function handleQuote(c: CloudContext): Promise<void> {
  const body = await c.req.parseBody();
  const raw: Record<string, string> = {};
  for (const [k, v] of Object.entries(body)) if (typeof v === 'string') raw[k] = v;
  const values: Record<string, string> = {};
  for (const k of ECHO_FIELDS) if (raw[k] != null) values[k] = raw[k];

  const fail = (message: string, fieldErrors?: Record<string, string>) =>
    setFeedback(c, { form: QUOTE_FORM, ok: false, message, fieldErrors, values });

  // Empty optional fields arrive as '' from a native form post (Astro treated them as absent).
  const input: Record<string, string | undefined> = {};
  for (const [k, v] of Object.entries(raw)) input[k] = v === '' ? undefined : v;
  const parsed = quoteInputSchema.safeParse(input);
  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? '');
      if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return fail('Please check the highlighted fields and try again.', fieldErrors);
  }
  const data = parsed.data;

  // Silent success for bots that fill the honeypot
  if (data.companyWebsite && data.companyWebsite.trim() !== '') {
    return setFeedback(c, { form: QUOTE_FORM, ok: true });
  }

  const ip = clientIpFromRequest(c.req.raw);
  const turnstile = await verifyTurnstile({ token: data['cf-turnstile-response'], ip });
  if (!turnstile.ok) return fail(turnstile.error);

  const db = getDb();
  const result = await createHeldLead(db, {
    mode: data.mode === 'match' ? 'match' : 'direct',
    operatorId: data.operatorId,
    seekerName: data.seekerName,
    seekerEmail: data.seekerEmail,
    seekerPhone: data.seekerPhone,
    projectSize: data.projectSize,
    material: data.material,
    addressOrZip: data.addressOrZip,
    timeline: data.timeline,
    notes: data.notes,
    preferredContact: data.preferredContact,
    budgetRange: data.budgetRange,
    howFound: data.howFound,
    sourcePath: data.sourcePath,
    sourceCityId: data.sourceCityId,
    utmSource: data.utmSource,
    utmMedium: data.utmMedium,
    utmCampaign: data.utmCampaign,
    utmContent: data.utmContent,
    utmTerm: data.utmTerm,
    referrer: data.referrer,
    ip,
  });
  if (!result.ok) return fail(result.error);

  if (!result.duplicate) {
    // Route + email after the response; the cron retries anything this misses.
    const work = processNewLead(db, result.leadId).catch((err) =>
      console.error('[autopilot] processNewLead failed', result.leadId, err),
    );
    let ctx: { waitUntil(p: Promise<unknown>): void } | null = null;
    try {
      ctx = c.executionCtx;
    } catch {
      /* no execution context (tests) */
    }
    if (ctx) ctx.waitUntil(work);
    else await work;
  }

  setFeedback(c, { form: QUOTE_FORM, ok: true });
}
