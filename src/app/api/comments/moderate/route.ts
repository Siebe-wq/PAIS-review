import { NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/db';
import { countSubtree, deleteComment, setHidden } from '@/lib/comments';
import { isSignedIn } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Moderate one comment. Admin only.
 *
 * hide / unhide keeps the row, so replies to it are not orphaned.
 * remove deletes it and everything under it. `count` asks how many that would be,
 * without changing anything, so the page can warn first.
 */
export async function POST(request: Request) {
  if (!(await isSignedIn())) return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
  if (!dbConfigured()) return NextResponse.json({ error: 'Comments are not set up.' }, { status: 503 });

  let input: { commentId?: number; action?: string; hidden?: boolean };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 });
  }

  const commentId = Number(input.commentId);
  if (!Number.isInteger(commentId) || commentId <= 0) {
    return NextResponse.json({ error: 'Bad comment.' }, { status: 400 });
  }

  // `hidden` is the older shape of this request; `action` is the current one.
  const action = input.action ?? (input.hidden === false ? 'unhide' : 'hide');

  switch (action) {
    case 'hide':
    case 'unhide':
      await setHidden(commentId, action === 'hide');
      return NextResponse.json({ ok: true });
    case 'count':
      return NextResponse.json({ ok: true, count: await countSubtree(commentId) });
    case 'remove': {
      const removed = await deleteComment(commentId);
      if (removed === 0) return NextResponse.json({ error: 'That comment is already gone.' }, { status: 404 });
      return NextResponse.json({ ok: true, removed });
    }
    default:
      return NextResponse.json({ error: 'Unknown action.' }, { status: 400 });
  }
}
