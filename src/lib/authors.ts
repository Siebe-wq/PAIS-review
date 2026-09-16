/**
 * Author lists are stored in full and shortened for display. Names are "Surname AB", so
 * the separator is the comma, never the space.
 */
export function splitAuthors(authors: string | undefined): string[] {
  if (!authors) return [];
  return authors
    .split(',')
    .map((name) => name.trim())
    .filter((name) => name && !/^et al\.?$/i.test(name));
}

/** True when the stored string already ends in "et al." — nothing further to expand. */
export function isAbbreviated(authors: string | undefined): boolean {
  return /et al\.?$/i.test((authors ?? '').trim());
}

export const SHOWN_AUTHORS = 3;

export function abbreviateAuthors(authors: string | undefined): string {
  if (!authors) return '';
  if (isAbbreviated(authors)) return authors.trim();
  const names = splitAuthors(authors);
  if (names.length <= SHOWN_AUTHORS) return names.join(', ');
  return `${names.slice(0, SHOWN_AUTHORS).join(', ')}, et al.`;
}
