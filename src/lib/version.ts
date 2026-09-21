/**
 * Methods versioning. The guide, the reviewing instructions and the project prompt
 * share one number, and every review records which one it was written under. Rather
 * than typing the next number, the editor says what kind of change it was.
 *
 * No fs imports here: the /admin editor is a client component and previews the result.
 */
export const CHANGE_KINDS = ['patch', 'minor', 'major'] as const;
export type ChangeKind = (typeof CHANGE_KINDS)[number];

export const CHANGE_LABELS: Record<ChangeKind, { label: string; help: string }> = {
  patch: {
    label: 'Wording or a clarification',
    help: 'Says the same thing more clearly. Could not move a grade on its own.',
  },
  minor: {
    label: 'A new or changed criterion',
    help: 'Something a review is judged on has changed, so the same paper could now score differently.',
  },
  major: {
    label: 'A rewrite',
    help: 'The method has been reorganised or rethought, not just amended.',
  },
};

export function isChangeKind(value: unknown): value is ChangeKind {
  return typeof value === 'string' && (CHANGE_KINDS as readonly string[]).includes(value);
}

/**
 * The next version after `current`. Versions are written as short as they can be:
 * a criterion change on 0.3.2 gives 0.4, not 0.4.0.
 *
 *   patch  0.3 -> 0.3.1,  0.3.1 -> 0.3.2
 *   minor  0.3 -> 0.4,    0.3.1 -> 0.4
 *   major  0.3 -> 1.0,    1.2.5 -> 2.0
 */
export function bumpVersion(current: string | null | undefined, kind: ChangeKind): string {
  const parts = String(current ?? '')
    .trim()
    .split('.')
    .map((part) => Number(part.trim()));

  const [major = 0, minor = 0, patch = 0] = parts.map((n) => (Number.isFinite(n) && n >= 0 ? Math.floor(n) : 0));

  switch (kind) {
    case 'patch':
      return `${major}.${minor}.${patch + 1}`;
    case 'minor':
      return `${major}.${minor + 1}`;
    case 'major':
      return `${major + 1}.0`;
  }
}

export const NOTE_LIMITS = { min: 4, max: 300 };

/** The changelog line is published, so it has to say something. */
export function validateNote(note: string): string | null {
  const trimmed = note.trim();
  if (trimmed.length < NOTE_LIMITS.min) return 'Say in a line what changed. It goes in the published changelog.';
  if (trimmed.length > NOTE_LIMITS.max) return `Keep the note under ${NOTE_LIMITS.max} characters.`;
  return null;
}
