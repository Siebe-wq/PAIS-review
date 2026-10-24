import fs from 'node:fs';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { isSignedIn } from '@/lib/session';
import { GithubError, getFile, getGithubConfig, putFile } from '@/lib/github';
import { getAllReviews } from '@/lib/reviews';
import { EMPTY_TAGS, TAGS_PATH, TAG_GROUPS, conditionTag, parseTagList, serialiseTagList, validateTagList, type TagList } from '@/lib/tags';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function fail(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}

/** How many reviews, drafts included, use each tag id. Conditions are matched by name. */
function usage(tags: TagList): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const review of getAllReviews({ includeDrafts: true })) {
    const conditionIds = (review.conditions ?? []).map((name) => conditionTag(name, tags)?.id);
    for (const id of [review.design, ...(review.topics ?? []), ...conditionIds]) {
      if (id) counts[id] = (counts[id] ?? 0) + 1;
    }
  }
  return counts;
}

async function readTags(): Promise<{ tags: TagList; sha: string | null; problems: string[] }> {
  const github = getGithubConfig();
  let raw = '{}';
  let sha: string | null = null;
  if (github) {
    const file = await getFile(github, TAGS_PATH);
    if (file) {
      raw = file.content;
      sha = file.sha;
    }
  } else {
    const local = path.join(process.cwd(), TAGS_PATH);
    if (fs.existsSync(local)) raw = fs.readFileSync(local, 'utf8');
  }
  let parsed: unknown = {};
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { tags: EMPTY_TAGS, sha, problems: [`${TAGS_PATH} is not valid JSON.`] };
  }
  return { ...parseTagList(parsed), sha };
}

/** The list as it stands in the repository, the sha it was read at, and how often each tag is used. */
export async function GET() {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);
  try {
    const { tags, sha, problems } = await readTags();
    return NextResponse.json({ tags, sha, problems, usage: usage(tags), canPublish: Boolean(getGithubConfig()) });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Could not read the tag list.', 502);
  }
}

export async function POST(request: Request) {
  if (!(await isSignedIn())) return fail('Sign in first.', 401);
  const github = getGithubConfig();
  if (!github) return fail('Publishing is not configured.', 503);

  let input: { tags?: unknown; sha?: string | null };
  try {
    input = await request.json();
  } catch {
    return fail('Could not read the request.', 400);
  }

  const checked = validateTagList(input.tags);
  if ('error' in checked) return fail(checked.error, 400);
  const next = checked.tags;

  try {
    const current = await readTags();
    // A tag still on a review cannot go: the review would silently lose it. Take it off the
    // reviews first (Reviews tab), then remove it here.
    const kept = new Set(TAG_GROUPS.flatMap((group) => next[group].map((t) => t.id)));
    const counts = usage(current.tags);
    const inUse = TAG_GROUPS.flatMap((group) => current.tags[group]).filter((t) => !kept.has(t.id) && counts[t.id]);
    if (inUse.length) {
      const names = inUse.map((t) => `"${t.label}" (${counts[t.id]})`).join(', ');
      return fail(`Still used on reviews, so not removed: ${names}. Take it off those reviews first.`, 400);
    }
    // Reviews hold conditions by name, so renaming one in use would leave them behind.
    const renamed = current.tags.conditions.filter(
      (t) => counts[t.id] && next.conditions.some((n) => n.id === t.id && n.label !== t.label),
    );
    if (renamed.length) {
      return fail(`"${renamed[0].label}" is on ${counts[renamed[0].id]} review(s), so it cannot be renamed.`, 400);
    }

    const before = serialiseTagList(current.tags);
    const after = serialiseTagList(next);
    if (before === after) return fail('Nothing has changed.', 400);

    const result = await putFile(github, TAGS_PATH, after, 'Tags: update the list', input.sha ?? current.sha ?? undefined);
    return NextResponse.json({ ok: true, tags: next, ...result });
  } catch (error) {
    if (error instanceof GithubError) return fail(error.message, error.status);
    return fail('Unexpected error talking to GitHub.', 502);
  }
}
