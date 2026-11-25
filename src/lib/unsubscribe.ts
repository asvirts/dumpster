import { env } from 'cloudflare:workers';
import { signLinkValue, verifyLinkValue } from './autopilot-rules';

const PURPOSE = 'lead-email-unsubscribe';

function siteBase(): string {
  return (
    (env as { PUBLIC_SITE_URL?: string }).PUBLIC_SITE_URL?.replace(/\/$/, '') ||
    'https://findadumpster.net'
  );
}

/**
 * Key for signed one-click links. Prefer a dedicated LINK_SIGNING_SECRET; fall back to an
 * existing server secret (namespaced by PURPOSE in the HMAC) so links work without new setup.
 */
function linkSecret(): string | null {
  const e = env as {
    LINK_SIGNING_SECRET?: string;
    CLERK_SECRET_KEY?: string;
    STRIPE_WEBHOOK_SECRET?: string;
  };
  return e.LINK_SIGNING_SECRET || e.CLERK_SECRET_KEY || e.STRIPE_WEBHOOK_SECRET || null;
}

export async function unsubscribeUrlFor(operatorId: string): Promise<string | null> {
  const secret = linkSecret();
  if (!secret) return null;
  const sig = await signLinkValue(secret, PURPOSE, operatorId);
  return `${siteBase()}/api/unsubscribe?op=${encodeURIComponent(operatorId)}&sig=${sig}`;
}

export async function verifyUnsubscribe(operatorId: string, sig: string): Promise<boolean> {
  const secret = linkSecret();
  if (!secret || !operatorId || !sig) return false;
  return verifyLinkValue(secret, PURPOSE, operatorId, sig);
}
