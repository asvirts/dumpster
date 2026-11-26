import { describe, expect, test } from 'bun:test';
import { orgRemapStatements, userRemapStatements } from './auth-remap';

describe('userRemapStatements', () => {
  test('covers every column that stores a user id', () => {
    const sql = userRemapStatements('user_2clerk', 'user_01WORKOS').map((s) => s.sql);
    expect(sql).toEqual([
      'UPDATE operators SET claim_requested_by_user_id = ?2 WHERE claim_requested_by_user_id = ?1',
      'UPDATE leads SET passed_by = ?2 WHERE passed_by = ?1',
      'UPDATE admin_audit SET actor = ?2 WHERE actor = ?1',
    ]);
  });

  test('binds clerk id first, workos id second', () => {
    for (const s of userRemapStatements('user_2clerk', 'user_01WORKOS')) {
      expect(s.params).toEqual(['user_2clerk', 'user_01WORKOS']);
    }
  });

  test('no-op without an external id or when ids already match', () => {
    expect(userRemapStatements(null, 'user_01WORKOS')).toEqual([]);
    expect(userRemapStatements('', 'user_01WORKOS')).toEqual([]);
    expect(userRemapStatements('user_01WORKOS', 'user_01WORKOS')).toEqual([]);
  });
});

describe('orgRemapStatements', () => {
  test('remaps the operator org and audit notes', () => {
    const stmts = orgRemapStatements('org_2clerk', 'org_01WORKOS');
    expect(stmts).toHaveLength(2);
    expect(stmts[0].sql).toContain('UPDATE operators SET clerk_org_id = ?2 WHERE clerk_org_id = ?1');
    // Unique index guard: never collide with a row that already has the WorkOS id.
    expect(stmts[0].sql).toContain('NOT EXISTS (SELECT 1 FROM operators WHERE clerk_org_id = ?2)');
    expect(stmts[1].sql).toContain('REPLACE(notes, ?1, ?2)');
    for (const s of stmts) expect(s.params).toEqual(['org_2clerk', 'org_01WORKOS']);
  });

  test('no-op for orgs created in WorkOS (no external id)', () => {
    expect(orgRemapStatements(null, 'org_01WORKOS')).toEqual([]);
    expect(orgRemapStatements(undefined, 'org_01WORKOS')).toEqual([]);
  });
});

describe('remap SQL against the D1 schema', () => {
  // Apply the real migrations to in-memory SQLite (same dialect as D1).
  async function freshDb() {
    const { Database } = await import('bun:sqlite');
    const { readdirSync, readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const dir = join(import.meta.dir, '../../migrations');
    const db = new Database(':memory:');
    for (const f of readdirSync(dir).filter((n) => n.endsWith('.sql')).sort()) {
      db.exec(readFileSync(join(dir, f), 'utf8').replaceAll('--> statement-breakpoint', ''));
    }
    return db;
  }

  function run(db: import('bun:sqlite').Database, stmts: { sql: string; params: string[] }[]) {
    let changes = 0;
    for (const s of stmts) changes += db.prepare(s.sql).run(...s.params).changes;
    return changes;
  }

  test('rewrites Clerk ids once and is idempotent', async () => {
    const db = await freshDb();
    db.exec(`INSERT INTO operators (id, name, slug, clerk_org_id, claim_requested_by_user_id, claim_status)
      VALUES ('op1', 'Acme', 'acme', 'org_2clerk', 'user_2clerk', 'approved')`);
    db.exec(`INSERT INTO leads (id, seeker_name, seeker_email, operator_id, passed_by)
      VALUES ('l1', 'S', 's@example.com', 'op1', 'user_2clerk'), ('l2', 'S', 's@example.com', 'op1', 'auto-buy')`);
    db.exec(`INSERT INTO admin_audit (id, action, entity_type, actor, notes)
      VALUES ('a1', 'claim_auto_approve', 'operator', 'user_2clerk', 'org org_2clerk; verified email matched listing')`);

    const stmts = [
      ...userRemapStatements('user_2clerk', 'user_01W'),
      ...orgRemapStatements('org_2clerk', 'org_01W'),
    ];
    expect(run(db, stmts)).toBe(5);
    expect(run(db, stmts)).toBe(0);

    expect(db.query('SELECT clerk_org_id o, claim_requested_by_user_id u FROM operators').get()).toEqual({
      o: 'org_01W',
      u: 'user_01W',
    });
    expect(db.query('SELECT id, passed_by FROM leads ORDER BY id').all()).toEqual([
      { id: 'l1', passed_by: 'user_01W' },
      { id: 'l2', passed_by: 'auto-buy' },
    ]);
    expect(db.query('SELECT actor, notes FROM admin_audit').get()).toEqual({
      actor: 'user_01W',
      notes: 'org org_01W; verified email matched listing',
    });
  });

  test('does not violate the unique org index', async () => {
    const db = await freshDb();
    db.exec(`INSERT INTO operators (id, name, slug, clerk_org_id) VALUES
      ('op1', 'A', 'a', 'org_2clerk'), ('op2', 'B', 'b', 'org_01W')`);
    expect(() => run(db, orgRemapStatements('org_2clerk', 'org_01W'))).not.toThrow();
    expect(db.query("SELECT clerk_org_id o FROM operators WHERE id = 'op1'").get()).toEqual({ o: 'org_2clerk' });
  });
});
