'use client';

import { useEffect, useState } from 'react';
import { HUMAN_INPUT_LABELS, HUMAN_INPUT_LEVELS, type HumanInput } from '@/lib/types';

interface Row {
  slug: string;
  title: string;
  kind: string;
  draft: boolean;
  reviewedOn: string;
  guideVersion: string | null;
  guideNotes: string[];
  humanInput: HumanInput | null;
  preprint: boolean;
}

export function ReviewManager({ onExpired }: { onExpired: () => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/admin/reviews')
      .then((response) => {
        if (response.status === 401) {
          onExpired();
          return null;
        }
        return response.json();
      })
      .then((json: { reviews?: Row[]; error?: string } | null) => {
        if (!json) return;
        if (json.reviews) setRows(json.reviews);
        else setError(json.error ?? 'Could not load reviews.');
      })
      .catch(() => setError('Could not load reviews.'));
  }, [onExpired]);

  async function act(slug: string, action: 'withdraw' | 'restore' | 'humanInput', humanInput?: HumanInput) {
    if (action === 'withdraw' && !window.confirm('Withdraw this review from the site? It can be restored later.')) return;
    setBusy(slug);
    setError(null);
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action, humanInput }),
      });
      if (response.status === 401) {
        onExpired();
        return;
      }
      const json = (await response.json()) as {
        ok?: boolean;
        draft?: boolean;
        humanInput?: HumanInput | null;
        error?: string;
      };
      if (json.ok) {
        setRows((current) =>
          current
            ? current.map((row) =>
                row.slug === slug
                  ? { ...row, draft: Boolean(json.draft), humanInput: json.humanInput ?? row.humanInput }
                  : row,
              )
            : current,
        );
      } else {
        setError(json.error ?? 'Could not update the review.');
      }
    } catch {
      setError('Could not reach the server.');
    } finally {
      setBusy(null);
    }
  }

  if (error && !rows) return <div className="notice err">{error}</div>;
  if (!rows) return <p className="empty">Loading…</p>;

  const notes = rows.flatMap((row) => row.guideNotes.map((note) => ({ note, slug: row.slug, title: row.title })));

  return (
    <div>
      <p className="hint">
        A draft is not on the site. Open it to read it exactly as it will look, then set the human
        input and publish. Withdrawing turns a public review back into a draft straight away, and
        can be undone. The commit history keeps the text; a takedown that needs it gone from the
        repository too is a deliberate git step, not a button.
      </p>

      <ul className="manage-list">
        {rows.map((row) => (
          <li key={row.slug} className={row.draft ? 'withdrawn' : ''}>
            <div className="manage-main">
              {/* A draft has no public page yet; its title opens the preview instead. */}
              <a href={row.draft ? `/admin/preview/${row.slug}` : `/reviews/${row.slug}`}>{row.title}</a>
              <span className="manage-meta">
                {row.reviewedOn} · {row.kind}
                {row.preprint ? ' (preprint)' : ''}
                {row.guideVersion ? ` · guide v${row.guideVersion}` : ' · no guide version'}
                {row.draft ? ' · draft, not public' : ''}
              </span>
              <label className="manage-input">
                Human input{' '}
                <select
                  value={row.humanInput ?? ''}
                  disabled={busy === row.slug}
                  onChange={(event) => {
                    const value = event.target.value as HumanInput;
                    if (value) act(row.slug, 'humanInput', value);
                  }}
                >
                  {!row.humanInput && <option value="">Not recorded</option>}
                  {HUMAN_INPUT_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {HUMAN_INPUT_LABELS[level]}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div className="manage-actions">
              {row.draft && (
                <a className="secondary small" href={`/admin/preview/${row.slug}`}>
                  Preview
                </a>
              )}
              <button
                type="button"
                className={row.draft ? 'primary' : 'secondary'}
                disabled={busy === row.slug || (row.draft && !row.humanInput)}
                title={row.draft && !row.humanInput ? 'Set the human input first' : undefined}
                onClick={() => act(row.slug, row.draft ? 'restore' : 'withdraw')}
              >
                {busy === row.slug ? '…' : row.draft ? 'Publish' : 'Withdraw'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {error && <div className="notice err">{error}</div>}

      <h2 className="manage-heading">Notes for the guide</h2>
      {notes.length === 0 ? (
        <p className="hint">No review has flagged anything for the guide yet.</p>
      ) : (
        <ul className="notes-list">
          {notes.map((item, index) => (
            <li key={`${item.slug}-${index}`}>
              {item.note}{' '}
              <a href={`/reviews/${item.slug}`} className="manage-meta">
                — {item.title.length > 60 ? `${item.title.slice(0, 60)}…` : item.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
