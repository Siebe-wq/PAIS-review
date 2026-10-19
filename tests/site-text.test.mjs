import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DEFAULTS, GROUPS, KEYS, checkValue, parseOverrides, resolve, serialiseOverrides } from '../src/lib/site-text-schema.ts';

test('every field is in exactly one group, and every default passes its own check', () => {
  const grouped = GROUPS.flatMap((g) => g.keys);
  assert.deepEqual([...grouped].sort(), [...KEYS].sort());
  assert.equal(new Set(grouped).size, grouped.length);
  for (const key of KEYS) assert.equal(checkValue(key, DEFAULTS[key]), null, key);
});

test('a bad stored file falls back to the defaults instead of breaking the site', () => {
  assert.deepEqual(resolve(parseOverrides('nonsense').overrides), DEFAULTS);
  const { overrides, problems } = parseOverrides({ 'site.footer': '  New  ', nope: 'x', 'site.name': '' });
  assert.equal(overrides['site.footer'], 'New');
  assert.ok(!('site.name' in overrides));
  assert.ok(problems.some((p) => p.includes('nope')));
});

test('only changed fields are stored', () => {
  assert.equal(serialiseOverrides({ ...DEFAULTS }), '{}\n');
  assert.deepEqual(Object.keys(JSON.parse(serialiseOverrides({ ...DEFAULTS, 'site.footer': 'Changed' }))), ['site.footer']);
});
