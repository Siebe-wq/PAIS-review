import { NextResponse } from 'next/server';
import matter from 'gray-matter';
import { getAllReviews } from '@/lib/reviews';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFile, getGithubConfig, putFile } from '@/lib/github';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** Every review, drafts included, with the fields the admin list needs. */
export async function GET() {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);

  const reviews = getAllReviews({ includeDrafts: true }).map((review) => ({
    slug: review.slug,
    title: review.title,
    kind: review.kind,
    draft: Boolean(review.draft),
    reviewedOn: review.reviewedOn,
    guideVersion: review.guideVersion ?? null,
    guideNotes: review.guideNotes ?? [],
  }));

  return NextResponse.json({ reviews });
}

/**
 * Withdraw or restore a review. Withdrawing sets `draft: true` rather than deleting the
 * file: the review disappears from the site and its raw URL immediately, it can be put
 * back with one click, and the history stays honest. A takedown that needs the text gone
 * from the repository entirely is a git operation, done deliberately, not a button.
 */
export async function POST(request: Request) {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);

  const github = getGithubConfig();
  if (!github) return fail('Publishing is not configured.', 503);

  let input: { slug?: string; action?: 'withdraw' | 'restore' };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  const slug = input.slug ?? '';
  if (!/^[a-z0-9-]+$/.test(slug)) return fail('Bad slug.', 400);
  if (input.action !== 'withdraw' && input.action !== 'restore') return fail('Unknown action.', 400);

  const path = `content/reviews/${slug}.md`;

  try {
    // Read from GitHub, not local disk: the deployed copy can be a commit behind and this
    // must not clobber an edit that has not deployed yet.
    const file = await getFile(github, path);
    if (!file) return fail('That review does not exist in the repository.', 404);

    const parsed = matter(file.content);
    const data = parsed.data as Record<string, unknown>;
    if (input.action === 'withdraw') data.draft = true;
    else delete data.draft;

    const updated = matter.stringify(parsed.content, data);
    const result = await putFile(
      github,
      path,
      updated,
      `${input.action === 'withdraw' ? 'Withdraw' : 'Restore'} review: ${slug}`,
      file.sha,
    );

    return NextResponse.json({ ok: true, slug, draft: input.action === 'withdraw', ...result });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Unexpected error talking to GitHub.', 502);
  }
}
