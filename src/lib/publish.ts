import matter from 'gray-matter';
import { createHash, timingSafeEqual } from 'node:crypto';
import type { ReviewFrontmatter } from './types';

export function slugify(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

/** Constant-time password check. Hashing first keeps the comparison length-independent. */
export function passwordMatches(supplied: string, expected: string): boolean {
  const digest = (value: string) => createHash('sha256').update(value, 'utf8').digest();
  return timingSafeEqual(digest(supplied), digest(expected));
}

export interface BuiltReview {
  slug: string;
  markdown: string;
  /** Normalised frontmatter, for previewing the card before publishing. */
  review: ReviewFrontmatter;
}

const strings = (value: unknown): string[] =>
  Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : [];

const text = (value: unknown): string | undefined => {
  const out = typeof value === 'string' ? value.trim() : value != null ? String(value).trim() : '';
  return out || undefined;
};

const level = (value: unknown): 'high' | 'moderate' | 'low' | undefined => {
  const out = typeof value === 'string' ? value.trim().toLowerCase() : '';
  return out === 'high' || out === 'moderate' || out === 'low' ? out : undefined;
};

/**
 * Parses a complete review file — the whole thing Claude writes, frontmatter and all —
 * and normalises it into the file that gets committed. There are no separate form
 * fields: everything comes from the pasted frontmatter, so what you publish is exactly
 * what you reviewed.
 *
 * `slugOverride` only renames the file; it never changes the content.
 */
export function buildReviewFile(raw: string, slugOverride?: string): BuiltReview {
  const source = (raw ?? '').trim();
  if (!source) throw new Error('Nothing pasted yet.');

  if (!source.startsWith('---')) {
    throw new Error(
      'No frontmatter found. The review needs to start with a --- block carrying at least title, score and verdict.',
    );
  }

  let parsed;
  try {
    parsed = matter(source);
  } catch (error) {
    throw new Error(
      `The frontmatter is not valid YAML: ${error instanceof Error ? error.message.split('\n')[0] : 'unknown error'}`,
    );
  }

  const data = parsed.data as Record<string, unknown>;

  const title = text(data.title);
  if (!title) throw new Error('Frontmatter is missing "title".');

  const score = typeof data.score === 'number' ? data.score : Number(data.score);
  if (!Number.isFinite(score) || score < 0 || score > 10) {
    throw new Error(
      data.score == null
        ? 'Frontmatter is missing "score".'
        : `"score" must be a number from 0 to 10, got ${String(data.score)}.`,
    );
  }

  const verdict = text(data.verdict);
  if (!verdict) {
    throw new Error('Frontmatter is missing "verdict" — one sentence for the index page.');
  }

  const content = parsed.content.trim();
  if (!content) throw new Error('The review body is empty — only frontmatter was pasted.');

  // gray-matter turns an unquoted YAML date into a Date object.
  const reviewedOn =
    data.reviewedOn instanceof Date
      ? data.reviewedOn.toISOString().slice(0, 10)
      : String(data.reviewedOn ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedOn)) {
    throw new Error(`"reviewedOn" must be a YYYY-MM-DD date, got ${String(data.reviewedOn)}.`);
  }

  const year = Number(data.year);

  const review: ReviewFrontmatter = {
    title,
    authors: text(data.authors),
    journal: text(data.journal),
    year: Number.isFinite(year) && year > 0 ? year : undefined,
    doi: text(data.doi),
    url: text(data.url),
    conditions: strings(data.conditions),
    studyType: text(data.studyType),
    score,
    verdict,
    confidence: level(data.confidence),
    importance: level(data.importance),
    strengths: strings(data.strengths),
    weaknesses: strings(data.weaknesses),
    reviewedOn,
    guideVersion: text(data.guideVersion),
    model: text(data.model),
  };

  const out: Record<string, unknown> = { ...review };
  for (const key of Object.keys(out)) {
    const value = out[key];
    if (value === undefined || (Array.isArray(value) && value.length === 0)) delete out[key];
  }

  const slug = slugify(slugOverride || text(data.slug) || title);
  if (!slug) throw new Error('Could not work out a filename. Set one below.');

  return { slug, review, markdown: matter.stringify(content, out) };
}
