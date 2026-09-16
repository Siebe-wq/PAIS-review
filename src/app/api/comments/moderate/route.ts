import { NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/db';
import { setHidden } from '@/lib/comments';
import { isSignedIn } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/** Hide or unhide a comment. Admin only. Hidden comments keep their place in a thread. */
export async function POST(request: Request) {
  if (!(await isSignedIn())) return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
  if (!dbConfigured()) return NextResponse.json({ error: 'Comments are not set up.' }, { status: 503 });

  let input: { commentId?: number; hidden?: boolean };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 });
  }

  const commentId = Number(input.commentId);
  if (!Number.isInteger(commentId) || commentId <= 0) return NextResponse.json({ error: 'Bad comment.' }, { status: 400 });

  await setHidden(commentId, Boolean(input.hidden));
  return NextResponse.json({ ok: true });
}
