import { getAllConditions, getAllReviews } from '@/lib/reviews';
import { ReviewIndex } from '@/components/ReviewIndex';
import { site } from '@/lib/site';

export default function HomePage() {
  const reviews = getAllReviews();
  const conditions = getAllConditions(reviews);
  const summaries = reviews.map(({ body: _body, ...rest }) => rest);

  return (
    <>
      <div className="lede">
        <h1>{site.tagline}</h1>
        <p>
          Each paper is reviewed against a published guide, graded out of 10, and summarised by its
          main strengths and weaknesses. Scores are a judgement, not a measurement — read the review.
        </p>
      </div>
      <ReviewIndex reviews={summaries} conditions={conditions} />
    </>
  );
}
