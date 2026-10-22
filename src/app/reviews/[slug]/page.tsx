import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllReviews, getReview } from '@/lib/reviews';
import { ReviewView } from '@/components/ReviewView';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllReviews().map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const review = getReview((await params).slug);
  if (!review) return { title: 'Review not found' };
  return {
    title: review.title,
    description: review.verdict,
    alternates: { canonical: `/reviews/${review.slug}` },
    openGraph: {
      title: review.title,
      description: review.verdict,
      type: 'article',
      url: `/reviews/${review.slug}`,
      publishedTime: review.reviewedOn,
    },
  };
}

export default async function ReviewPage({ params }: Params) {
  const review = getReview((await params).slug);
  if (!review) notFound();
  return <ReviewView review={review} />;
}
