/**
 * House rule: write abbreviations out in full at first use, and keep them out of the
 * frontmatter altogether, apart from the title and ones as familiar as ME/CFS. The
 * frontmatter is what the index shows, so it has to read for someone outside the field.
 *
 * This is a heuristic that warns in the /admin preview; it never blocks publishing.
 */

/** Familiar enough to need no expansion anywhere. Kept deliberately short. */
export const FAMILIAR = new Set([
  'ME', 'CFS', 'ME/CFS', 'PAIS', 'COVID', 'COVID-19', 'SARS-CoV-2', 'DNA', 'RNA', 'UK', 'US', 'USA', 'EU',
]);

const COMPOUNDS = [...FAMILIAR].filter((term) => /[/-]/.test(term)).map((term) => term.replace('/', '\\/'));

/**
 * A token looks like an abbreviation if it has at least two capital letters and they
 * make up at least half its letters: PEM, ICC, IgG and mtDNA count; EpiSwitch and
 * McGill do not.
 */
export function looksAbbreviated(token: string): boolean {
  const letters = token.replace(/[^A-Za-z]/g, '');
  const capitals = letters.replace(/[^A-Z]/g, '');
  return capitals.length >= 2 && capitals.length * 2 >= letters.length;
}

/**
 * Parts of a token that need writing out. "post-COVID" and "ME/CFS-like" are made of
 * familiar parts and pass; "PEM/ME/CFS" yields PEM. Skipped as names rather than
 * abbreviations: gene and protein symbols with a digit (OLFM4, TAOK3), and Roman
 * numerals ("phase III").
 */
export function flaggedParts(token: string): string[] {
  if (FAMILIAR.has(token)) return [];
  // A familiar compound inside a longer token stays whole: "SARS-CoV-2-specific" is fine.
  for (const term of COMPOUNDS) token = token.replace(new RegExp(`(^|[/-])${term}(?=$|[/-])`, 'g'), '$1');
  return token
    .split(/[/-]/)
    .filter((part) => part && !FAMILIAR.has(part))
    .filter((part) => !/^[IVX]+$/.test(part))
    .filter((part) => !(/\d/.test(part) && part.length >= 4))
    .filter(looksAbbreviated);
}

// Greek letters belong inside a term: HPβCD is one abbreviation, not HP and CD.
const TOKEN = /[A-Za-z\u0370-\u03FF][A-Za-z0-9\u0370-\u03FF]*(?:[/-][A-Za-z0-9\u0370-\u03FF]+)*/g;

/**
 * A name that is an acronym — a trial, a study, a database — needs saying what it is,
 * not spelling out. "the PACE trial" and "a prospective study (EMERGE)" do that.
 */
const NAME_NOUNS =
  'trial|trials|study|studies|cohort|consortium|biobank|database|registry|questionnaire|scale|criteria|survey|programme|program|project|enzyme|gene|protein|assay|test';
const NOUN_AFTER = new RegExp(`^\\)?\\s+(?:${NAME_NOUNS})\\b`, 'i');
const NOUN_BEFORE = new RegExp(`\\b(?:${NAME_NOUNS})\\s+\\($`, 'i');

function isExplainedName(text: string, start: number, token: string): boolean {
  const before = text.slice(Math.max(0, start - 30), start);
  const after = text.slice(start + token.length, start + token.length + 30);
  return NOUN_AFTER.test(after) || NOUN_BEFORE.test(before);
}

export function abbreviationsIn(text: string): string[] {
  const found = new Set<string>();
  for (const match of text.matchAll(TOKEN)) {
    if (isExplainedName(text, match.index ?? 0, match[0])) continue;
    for (const part of flaggedParts(match[0])) found.add(part);
  }
  return [...found];
}

export interface AbbreviationWarning {
  where: string;
  terms: string[];
}

/** Frontmatter fields readers see on the index and at the top of a review. The title is exempt. */
export function frontmatterAbbreviations(review: {
  verdict?: string;
  studyType?: string;
  strengths?: string[];
  weaknesses?: string[];
  context?: { note: string }[];
}): AbbreviationWarning[] {
  const fields: [string, string[]][] = [
    ['the verdict', review.verdict ? [review.verdict] : []],
    ['the design line', review.studyType ? [review.studyType] : []],
    ['a strength', review.strengths ?? []],
    ['a weakness', review.weaknesses ?? []],
    ['a context note', (review.context ?? []).map((item) => item.note)],
  ];
  return fields
    .map(([where, texts]) => ({ where, terms: [...new Set(texts.flatMap(abbreviationsIn))] }))
    .filter((warning) => warning.terms.length > 0);
}

/**
 * Abbreviations in the body whose first use is not written out. Counts as written out
 * when the first use sits in brackets right after words ("post-exertional malaise (PEM)"),
 * or is itself followed by a bracketed expansion ("PEM (post-exertional malaise)").
 */
export function undefinedInBody(body: string): string[] {
  // Code, links and headings are not prose a reader has to decode in order.
  const prose = body
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/\]\([^)]*\)/g, ']')
    .replace(/^#{1,6} .*$/gm, ' ');

  const seen = new Set<string>();
  const missing: string[] = [];
  for (const match of prose.matchAll(TOKEN)) {
    const token = match[0];
    // A numbered member of a family already written out counts as explained: once
    // "cluster of differentiation (CD)" has appeared, CD3 and CD68 need nothing more.
    const parts = flaggedParts(token).filter((part) => {
      // "PBMCs" written out covers a later "PBMC", and the other way round.
      if (seen.has(part) || seen.has(`${part}s`) || seen.has(part.replace(/s$/, ''))) return false;
      const family = /^([A-Z]{2,})\d+$/.exec(part)?.[1];
      return !(family && seen.has(family));
    });
    if (parts.length === 0) continue;
    const start = match.index ?? 0;
    const before = prose.slice(Math.max(0, start - 2), start);
    const after = prose.slice(start + token.length, start + token.length + 3);
    const inBrackets = /\($/.test(before) && /^[),;]/.test(after);
    // "PEM (post-exertional malaise)", or in a quotation the editorial "LC [long COVID]".
    const expandedAfter = /^ ?[([]/.test(after) && !/^ ?[([]\d/.test(after);
    const named = isExplainedName(prose, start, token);
    for (const part of parts) {
      seen.add(part);
      if (!inBrackets && !expandedAfter && !named) missing.push(part);
    }
  }
  return missing;
}
