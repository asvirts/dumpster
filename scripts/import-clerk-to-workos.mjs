#!/usr/bin/env node
/**
 * Import Clerk users and organizations into WorkOS User Management.
 *
 *   node scripts/import-clerk-to-workos.mjs --users clerk-users.csv [--dry-run]
 *
 * Users come from the Clerk dashboard CSV export (Users → Export). Each becomes
 * a WorkOS user with emailVerified=true and externalId = the Clerk user id, and
 * keeps their password when the export has a bcrypt digest.
 *
 * Organizations (and memberships) come from the Clerk Backend API using
 * CLERK_SECRET_KEY, or from a JSON file passed with --orgs-json:
 *   [{ "id": "org_…", "name": "Acme", "members": [{ "userId": "user_…", "role": "org:admin" }] }]
 * Each becomes a WorkOS organization with externalId = the Clerk org id.
 *
 * The site swaps Clerk ids in D1 for the WorkOS ids on each person's first
 * sign-in (src/lib/auth-remap.ts), using those externalIds.
 *
 * Idempotent: users whose email already exists in WorkOS are skipped (their
 * externalId is filled in if missing), organizations are matched by externalId,
 * and existing memberships are left alone. Safe to re-run.
 *
 * Env:
 *   WORKOS_API_KEY    required (optional with --dry-run: then nothing is looked up)
 *   CLERK_SECRET_KEY  required for orgs unless --orgs-json or --skip-orgs
 *
 * Flags:
 *   --users <file>        Clerk user export CSV
 *   --orgs-json <file>    organizations + members as JSON instead of the Clerk API
 *   --skip-orgs           users only
 *   --dry-run             print what would change; write nothing
 *   --admin-role <slug>   WorkOS role for Clerk org admins (default "admin"; "" = default role)
 *   --member-role <slug>  WorkOS role for other members (default: the environment's default role)
 */
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { WorkOS } from '@workos-inc/node';

// ---------- args ----------

function parseArgs(argv) {
  const out = { dryRun: false, skipOrgs: false, adminRole: 'admin', memberRole: '' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    const value = () => {
      const v = argv[++i];
      if (v === undefined) fail(`${a} needs a value`);
      return v;
    };
    if (a === '--users') out.users = value();
    else if (a === '--orgs-json') out.orgsJson = value();
    else if (a === '--skip-orgs') out.skipOrgs = true;
    else if (a === '--dry-run') out.dryRun = true;
    else if (a === '--admin-role') out.adminRole = value();
    else if (a === '--member-role') out.memberRole = value();
    else if (a === '-h' || a === '--help') {
      console.log(readFileSync(new URL(import.meta.url), 'utf8').split('*/')[0]);
      process.exit(0);
    } else fail(`Unknown argument: ${a}`);
  }
  return out;
}

function fail(msg) {
  console.error(`error: ${msg}`);
  process.exit(1);
}

// ---------- CSV ----------

/** RFC 4180 CSV → array of objects keyed by the (lower-cased) header row. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else field += c;
  }
  if (field !== '' || row.length) {
    row.push(field);
    rows.push(row);
  }
  const [header, ...body] = rows.filter((r) => r.some((v) => v.trim() !== ''));
  if (!header) return [];
  const keys = header.map((h) => h.trim().replace(/^﻿/, '').toLowerCase());
  return body.map((r) => Object.fromEntries(keys.map((k, idx) => [k, (r[idx] ?? '').trim()])));
}

const pick = (row, ...keys) => keys.map((k) => row[k]).find((v) => v) ?? '';
const splitList = (v) =>
  (v || '')
    .split(/[|;,\s]+/)
    .map((s) => s.trim())
    .filter(Boolean);

/** Normalize one row of the Clerk user export. */
export function clerkUserFromRow(row) {
  const verified = splitList(pick(row, 'verified_email_addresses'));
  const unverified = splitList(pick(row, 'unverified_email_addresses'));
  const email = (
    pick(row, 'primary_email_address', 'email_address', 'email') ||
    verified[0] ||
    splitList(pick(row, 'email_addresses'))[0] ||
    unverified[0] ||
    ''
  ).toLowerCase();
  const digest = pick(row, 'password_digest');
  const hasher = pick(row, 'password_hasher').toLowerCase();
  const isBcrypt = !!digest && (hasher === 'bcrypt' || (!hasher && /^\$2[abxy]?\$/.test(digest)));
  return {
    clerkId: pick(row, 'id', 'user_id', 'clerk_id'),
    email,
    firstName: pick(row, 'first_name') || undefined,
    lastName: pick(row, 'last_name') || undefined,
    passwordHash: isBcrypt ? digest : undefined,
    unsupportedHasher: digest && !isBcrypt ? hasher || 'unknown' : undefined,
  };
}

