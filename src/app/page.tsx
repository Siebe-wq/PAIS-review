import { getAllConditions, getAllReviews } from '@/lib/reviews';
import { listEngagement, NO_ENGAGEMENT, type Engagement } from '@/lib/comments';
import { dbConfigured } from '@/lib/db';
import { ReviewIndex } from '@/components/ReviewIndex';
import { getSiteText } from '@/lib/site-text';
import { RichText } from '@/components/RichText';
import { getTags } from '@/lib/tags-store';
import { usedTags } from '@/lib/tags';

// Comment counts and ratings change between deploys, so the index cannot be fully
// static. A minute of cache is plenty: nothing here is to-the-second.
export const revalidate = 60;

export const metadata = { alternates: { canonical: '/' } };

export default async function HomePage() {
  const reviews = getAllReviews();
  const conditions = getAllConditions(reviews);
  const summaries = reviews.map(({ body: _body, ...rest }) => rest);
  const text = getSiteText();

  let engagement: Record<string, Engagement> | undefined;
  if (dbConfigured()) {
    try {
      const found = await listEngagement();
      // Every review gets an entry, so a review nobody has touched reads
      // "No comments yet" rather than showing nothing at all.
      engagement = Object.fromEntries(
        summaries.map((review) => [review.slug, found[review.slug] ?? NO_ENGAGEMENT]),
      );
    } catch (error) {
      // The index still has to render. /api/db-status explains what is wrong.
      console.error('Could not load comment and rating totals for the index:', error);
    }
  }

  return (
    <>
      <div className="lede">
        <h1>{text['home.heading']}</h1>
        <RichText text={text['home.intro']} />
      </div>
      <ReviewIndex
        reviews={summaries}
        conditions={conditions}
        engagement={engagement}
        serverNow={Date.now()}
        tags={usedTags(reviews, getTags())}
        labels={{
          searchPlaceholder: text['home.searchPlaceholder'],
          empty: text['home.empty'],
          noMatches: text['home.noMatches'],
          preprint: text['label.preprint'],
          designFilter: text['home.designFilter'],
          anyDesign: text['home.anyDesign'],
          topicFilter: text['home.topicFilter'],
          anyTopic: text['home.anyTopic'],
        }}
      />
    </>
  );
}
