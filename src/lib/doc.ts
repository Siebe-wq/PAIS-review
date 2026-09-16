import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';

export interface Doc {
  title: string;
  version?: string;
  updated?: string;
  authors?: string;
  source?: string;
  body: string;
}

/** Loads a standalone markdown document from content/, e.g. "guide". */
export function getDoc(name: string): Doc | undefined {
  const file = path.join(process.cwd(), 'content', `${name}.md`);
  if (!fs.existsSync(file)) return undefined;

  const { data, content } = matter(fs.readFileSync(file, 'utf8'));
  const updated =
    data.updated instanceof Date ? data.updated.toISOString().slice(0, 10) : data.updated;

  return {
    title: String(data.title ?? name),
    version: data.version != null ? String(data.version) : undefined,
    updated: updated ? String(updated) : undefined,
    authors: data.authors ? String(data.authors) : undefined,
    source: data.source ? String(data.source) : undefined,
    body: content.trim(),
  };
}
