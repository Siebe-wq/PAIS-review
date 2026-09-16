'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import type { Review } from '@/lib/types';
import { ScoreBadge } from './ScoreBadge';

export type ReviewSummary = Omit<Review, 'body'>;

type Sort = 'newest' | 'oldest' | 'score-desc' | 'score-asc';

function citation(r: ReviewSummary): string {
  return [r.authors, r.journal, r.year].filter(Boolean).join(' · ');
}

export function ReviewIndex({
  reviews,
  conditions,
}: {
  reviews: ReviewSummary[];
  conditions: string[];
}) {
  const [active, setActive] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>('newest');

  const shown = useMemo(() => {
    const filtered = active.length
      ? reviews.filter((r) => active.every((c) => r.conditions?.includes(c)))
      : reviews;

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.reviewedOn.localeCompare(b.reviewedOn);
        case 'score-desc':
          return b.score - a.score || a.title.localeCompare(b.title);
        case 'score-asc':
          return a.score - b.score || a.title.localeCompare(b.title);
        default:
          return b.reviewedOn.localeCompare(a.reviewedOn);
      }
    });
  }, [reviews, active, sort]);

  const toggle = (condition: string) =>
    setActive((current) =>
      current.includes(condition)
        ? current.filter((c) => c !== condition)
        : [...current, condition],
    );

  return (
    <>
      <div className="controls">
        {conditions.length > 0 && (
          <div className="chip-row">
            {conditions.map((condition) => (
              <button
                key={condition}
                type="button"
                className="chip toggle"
                aria-pressed={active.includes(condition)}
                onClick={() => toggle(condition)}
              >
                {condition}
              </button>
            ))}
          </div>
        )}
        <div className="spacer" />
        <label htmlFor="sort">Sort</label>
        <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="score-desc">Highest score</option>
          <option value="score-asc">Lowest score</option>
        </select>
      </div>

      {shown.length === 0 ? (
        <p className="empty">
          {reviews.length === 0
            ? 'No reviews published yet.'
            : 'No reviews match those filters.'}
        </p>
      ) : (
        <ul className="review-list">
          {shown.map((review) => (
            <li key={review.slug}>
              <article className="card">
                <ScoreBadge score={review.score} />
                <div className="card-main">
                  <h2>
                    <Link href={`/reviews/${review.slug}`}>{review.title}</Link>
                  </h2>
                  <p className="cite">{citation(review)}</p>
                  <p className="verdict">{review.verdict}</p>
                  <div className="chip-row">
                    {review.weaknesses?.slice(0, 3).map((w) => (
                      <span className="chip weakness" key={w}>
                        {w}
                      </span>
                    ))}
                    {review.strengths?.slice(0, 2).map((s) => (
                      <span className="chip strength" key={s}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
