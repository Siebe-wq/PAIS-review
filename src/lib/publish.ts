import matter from 'gray-matter';
import { createHash, timingSafeEqual } from 'node:crypto';

export interface PublishInput {
  slug?: string;
  title?: string;
  authors?: string;
  journal?: string;
  year?: string | number;
  doi?: string;
  url?: string;
  conditions?: string;
  studyType?: string;
  score?: string | number;
  verdict?: string;
  confidence?: string;
  importance?: string;
  strengths?: string;
  weaknesses?: string;
  reviewedOn?: string;
  guideVersion?: string;
  model?: string;
  body?: string;
}

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

const splitLines = (value?: string): string[] =>
  (value ?? '')
    .split('\n')
    .map((line) => line.replace(/^\s*[-*]\s*/, '').trim())
    .filter(Boolean);

const splitCommas = (value?: string): string[] =>
  (value ?? '')
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean);

export interface BuiltReview {
  slug: string;
  markdown: string;
  title: string;
}

/**
 * Builds the review file. If `body` already carries YAML frontmatter — which is
 * what Claude produces when it writes a whole review file — that frontmatter wins
 * and the form fields only fill the gaps.
 */
export function buildReviewFile(input: PublishInput): BuiltReview {
  const raw = (input.body ?? '').trim();
  const pasted = raw.startsWith('---') ? matter(raw) : { data: {}, content: raw };
  const pastedData = pasted.data as Record<string, unknown>;

  const pick = <T,>(fromPaste: unknown, fromForm: T | undefined): T | undefined =>
    fromPaste !== undefined && fromPaste !== null && fromPaste !== ''
      ? (fromPaste as T)
      : fromForm;

  const title = String(pick(pastedData.title, input.title) ?? '').trim();
  if (!title) throw new Error('Title is required.');

  const scoreRaw = pick(pastedData.score, input.score);
  const score = typeof scoreRaw === 'number' ? scoreRaw : Number(scoreRaw);
  if (!Number.isFinite(score) || score < 0 || score > 10) {
    throw new Error('Score must be a number from 0 to 10.');
  }

  const verdict = String(pick(pastedData.verdict, input.verdict) ?? '').trim();
  if (!verdict) throw new Error('Verdict is required — one sentence a reader can act on.');

  const content = pasted.content.trim();
  if (!content) throw new Error('The review body is empty.');

  const reviewedOnRaw: unknown = pick(pastedData.reviewedOn, input.reviewedOn);
  const reviewedOn =
    reviewedOnRaw instanceof Date
      ? reviewedOnRaw.toISOString().slice(0, 10)
      : String(reviewedOnRaw ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedOn)) {
    throw new Error('Reviewed date must be YYYY-MM-DD.');
  }

  const yearRaw = pick(pastedData.year, input.year);
  const year = Number(yearRaw);

  const list = (fromPaste: unknown, fromForm: string | undefined, mode: 'lines' | 'commas') =>
    Array.isArray(fromPaste)
      ? fromPaste.map((v) => String(v).trim()).filter(Boolean)
      : mode === 'lines'
        ? splitLines(fromForm)
        : splitCommas(fromForm);

  const data: Record<string, unknown> = {
    title,
    authors: pick(pastedData.authors, input.authors) || undefined,
    journal: pick(pastedData.journal, input.journal) || undefined,
    year: Number.isFinite(year) && year > 0 ? year : undefined,
    doi: pick(pastedData.doi, input.doi) || undefined,
    url: pick(pastedData.url, input.url) || undefined,
    conditions: list(pastedData.conditions, input.conditions, 'commas'),
    studyType: pick(pastedData.studyType, input.studyType) || undefined,
    score,
    verdict,
    confidence: pick(pastedData.confidence, input.confidence) || undefined,
    importance: pick(pastedData.importance, input.importance) || undefined,
    strengths: list(pastedData.strengths, input.strengths, 'lines'),
    weaknesses: list(pastedData.weaknesses, input.weaknesses, 'lines'),
    reviewedOn,
    guideVersion: pick(pastedData.guideVersion, input.guideVersion) || undefined,
    model: pick(pastedData.model, input.model) || 'Claude',
  };

  for (const key of Object.keys(data)) {
    const value = data[key];
    if (value === undefined || (Array.isArray(value) && value.length === 0)) delete data[key];
  }

  const slug = slugify(input.slug || String(pastedData.slug ?? '') || title);
  if (!slug) throw new Error('Could not derive a slug — give the review a filename.');

  return { slug, title, markdown: matter.stringify(content, data) };
}
