#!/usr/bin/env node
/**
 * Lists abbreviations a review uses without writing them out, and any in its frontmatter.
 *   node scripts/check-abbreviations.mjs content/reviews/<file>.md [more files]
 * With no arguments, checks every review. Exits 1 if anything is found, so it can gate
 * a workflow; it is a heuristic, so names such as trial acronyms will show up too.
 */
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { frontmatterAbbreviations, undefinedInBody } from '../src/lib/abbreviations.ts';

const dir = 'content/reviews';
const files = process.argv.slice(2).length
  ? process.argv.slice(2)
  : fs.readdirSync(dir).filter((f) => f.endsWith('.md')).map((f) => path.join(dir, f));

let problems = 0;
for (const file of files) {
  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const front = frontmatterAbbreviations(data);
  const body = undefinedInBody(content);
  if (!front.length && !body.length) continue;
  console.log(file);
  for (const warning of front) console.log(`  frontmatter, ${warning.where}: ${warning.terms.join(', ')}`);
  if (body.length) console.log(`  not written out at first use: ${body.join(', ')}`);
  problems += front.length + body.length;
}
if (!problems) console.log(`No abbreviation problems in ${files.length} file(s).`);
process.exit(problems ? 1 : 0);
