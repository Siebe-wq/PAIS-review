import { test } from 'node:test';
import assert from 'node:assert/strict';
import { excerptAround, plainText } from '../src/lib/plaintext.ts';

test('markdown becomes the words a reader sees', () => {
  assert.equal(plainText('## Bias\n\n**Selection** bias, see [the trial](https://x.org).\n\n- one\n- two'), 'Bias Selection bias, see the trial. one two');
});

test('an excerpt shows whole words around the match', () => {
  const text = 'Cases came from the UK ME/CFS Biobank while most controls came from a different source entirely.';
  const e = excerptAround(text, 'biobank', 20);
  assert.equal(e.match, 'Biobank');
  assert.ok(e.before.startsWith('…'));
  assert.ok(!/\S…$/.test(e.before.trim()) || e.before.endsWith(' '));
  assert.equal(excerptAround(text, 'absent'), null);
});
