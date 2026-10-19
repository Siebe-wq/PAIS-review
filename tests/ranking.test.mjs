import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rankScore, ratingRank } from '../src/lib/ranking.ts';

const NOW = Date.parse('2026-09-21T12:00:00Z');
const ago = (h) => new Date(NOW - h * 3600_000).toISOString();
const eng = (o) => ({ comments: 0, lastCommentAt: null, ratingAverage: null, ratingCount: 0, ...o });

test('a live discussion beats a quiet new review, and fades when it stops', () => {
  const quietNew = rankScore({ reviewedOn: '2026-09-21' }, eng({}), NOW);
  const busy = rankScore({ reviewedOn: '2026-08-01' }, eng({ comments: 12, lastCommentAt: ago(2) }), NOW);
  const stale = rankScore({ reviewedOn: '2026-08-01' }, eng({ comments: 12, lastCommentAt: ago(24 * 21) }), NOW);
  assert.ok(busy > quietNew);
  assert.ok(stale < busy / 4);
});

test('one five-star rating does not outrank forty at 4.8', () => {
  assert.ok(ratingRank(eng({ ratingAverage: 4.8, ratingCount: 40 })) > ratingRank(eng({ ratingAverage: 5, ratingCount: 1 })));
  assert.equal(ratingRank(eng({})), -1);
});
