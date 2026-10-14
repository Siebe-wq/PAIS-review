import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFile, getGithubConfig, putFile } from '@/lib/github';
import { BACKLOG_PATH, mergeIntoBacklog, parseBacklog, serializeBacklog, validateSections } from '@/lib/backlog';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Read from the repository when publishing is set up, so a change shows before the rebuild. */
async function read(): Promise<{ source: string; sha: string | null }> {
  const github = getGithubConfig();
  if (github) {
    const file = await getFile(github, BACKLOG_PATH);
    return { source: file?.content ?? '', sha: file?.sha ?? null };
  }
  const local = path.join(process.cwd(), BACKLOG_PATH);
  return { source: fs.existsSync(local) ? fs.readFileSync(local, 'utf8') : '', sha: null };
}

/** What the panel needs: categories and items, without the hand-typed notes it does not edit. */
function forPanel(source: string) {
  return parseBacklog(source).sections.map(({ title, items }) => ({ title, items }));
}

export async function GET() {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);
  try {
    const { source, sha } = await read();
    return NextResponse.json({ sections: forPanel(source), sha });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Could not read the backlog.', 502);
  }
}

/**
 * Saves the whole list as the panel has it. The panel batches edits made in quick
 * succession — several drags, say — into one save, and sends a summary for the commit.
 */
export async function POST(request: Request) {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);
  const github = getGithubConfig();
  if (!github) return fail('Publishing is not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO.', 503);

  let input: { sections?: unknown; summary?: string; sha?: string | null };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  try {
    const sections = validateSections(input.sections);
    const { source, sha } = await read();
    // The sha the panel loaded must still be current, so two tabs cannot overwrite each other.
    if (input.sha && sha && input.sha !== sha) {
      return fail('The backlog changed since this page loaded. Reload to see the current list.', 409);
    }

    const next = serializeBacklog(mergeIntoBacklog(parseBacklog(source), sections));
    if (next === source) return NextResponse.json({ ok: true, sections: forPanel(next), sha, unchanged: true });

    const summary = String(input.summary ?? 'edit').replace(/\s+/g, ' ').trim().slice(0, 120) || 'edit';
    const result = await putFile(github, BACKLOG_PATH, next, `Backlog: ${summary}`, sha ?? undefined);
    return NextResponse.json({ ok: true, sections: forPanel(next), sha: result.sha ?? null });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    if (error instanceof Error) return fail(error.message, 400);
    return fail('Could not update the backlog.', 502);
  }
}
