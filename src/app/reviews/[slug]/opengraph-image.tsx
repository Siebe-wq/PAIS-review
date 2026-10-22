import { ImageResponse } from 'next/og';
import { notFound } from 'next/navigation';
import { getAllReviews, getReview } from '@/lib/reviews';
import { getSiteText } from '@/lib/site-text';
import { verdictOf } from '@/lib/types';
import { OG_SIZE, OgCard, clip } from '@/lib/og';

export const size = OG_SIZE;
export const contentType = 'image/png';
export const alt = 'The review’s grade and verdict';

export function generateStaticParams() {
  return getAllReviews().map((review) => ({ slug: review.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const review = getReview((await params).slug);
  if (!review) notFound();
  return new ImageResponse(
    <OgCard
      siteName={getSiteText()['site.name']}
      heading={clip(review.title, 120)}
      text={clip(review.verdict, 210)}
      badge={verdictOf(review)}
    />,
    size,
  );
}