// ---------- WorkOS helpers ----------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const isStatus = (err, status) => err?.status === status;

async function withRetry(fn, label) {
  for (let attempt = 0; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      const retryable = isStatus(err, 429) || (err?.status >= 500 && err?.status < 600);
      if (!retryable || attempt >= 5) throw err;
      const wait = (err.retryAfter ? err.retryAfter * 1000 : 0) || 1000 * 2 ** attempt;
      console.warn(`  ${label}: ${err.status}, retrying in ${Math.round(wait / 1000)}s`);
      await sleep(wait);
    }
  }
}

async function orNull(fn) {
  try {
    return await fn();
  } catch (err) {
    if (isStatus(err, 404)) return null;
    throw err;
  }
}

// ---------- Clerk organizations ----------

async function clerkGet(path, secret) {
  const res = await fetch(`https://api.clerk.com/v1${path}`, {
    headers: { Authorization: `Bearer ${secret}` },
  });
  if (!res.ok) throw new Error(`Clerk API ${path} → ${res.status} ${await res.text()}`);
  return res.json();
}

async function clerkPaginate(path, secret) {
  const all = [];
  for (let offset = 0; ; offset += 100) {
    const sep = path.includes('?') ? '&' : '?';
    const body = await clerkGet(`${path}${sep}limit=100&offset=${offset}`, secret);
    const page = Array.isArray(body) ? body : (body.data ?? []);
    all.push(...page);
    if (page.length < 100) return all;
  }
}

async function loadClerkOrgs(opts) {
  if (opts.orgsJson) {
    const parsed = JSON.parse(readFileSync(opts.orgsJson, 'utf8'));
    return parsed.map((o) => ({
      id: o.id,
      name: o.name,
      members: (o.members ?? []).map((m) => ({ userId: m.userId ?? m.user_id, role: m.role ?? '' })),
    }));
  }
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) fail('Set CLERK_SECRET_KEY (or pass --orgs-json / --skip-orgs) to import organizations.');
  const orgs = await clerkPaginate('/organizations', secret);
  const out = [];
  for (const org of orgs) {
    const memberships = await clerkPaginate(`/organizations/${org.id}/memberships`, secret);
    out.push({
      id: org.id,
      name: org.name,
      members: memberships.map((m) => ({ userId: m.public_user_data?.user_id, role: m.role ?? '' })),
    });
  }
  return out;
}

// ---------- main ----------

