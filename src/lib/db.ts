import { Pool, type QueryResultRow } from 'pg';

/**
 * One Postgres pool per server instance. Vercel's Neon integration sets DATABASE_URL
 * (pooled); a plain Postgres URL works the same locally. Without either, comments and
 * ratings simply do not appear — the rest of the site does not depend on this.
 */
function connectionString(): string | undefined {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || undefined;
}

export function dbConfigured(): boolean {
  return Boolean(connectionString());
}

let pool: Pool | undefined;

function getPool(): Pool {
  const url = connectionString();
  if (!url) throw new Error('DATABASE_URL is not set.');
  if (!pool) {
    pool = new Pool({
      connectionString: url,
      max: 3,
      // Neon and most hosted Postgres need TLS; a local server does not offer it.
      ssl: /localhost|127\.0\.0\.1/.test(url) ? undefined : { rejectUnauthorized: false },
    });
  }
  return pool;
}

export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<T[]> {
  await ensureSchema();
  const result = await getPool().query<T>(text, params);
  return result.rows;
}

const SCHEMA = `
create table if not exists comments (
  id             bigserial primary key,
  target_type    text not null,
  target_slug    text not null,
  target_version text,
  parent_id      bigint references comments(id) on delete cascade,
  username       text not null,
  body           text not null,
  voter          text not null,
  ip             text,
  hidden         boolean not null default false,
  created_at     timestamptz not null default now()
);
create index if not exists comments_target_idx on comments (target_type, target_slug, created_at);
create index if not exists comments_voter_recent_idx on comments (voter, created_at);

create table if not exists comment_votes (
  comment_id bigint not null references comments(id) on delete cascade,
  voter      text not null,
  axis       text not null check (axis in ('karma', 'agree')),
  value      smallint not null check (value in (-1, 1)),
  primary key (comment_id, voter, axis)
);

create table if not exists ratings (
  review_slug text not null,
  voter       text not null,
  stars       smallint not null check (stars between 1 and 5),
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  primary key (review_slug, voter)
);
`;

let schemaReady: Promise<void> | undefined;

/** Creates the tables on first use. Idempotent, and memoised per server instance. */
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = getPool()
      .query(SCHEMA)
      .then(() => undefined)
      .catch((error) => {
        schemaReady = undefined;
        throw error;
      });
  }
  return schemaReady;
}

/**
 * A plain-English reason for a failed connection, safe to show publicly: never the
 * host, user or password, only what kind of thing went wrong. The codes are the ones
 * `pg` and Node put on the error.
 */
export function describeDbError(error: unknown): string {
  const code = typeof error === 'object' && error && 'code' in error ? String((error as { code: unknown }).code) : '';
  switch (code) {
    case 'ENOTFOUND':
    case 'EAI_AGAIN':
      return 'The database host name could not be resolved. Check DATABASE_URL.';
    case 'ECONNREFUSED':
    case 'ETIMEDOUT':
    case 'ECONNRESET':
      return 'The database did not answer. It may be paused, or the URL points somewhere wrong.';
    case '28P01':
    case '28000':
      return 'The database rejected the username or password in DATABASE_URL.';
    case '3D000':
      return 'The database named in DATABASE_URL does not exist.';
    case '42501':
      return 'The database user is not allowed to create tables.';
    default:
      return code ? `Database error ${code}.` : 'Could not reach the database.';
  }
}

/** Runs one trivial query so a status page can say whether the database answers. */
export async function pingDb(): Promise<void> {
  await query('select 1');
}
