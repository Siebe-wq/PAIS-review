import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFile, getGithubConfig, putFile } from '@/lib/github';
import { BACKLOG_PATH, addBacklogItem, cleanItemText, parseBacklog, setBacklogItemDone } from '@/lib/backlog';

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

export async function GET() {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);
  try {
    const { source, sha } = await read();
    return NextResponse.json({ sections: parseBacklog(source), sha });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Could not read the backlog.', 502);
  }
}

export async function POST(request: Request) {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);
  const github = getGithubConfig();
  if (!github) return fail('Publishing is not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO.', 503);

  let input: { action?: string; section?: string; text?: string; done?: boolean; sha?: string | null };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }
  const section = String(input.section ?? '').trim();
  const text = cleanItemText(String(input.text ?? ''));
  if (!section || section.length > 60 || /\n/.test(section)) return fail('Choose a section.', 400);

  try {
    const { source, sha } = await read();
    // The sha the page loaded must still be current, so two tabs cannot overwrite each other.
    if (input.sha && sha && input.sha !== sha) {
      return fail('The backlog changed since this page loaded. Reload to see the current list.', 409);
    }

    let next: string;
    let message: string;
    if (input.action === 'add') {
      next = addBacklogItem(source, section, text);
      message = `Backlog: add "${text.slice(0, 60)}"`;
    } else if (input.action === 'toggle') {
      next = setBacklogItemDone(source, section, text, Boolean(input.done), new Date().toISOString().slice(0, 10));
      message = `Backlog: ${input.done ? 'done' : 'reopen'} "${text.slice(0, 60)}"`;
    } else {
      return fail('Unknown action.', 400);
    }

    const result = await putFile(github, BACKLOG_PATH, next, message, sha ?? undefined);
    return NextResponse.json({ ok: true, sections: parseBacklog(next), sha: result.sha ?? null });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    if (error instanceof Error) return fail(error.message, 400);
    return fail('Could not update the backlog.', 502);
  }
}
