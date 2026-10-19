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
