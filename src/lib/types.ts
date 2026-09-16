export type Confidence = 'high' | 'moderate' | 'low';
export type Importance = 'high' | 'moderate' | 'low';

/**
 * What is being reviewed. This decides how the verdict is expressed:
 * a single paper gets a 0–10 score; preliminary findings get a coarse ordinal,
 * because a decimal grade on unpublished data is false precision; a literature
 * review gets neither, because "how good is this body of evidence" is not the
 * same question the score was built to answer.
 */
export type ReviewKind = 'paper' | 'literature' | 'preliminary';

export const REVIEW_KINDS: ReviewKind[] = ['paper', 'literature', 'preliminary'];

export const KIND_LABELS: Record<ReviewKind, string> = {
  paper: 'Paper',
  literature: 'Literature review',
  preliminary: 'Preliminary findings',
};

/** The coarse ordinal used for preliminary findings. */
export type Signal = 'promising' | 'mixed' | 'unconvincing' | 'too-early';

export const SIGNALS: Signal[] = ['promising', 'mixed', 'unconvincing', 'too-early'];

export const SIGNAL_LABELS: Record<Signal, string> = {
  promising: 'Promising',
  mixed: 'Mixed',
  unconvincing: 'Unconvincing',
  'too-early': 'Too early',
};

/**
 * Something outside the paper that bears on how to read it — a funder's history, a
 * market reaction, an undisclosed tie. Published as fact about named people and
 * companies, so `source` matters: an unsourced note is an allegation.
 */
export interface ContextNote {
  note: string;
  source?: string;
}

/** Frontmatter as authored in content/reviews/*.md */
export interface ReviewFrontmatter {
  title: string;
  authors?: string;
  journal?: string;
  year?: number;
  doi?: string;
  url?: string;
  /** Free tags, e.g. ["ME/CFS", "Long Covid"] — drive the index filters. */
  conditions?: string[];
  studyType?: string;
  kind: ReviewKind;
  /** 0–10, in 0.5 steps. Papers only. */
  score?: number;
  /** Coarse ordinal. Preliminary findings only. */
  signal?: Signal;
  /** One sentence. The single most useful thing a reader can take away. */
  verdict: string;
  /** Optional: how sure the verdict is, given what the source actually reports. */
  confidence?: Confidence;
  /** Optional: how much it would matter if the finding held up. */
  importance?: Importance;
  strengths?: string[];
  weaknesses?: string[];
  context?: ContextNote[];
  reviewedOn: string;
  guideVersion?: string;
  model?: string;
  /** Set true while drafting; excluded from the site. */
  draft?: boolean;
}

export interface Review extends ReviewFrontmatter {
  slug: string;
  body: string;
}

export type Tone = 'strong' | 'solid' | 'borderline' | 'weak' | 'fatal' | 'neutral';

export interface Verdict {
  /** Big text in the badge: a number for papers, a word otherwise. */
  headline: string;
  /** Small text under it. */
  label: string;
  tone: Tone;
  /** Papers show "/ 10" under the number; nothing else does. */
  showDenominator: boolean;
}

/**
 * Bands exist to stop small score differences reading as meaningful.
 * Anything under 5 does not pass, matching how the reviews already use "FAIL".
 */
export function scoreBand(score: number): { label: string; tone: Tone } {
  if (score >= 8) return { label: 'Strong', tone: 'strong' };
  if (score >= 6.5) return { label: 'Solid', tone: 'solid' };
  if (score >= 5) return { label: 'Borderline', tone: 'borderline' };
  if (score >= 3) return { label: 'Fails', tone: 'weak' };
  return { label: 'Fatal flaws', tone: 'fatal' };
}

const SIGNAL_TONES: Record<Signal, Tone> = {
  promising: 'strong',
  mixed: 'borderline',
  unconvincing: 'weak',
  'too-early': 'neutral',
};

export function formatScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}

/** How a review's verdict is rendered on the badge, whatever kind it is. */
export function verdictOf(review: Pick<ReviewFrontmatter, 'kind' | 'score' | 'signal'>): Verdict {
  if (review.kind === 'paper' && typeof review.score === 'number') {
    const band = scoreBand(review.score);
    return {
      headline: formatScore(review.score),
      label: band.label,
      tone: band.tone,
      showDenominator: true,
    };
  }

  if (review.kind === 'preliminary' && review.signal) {
    return {
      headline: SIGNAL_LABELS[review.signal],
      label: 'Preliminary',
      tone: SIGNAL_TONES[review.signal],
      showDenominator: false,
    };
  }

  return { headline: 'Review', label: 'Literature', tone: 'neutral', showDenominator: false };
}
