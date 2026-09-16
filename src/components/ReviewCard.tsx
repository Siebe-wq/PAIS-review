import Link from 'next/link';
import type { ReviewFrontmatter } from '@/lib/types';
import { ScoreBadge } from './ScoreBadge';

/**
 * One row on the index. Also used by /admin to preview a pasted review exactly as it
 * will appear once published, so there is nothing to imagine.
 */
export function ReviewCard({ review, href }: { review: ReviewFrontmatter; href?: string }) {
  const citation = [review.authors, review.journal, review.year].filter(Boolean).join(' · ');

  return (
    <article className="card">
      <ScoreBadge score={review.score} />
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
      </div>
    </article>
  );
}
