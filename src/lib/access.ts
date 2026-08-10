import { env } from 'cloudflare:workers';

type JwksResponse = {
  keys: Array<JsonWebKey & { kid?: string }>;
};

type CachedJwks = {
  keys: Map<string, CryptoKey>;
  expiresAt: number;
};

let jwksCache: CachedJwks | null = null;

function base64UrlToBytes(input: string): Uint8Array {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4));
  const binary = atob(padded + pad);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

function decodeJwtPart(part: string): unknown {
  const json = new TextDecoder().decode(base64UrlToBytes(part));
  return JSON.parse(json);
}

async function getAccessSigningKeys(teamDomain: string): Promise<Map<string, CryptoKey>> {
  const now = Date.now();
  if (jwksCache && jwksCache.expiresAt > now) {
    return jwksCache.keys;
  }

  const res = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!res.ok) {
    throw new Error(`Failed to fetch Access JWKS (${res.status})`);
  }
  const body = (await res.json()) as JwksResponse;
  const keys = new Map<string, CryptoKey>();
  for (const jwk of body.keys ?? []) {
    if (!jwk.kid || jwk.kty !== 'RSA') continue;
    const key = await crypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    keys.set(jwk.kid, key);
  }
  jwksCache = { keys, expiresAt: now + 60 * 60 * 1000 };
  return keys;
}

/**
 * Verify Cloudflare Access JWT (Cf-Access-Jwt-Assertion).
 * Requires CF_ACCESS_TEAM_DOMAIN (e.g. myteam.cloudflareaccess.com) and CF_ACCESS_AUD.
 */
export async function verifyAccessJwt(
  request: Request,
): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const teamDomain = (env as { CF_ACCESS_TEAM_DOMAIN?: string }).CF_ACCESS_TEAM_DOMAIN?.trim();
  const aud = (env as { CF_ACCESS_AUD?: string }).CF_ACCESS_AUD?.trim();
  if (!teamDomain || !aud) {
    return {
      ok: false,
      error:
        'Admin Access is not configured. Set CF_ACCESS_TEAM_DOMAIN and CF_ACCESS_AUD, or use ADMIN_BYPASS=1 only in local DEV.',
    };
  }

  const token = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!token) {
    return { ok: false, error: 'Missing Cloudflare Access token' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { ok: false, error: 'Invalid Access token format' };
  }

  try {
    const header = decodeJwtPart(parts[0]) as { alg?: string; kid?: string };
    if (header.alg !== 'RS256' || !header.kid) {
      return { ok: false, error: 'Unsupported Access token algorithm' };
    }

    const keys = await getAccessSigningKeys(teamDomain);
    const key = keys.get(header.kid);
    if (!key) {
      // Refresh JWKS once in case of rotation
      jwksCache = null;
      const refreshed = await getAccessSigningKeys(teamDomain);
      const retryKey = refreshed.get(header.kid);
      if (!retryKey) {
        return { ok: false, error: 'Unknown Access signing key' };
      }
      return verifyWithKey(token, parts, retryKey, aud, teamDomain);
    }
    return verifyWithKey(token, parts, key, aud, teamDomain);
  } catch (err) {
    console.error('[access] JWT verify failed', err);
    return { ok: false, error: 'Access token verification failed' };
  }
}

async function verifyWithKey(
  token: string,
  parts: string[],
  key: CryptoKey,
  expectedAud: string,
  teamDomain: string,
): Promise<{ ok: true; email: string } | { ok: false; error: string }> {
  const data = new TextEncoder().encode(`${parts[0]}.${parts[1]}`);
  // Copy into a fresh ArrayBuffer-backed view for WebCrypto typing
  const signature = new Uint8Array(base64UrlToBytes(parts[2]));
  const valid = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, signature, data);
  if (!valid) {
    return { ok: false, error: 'Invalid Access token signature' };
  }

  const payload = decodeJwtPart(parts[1]) as {
    aud?: string | string[];
    exp?: number;
    email?: string;
    common_name?: string;
    iss?: string;
  };

  const now = Math.floor(Date.now() / 1000);
  if (typeof payload.exp !== 'number' || payload.exp < now) {
    return { ok: false, error: 'Access token expired' };
  }

  const audOk = Array.isArray(payload.aud)
    ? payload.aud.includes(expectedAud)
    : payload.aud === expectedAud;
  if (!audOk) {
    return { ok: false, error: 'Access token audience mismatch' };
  }

  const expectedIss = `https://${teamDomain}`;
  if (payload.iss && payload.iss !== expectedIss) {
    return { ok: false, error: 'Access token issuer mismatch' };
  }

  const email = payload.email || payload.common_name;
  if (!email) {
    return { ok: false, error: 'Access token missing email' };
  }

  return { ok: true, email };
}

/** Local-only admin bypass: requires both Astro DEV and ADMIN_BYPASS=1. */
export function isLocalAdminBypass(): boolean {
  const bypass = (env as { ADMIN_BYPASS?: string }).ADMIN_BYPASS === '1';
  return Boolean(import.meta.env.DEV && bypass);
}
