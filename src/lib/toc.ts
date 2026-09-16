export interface TocEntry {
  id: string;
  text: string;
}

/** Stable anchor id for a heading. Shared by the renderer and the contents list so they match. */
export function headingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * The `##` headings of a review body, in order. Only H2: the sub-headings below them are
 * too many to be a useful list, and the point of the sidebar is to show the shape of the
 * argument, not every paragraph label.
 */
export function extractToc(markdown: string): TocEntry[] {
  const entries: TocEntry[] = [];
  let inFence = false;

  for (const line of markdown.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;

    const match = /^##\s+(.+?)\s*$/.exec(line);
    if (!match) continue;

    // Strip inline markdown so the sidebar shows words, not asterisks and brackets.
    const text = match[1]
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[*_`]/g, '')
      .trim();
    if (text) entries.push({ id: headingId(text), text });
  }

  return entries;
}
