import { verdictOf, type ReviewFrontmatter } from '@/lib/types';

/**
 * The verdict badge. A number for papers, a word for preliminary findings,
 * and a plain marker for literature reviews.
 */
export function ScoreBadge({
  review,
}: {
  review: Pick<ReviewFrontmatter, 'kind' | 'score' | 'signal'>;
}) {
  const verdict = verdictOf(review);
  const title = verdict.showDenominator
    ? `${verdict.headline} out of 10 — ${verdict.label}`
    : `${verdict.headline} — ${verdict.label}`;

  return (
    <div
      className={`score${verdict.showDenominator ? '' : ' score-word'}`}
      data-tone={verdict.tone}
      title={title}
    >
      <span className="num">{verdict.headline}</span>
      {verdict.showDenominator && <span className="den">/ 10</span>}
      <span className="band">{verdict.label}</span>
    </div>
  );
}
