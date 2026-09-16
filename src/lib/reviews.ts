import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import { REVIEW_KINDS, SIGNALS, type ContextNote, type Review, type ReviewFrontmatter, type ReviewKind, type Signal } from './types';

const REVIEWS_DIR = path.join(process.cwd(), 'content', 'reviews');

function coerce(data: Record<string, unknown>, slug: string): ReviewFrontmatter {
  const title = typeof data.title === 'string' ? data.title.trim() : '';
  if (!title) throw new Error(`${slug}: frontmatter is missing "title"`);

  const rawKind = typeof data.kind === 'string' ? data.kind.trim().toLowerCase() : 'paper';
  if (!(REVIEW_KINDS as string[]).includes(rawKind)) {
    throw new Error(`${slug}: "kind" must be one of ${REVIEW_KINDS.join(', ')}, got ${rawKind}`);
  }
  const kind = rawKind as ReviewKind;

  let score: number | undefined;
  if (kind === 'paper') {
    const parsedScore = typeof data.score === 'number' ? data.score : Number(data.score);
    if (!Number.isFinite(parsedScore) || parsedScore < 0 || parsedScore > 10) {
      throw new Error(`${slug}: "score" must be a number from 0 to 10, got ${String(data.score)}`);
    }
    score = parsedScore;
  }

  let signal: Signal | undefined;
  if (kind === 'preliminary') {
    const rawSignal =
      typeof data.signal === 'string' ? data.signal.trim().toLowerCase().replace(/\s+/g, '-') : '';
    if (!(SIGNALS as string[]).includes(rawSignal)) {
      throw new Error(`${slug}: "signal" must be one of ${SIGNALS.join(', ')}, got ${rawSignal}`);
    }
    signal = rawSignal as Signal;
  }

  const verdict = typeof data.verdict === 'string' ? data.verdict.trim() : '';
  if (!verdict) throw new Error(`${slug}: frontmatter is missing "verdict"`);

  // gray-matter turns unquoted YAML dates into Date objects; normalise to YYYY-MM-DD.
  const reviewedOn =
    data.reviewedOn instanceof Date
      ? data.reviewedOn.toISOString().slice(0, 10)
      : String(data.reviewedOn ?? '').slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(reviewedOn)) {
    throw new Error(`${slug}: "reviewedOn" must be a YYYY-MM-DD date`);
  }

  const strings = (value: unknown): string[] =>
    Array.isArray(value) ? value.map((v) => String(v).trim()).filter(Boolean) : [];

  const contextNotes = (value: unknown): ContextNote[] =>
    Array.isArray(value)
      ? value
          .map((entry): ContextNote | undefined => {
            if (typeof entry === 'string') return entry.trim() ? { note: entry.trim() } : undefined;
            if (entry && typeof entry === 'object') {
              const record = entry as Record<string, unknown>;
              const note = String(record.note ?? '').trim();
              const source = String(record.source ?? '').trim();
              if (!note) return undefined;
              return source ? { note, source } : { note };
            }
            return undefined;
          })
          .filter((entry): entry is ContextNote => entry !== undefined)
      : [];

  return {
    title,
    authors: typeof data.authors === 'string' ? data.authors : undefined,
    journal: typeof data.journal === 'string' ? data.journal : undefined,
    year: Number.isFinite(Number(data.year)) ? Number(data.year) : undefined,
    doi: typeof data.doi === 'string' && data.doi ? data.doi : undefined,
    url: typeof data.url === 'string' && data.url ? data.url : undefined,
    conditions: strings(data.conditions),
    studyType: typeof data.studyType === 'string' ? data.studyType : undefined,
    kind,
    score,
    signal,
    verdict,
    confidence: data.confidence as ReviewFrontmatter['confidence'],
    importance: data.importance as ReviewFrontmatter['importance'],
    strengths: strings(data.strengths),
    weaknesses: strings(data.weaknesses),
    context: contextNotes(data.context),
    reviewedOn,
    guideVersion: data.guideVersion != null ? String(data.guideVersion) : undefined,
    model: typeof data.model === 'string' ? data.model : undefined,
    draft: data.draft === true,
  };
}

export function getAllReviews(): Review[] {
  if (!fs.existsSync(REVIEWS_DIR)) return [];

  return fs
    .readdirSync(REVIEWS_DIR)
    .filter((file) => file.endsWith('.md'))
    .map((file) => {
      const slug = file.replace(/\.md$/, '');
      const raw = fs.readFileSync(path.join(REVIEWS_DIR, file), 'utf8');
      const { data, content } = matter(raw);
      return { ...coerce(data, slug), slug, body: content.trim() };
    })
    .filter((review) => !review.draft)
    .sort((a, b) => b.reviewedOn.localeCompare(a.reviewedOn) || a.title.localeCompare(b.title));
}

export function getReview(slug: string): Review | undefined {
  return getAllReviews().find((review) => review.slug === slug);
}

export function getAllConditions(reviews: Review[]): string[] {
  return [...new Set(reviews.flatMap((r) => r.conditions ?? []))].sort((a, b) => a.localeCompare(b));
}

export function citationOf(review: Review): string {
  return [review.authors, review.journal, review.year].filter(Boolean).join(' · ');
}

export function paperLink(review: Review): string | undefined {
  if (review.url) return review.url;
  if (review.doi) return `https://doi.org/${review.doi.replace(/^https?:\/\/doi\.org\//, '')}`;
  return undefined;
}
