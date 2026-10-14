import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFile, getGithubConfig, putFile } from '@/lib/github';
import { SITE_TEXT_PATH } from '@/lib/site-text';
import {
  DEFAULTS,
  FIELDS,
  KEYS,
  checkValue,
  isKey,
  normalise,
  parseOverrides,
  serialiseOverrides,
  type SiteText,
  type SiteTextKey,
} from '@/lib/site-text-schema';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(message: string, status: number, extra: Record<string, unknown> = {}) {
  return NextResponse.json({ error: message, ...extra }, { status });
}

/**
 * The stored overrides, and the sha they were read at. Read from the repository when
 * publishing is configured, so a save made a minute ago shows up before the site has
 * rebuilt; the sha then lets the save refuse to overwrite a newer version.
 */
export async function GET() {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);

  const github = getGithubConfig();
  let raw = '{}';
  let sha: string | undefined;

  try {
    if (github) {
      const file = await getFile(github, SITE_TEXT_PATH);
      if (file) {
        raw = file.content;
        sha = file.sha;
      }
    } else {
      const local = path.join(process.cwd(), SITE_TEXT_PATH);
      if (fs.existsSync(local)) raw = fs.readFileSync(local, 'utf8');
    }
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Could not read the current site text.', 502);
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }
  const { overrides, problems } = parseOverrides(parsed);
  return NextResponse.json({ overrides, sha: sha ?? null, problems, canPublish: Boolean(github) });
}

export async function POST(request: Request) {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);

  const github = getGithubConfig();
  if (!github) {
    return fail('Publishing is not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO.', 503);
  }

  let input: { values?: Record<string, unknown>; sha?: string | null };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }
  if (!input.values || typeof input.values !== 'object') return fail('Nothing to save.', 400);

  const values: Partial<SiteText> = {};
  const fieldErrors: Partial<Record<SiteTextKey, string>> = {};
  for (const [key, value] of Object.entries(input.values)) {
    if (!isKey(key)) continue;
    if (typeof value !== 'string') {
      fieldErrors[key] = 'Must be text.';
      continue;
    }
    const clean = normalise(value);
    const problem = checkValue(key, clean);
    if (problem) fieldErrors[key] = problem;
    else values[key] = clean;
  }
  if (Object.keys(fieldErrors).length) {
    return fail('Some fields need fixing before this can be saved.', 400, { fieldErrors });
  }

  // Anything the form did not send keeps its default.
  const next = serialiseOverrides(values);

  let previous: Partial<SiteText> = {};
  try {
    const current = await getFile(github, SITE_TEXT_PATH);
    if (current) previous = parseOverrides(JSON.parse(current.content)).overrides;
  } catch {
    // Only used to name the changed fields in the commit message.
  }

  const changed = KEYS.filter((key) => (values[key] ?? DEFAULTS[key]) !== (previous[key] ?? DEFAULTS[key]));
  if (changed.length === 0) return fail('Nothing has changed.', 400);

  const names = changed.map((key) => FIELDS[key].label.toLowerCase());
  const message = `Site text: ${names.length > 4 ? `${names.slice(0, 4).join(', ')} and ${names.length - 4} more` : names.join(', ')}`;

  try {
    // Passing the sha the editor loaded makes GitHub refuse the write if the file has
    // moved on since — someone else's save is never silently overwritten.
    const result = await putFile(github, SITE_TEXT_PATH, next, message, input.sha ?? undefined);
    return NextResponse.json({ ok: true, changed, ...result });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Unexpected error talking to GitHub.', 502);
  }
}
