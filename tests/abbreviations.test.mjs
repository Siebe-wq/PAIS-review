import { test } from 'node:test';
import assert from 'node:assert/strict';
import { abbreviationsIn, undefinedInBody } from '../src/lib/abbreviations.ts';

test('finds abbreviations but not names, familiar terms or compounds of them', () => {
  assert.deepEqual(abbreviationsIn('No case definition; PEM not assessed'), ['PEM']);
  assert.deepEqual(abbreviationsIn('EpiSwitch in ME/CFS after COVID-19, post-COVID'), []);
});

test('accepts an abbreviation written out at first use, or a name that says what it is', () => {
  assert.deepEqual(undefinedInBody('Post-exertional malaise (PEM) was not measured. PEM matters.'), []);
  assert.deepEqual(undefinedInBody('The PACE trial was criticised.'), []);
  assert.deepEqual(undefinedInBody('The ICC was 0.4.'), ['ICC']);
  assert.deepEqual(undefinedInBody('The SD (12.1) was large.'), ['SD']);
});

test('a bracketed explanation in a quotation counts, and so does a numbered member of a defined family', () => {
  assert.deepEqual(undefinedInBody('They called it "proof that LC [long COVID] is real".'), []);
  assert.deepEqual(undefinedInBody('Cluster of differentiation (CD) proteins: CD3 for T cells, CD68 for macrophages.'), []);
  assert.deepEqual(undefinedInBody('CD3 counts rose.'), ['CD3']);
});
