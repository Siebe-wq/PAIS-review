import { test } from 'node:test';
import assert from 'node:assert/strict';
import { itemLine, mergeIntoBacklog, parseBacklog, serializeBacklog, validateSections } from '../src/lib/backlog.ts';

const source = '---\ntitle: B\n---\n\nIntro.\n\n## A\n\nA note typed by hand.\n\n- [ ] [high] One\n- [x] Two (done 2026-10-01)\n\n## B\n';

test('reads and writes back unchanged', () => {
  assert.equal(serializeBacklog(parseBacklog(source)), source);
});

test('priority and done date are parsed and written', () => {
  const [a] = parseBacklog(source).sections;
  assert.equal(a.items[0].priority, 'high');
  assert.equal(a.items[1].doneOn, '2026-10-01');
  assert.equal(itemLine({ text: 'T', done: true, doneOn: '2026-01-02', priority: 'low' }), '- [x] [low] T (done 2026-01-02)');
});

test('an edit from the panel keeps the intro and the hand-typed notes', () => {
  const edited = validateSections([{ title: 'A', items: [{ text: 'Two', done: false }, { text: 'One', done: false, priority: 'high' }] }]);
  const out = serializeBacklog(mergeIntoBacklog(parseBacklog(source), edited));
  assert.match(out, /Intro\./);
  assert.match(out, /A note typed by hand\.\n\n- \[ \] Two\n- \[ \] \[high\] One/);
});

test('bad input is refused or cleaned', () => {
  assert.throws(() => validateSections([{ title: 'A', items: [{ text: ' ' }] }]), /empty/);
  assert.throws(() => validateSections([{ title: 'A', items: [] }, { title: 'A', items: [] }]), /twice/);
  assert.equal(validateSections([{ title: 'A', items: [{ text: 'x', priority: 'urgent' }] }])[0].items[0].priority, undefined);
});
