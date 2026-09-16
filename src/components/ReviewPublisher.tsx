'use client';

import { useEffect, useState } from 'react';
import type { ReviewFrontmatter } from '@/lib/types';
import { ReviewCard } from './ReviewCard';

interface Parsed {
  slug?: string;
  review?: ReviewFrontmatter;
  error?: string;
}

interface Result {
  ok?: boolean;
  slug?: string;
  replaced?: boolean;
  commitUrl?: string;
  error?: string;
  exists?: boolean;
}

export function ReviewPublisher({ password }: { password: string }) {
  const [body, setBody] = useState('');
  const [slug, setSlug] = useState('');
  const [parsed, setParsed] = useState<Parsed | null>(null);
  const [overwrite, setOverwrite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  // Parse on the server as you type, so the preview below is the real thing that
  // would be committed rather than a second, client-side guess at it.
  useEffect(() => {
    if (!body.trim()) {
      setParsed(null);
      return;
    }

    let cancelled = false;
    const timer = setTimeout(() => {
      fetch('/api/admin/preview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body }),
      })
        .then((response) => response.json())
        .then((json: Parsed) => {
          if (!cancelled) setParsed(json);
        })
        .catch(() => {
          if (!cancelled) setParsed({ error: 'Could not reach the server to check this.' });
        });
    }, 400);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [body]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body, slug: slug || undefined, password, overwrite }),
      });
      const json = (await response.json()) as Result;
      setResult(json);
      if (json.ok) {
        setBody('');
        setSlug('');
        setParsed(null);
        setOverwrite(false);
      }
    } catch {
      setResult({ error: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  }

  const ready = Boolean(parsed?.review);

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="review-body">Paste the review</label>
        <textarea
          id="review-body"
          rows={14}
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder={'---\ntitle: "…"\nscore: 6.5\nverdict: "…"\n---\n\n## Executive summary\n…'}
          required
        />
        <p className="hint">
          The whole file Claude wrote, frontmatter included. Everything else is read from it.
        </p>
      </div>

      {parsed?.error && (
        <div className="notice err">
          {parsed.error}
        </div>
      )}

      {parsed?.review && (
        <>
          <p className="preview-label">How it will look on the index</p>
          <div className="preview">
            <ReviewCard review={parsed.review} />
          </div>

          {!parsed.review.model && (
            <p className="hint warn">
              No <code>model</code> in the frontmatter. Add the model that wrote this
              (e.g. <code>claude-opus-5</code>) — it publishes either way, but the review page
              will say the model is unrecorded.
            </p>
          )}

          <div className="field-row">
            <div className="field">
              <label htmlFor="review-slug">Filename</label>
              <input
                id="review-slug"
                type="text"
                value={slug}
                placeholder={parsed.slug}
                onChange={(event) => setSlug(event.target.value)}
              />
              <p className="hint">Leave blank to use the one derived from the title.</p>
            </div>
            <div className="field">
              <label htmlFor="overwrite" className="checkbox">
                <input
                  id="overwrite"
                  type="checkbox"
                  checked={overwrite}
                  onChange={(event) => setOverwrite(event.target.checked)}
                />
                Replace if it already exists
              </label>
            </div>
          </div>
        </>
      )}

      <button className="primary" type="submit" disabled={busy || !ready || !password}>
        {busy ? 'Publishing…' : 'Publish'}
      </button>
      {!password && <p className="hint">Enter the admin password above to publish.</p>}

      {result?.ok && (
        <div className="notice ok">
          {result.replaced ? 'Replaced' : 'Published'}. Vercel is rebuilding — it will be live at{' '}
          <a href={`/reviews/${result.slug}`}>/reviews/{result.slug}</a> in a minute or two.
          {result.commitUrl && (
            <>
              {' '}
              <a href={result.commitUrl} target="_blank" rel="noreferrer">
                See the commit
              </a>
              .
            </>
          )}
        </div>
      )}
      {result?.error && <div className="notice err">{result.error}</div>}
    </form>
  );
}
