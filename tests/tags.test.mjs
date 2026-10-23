import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkReviewTags, parseTagList, tagId, tagsOf, usedTags, validateTagList } from '../src/lib/tags.ts';

const list = {
  designs: [{ id: 'randomised-trial', label: 'Randomised trial' }],
  topics: [
    { id: 'treatment', label: 'Treatment' },
    { id: 'pots-oi', label: 'POTS/OI' },
    { id: 'me-cfs', label: 'ME/CFS' },
  ],
};

test('a tag address comes from its name', () => {
  assert.equal(tagId('Heart, blood vessels & circulation'), 'heart-blood-vessels-and-circulation');
  assert.equal(tagId('POTS/OI'), 'pots-oi');
  assert.equal(tagId('  Café  '), 'cafe');
});

test('a new tag gets an id, a renamed one keeps its own, and two tags cannot share an address', () => {
  const ok = validateTagList({ designs: [{ id: 'randomised-trial', label: 'RCT' }], topics: [{ label: 'Viral persistence' }] });
  assert.deepEqual(ok, { tags: { designs: [{ id: 'randomised-trial', label: 'RCT' }], topics: [{ id: 'viral-persistence', label: 'Viral persistence' }] } });
  assert.ok('error' in validateTagList({ designs: [], topics: [{ label: 'ME/CFS' }, { label: 'ME CFS' }] }));
  assert.ok('error' in validateTagList({ designs: [], topics: [{ label: '  ' }] }));
  assert.ok('error' in validateTagList({ designs: [] }));
});

test('a damaged file loses its bad entries, not the site', () => {
  const { tags, problems } = parseTagList({ designs: 'oops', topics: [{ id: 'treatment', label: 'Treatment' }, { label: 'no id' }, { id: 'treatment', label: 'Again' }] });
  assert.deepEqual(tags, { designs: [], topics: [{ id: 'treatment', label: 'Treatment' }] });
  assert.equal(problems.length, 3);
});

test('tags chosen for a review must be on the list, and come back in list order', () => {
  assert.deepEqual(checkReviewTags({ design: 'randomised-trial', topics: ['me-cfs', 'treatment'] }, list), {
    design: 'randomised-trial',
    topics: ['treatment', 'me-cfs'],
  });
  assert.deepEqual(checkReviewTags({ design: '', topics: [] }, list), { design: null, topics: [] });
  assert.ok('error' in checkReviewTags({ design: 'cohort' }, list));
  assert.ok('error' in checkReviewTags({ topics: ['nope'] }, list));
});

test('a review shows only tags still on the list; menus show only tags in use', () => {
  const review = { design: 'randomised-trial', topics: ['me-cfs', 'gone'] };
  assert.deepEqual(tagsOf(review, list), { design: list.designs[0], topics: [list.topics[2]] });
  assert.deepEqual(usedTags([review], list), { designs: list.designs, topics: [list.topics[2]] });
});
