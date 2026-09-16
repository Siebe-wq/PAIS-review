import { NextResponse } from 'next/server';
import { getDocSource } from '@/lib/doc';
import { passwordMatches } from '@/lib/publish';
import { GithubError, getFileSha, getGithubConfig, putFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Standalone pages editable from /admin. Reviews go through /api/admin/publish instead. */
const EDITABLE_PAGES = new Set(['about', 'guide']);

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Returns the page's current raw markdown, frontmatter included. No password needed — it's the same text already public on the live page. */
export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get('name');
  if (!name || !EDITABLE_PAGES.has(name)) return fail('Unknown page.', 400);

  const content = getDocSource(name);
  if (content === undefined) return fail(`content/${name}.md does not exist.`, 404);

  return NextResponse.json({ name, content });
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const github = getGithubConfig();

  if (!adminPassword || !github) {
    return fail(
      'Publishing is not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO.',
      503,
    );
  }

  let input: { name?: string; content?: string; password?: string };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  if (!input.name || !EDITABLE_PAGES.has(input.name)) return fail('Unknown page.', 400);
  if (typeof input.password !== 'string' || !passwordMatches(input.password, adminPassword)) {
    return fail('Wrong password.', 401);
  }

  const content = (input.content ?? '').trim();
  if (!content.startsWith('---')) {
    return fail('The page must keep its --- frontmatter block at the top.', 400);
  }

  const path = `content/${input.name}.md`;

  try {
    const sha = await getFileSha(github, path);
    const result = await putFile(github, path, `${content}\n`, `Edit page: ${input.name}`, sha);
    return NextResponse.json({ ok: true, path, ...result });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Unexpected error talking to GitHub.', 502);
  }
}
