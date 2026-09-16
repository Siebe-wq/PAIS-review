import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { getDoc, getDocSource, withGuideVersion } from '@/lib/doc';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFileSha, getGithubConfig, putFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Standalone pages editable from /admin. Reviews go through /api/admin/publish instead. */
const EDITABLE_PAGES = new Set(['about', 'methods', 'guide', 'instructions', 'prompt']);

/**
 * The three documents that together are "the method". They share one version number,
 * kept in the guide's frontmatter, and a change to any of them must bump it — reviews
 * record which version they were written under, and an unbumped edit makes older reviews
 * look like they met the current standard.
 */
const VERSIONED_PAGES = new Set(['guide', 'instructions', 'prompt']);

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** A page's current raw markdown, plus the methods version so the editor can offer the next one. */
export async function GET(request: Request) {
  const name = new URL(request.url).searchParams.get('name');
  if (!name || !EDITABLE_PAGES.has(name)) return fail('Unknown page.', 400);

  const content = getDocSource(name);
  if (content === undefined) return fail(`content/${name}.md does not exist.`, 404);

  return NextResponse.json({
    name,
    content,
    versioned: VERSIONED_PAGES.has(name),
    guideVersion: getDoc('guide')?.version ?? null,
  });
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

  let input: { name?: string; content?: string; version?: string };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  const name = input.name;
  if (!name || !EDITABLE_PAGES.has(name)) return fail('Unknown page.', 400);

  const content = (input.content ?? '').trim();
  if (!content.startsWith('---')) {
    return fail('The page must keep its --- frontmatter block at the top.', 400);
  }

  const today = new Date().toISOString().slice(0, 10);
  const currentVersion = getDoc('guide')?.version;

  // Work out what the guide file should end up containing. For the guide itself the
  // version comes from the pasted frontmatter; for the other versioned pages it comes
  // from the editor's version field and is written into the guide alongside the page.
  let guideUpdate: string | undefined;
  let saveContent = content;

  if (VERSIONED_PAGES.has(name)) {
    let newVersion: string | undefined;

    if (name === 'guide') {
      try {
        const value = (matter(content).data as Record<string, unknown>).version;
        newVersion = value == null ? undefined : String(value).trim();
      } catch {
        return fail("The guide's frontmatter is not valid YAML.", 400);
      }
      if (!newVersion) return fail('The guide needs a "version" field in its frontmatter.', 400);
    } else {
      newVersion = (input.version ?? '').trim() || undefined;
      if (!newVersion) {
        return fail(
          'This page is part of the versioned method. Give the new methods version to save it.',
          400,
        );
      }
    }

    if (currentVersion && newVersion === currentVersion) {
      return fail(
        `The method is still marked v${currentVersion}. Bump the version before saving — reviews record which version they were written under, and leaving it unchanged makes older reviews look current.`,
        409,
      );
    }

    if (name === 'guide') {
      // Stamp the date so it cannot drift from the version.
      saveContent = withGuideVersion(content, newVersion, today);
    } else {
      const guideSource = getDocSource('guide');
      if (!guideSource) return fail('content/guide.md is missing, so the version cannot be bumped.', 500);
      guideUpdate = withGuideVersion(guideSource, newVersion, today);
    }
  }

  const path = `content/${name}.md`;

  try {
    const sha = await getFileSha(github, path);
    const result = await putFile(github, path, `${saveContent}\n`, `Edit page: ${name}`, sha);

    if (guideUpdate) {
      const guideSha = await getFileSha(github, 'content/guide.md');
      await putFile(
        github,
        'content/guide.md',
        guideUpdate,
        `Bump methods version to ${input.version} (${name} changed)`,
        guideSha,
      );
    }

    return NextResponse.json({ ok: true, path, bumpedGuide: Boolean(guideUpdate), ...result });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Unexpected error talking to GitHub.', 502);
  }
}
