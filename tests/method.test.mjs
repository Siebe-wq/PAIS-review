// The method's one version number and its changelog.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { bumpVersion, validateNote } from '../src/lib/version.ts';
import { withChangelogEntry, withGuideVersion } from '../src/lib/doc.ts';

test('version bumps by kind of change', () => {
  assert.equal(bumpVersion('0.3', 'patch'), '0.3.1');
  assert.equal(bumpVersion('0.3.9', 'patch'), '0.3.10');
  assert.equal(bumpVersion('0.3.7', 'minor'), '0.4');
  assert.equal(bumpVersion('1.2.5', 'major'), '2.0');
  assert.equal(bumpVersion(null, 'minor'), '0.1');
});

test('a changelog note must say something', () => {
  assert.ok(validateNote('  '));
  assert.ok(validateNote('x'.repeat(400)));
  assert.equal(validateNote('Clarified the PEM criteria.'), null);
});

test('saving stamps the version and puts the note first in the changelog', () => {
  const guide = '---\ntitle: G\nversion: "0.1"\n---\n\n## Rules\n\nText.\n\n## Changelog\n\n- **0.1** (2026-01-01) — First.\n';
  const out = withChangelogEntry(withGuideVersion(guide, '0.2', '2026-02-02'), '0.2', '2026-02-02', 'Second.');
  assert.match(out, /^version: "0\.2"$/m);
  assert.match(out, /^updated: 2026-02-02$/m);
  assert.match(out, /## Changelog\n\n- \*\*0\.2\*\* \(2026-02-02\) — Second\.\n- \*\*0\.1\*\*/);
});

test('a guide without a changelog gets one', () => {
  const out = withChangelogEntry('---\ntitle: G\n---\n\nText.\n', '0.1', '2026-01-01', 'Start.');
  assert.match(out, /## Changelog\n\n- \*\*0\.1\*\* \(2026-01-01\) — Start\./);
});
