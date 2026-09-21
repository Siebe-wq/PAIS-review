import type { Engagement } from './comments';

const HOUR = 3600 * 1000;

/** Weight of a signal now, given it halves every `halfLifeHours`. */
function decay(ageHours: number, halfLifeHours: number): number {
  if (!Number.isFinite(ageHours)) return 0;
  return 0.5 ** (Math.max(0, ageHours) / halfLifeHours);
}

/**
 * How the index sorts by default.
 *
 * Three signals, added together:
 *
 * - **A live discussion.** The number of comments, damped by a logarithm so one busy
 *   thread cannot own the page, and faded by how long ago the last one was. Half-life
 *   three days: an argument that stopped a week ago is nearly spent.
 * - **Reader interest.** How many people rated it. No decay — it is a slow signal of
 *   whether a review is worth reading at all, not of what is happening this week.
 * - **Freshness.** A new review has no comments and no ratings, so without this it would
 *   be published straight to the bottom of the page. Half-life one week.
 *
 * Logs and decays keep every term roughly 0 to 3, so the weights mean what they look like.
 * Ties break on publication date, newest first, so the order is never arbitrary.
 */
export const WEIGHTS = { discussion: 3, readers: 1, freshness: 2 };

export function rankScore(
  review: { reviewedOn: string },
  engagement: Engagement | undefined,
  now: number,
): number {
  const published = Date.parse(review.reviewedOn);
  const freshness = Number.isNaN(published) ? 0 : decay((now - published) / HOUR, 24 * 7);

  if (!engagement) return WEIGHTS.freshness * freshness;

  const lastComment = engagement.lastCommentAt ? Date.parse(engagement.lastCommentAt) : NaN;
  const discussion =
    engagement.comments > 0 && !Number.isNaN(lastComment)
      ? Math.log1p(engagement.comments) * decay((now - lastComment) / HOUR, 24 * 3)
      : 0;
  const readers = Math.log1p(engagement.ratingCount);

  return (
    WEIGHTS.discussion * discussion + WEIGHTS.readers * readers + WEIGHTS.freshness * freshness
  );
}

/**
 * Sort key for "highest rated". A plain mean would put a review with one five-star
 * rating above one with forty averaging 4.8, so ratings are pulled toward 3.5 until
 * there are enough of them to mean something. The number shown on the card is still
 * the plain mean — this only decides the order.
 */
const PRIOR = { mean: 3.5, weight: 3 };

export function ratingRank(engagement: Engagement | undefined): number {
  if (!engagement || engagement.ratingCount === 0 || engagement.ratingAverage === null) return -1;
  const { ratingAverage: average, ratingCount: count } = engagement;
  return (average * count + PRIOR.mean * PRIOR.weight) / (count + PRIOR.weight);
}
