import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { getDoc, getDocSource } from '@/lib/doc';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFileSha, getGithubConfig, putFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Standalone pages editable from /admin. Reviews go through /api/admin/publish instead. */
const EDITABLE_PAGES = new Set(['about', 'guide', 'instructions']);

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
  if (!(await isSignedIn())) return fail('Sign in first.', 401);

  const github = getGithubConfig();
  if (!github) {
    return fail(
      'Publishing is not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO.',
      503,
    );
  }

  let input: { name?: string; content?: string };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  if (!input.name || !EDITABLE_PAGES.has(input.name)) return fail('Unknown page.', 400);

  const content = (input.content ?? '').trim();
  if (!content.startsWith('---')) {
    return fail('The page must keep its --- frontmatter block at the top.', 400);
  }

  // Reviews are stamped with the guide version they were written under, so an edit that
  // silently leaves the version alone breaks the only signal a reader has that a review
  // predates the current standard. Compares against the deployed copy, which is a commit
  // behind at worst — enough to catch forgetting, which is the actual failure mode.
  if (input.name === 'guide') {
    let submittedVersion: string | undefined;
    try {
      const value = (matter(content).data as Record<string, unknown>).version;
      submittedVersion = value == null ? undefined : String(value).trim();
    } catch {
      return fail('The guide\'s frontmatter is not valid YAML.', 400);
    }

    if (!submittedVersion) {
      return fail('The guide needs a "version" field in its frontmatter.', 400);
    }

    const currentVersion = getDoc('guide')?.version;
    if (currentVersion && submittedVersion === currentVersion) {
      return fail(
        `The guide is still marked v${currentVersion}. Bump the version before saving — reviews record which version they were written under, and leaving it unchanged makes older reviews look current.`,
        409,
      );
    }
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
