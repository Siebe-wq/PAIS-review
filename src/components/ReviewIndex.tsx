'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Review } from '@/lib/types';
import type { Engagement } from '@/lib/comments';
import { rankScore, ratingRank } from '@/lib/ranking';
import { ReviewCard } from './ReviewCard';

export type ReviewSummary = Omit<Review, 'body'>;

type Sort = 'active' | 'newest' | 'oldest' | 'score-desc' | 'score-asc' | 'comments' | 'discussed' | 'rating';

export function ReviewIndex({
  reviews,
  conditions,
  engagement,
  serverNow,
}: {
  reviews: ReviewSummary[];
  conditions: string[];
  /** Absent when the site has no database; the engagement sorts are then hidden. */
  engagement?: Record<string, Engagement>;
  serverNow: number;
}) {
  const hasEngagement = Boolean(engagement);
  const [active, setActive] = useState<string[]>([]);
  const [sort, setSort] = useState<Sort>(hasEngagement ? 'active' : 'newest');
  const [query, setQuery] = useState('');

  // The server rendered "3 h ago" and the ranking against its own clock. Re-run against
  // the reader's once mounted, so a cached page does not show a stale time. Starting
  // from the server's value keeps the first client render identical to the HTML.
  const [now, setNow] = useState(serverNow);
  useEffect(() => setNow(Date.now()), []);

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

    const stats = (r: ReviewSummary) => engagement?.[r.slug];
    const newestFirst = (a: ReviewSummary, b: ReviewSummary) =>
      b.reviewedOn.localeCompare(a.reviewedOn) || a.title.localeCompare(b.title);

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case 'oldest':
          return a.reviewedOn.localeCompare(b.reviewedOn) || a.title.localeCompare(b.title);
        // Unscored kinds (literature reviews) sort to the end either way.
        case 'score-desc':
          return (b.score ?? -1) - (a.score ?? -1) || a.title.localeCompare(b.title);
        case 'score-asc':
          return (a.score ?? 11) - (b.score ?? 11) || a.title.localeCompare(b.title);
        case 'comments':
          return (stats(b)?.comments ?? 0) - (stats(a)?.comments ?? 0) || newestFirst(a, b);
        case 'discussed':
          // Never-commented reviews sort last, whatever their publication date.
          return (
            (stats(b)?.lastCommentAt ?? '').localeCompare(stats(a)?.lastCommentAt ?? '') ||
            newestFirst(a, b)
          );
        case 'rating':
          return ratingRank(stats(b)) - ratingRank(stats(a)) || newestFirst(a, b);
        case 'active':
          return (
            rankScore(b, stats(b), now) - rankScore(a, stats(a), now) || newestFirst(a, b)
          );
        default:
          return newestFirst(a, b);
      }
    });
  }, [reviews, active, sort, query, engagement, now]);

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
          {hasEngagement && <option value="active">Active</option>}
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="score-desc">Highest score</option>
          <option value="score-asc">Lowest score</option>
          {hasEngagement && <option value="comments">Most comments</option>}
          {hasEngagement && <option value="discussed">Recently discussed</option>}
          {hasEngagement && <option value="rating">Highest reader rating</option>}
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
              <ReviewCard
                review={review}
                href={`/reviews/${review.slug}`}
                engagement={engagement?.[review.slug]}
                now={now}
              />
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
