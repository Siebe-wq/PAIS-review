// The files the site is built from. A broken one fails here before it fails a deploy.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { parseReview } from '../src/lib/reviews.ts';
import { parseBacklog, serializeBacklog } from '../src/lib/backlog.ts';
import { parseOverrides } from '../src/lib/site-text-schema.ts';
import { getDoc } from '../src/lib/doc.ts';

test('every review file parses', () => {
  const files = fs.readdirSync('content/reviews').filter((f) => f.endsWith('.md'));
  assert.ok(files.length > 0);
  for (const f of files) parseReview(fs.readFileSync(`content/reviews/${f}`, 'utf8'), f.replace(/\.md$/, ''));
});

test('the guide has a version and a changelog', () => {
  const guide = getDoc('guide');
  assert.match(guide.version ?? '', /^\d+\.\d+(\.\d+)?$/);
  assert.match(guide.body, /^## Changelog$/m);
});

test('the backlog is in the form the admin panel writes', () => {
  const source = fs.readFileSync('content/backlog.md', 'utf8');
  assert.equal(serializeBacklog(parseBacklog(source)), source);
});

test('the stored site text has no problems', () => {
  const { problems } = parseOverrides(JSON.parse(fs.readFileSync('content/site-text.json', 'utf8')));
  assert.deepEqual(problems, []);
});
