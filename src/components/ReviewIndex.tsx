'use client';

import { useMemo, useState } from 'react';
import type { Review } from '@/lib/types';
import { ReviewCard } from './ReviewCard';

export type ReviewSummary = Omit<Review, 'body'>;

type Sort = 'newest' | 'oldest' | 'score-desc' | 'score-asc';

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
              <ReviewCard review={review} href={`/reviews/${review.slug}`} />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
