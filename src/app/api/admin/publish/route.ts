import { NextResponse } from 'next/server';
import { buildReviewFile } from '@/lib/publish';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFileSha, getGithubConfig, putFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
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

  let input: { body?: string; slug?: string; overwrite?: boolean };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  let built;
  try {
    built = buildReviewFile(input.body ?? '', input.slug);
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Could not build the review.', 400);
  }

  const path = `content/reviews/${built.slug}.md`;

  try {
    const sha = await getFileSha(github, path);
    if (sha && !input.overwrite) {
      return NextResponse.json(
        {
          error: `A review already exists at ${built.slug}.md. Tick "replace" to overwrite it.`,
          exists: true,
        },
        { status: 409 },
      );
    }

    const result = await putFile(
      github,
      path,
      built.markdown,
      `${sha ? 'Update' : 'Publish'} review: ${built.review.title}`,
      sha,
    );

    return NextResponse.json({ ok: true, slug: built.slug, path, ...result });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Unexpected error talking to GitHub.', 502);
  }
}
