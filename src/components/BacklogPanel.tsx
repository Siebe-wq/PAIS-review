'use client';

import { useCallback, useEffect, useState } from 'react';
import { BACKLOG_SECTIONS, type BacklogSection } from '@/lib/backlog';
import { RichText } from './RichText';

/**
 * The site's to-do list. Add an item from a phone in two taps, tick items off, and see
 * what is open per section. Everything lives in content/backlog.md; editing it as text
 * is under "Edit a page".
 */
export function BacklogPanel({ onExpired }: { onExpired: () => void }) {
  const [sections, setSections] = useState<BacklogSection[] | null>(null);
  const [sha, setSha] = useState<string | null>(null);
  const [section, setSection] = useState<string>(BACKLOG_SECTIONS[0]);
  const [text, setText] = useState('');
  const [showDone, setShowDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ticked, setTicked] = useState<{ section: string; text: string } | null>(null);

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/admin/backlog');
      if (response.status === 401) return onExpired();
      const json = (await response.json()) as { sections?: BacklogSection[]; sha?: string | null; error?: string };
      if (!json.sections) return setError(json.error ?? 'Could not load the backlog.');
      setSections(json.sections);
      setSha(json.sha ?? null);
    } catch {
      setError('Could not reach the server.');
    }
  }, [onExpired]);

  useEffect(() => {
    load();
  }, [load]);

  async function send(body: Record<string, unknown>): Promise<boolean> {
    setBusy(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/backlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...body, sha }),
      });
      if (response.status === 401) {
        onExpired();
        return false;
      }
      const json = (await response.json()) as { ok?: boolean; sections?: BacklogSection[]; sha?: string | null; error?: string };
      if (!json.ok || !json.sections) {
        setError(json.error ?? 'Could not save.');
        return false;
      }
      setSections(json.sections);
      setSha(json.sha ?? null);
      return true;
    } catch {
      setError('Could not reach the server.');
      return false;
    } finally {
      setBusy(false);
    }
  }

  /** Shows the tick straight away, and puts it back if the save fails. */
  async function toggle(sectionTitle: string, itemText: string, done: boolean) {
    const before = sections;
    setSections((current) =>
      current
        ? current.map((s) =>
            s.title !== sectionTitle
              ? s
              : { ...s, items: s.items.map((i) => (i.text === itemText ? { ...i, done } : i)) },
          )
        : current,
    );
    setTicked(done ? { section: sectionTitle, text: itemText } : null);
    if (!(await send({ action: 'toggle', section: sectionTitle, text: itemText, done }))) {
      setSections(before);
      setTicked(null);
    }
  }

  async function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (await send({ action: 'add', section, text })) setText('');
  }

  if (!sections) {
    return error ? <div className="notice err">{error}</div> : <p className="empty">Loading…</p>;
  }

  // Known sections first, in their usual order, then any added by hand.
  const titles = [...BACKLOG_SECTIONS, ...sections.map((s) => s.title).filter((t) => !(BACKLOG_SECTIONS as readonly string[]).includes(t))];
  const doneCount = sections.reduce((n, s) => n + s.items.filter((i) => i.done).length, 0);

  return (
    <div className="backlog">
      <form className="backlog-add" onSubmit={add}>
        <select value={section} onChange={(event) => setSection(event.target.value)} aria-label="Section">
          {titles.map((title) => (
            <option key={title} value={title}>
              {title}
            </option>
          ))}
        </select>
        <input
          type="text"
          value={text}
          onChange={(event) => setText(event.target.value)}
          placeholder="Add an item"
          aria-label="New item"
          maxLength={500}
        />
        <button className="primary" type="submit" disabled={busy || !text.trim()}>
          Add
        </button>
      </form>

      {ticked && !error && (
        <div className="notice ok">
          Ticked off: &ldquo;{ticked.text.length > 70 ? `${ticked.text.slice(0, 70)}…` : ticked.text}&rdquo;{' '}
          <button type="button" className="linkish" disabled={busy} onClick={() => toggle(ticked.section, ticked.text, false)}>
            Undo
          </button>
        </div>
      )}

      {error && (
        <div className="notice err">
          {error}{' '}
          {/reload/i.test(error) && (
            <button type="button" className="linkish" onClick={load}>
              Reload now
            </button>
          )}
        </div>
      )}

      {titles.map((title) => {
        const items = sections.find((s) => s.title === title)?.items ?? [];
        const open = items.filter((item) => !item.done);
        const shown = showDone ? items : open;
        return (
          <section key={title} className="backlog-section">
            <h3>
              {title} <span className="backlog-count">{open.length} open</span>
            </h3>
            {shown.length === 0 ? (
              <p className="hint">{items.length ? 'All done.' : 'Nothing here yet.'}</p>
            ) : (
              <ul>
                {shown.map((item) => (
                  <li key={item.text} className={item.done ? 'done' : ''}>
                    <label>
                      <input
                        type="checkbox"
                        checked={item.done}
                        disabled={busy}
                        onChange={(event) => toggle(title, item.text, event.target.checked)}
                      />
                      <span>
                        <RichText text={item.text} inline />
                        {item.doneOn && <span className="backlog-date"> · done {item.doneOn}</span>}
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );
      })}

      <p className="hint">
        {doneCount > 0 && (
          <>
            <button type="button" className="linkish" onClick={() => setShowDone((v) => !v)}>
              {showDone ? 'Hide' : 'Show'} {doneCount} done
            </button>
            {' · '}
          </>
        )}
        Kept in <code>content/backlog.md</code>. To reword or reorder, use Edit a page → Backlog.
      </p>
    </div>
  );
}
