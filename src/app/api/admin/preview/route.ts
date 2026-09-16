import { NextResponse } from 'next/server';
import { buildReviewFile } from '@/lib/publish';
import { currentGuideVersion } from '@/lib/doc';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Parses a pasted review and hands back what would be committed, without committing it.
 * No password: it only reads the caller's own text and writes nothing.
 */
export async function POST(request: Request) {
  let input: { body?: string; slug?: string };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 });
  }

  try {
    const { slug, review } = buildReviewFile(input.body ?? '', input.slug, currentGuideVersion());
    return NextResponse.json({ ok: true, slug, review });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Could not parse the review.' },
      { status: 400 },
    );
  }
}
