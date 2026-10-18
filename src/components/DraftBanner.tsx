'use client';

import { useState } from 'react';
import Link from 'next/link';
import { HUMAN_INPUT_LABELS, HUMAN_INPUT_LEVELS, type HumanInput } from '@/lib/types';
import { DEFAULTS } from '@/lib/site-text-schema';

/**
 * Top of the admin preview: says plainly that this is not public, and lets the editor
 * publish once they have read it, with the human-input level set in the same step.
 */
export function DraftBanner({
  slug,
  draft,
  humanInput: initial,
}: {
  slug: string;
  draft: boolean;
  humanInput: HumanInput | null;
}) {
  const [humanInput, setHumanInput] = useState<HumanInput | ''>(initial ?? '');
  const [state, setState] = useState<'idle' | 'busy' | 'published' | 'error'>('idle');
  const [error, setError] = useState<string | null>(null);

  async function publish() {
    setState('busy');
    setError(null);
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action: 'restore', humanInput: humanInput || undefined }),
      });
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (response.status === 401) throw new Error('Your admin session has ended. Sign in again at /admin.');
      if (!json.ok) throw new Error(json.error ?? 'Could not publish.');
      setState('published');
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not publish.');
      setState('error');
    }
  }

  if (!draft || state === 'published') {
    return (
      <div className="draft-banner live" role="status">
        <strong>{state === 'published' ? 'Published.' : 'This review is public.'}</strong>{' '}
        {state === 'published' ? 'It will be live in a minute or two, once the site has rebuilt. ' : ''}
        <Link href={`/reviews/${slug}`}>Open the public page</Link> · <Link href="/admin">Admin</Link>
      </div>
    );
  }

  return (
    <div className="draft-banner" role="status">
      <p>
        <strong>Draft — not public.</strong> Only you can see this, because you are signed in. This
        is how it will look once published. Comments and ratings are left out until then.
      </p>
      <div className="draft-banner-actions">
        <label>
          Human input
          <select value={humanInput} onChange={(e) => setHumanInput(e.target.value as HumanInput | '')}>
            <option value="">Choose…</option>
            {HUMAN_INPUT_LEVELS.map((level) => (
              <option key={level} value={level}>
                {HUMAN_INPUT_LABELS[level]} — {DEFAULTS[`humanInput.${level}`]}
              </option>
            ))}
          </select>
        </label>
        <button type="button" className="primary" disabled={!humanInput || state === 'busy'} onClick={publish}>
          {state === 'busy' ? 'Publishing…' : 'Publish'}
        </button>
        <Link href="/admin">Back to admin</Link>
      </div>
      {error && <p className="notice err">{error}</p>}
    </div>
  );
}
