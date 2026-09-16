import { NextResponse } from 'next/server';
import { buildReviewFile, passwordMatches, type PublishInput } from '@/lib/publish';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const GITHUB_API = 'https://api.github.com';

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

async function githubFetch(path: string, token: string, init?: RequestInit) {
  return fetch(`${GITHUB_API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    cache: 'no-store',
  });
}

export async function POST(request: Request) {
  const adminPassword = process.env.ADMIN_PASSWORD;
  const token = process.env.GITHUB_TOKEN;
  const repo = process.env.GITHUB_REPO;
  const branch = process.env.GITHUB_BRANCH || 'main';

  if (!adminPassword || !token || !repo) {
    return fail(
      'Publishing is not configured. Set ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO.',
      503,
    );
  }

  let input: PublishInput & { password?: string; overwrite?: boolean };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  if (typeof input.password !== 'string' || !passwordMatches(input.password, adminPassword)) {
    return fail('Wrong password.', 401);
  }

  let built;
  try {
    built = buildReviewFile(input);
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Could not build the review.', 400);
  }

  const path = `content/reviews/${built.slug}.md`;
  const query = `?ref=${encodeURIComponent(branch)}`;

  const existing = await githubFetch(`/repos/${repo}/contents/${path}${query}`, token);
  let sha: string | undefined;

  if (existing.ok) {
    if (!input.overwrite) {
      return NextResponse.json(
        { error: `A review already exists at ${path}. Tick "replace" to overwrite it.`, exists: true },
        { status: 409 },
      );
    }
    const json = (await existing.json()) as { sha?: string };
    sha = json.sha;
  } else if (existing.status !== 404) {
    const detail = await existing.text();
    return fail(`GitHub rejected the read (${existing.status}): ${detail.slice(0, 300)}`, 502);
  }

  const commit = await githubFetch(`/repos/${repo}/contents/${path}`, token, {
    method: 'PUT',
    body: JSON.stringify({
      message: `${sha ? 'Update' : 'Publish'} review: ${built.title}`.slice(0, 200),
      content: Buffer.from(built.markdown, 'utf8').toString('base64'),
      branch,
      ...(sha ? { sha } : {}),
    }),
  });

  if (!commit.ok) {
    const detail = await commit.text();
    return fail(`GitHub rejected the commit (${commit.status}): ${detail.slice(0, 300)}`, 502);
  }

  const result = (await commit.json()) as { commit?: { html_url?: string } };

  return NextResponse.json({
    ok: true,
    slug: built.slug,
    path,
    replaced: Boolean(sha),
    commitUrl: result.commit?.html_url,
  });
}
