import { NextResponse } from 'next/server';
import { HUMAN_INPUT_LEVELS, isHumanInput } from '@/lib/types';
import { setFrontmatterField } from '@/lib/frontmatter';
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
    humanInput: review.humanInput ?? null,
    preprint: Boolean(review.preprint),
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

  let input: { slug?: string; action?: 'withdraw' | 'restore' | 'humanInput'; humanInput?: string };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  const slug = input.slug ?? '';
  if (!/^[a-z0-9-]+$/.test(slug)) return fail('Bad slug.', 400);
  if (input.action !== 'withdraw' && input.action !== 'restore' && input.action !== 'humanInput') {
    return fail('Unknown action.', 400);
  }
  if (input.action === 'humanInput' && !isHumanInput(input.humanInput)) {
    return fail(`Human input must be one of ${HUMAN_INPUT_LEVELS.join(', ')}.`, 400);
  }

  const path = `content/reviews/${slug}.md`;

  try {
    // Read from GitHub, not local disk: the deployed copy can be a commit behind and this
    // must not clobber an edit that has not deployed yet.
    const file = await getFile(github, path);
    if (!file) return fail('That review does not exist in the repository.', 404);

    let updated: string;
    let message: string;
    if (input.action === 'humanInput') {
      updated = setFrontmatterField(file.content, 'humanInput', input.humanInput as string);
      message = `Human input ${input.humanInput}: ${slug}`;
    } else if (input.action === 'withdraw') {
      updated = setFrontmatterField(file.content, 'draft', true);
      message = `Withdraw review: ${slug}`;
    } else {
      updated = setFrontmatterField(file.content, 'draft', null);
      message = `Restore review: ${slug}`;
    }
    const data = matter(updated).data as Record<string, unknown>;

    const result = await putFile(github, path, updated, message, file.sha);

    return NextResponse.json({
      ok: true,
      slug,
      draft: data.draft === true,
      humanInput: data.humanInput ?? null,
      ...result,
    });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    if (error instanceof Error && /frontmatter/.test(error.message)) return fail(error.message, 422);
    return fail('Unexpected error talking to GitHub.', 502);
  }
}
