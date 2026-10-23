import { test } from 'node:test';
import assert from 'node:assert/strict';
import { setFrontmatterField } from '../src/lib/frontmatter.ts';

const src = '---\ntitle: "A title: with a colon"\nkind: paper\n---\n\nBody.\n';

test('adds, changes and removes one line without touching the rest', () => {
  const added = setFrontmatterField(src, 'humanInput', 'minor');
  assert.equal(added, '---\ntitle: "A title: with a colon"\nkind: paper\nhumanInput: minor\n---\n\nBody.\n');
  assert.equal(setFrontmatterField(added, 'humanInput', 'major'), added.replace('minor', 'major'));
  assert.equal(setFrontmatterField(setFrontmatterField(src, 'draft', true), 'draft', null), src);
});

test('refuses a file without frontmatter', () => {
  assert.throws(() => setFrontmatterField('no frontmatter', 'draft', true));
});

test('writes a list on one line, and replaces a list written one item per line', () => {
  const listed = setFrontmatterField(src, 'topics', ['treatment', 'me-cfs']);
  assert.match(listed, /\ntopics: \["treatment", "me-cfs"\]\n---/);
  const blockList = '---\ntitle: T\ntopics:\n  - a\n  - b\nkind: paper\n---\n\nBody.\n';
  assert.equal(setFrontmatterField(blockList, 'topics', ['c']), '---\ntitle: T\ntopics: ["c"]\nkind: paper\n---\n\nBody.\n');
  assert.equal(setFrontmatterField(blockList, 'topics', null), '---\ntitle: T\nkind: paper\n---\n\nBody.\n');
});
