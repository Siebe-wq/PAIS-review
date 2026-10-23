import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllReviews } from '@/lib/reviews';
import { getSiteText } from '@/lib/site-text';
import { getTags } from '@/lib/tags-store';
import { findTag, TAG_GROUPS } from '@/lib/tags';
import { ReviewCard } from '@/components/ReviewCard';

type Params = { params: Promise<{ id: string }> };

// Every tag in the list gets a page, used or not, so a link never breaks while a tag waits
// for its first review. A tag that is not in the list is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  const tags = getTags();
  return TAG_GROUPS.flatMap((group) => tags[group].map((tag) => ({ id: tag.id })));
}

function reviewsWith(id: string) {
  return getAllReviews().filter((review) => review.design === id || review.topics?.includes(id));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tag = findTag(getTags(), (await params).id);
  if (!tag) return { title: 'Tag not found' };
  return { title: tag.label, alternates: { canonical: `/tags/${tag.id}` } };
}

export default async function TagPage({ params }: Params) {
  const tag = findTag(getTags(), (await params).id);
  if (!tag) notFound();
  const text = getSiteText();
  const reviews = reviewsWith(tag.id);

  return (
    <>
      <p className="back-link">
        <Link href="/">← {text['tags.allReviews']}</Link>
      </p>
      <div className="lede">
        <h1>{tag.label}</h1>
      </div>
      <p className="tag-page-count">
        {reviews.length === 1 ? '1 review' : `${reviews.length} reviews`}
      </p>
      {reviews.length === 0 ? (
        <p className="empty">{text['home.empty']}</p>
      ) : (
        <ul className="review-list">
          {reviews.map((review) => (
            <li key={review.slug}>
              <ReviewCard review={review} href={`/reviews/${review.slug}`} preprintLabel={text['label.preprint']} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
