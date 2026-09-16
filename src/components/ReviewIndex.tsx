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
  const [query, setQuery] = useState('');

  const shown = useMemo(() => {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const haystack = (r: ReviewSummary) =>
      [r.title, r.authors, r.journal, r.studyType, r.verdict, r.conditions, r.strengths, r.weaknesses, r.year]
        .flat()
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

    const filtered = reviews.filter((r) => {
      if (active.length && !active.every((c) => r.conditions?.includes(c))) return false;
      if (terms.length) {
        const text = haystack(r);
        if (!terms.every((term) => text.includes(term))) return false;
      }
      return true;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.reviewedOn.localeCompare(b.reviewedOn);
        // Unscored kinds (literature reviews) sort to the end either way.
        case 'score-desc':
          return (b.score ?? -1) - (a.score ?? -1) || a.title.localeCompare(b.title);
        case 'score-asc':
          return (a.score ?? 11) - (b.score ?? 11) || a.title.localeCompare(b.title);
        default:
          return b.reviewedOn.localeCompare(a.reviewedOn);
      }
    });
  }, [reviews, active, sort, query]);

  const toggle = (condition: string) =>
    setActive((current) =>
      current.includes(condition)
        ? current.filter((c) => c !== condition)
        : [...current, condition],
    );

  return (
    <>
      <div className="controls">
        <input
          type="search"
          className="search"
          placeholder="Search reviews"
          aria-label="Search reviews"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
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
