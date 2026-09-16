import { NextResponse } from 'next/server';
import { normaliseReview, normaliserIsConfigured } from '@/lib/normalise';
import { isSignedIn } from '@/lib/session';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 120;

/** Converts a pasted review into the house format. Signed-in only: it spends money. */
export async function POST(request: Request) {
  if (!(await isSignedIn())) {
    return NextResponse.json({ error: 'Sign in first.' }, { status: 401 });
  }

  if (!normaliserIsConfigured()) {
    return NextResponse.json(
      { error: 'Tidying is not configured. Set ANTHROPIC_API_KEY in the Vercel project.' },
      { status: 503 },
    );
  }

  let input: { raw?: string };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 });
  }

  try {
    const { markdown, scoreMissing } = await normaliseReview(input.raw ?? '');
    return NextResponse.json({ ok: true, markdown, scoreMissing });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Could not convert the review.';
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
