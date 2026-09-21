import Link from 'next/link';
import type { ReviewFrontmatter } from '@/lib/types';
import type { Engagement } from '@/lib/comments';
import { ScoreBadge } from './ScoreBadge';
import { Stars } from './Stars';
import { abbreviateAuthors } from '@/lib/authors';
import { timeAgo } from '@/lib/time';

/**
 * One row on the index. Also used by /admin to preview a pasted review exactly as it
 * will appear once published, so there is nothing to imagine.
 */
export function ReviewCard({
  review,
  href,
  engagement,
  now,
}: {
  review: ReviewFrontmatter;
  href?: string;
  /** Left out where there is no database, and in the /admin preview. */
  engagement?: Engagement;
  now?: number;
}) {
  const citation = [abbreviateAuthors(review.authors), review.journal, review.year].filter(Boolean).join(' · ');

  return (
    <article className="card">
      <ScoreBadge review={review} />
      <div className="card-main">
        <h2>{href ? <Link href={href}>{review.title}</Link> : review.title}</h2>
        {citation && <p className="cite">{citation}</p>}
        <p className="verdict">{review.verdict}</p>
        <div className="chip-row">
          {review.weaknesses?.slice(0, 3).map((weakness) => (
            <span className="chip weakness" key={weakness}>
              {weakness}
            </span>
          ))}
          {review.strengths?.slice(0, 2).map((strength) => (
            <span className="chip strength" key={strength}>
              {strength}
            </span>
          ))}
        </div>
        {engagement && (
          <p className="card-meta">
            <span>
              {engagement.comments === 0
                ? 'No comments yet'
                : `${engagement.comments} comment${engagement.comments === 1 ? '' : 's'}`}
            </span>
            {engagement.lastCommentAt && <span>latest {timeAgo(engagement.lastCommentAt, now)}</span>}
            {engagement.ratingAverage !== null && (
              <span className="card-rating">
                <Stars value={engagement.ratingAverage} />
                {engagement.ratingAverage.toFixed(1)}
                <span className="card-rating-n">
                  ({engagement.ratingCount} rating{engagement.ratingCount === 1 ? '' : 's'})
                </span>
              </span>
            )}
          </p>
        )}
      </div>
    </article>
  );
}
