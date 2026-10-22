#!/usr/bin/env node
/**
 * Lists abbreviations a review uses without writing them out, and any in its frontmatter.
 *   node scripts/check-abbreviations.mjs content/reviews/<file>.md [more files]
 * With no arguments, checks every review. Exits 1 if anything is found; it is a heuristic,
 * so names such as trial acronyms will show up too. With --warn (used in CI) it prints
 * GitHub warnings instead and exits 0, because a review the editor publishes goes
 * straight to main and a guess should not turn the checks red.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { frontmatterAbbreviations, undefinedInBody } from '../src/lib/abbreviations.ts';

const dir = 'content/reviews';
const args = process.argv.slice(2);
const warnOnly = args.includes('--warn');
const named = args.filter((arg) => arg !== '--warn');
const files = named.length
  ? named
  : fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f));

let problems = 0;
for (const file of files) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const front = frontmatterAbbreviations(data);
  const body = undefinedInBody(content);
  if (!front.length && !body.length) continue;
  const lines = front.map((warning) => `frontmatter, ${warning.where}: ${warning.terms.join(', ')}`);
  if (body.length) lines.push(`not written out at first use: ${body.join(', ')}`);
  if (warnOnly) for (const line of lines) console.log(`::warning file=${file}::Abbreviations, ${line}`);
  else console.log([file, ...lines.map((line) => `  ${line}`)].join('\n'));
  problems += front.length + body.length;
}
if (!problems) console.log(`No abbreviation problems in ${files.length} file(s).`);
process.exit(problems && !warnOnly ? 1 : 0);
