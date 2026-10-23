'use client';

import { useEffect, useState } from 'react';
import { HUMAN_INPUT_LABELS, HUMAN_INPUT_LEVELS, type HumanInput, type ReviewKind, type Signal } from '@/lib/types';
import { EMPTY_TAGS, type TagList } from '@/lib/tags';
import { ScoreBadge } from './ScoreBadge';

interface Row {
  slug: string;
  title: string;
  kind: ReviewKind;
  draft: boolean;
  reviewedOn: string;
  guideVersion: string | null;
  guideNotes: string[];
  humanInput: HumanInput | null;
  preprint: boolean;
  design: string | null;
  topics: string[];
  score: number | null;
  signal: Signal | null;
  verdict: string;
}

type Action = 'withdraw' | 'restore' | 'humanInput' | 'tags';

export function ReviewManager({ onExpired }: { onExpired: () => void }) {
  const [rows, setRows] = useState<Row[] | null>(null);
  const [tags, setTags] = useState<TagList>(EMPTY_TAGS);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = (url: string) =>
      fetch(url).then((response) => {
        if (response.status === 401) {
          onExpired();
          return null;
        }
        return response.json();
      });
    load('/api/admin/reviews')
      .then((json: { reviews?: Row[]; error?: string } | null) => {
        if (!json) return;
        if (json.reviews) setRows(json.reviews);
        else setError(json.error ?? 'Could not load reviews.');
      })
      .catch(() => setError('Could not load reviews.'));
    // Without the list the tag editor is simply empty; the rest still works.
    load('/api/admin/tags')
      .then((json: { tags?: TagList } | null) => json?.tags && setTags(json.tags))
      .catch(() => {});
  }, [onExpired]);

  async function act(slug: string, action: Action, extra: Record<string, unknown> = {}) {
    if (action === 'withdraw' && !window.confirm('Withdraw this review from the site? It can be restored later.')) return;
    setBusy(slug);
    setError(null);
    try {
      const response = await fetch('/api/admin/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, action, ...extra }),
      });
      if (response.status === 401) {
        onExpired();
        return;
      }
      const json = (await response.json()) as {
        ok?: boolean;
        draft?: boolean;
        humanInput?: HumanInput | null;
        design?: string | null;
        topics?: string[];
        error?: string;
      };
      if (json.ok) {
        setRows((current) =>
          current
            ? current.map((row) =>
                row.slug === slug
                  ? {
                      ...row,
                      draft: Boolean(json.draft),
                      humanInput: json.humanInput ?? row.humanInput,
                      design: json.design ?? null,
                      topics: json.topics ?? [],
                    }
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

  const drafts = rows.filter((row) => row.draft);
  const published = rows.filter((row) => !row.draft);
  const notes = rows.flatMap((row) => row.guideNotes.map((note) => ({ note, slug: row.slug, title: row.title })));

  const item = (row: Row) => (
    <li key={row.slug} className={row.draft ? 'is-draft' : ''}>
      <div className="manage-row">
        <div className="manage-score">
          <ScoreBadge review={{ kind: row.kind, score: row.score ?? undefined, signal: row.signal ?? undefined }} />
        </div>
        <div className="manage-main">
          {/* A draft has no public page yet; its title opens the preview instead. */}
          <a href={row.draft ? `/admin/preview/${row.slug}` : `/reviews/${row.slug}`}>{row.title}</a>
          <span className="manage-meta">
            {row.reviewedOn} · {row.kind}
            {row.preprint ? ' (preprint)' : ''}
            {row.guideVersion ? ` · guide v${row.guideVersion}` : ' · no guide version'}
          </span>
          {row.draft && <p className="manage-verdict">{row.verdict}</p>}
          <label className="manage-input">
            Human input{' '}
            <select
              value={row.humanInput ?? ''}
              disabled={busy === row.slug}
              onChange={(event) => {
                const value = event.target.value as HumanInput;
                if (value) act(row.slug, 'humanInput', { humanInput: value });
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
          <TagEditor
            key={`${row.design}|${row.topics.join(',')}`}
            row={row}
            tags={tags}
            busy={busy === row.slug}
            onSave={(design, topics) => act(row.slug, 'tags', { design, topics })}
          />
        </div>
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
  );

  return (
    <div>
      <p className="hint">
        A draft is not on the site. Open it to read it exactly as it will look, then set the human
        input and publish. Withdrawing turns a public review back into a draft straight away, and
        can be undone. The commit history keeps the text; a takedown that needs it gone from the
        repository too is a deliberate git step, not a button.
      </p>

      {error && <div className="notice err">{error}</div>}

      <h2 className="manage-heading">Drafts waiting ({drafts.length})</h2>
      {drafts.length === 0 ? (
        <p className="hint">Nothing waiting.</p>
      ) : (
        <ul className="manage-list">{drafts.map(item)}</ul>
      )}

      <h2 className="manage-heading">Published ({published.length})</h2>
      <ul className="manage-list">{published.map(item)}</ul>

      <h2 className="manage-heading">Notes for the guide</h2>
      {notes.length === 0 ? (
        <p className="hint">No review has flagged anything for the guide yet.</p>
      ) : (
        <ul className="notes-list">
          {notes.map((note, index) => (
            <li key={`${note.slug}-${index}`}>
              {note.note}{' '}
              <a href={`/reviews/${note.slug}`} className="manage-meta">
                — {note.title.length > 60 ? `${note.title.slice(0, 60)}…` : note.title}
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Folded by default: one line saying what is set, opening to a design menu and topic toggles. */
function TagEditor({
  row,
  tags,
  busy,
  onSave,
}: {
  row: Row;
  tags: TagList;
  busy: boolean;
  onSave: (design: string | null, topics: string[]) => void;
}) {
  const [design, setDesign] = useState(row.design ?? '');
  const [topics, setTopics] = useState<string[]>(row.topics);
  if (tags.designs.length === 0 && tags.topics.length === 0) return null;

  const label = (id: string | null) =>
    [...tags.designs, ...tags.topics].find((tag) => tag.id === id)?.label ?? id;
  const summary = [row.design ? label(row.design) : null, ...row.topics.map(label)].filter(Boolean).join(' · ');
  const changed = design !== (row.design ?? '') || topics.slice().sort().join() !== row.topics.slice().sort().join();

  return (
    <details className="manage-tags">
      <summary>Tags: {summary || <em>none yet</em>}</summary>
      <label className="manage-input">
        Design{' '}
        <select value={design} disabled={busy} onChange={(event) => setDesign(event.target.value)}>
          <option value="">None</option>
          {tags.designs.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.label}
            </option>
          ))}
        </select>
      </label>
      <div className="chip-row">
        {tags.topics.map((tag) => (
          <button
            key={tag.id}
            type="button"
            className="chip toggle"
            aria-pressed={topics.includes(tag.id)}
            disabled={busy}
            onClick={() =>
              setTopics((current) =>
                current.includes(tag.id) ? current.filter((id) => id !== tag.id) : [...current, tag.id],
              )
            }
          >
            {tag.label}
          </button>
        ))}
      </div>
      <button type="button" className="secondary small" disabled={busy || !changed} onClick={() => onSave(design || null, topics)}>
        {busy ? 'Saving…' : 'Save tags'}
      </button>
    </details>
  );
}
