import type { APIRoute } from 'astro';
import { eq } from 'drizzle-orm';
import { getDb } from '../../lib/db';
import { logAudit } from '../../lib/admin';
import { operators } from '../../lib/schema';
import { verifyUnsubscribe } from '../../lib/unsubscribe';

function page(title: string, body: string, status = 200): Response {
  const html = `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>${title}</title></head><body style="font-family:system-ui,sans-serif;max-width:32rem;margin:4rem auto;padding:0 1rem;line-height:1.5"><h1 style="font-size:1.25rem">${title}</h1><p>${body}</p><p><a href="/">Find A Dumpster</a></p></body></html>`;
  return new Response(html, {
    status,
    headers: { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex' },
  });
}

async function optOut(operatorId: string, sig: string): Promise<boolean> {
  if (!(await verifyUnsubscribe(operatorId, sig))) return false;
  const db = getDb();
  const updated = await db
    .update(operators)
    .set({ leadEmailsOptOut: true, autoUnlockEnabled: false, updatedAt: new Date().toISOString() })
    .where(eq(operators.id, operatorId))
    .returning({ id: operators.id });
  if (updated.length === 0) return false;
  await logAudit(db, {
    action: 'operator_unsubscribe',
    entityType: 'operator',
    entityId: operatorId,
    actor: 'operator-link',
  });
  return true;
}

/** Link click from the email: show a confirm button (mail scanners pre-fetch GET links). */
export const GET: APIRoute = async ({ url }) => {
  const op = url.searchParams.get('op') ?? '';
  const sig = url.searchParams.get('sig') ?? '';
  if (!(await verifyUnsubscribe(op, sig))) {
    return page('Link not valid', 'This unsubscribe link is invalid or expired.', 400);
  }
  const action = `/api/unsubscribe?op=${encodeURIComponent(op)}&sig=${encodeURIComponent(sig)}`;
  return page(
    'Stop lead emails?',
    `You will no longer be offered quote requests from Find A Dumpster.</p><form method="POST" action="${action}"><button type="submit" style="padding:.5rem 1rem;font-weight:600">Unsubscribe</button></form><p>`,
  );
};

/** Confirm button and RFC 8058 one-click (List-Unsubscribe-Post). */
export const POST: APIRoute = async ({ url }) => {
  const op = url.searchParams.get('op') ?? '';
  const sig = url.searchParams.get('sig') ?? '';
  const ok = await optOut(op, sig);
  if (!ok) return page('Link not valid', 'This unsubscribe link is invalid or expired.', 400);
  return page('Unsubscribed', 'You will no longer receive lead offers from Find A Dumpster.');
};
