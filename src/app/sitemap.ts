import type { MetadataRoute } from 'next';
import { getAllReviews } from '@/lib/reviews';
import { site } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const reviews = getAllReviews();
  const latest = reviews[0]?.reviewedOn;

  return [
    { url: site.url, lastModified: latest ? new Date(latest) : new Date(), priority: 1 },
    { url: `${site.url}/guide`, priority: 0.8 },
    { url: `${site.url}/about`, priority: 0.5 },
    ...reviews.map((review) => ({
      url: `${site.url}/reviews/${review.slug}`,
      lastModified: new Date(review.reviewedOn),
      priority: 0.7,
    })),
  ];
}
