/**
 * Markdown to the words a reader sees, for full-text search. Not a renderer: it only has
 * to keep the text and drop the syntax, so that "**bias**" matches "bias".
 */
export function plainText(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`([^`]*)`/g, '$1')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/^\s{0,3}#{1,6}\s+/gm, '')
    .replace(/^\s*(?:[-*+]|\d+\.)\s+/gm, '')
    .replace(/^\s*>\s?/gm, '')
    .replace(/\|/g, ' ')
    .replace(/[*_~]+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * A short stretch of text around the first match, for showing why a result matched.
 * Returns the pieces so the caller can highlight the match without injecting HTML.
 */
export function excerptAround(text: string, term: string, radius = 70): { before: string; match: string; after: string } | null {
  const at = text.toLowerCase().indexOf(term.toLowerCase());
  if (at === -1 || !term) return null;
  let start = Math.max(0, at - radius);
  let end = Math.min(text.length, at + term.length + radius);
  // Widen to whole words.
  while (start > 0 && /\S/.test(text[start - 1])) start--;
  while (end < text.length && /\S/.test(text[end])) end++;
  return {
    before: `${start > 0 ? '…' : ''}${text.slice(start, at)}`,
    match: text.slice(at, at + term.length),
    after: `${text.slice(at + term.length, end)}${end < text.length ? '…' : ''}`,
  };
}