async function main() {
  const opts = parseArgs(process.argv.slice(2));
  if (!opts.users && opts.skipOrgs) fail('Nothing to do: pass --users and/or drop --skip-orgs.');

  const apiKey = process.env.WORKOS_API_KEY;
  if (!apiKey && !opts.dryRun) fail('Set WORKOS_API_KEY (the WorkOS project for this site).');
  const workos = apiKey ? new WorkOS(apiKey) : null;
  const tag = opts.dryRun ? '[dry-run] ' : '';
  if (!workos) console.log('[dry-run] no WORKOS_API_KEY: existing WorkOS data is not checked.');

  const stats = {
    usersCreated: 0,
    usersSkipped: 0,
    usersLinked: 0,
    usersFailed: 0,
    orgsCreated: 0,
    orgsSkipped: 0,
    membershipsCreated: 0,
    membershipsSkipped: 0,
    membershipsFailed: 0,
  };
  /** Clerk user id → WorkOS user id */
  const userIds = new Map();

  if (opts.users) {
    const rows = parseCsv(readFileSync(opts.users, 'utf8')).map(clerkUserFromRow);
    console.log(`Users: ${rows.length} row(s) in ${opts.users}`);
    const seen = new Set();
    for (const u of rows) {
      if (!u.clerkId || !u.email) {
        console.warn(`  skip row without id/email: ${u.clerkId || '(no id)'} ${u.email}`);
        stats.usersFailed++;
        continue;
      }
      if (seen.has(u.email)) {
        console.warn(`  skip duplicate email in CSV: ${u.email} (${u.clerkId})`);
        stats.usersSkipped++;
        continue;
      }
      seen.add(u.email);
      if (u.unsupportedHasher) {
        console.warn(`  ${u.email}: password hasher "${u.unsupportedHasher}" not imported; user must reset password`);
      }

      const existing = workos
        ? (await withRetry(() => workos.userManagement.listUsers({ email: u.email }), u.email)).data[0]
        : null;
      if (existing) {
        stats.usersSkipped++;
        userIds.set(u.clerkId, existing.id);
        if (!existing.externalId) {
          console.log(`  ${tag}link existing ${u.email} → externalId ${u.clerkId}`);
          if (!opts.dryRun) {
            await withRetry(
              () => workos.userManagement.updateUser({ userId: existing.id, externalId: u.clerkId }),
              u.email,
            );
          }
          stats.usersLinked++;
        } else if (existing.externalId !== u.clerkId) {
          console.warn(`  ${u.email} exists with externalId ${existing.externalId} (Clerk id ${u.clerkId}); left as is`);
        }
        continue;
      }

      console.log(`  ${tag}create ${u.email} (${u.clerkId})${u.passwordHash ? ' with bcrypt password' : ''}`);
      if (opts.dryRun) {
        stats.usersCreated++;
        continue;
      }
      try {
        const created = await withRetry(
          () =>
            workos.userManagement.createUser({
              email: u.email,
              firstName: u.firstName,
              lastName: u.lastName,
              emailVerified: true,
              externalId: u.clerkId,
              ...(u.passwordHash ? { passwordHash: u.passwordHash, passwordHashType: 'bcrypt' } : {}),
            }),
          u.email,
        );
        userIds.set(u.clerkId, created.id);
        stats.usersCreated++;
      } catch (err) {
        console.error(`  FAILED ${u.email}: ${err.message}`);
        stats.usersFailed++;
      }
    }
  }

  if (!opts.skipOrgs) {
    const orgs = await loadClerkOrgs(opts);
    console.log(`Organizations: ${orgs.length}`);
    for (const org of orgs) {
      let workosOrg = workos
        ? await withRetry(() => orNull(() => workos.organizations.getOrganizationByExternalId(org.id)), org.id)
        : null;
      if (workosOrg) {
        stats.orgsSkipped++;
        console.log(`  exists ${org.name} (${org.id} → ${workosOrg.id})`);
      } else {
        console.log(`  ${tag}create org ${org.name} (${org.id})`);
        stats.orgsCreated++;
        if (!opts.dryRun) {
          workosOrg = await withRetry(
            () => workos.organizations.createOrganization({ name: org.name, externalId: org.id }),
            org.id,
          );
        }
      }

      for (const m of org.members) {
        if (!m.userId) continue;
        let userId = userIds.get(m.userId);
        if (!userId && workos) {
          const u = await withRetry(
            () => orNull(() => workos.userManagement.getUserByExternalId(m.userId)),
            m.userId,
          );
          userId = u?.id;
        }
        if (!userId && !opts.dryRun) {
          console.warn(`    member ${m.userId} not found in WorkOS (import users first); skipped`);
          stats.membershipsFailed++;
          continue;
        }
        const roleSlug = /admin/.test(m.role) ? opts.adminRole : opts.memberRole;
        if (workosOrg && userId) {
          const existing = await withRetry(
            () =>
              workos.userManagement.listOrganizationMemberships({
                organizationId: workosOrg.id,
                userId,
              }),
            m.userId,
          );
          if (existing.data.length > 0) {
            stats.membershipsSkipped++;
            continue;
          }
        }
        console.log(`    ${tag}add ${m.userId} as ${roleSlug || 'default role'}`);
        if (opts.dryRun) {
          stats.membershipsCreated++;
          continue;
        }
        try {
          await withRetry(
            () =>
              workos.userManagement.createOrganizationMembership({
                organizationId: workosOrg.id,
                userId,
                ...(roleSlug ? { roleSlug } : {}),
              }),
            m.userId,
          );
          stats.membershipsCreated++;
        } catch (err) {
          if (roleSlug) {
            console.warn(`    role "${roleSlug}" rejected (${err.message}); using the default role`);
            try {
              await withRetry(
                () => workos.userManagement.createOrganizationMembership({ organizationId: workosOrg.id, userId }),
                m.userId,
              );
              stats.membershipsCreated++;
              continue;
            } catch (retryErr) {
              err = retryErr;
            }
          }
          console.error(`    FAILED membership ${m.userId}: ${err.message}`);
          stats.membershipsFailed++;
        }
      }
    }
  }

  console.log(`\n${tag}Done.`);
  console.table(stats);
  if (stats.usersFailed || stats.membershipsFailed) process.exitCode = 1;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
