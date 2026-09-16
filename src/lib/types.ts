export type Confidence = 'high' | 'moderate' | 'low';
export type Importance = 'high' | 'moderate' | 'low';

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
  /** 0–10, in 0.5 steps. The headline grade. */
  score: number;
  /** One sentence. The single most useful thing a reader can take away. */
  verdict: string;
  /** Optional: how sure the grade is, given what the paper actually reports. */
  confidence?: Confidence;
  /** Optional: how much it would matter if the finding held up. */
  importance?: Importance;
  strengths?: string[];
  weaknesses?: string[];
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

export interface ScoreBand {
  label: string;
  /** Maps to a --band-* colour pair in globals.css */
  tone: 'strong' | 'solid' | 'borderline' | 'weak' | 'fatal';
}

/**
 * Bands exist to stop small score differences reading as meaningful.
 * Anything under 5 does not pass, matching how the reviews already use "FAIL".
 */
export function scoreBand(score: number): ScoreBand {
  if (score >= 8) return { label: 'Strong', tone: 'strong' };
  if (score >= 6.5) return { label: 'Solid', tone: 'solid' };
  if (score >= 5) return { label: 'Borderline', tone: 'borderline' };
  if (score >= 3) return { label: 'Fails', tone: 'weak' };
  return { label: 'Fatal flaws', tone: 'fatal' };
}

export function formatScore(score: number): string {
  return Number.isInteger(score) ? String(score) : score.toFixed(1);
}
