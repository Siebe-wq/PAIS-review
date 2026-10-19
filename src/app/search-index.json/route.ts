import { NextResponse } from 'next/server';
import { getAllReviews } from '@/lib/reviews';
import { plainText } from '@/lib/plaintext';

// Built once with the site, like the review pages. The index fetches it only when someone
// starts searching, so the home page does not carry every review's text.
export const dynamic = 'force-static';

export function GET() {
  const bodies = Object.fromEntries(getAllReviews().map((review) => [review.slug, plainText(review.body)]));
  return NextResponse.json(bodies);
}
