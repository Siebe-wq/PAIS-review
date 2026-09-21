import { getAllConditions, getAllReviews } from '@/lib/reviews';
import { listEngagement, NO_ENGAGEMENT, type Engagement } from '@/lib/comments';
import { dbConfigured } from '@/lib/db';
import { ReviewIndex } from '@/components/ReviewIndex';
import { site } from '@/lib/site';

// Comment counts and ratings change between deploys, so the index cannot be fully
// static. A minute of cache is plenty: nothing here is to-the-second.
export const revalidate = 60;

export default async function HomePage() {
  const reviews = getAllReviews();
  const conditions = getAllConditions(reviews);
  const summaries = reviews.map(({ body: _body, ...rest }) => rest);

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
        <h1>{site.tagline}</h1>
        <p>
          Each paper is reviewed against a published guide, graded out of 10, and summarised by its
          main strengths and weaknesses. Scores are a judgement, not a measurement — read the review.
        </p>
      </div>
      <ReviewIndex
        reviews={summaries}
        conditions={conditions}
        engagement={engagement}
        serverNow={Date.now()}
      />
    </>
  );
}
