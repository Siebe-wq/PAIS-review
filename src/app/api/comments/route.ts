import { NextResponse } from 'next/server';
import { dbConfigured, describeDbError } from '@/lib/db';
import { createComment, isRateLimited, listComments, validateComment, type TargetType } from '@/lib/comments';
import { getDoc } from '@/lib/doc';
import { getReview } from '@/lib/reviews';
import { isSignedIn } from '@/lib/session';
import { attachVoter, clientIp, newVoter, readVoter } from '@/lib/voter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

function parseTarget(type: string | null, slug: string | null): { type: TargetType; slug: string } | null {
  if (type === 'guide') return { type, slug: 'guide' };
  if (type === 'review' && slug && /^[a-z0-9-]+$/.test(slug) && getReview(slug)) return { type, slug };
  return null;
}

/** The version a comment is about: the guide's for the guide, the review's guide version for a review. */
function versionFor(target: { type: TargetType; slug: string }): string | null {
  if (target.type === 'guide') return getDoc('guide')?.version ?? null;
  return getReview(target.slug)?.guideVersion ?? null;
}

export async function GET(request: Request) {
  if (!dbConfigured()) return NextResponse.json({ configured: false, comments: [] });

  const url = new URL(request.url);
  const target = parseTarget(url.searchParams.get('type'), url.searchParams.get('slug'));
  if (!target) return fail('Unknown target.', 400);

  const admin = await isSignedIn();
  try {
    const comments = await listComments(target.type, target.slug, readVoter(request), { includeHidden: admin });
    return NextResponse.json({ configured: true, admin, comments, version: versionFor(target) });
  } catch (error) {
    // Configured but not answering. Say so, so the page can show a notice instead of nothing.
    return NextResponse.json({ configured: true, error: describeDbError(error) }, { status: 503 });
  }
}

export async function POST(request: Request) {
  if (!dbConfigured()) return fail('Comments are not set up on this site yet.', 503);

  let input: { type?: string; slug?: string; parentId?: number | null; username?: string; body?: string; website?: string };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  // Honeypot: real people never see this field, so anything in it is a bot.
  if (input.website) return NextResponse.json({ ok: true, id: 0 });

  const target = parseTarget(input.type ?? null, input.slug ?? null);
  if (!target) return fail('Unknown target.', 400);

  const username = String(input.username ?? '');
  const body = String(input.body ?? '');
  const problem = validateComment({ username, body });
  if (problem) return fail(problem, 400);

  const parentId = input.parentId == null ? null : Number(input.parentId);
  if (parentId !== null && !Number.isInteger(parentId)) return fail('Bad parent.', 400);

  const voter = readVoter(request) ?? newVoter();
  const ip = clientIp(request);

  const limited = await isRateLimited(voter, ip, body);
  if (limited) return fail(limited, 429);

  try {
    const id = await createComment({
      targetType: target.type,
      targetSlug: target.slug,
      targetVersion: versionFor(target),
      parentId,
      username,
      body,
      voter,
      ip,
    });
    const response = NextResponse.json({ ok: true, id });
    attachVoter(response, voter);
    return response;
  } catch (error) {
    return fail(error instanceof Error ? error.message : 'Could not post the comment.', 400);
  }
}
