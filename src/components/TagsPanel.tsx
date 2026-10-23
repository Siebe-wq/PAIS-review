'use client';

import { useEffect, useRef, useState } from 'react';
import { TAG_GROUPS, TAG_LIMITS, type TagGroup, type TagList } from '@/lib/tags';

interface Row {
  /** Absent for a tag added in this form: the server gives it an id from its name. */
  id?: string;
  label: string;
  key: string;
}

const GROUP_TEXT: Record<TagGroup, { title: string; hint: string; add: string }> = {
  designs: { title: 'Designs', hint: 'What kind of study it is. One per review.', add: 'New design' },
  topics: { title: 'Topics', hint: 'What it is about. As many per review as fit.', add: 'New topic' },
};

/**
 * The controlled tag list. Rename, reorder, add, remove; then save once. A renamed tag keeps
 * its address and stays on its reviews. A tag still on a review cannot be removed.
 * Tags are put on reviews in the Reviews tab.
 */
export function TagsPanel({ onExpired }: { onExpired: () => void }) {
  const [rows, setRows] = useState<Record<TagGroup, Row[]> | null>(null);
  const [usage, setUsage] = useState<Record<string, number>>({});
  const [sha, setSha] = useState<string | null>(null);
  const [adding, setAdding] = useState<Record<TagGroup, string>>({ designs: '', topics: '' });
  const [status, setStatus] = useState<{ kind: 'ok' | 'err'; text: string } | null>(null);
  const [dirty, setDirty] = useState(false);
  const [busy, setBusy] = useState(false);
  const [loadCount, setLoadCount] = useState(0);
  const nextKey = useRef(0);

  useEffect(() => {
    fetch('/api/admin/tags')
      .then((response) => {
        if (response.status === 401) {
          onExpired();
          return null;
        }
        return response.json();
      })
      .then((json: { tags?: TagList; sha?: string | null; usage?: Record<string, number>; error?: string } | null) => {
        if (!json) return;
        if (!json.tags) {
          setStatus({ kind: 'err', text: json.error ?? 'Could not load the tags.' });
          return;
        }
        const tags = json.tags;
        setRows({
          designs: tags.designs.map((tag) => ({ ...tag, key: `k${nextKey.current++}` })),
          topics: tags.topics.map((tag) => ({ ...tag, key: `k${nextKey.current++}` })),
        });
        setUsage(json.usage ?? {});
        setSha(json.sha ?? null);
        setDirty(false);
      })
      .catch(() => setStatus({ kind: 'err', text: 'Could not load the tags.' }));
  }, [onExpired, loadCount]);

  if (!rows) return status ? <div className="notice err">{status.text}</div> : <p className="empty">Loading…</p>;

  const change = (group: TagGroup, update: (list: Row[]) => Row[]) => {
    setRows({ ...rows, [group]: update(rows[group]) });
    setDirty(true);
    setStatus(null);
  };
  const move = (group: TagGroup, index: number, by: number) =>
    change(group, (list) => {
      const next = [...list];
      const [row] = next.splice(index, 1);
      next.splice(index + by, 0, row);
      return next;
    });

  async function save() {
    if (!rows) return;
    setBusy(true);
    setStatus(null);
    try {
      const body = Object.fromEntries(
        TAG_GROUPS.map((group) => [group, rows[group].map(({ id, label }) => (id ? { id, label } : { label }))]),
      );
      const response = await fetch('/api/admin/tags', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags: body, sha }),
      });
      if (response.status === 401) {
        onExpired();
        return;
      }
      const json = (await response.json()) as { ok?: boolean; error?: string };
      if (json.ok) {
        setStatus({ kind: 'ok', text: 'Saved. The site shows the change after its next rebuild, in about a minute.' });
        setLoadCount((n) => n + 1);
      } else {
        setStatus({ kind: 'err', text: json.error ?? 'Could not save.' });
      }
    } catch {
      setStatus({ kind: 'err', text: 'Could not reach the server.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="tags-panel">
      <p className="hint">
        Rename, reorder, add or remove tags, then save. Renaming keeps a tag on its reviews and keeps
        its address. A tag still on a review cannot be removed. Put tags on reviews in the Reviews tab.
        The review counts come from the live site, so a tag added to a review in the last minute or
        two can still read “unused”.
      </p>

      {TAG_GROUPS.map((group) => (
        <section key={group}>
          <h2 className="manage-heading">{GROUP_TEXT[group].title}</h2>
          <p className="hint">{GROUP_TEXT[group].hint}</p>
          <ul className="tag-edit-list">
            {rows[group].map((row, index) => {
              const used = row.id ? usage[row.id] ?? 0 : 0;
              return (
                <li key={row.key}>
                  <input
                    type="text"
                    value={row.label}
                    maxLength={TAG_LIMITS.label}
                    aria-label={`Name of ${row.label || 'tag'}`}
                    onChange={(event) =>
                      change(group, (list) => list.map((r) => (r.key === row.key ? { ...r, label: event.target.value } : r)))
                    }
                  />
                  <span className="tag-used">{used ? `${used} review${used === 1 ? '' : 's'}` : 'unused'}</span>
                  <button type="button" className="icon" aria-label="Move up" disabled={index === 0} onClick={() => move(group, index, -1)}>
                    ↑
                  </button>
                  <button
                    type="button"
                    className="icon"
                    aria-label="Move down"
                    disabled={index === rows[group].length - 1}
                    onClick={() => move(group, index, 1)}
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    className="icon"
                    aria-label={`Remove ${row.label}`}
                    title={used ? 'Take it off its reviews first' : 'Remove'}
                    disabled={used > 0}
                    onClick={() => change(group, (list) => list.filter((r) => r.key !== row.key))}
                  >
                    ×
                  </button>
                </li>
              );
            })}
          </ul>
          <form
            className="tag-add"
            onSubmit={(event) => {
              event.preventDefault();
              const label = adding[group].trim();
              if (!label) return;
              change(group, (list) => [...list, { label, key: `k${nextKey.current++}` }]);
              setAdding({ ...adding, [group]: '' });
            }}
          >
            <input
              type="text"
              placeholder={GROUP_TEXT[group].add}
              aria-label={GROUP_TEXT[group].add}
              maxLength={TAG_LIMITS.label}
              value={adding[group]}
              onChange={(event) => setAdding({ ...adding, [group]: event.target.value })}
            />
            <button type="submit" className="secondary small">
              Add
            </button>
          </form>
        </section>
      ))}

      <div className="publish-actions tags-save">
        <button type="button" className="primary" disabled={busy || !dirty} onClick={save}>
          {busy ? 'Saving…' : 'Save tags'}
        </button>
        {dirty && (
          <button type="button" className="linkish" disabled={busy} onClick={() => setLoadCount((n) => n + 1)}>
            Undo changes
          </button>
        )}
      </div>
      {status && <div className={`notice ${status.kind}`}>{status.text}</div>}
    </div>
  );
}
