import { NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/db';
import { vote, type VoteAxis } from '@/lib/comments';
import { attachVoter, newVoter, readVoter } from '@/lib/voter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Comments are not set up.' }, { status: 503 });

  let input: { commentId?: number; axis?: string; value?: number };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 });
  }

  const commentId = Number(input.commentId);
  const axis = input.axis;
  const value = Number(input.value);
  if (!Number.isInteger(commentId) || commentId <= 0) return NextResponse.json({ error: 'Bad comment.' }, { status: 400 });
  if (axis !== 'karma' && axis !== 'agree') return NextResponse.json({ error: 'Bad axis.' }, { status: 400 });
  if (![-1, 0, 1].includes(value)) return NextResponse.json({ error: 'Bad value.' }, { status: 400 });

  const voter = readVoter(request) ?? newVoter();
  try {
    await vote(commentId, voter, axis as VoteAxis, value as -1 | 0 | 1);
  } catch {
    return NextResponse.json({ error: 'That comment does not exist.' }, { status: 404 });
  }

  const response = NextResponse.json({ ok: true });
  attachVoter(response, voter);
  return response;
}
