import { NextResponse } from 'next/server';
import { dbConfigured } from '@/lib/db';
import { getRating, setRating } from '@/lib/comments';
import { getReview } from '@/lib/reviews';
import { attachVoter, newVoter, readVoter } from '@/lib/voter';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function validSlug(slug: string | null): slug is string {
  return Boolean(slug && /^[a-z0-9-]+$/.test(slug) && getReview(slug));
}

export async function GET(request: Request) {
  if (!dbConfigured()) return NextResponse.json({ configured: false });
  const slug = new URL(request.url).searchParams.get('slug');
  if (!validSlug(slug)) return NextResponse.json({ error: 'Unknown review.' }, { status: 400 });
  return NextResponse.json({ configured: true, ...(await getRating(slug, readVoter(request))) });
}

export async function POST(request: Request) {
  if (!dbConfigured()) return NextResponse.json({ error: 'Ratings are not set up.' }, { status: 503 });

  let input: { slug?: string; stars?: number };
  try {
    input = await request.json();
  } catch {
    return NextResponse.json({ error: 'Could not read the request.' }, { status: 400 });
  }

  const slug = input.slug ?? null;
  const stars = Number(input.stars);
  if (!validSlug(slug)) return NextResponse.json({ error: 'Unknown review.' }, { status: 400 });
  if (!Number.isInteger(stars) || stars < 1 || stars > 5) return NextResponse.json({ error: 'Stars must be 1 to 5.' }, { status: 400 });

  const voter = readVoter(request) ?? newVoter();
  await setRating(slug, voter, stars);

  const response = NextResponse.json({ ok: true, ...(await getRating(slug, voter)) });
  attachVoter(response, voter);
  return response;
}
