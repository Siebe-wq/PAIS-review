import { test } from 'node:test';
import assert from 'node:assert/strict';
import { checkReviewTags, hasTag, parseTagList, tagId, tagsOf, usedTags, validateTagList } from '../src/lib/tags.ts';

const list = {
  conditions: [{ id: 'me-cfs', label: 'ME/CFS' }, { id: 'long-covid', label: 'Long Covid' }],
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
  const ok = validateTagList({ conditions: [], designs: [{ id: 'randomised-trial', label: 'RCT' }], topics: [{ label: 'Viral persistence' }] });
  assert.deepEqual(ok, { tags: { conditions: [], designs: [{ id: 'randomised-trial', label: 'RCT' }], topics: [{ id: 'viral-persistence', label: 'Viral persistence' }] } });
  assert.ok('error' in validateTagList({ conditions: [{ label: 'ME/CFS' }], designs: [], topics: [{ label: 'ME CFS' }] }));
  assert.ok('error' in validateTagList({ conditions: [], designs: [], topics: [{ label: '  ' }] }));
  assert.ok('error' in validateTagList({ designs: [] }));
});

test('a damaged file loses its bad entries, not the site', () => {
  const { tags, problems } = parseTagList({ designs: 'oops', topics: [{ id: 'treatment', label: 'Treatment' }, { label: 'no id' }, { id: 'treatment', label: 'Again' }] });
  assert.deepEqual(tags, { conditions: [], designs: [], topics: [{ id: 'treatment', label: 'Treatment' }] });
  assert.equal(problems.length, 3);
});

test('tags chosen for a review must be on the list, and come back in list order', () => {
  assert.deepEqual(checkReviewTags({ conditions: ['long-covid', 'me-cfs'], design: 'randomised-trial', topics: ['pots-oi', 'treatment'] }, list), {
    conditions: ['ME/CFS', 'Long Covid'],
    design: 'randomised-trial',
    topics: ['treatment', 'pots-oi'],
  });
  assert.deepEqual(checkReviewTags({ design: '', topics: [] }, list), { conditions: [], design: null, topics: [] });
  assert.ok('error' in checkReviewTags({ conditions: ['ME/CFS'] }, list));
  assert.ok('error' in checkReviewTags({ design: 'cohort' }, list));
  assert.ok('error' in checkReviewTags({ topics: ['nope'] }, list));
});

test('a review shows only tags still on the list; menus show only tags in use', () => {
  const review = { conditions: ['Long Covid'], design: 'randomised-trial', topics: ['me-cfs', 'gone'] };
  assert.deepEqual(tagsOf(review, list), { design: list.designs[0], topics: [list.topics[2]] });
  assert.deepEqual(usedTags([review], list), { conditions: [list.conditions[1]], designs: list.designs, topics: [list.topics[2]] });
  assert.ok(hasTag(review, { ...list.conditions[1], group: 'conditions' }));
  assert.ok(!hasTag(review, { ...list.conditions[0], group: 'conditions' }));
});
