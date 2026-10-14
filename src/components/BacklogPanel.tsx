'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { BACKLOG_SECTIONS, PRIORITIES, type BacklogItem, type Priority } from '@/lib/backlog';
import { RichText } from './RichText';

interface Item extends BacklogItem {
  /** Client-only identity, so React and the drag code can follow an item as it moves. */
  key: string;
}
interface Section {
  title: string;
  items: Item[];
}
type Status = 'idle' | 'pending' | 'saving' | 'saved' | 'error';

interface Drag {
  section: string;
  key: string;
  from: number;
  to: number;
  dy: number;
  startY: number;
  /** Page-relative midpoints of the visible items when the drag began. */
  mids: number[];
  /** Page-relative top and bottom of the dragged item when the drag began. */
  top: number;
  bottom: number;
  height: number;
}

const PRIORITY_LABELS: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' };
const COLLAPSED_KEY = 'pais_backlog_collapsed';
const SAVE_DELAY = 900;

const today = () => new Date().toISOString().slice(0, 10);
const short = (text: string) => (text.length > 50 ? `${text.slice(0, 50)}…` : text);

/**
 * The site's to-do list. Add, edit, prioritise, recategorise, tick off and drag items into
 * order; categories fold away. Edits apply at once and are saved together a moment later,
 * so several drags become one commit. Everything lives in content/backlog.md.
 */
export function BacklogPanel({ onExpired }: { onExpired: () => void }) {
  const [sections, setSections] = useState<Section[] | null>(null);
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());
  const [showDone, setShowDone] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);
  const [ticked, setTicked] = useState<{ key: string; text: string } | null>(null);
  const [drag, setDrag] = useState<Drag | null>(null);

  const [addSection, setAddSection] = useState<string>(BACKLOG_SECTIONS[0]);
  const [addPriority, setAddPriority] = useState<Priority | ''>('');
  const [addText, setAddText] = useState('');

  const nextKey = useRef(0);
  const latest = useRef<Section[] | null>(null);
  const sha = useRef<string | null>(null);
  const summaries = useRef<string[]>([]);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const inFlight = useRef(false);
  const lists = useRef(new Map<string, HTMLUListElement>());

  const withKeys = useCallback(
    (raw: { title: string; items: BacklogItem[] }[]): Section[] =>
      raw.map((s) => ({ title: s.title, items: s.items.map((i) => ({ ...i, key: `i${nextKey.current++}` })) })),
    [],
  );

  const load = useCallback(async () => {
    setError(null);
    try {
      const response = await fetch('/api/admin/backlog');
      if (response.status === 401) return onExpired();
      const json = (await response.json()) as { sections?: { title: string; items: BacklogItem[] }[]; sha?: string | null; error?: string };
      if (!json.sections) return setError(json.error ?? 'Could not load the backlog.');
      const loaded = withKeys(json.sections);
      latest.current = loaded;
      sha.current = json.sha ?? null;
      summaries.current = [];
      setSections(loaded);
      setStatus('idle');
      setEditing(null);
      setTicked(null);
    } catch {
      setError('Could not reach the server.');
    }
  }, [onExpired, withKeys]);

  useEffect(() => {
    load();
    try {
      const stored = JSON.parse(localStorage.getItem(COLLAPSED_KEY) ?? '[]');
      if (Array.isArray(stored)) setCollapsed(new Set(stored.map(String)));
    } catch {
      // Not remembered on this device; every category starts open.
    }
  }, [load]);

  // Unsaved edits are lost if the tab closes, so warn while there are any.
  useEffect(() => {
    if (status !== 'pending' && status !== 'saving') return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [status]);

  const flush = useCallback(async () => {
    if (inFlight.current || summaries.current.length === 0 || !latest.current) return;
    inFlight.current = true;
    const batch = summaries.current.splice(0);
    setStatus('saving');
    try {
      const body = {
        sections: latest.current.map((s) => ({ title: s.title, items: s.items.map(({ key: _key, ...item }) => item) })),
        summary: batch.length === 1 ? batch[0] : `${batch.length} changes: ${batch.join('; ')}`,
        sha: sha.current,
      };
      const response = await fetch('/api/admin/backlog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (response.status === 401) return onExpired();
      const json = (await response.json()) as { ok?: boolean; sha?: string | null; error?: string };
      if (!json.ok) {
        setError(json.error ?? 'Could not save.');
        setStatus('error');
        return;
      }
      sha.current = json.sha ?? sha.current;
      setStatus(summaries.current.length ? 'pending' : 'saved');
    } catch {
      setError('Could not reach the server. Your changes are still here; they will be saved with the next edit.');
      summaries.current.unshift(...batch);
      setStatus('error');
    } finally {
      inFlight.current = false;
      if (summaries.current.length) timer.current = setTimeout(flush, SAVE_DELAY);
    }
  }, [onExpired]);

  /** Applies an edit straight away and schedules the save. */
  function apply(next: Section[], summary: string) {
    latest.current = next;
    setSections(next);
    summaries.current.push(summary);
    setError(null);
    setStatus('pending');
    clearTimeout(timer.current);
    timer.current = setTimeout(flush, SAVE_DELAY);
  }

  const visible = (section: Section) => section.items.filter((item) => showDone || !item.done);

  function updateItem(key: string, change: (item: Item) => Item | null, summary: string) {
    if (!latest.current) return;
    apply(
      latest.current.map((s) => ({
        ...s,
        items: s.items.flatMap((item) => {
          if (item.key !== key) return [item];
          const changed = change(item);
          return changed ? [changed] : [];
        }),
      })),
      summary,
    );
  }

  function toggleDone(item: Item, done: boolean) {
    updateItem(item.key, (i) => ({ ...i, done, doneOn: done ? today() : undefined }), `${done ? 'done' : 'reopen'} "${short(item.text)}"`);
    setTicked(done ? { key: item.key, text: item.text } : null);
  }

  /** Moves an item within its category, by position among the items currently shown. */
  function moveTo(sectionTitle: string, key: string, toVisible: number) {
    if (!latest.current) return;
    const next = latest.current.map((section) => {
      if (section.title !== sectionTitle) return section;
      const shown = visible(section);
      const moving = shown.find((i) => i.key === key);
      if (!moving) return section;
      const reordered = shown.filter((i) => i.key !== key);
      reordered.splice(Math.max(0, Math.min(toVisible, reordered.length)), 0, moving);
      // Hidden (done) items keep their places; the shown ones fill the shown slots in the new order.
      let slot = 0;
      const shownKeys = new Set(shown.map((i) => i.key));
      return { ...section, items: section.items.map((i) => (shownKeys.has(i.key) ? reordered[slot++] : i)) };
    });
    const item = latest.current.flatMap((s) => s.items).find((i) => i.key === key);
    apply(next, `reorder "${short(item?.text ?? '')}"`);
  }

  function moveToSection(item: Item, title: string) {
    if (!latest.current) return;
    const without = latest.current.map((s) => ({ ...s, items: s.items.filter((i) => i.key !== item.key) }));
    apply(
      without.map((s) => (s.title === title ? { ...s, items: [...s.items, item] } : s)),
      `move "${short(item.text)}" to ${title}`,
    );
  }

  function add(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = addText.replace(/\s+/g, ' ').trim();
    if (!text || !latest.current) return;
    const item: Item = { key: `i${nextKey.current++}`, text, done: false, ...(addPriority ? { priority: addPriority } : {}) };
    const exists = latest.current.some((s) => s.title === addSection);
    const next = exists
      ? latest.current.map((s) => (s.title === addSection ? { ...s, items: [...s.items, item] } : s))
      : [...latest.current, { title: addSection, items: [item] }];
    apply(next, `add "${short(text)}"`);
    setAddText('');
    if (collapsed.has(addSection)) toggleCollapsed(addSection);
  }

  function toggleCollapsed(title: string) {
    setCollapsed((current) => {
      const next = new Set(current);
      if (!next.delete(title)) next.add(title);
      try {
        localStorage.setItem(COLLAPSED_KEY, JSON.stringify([...next]));
      } catch {
        // Fine: just not remembered.
      }
      return next;
    });
  }

  // ---- dragging, by pointer so it works with a finger as well as a mouse

  function startDrag(event: React.PointerEvent<HTMLButtonElement>, section: Section, key: string) {
    if (event.pointerType === 'mouse' && event.button !== 0) return;
    const list = lists.current.get(section.title);
    if (!list) return;
    event.preventDefault();
    const rows = Array.from(list.children) as HTMLElement[];
    const rects = rows.map((row) => row.getBoundingClientRect());
    const mids = rects.map((rect) => rect.top + window.scrollY + rect.height / 2);
    const from = visible(section).findIndex((i) => i.key === key);
    if (from === -1) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    setEditing(null);
    setDrag({
      section: section.title,
      key,
      from,
      to: from,
      dy: 0,
      startY: event.clientY + window.scrollY,
      mids,
      top: rects[from].top + window.scrollY,
      bottom: rects[from].bottom + window.scrollY,
      height: rects[from].height,
    });
  }

  function moveDrag(event: React.PointerEvent<HTMLButtonElement>) {
    if (!drag) return;
    // Near the top or bottom of the screen, scroll so a long list can be crossed in one drag.
    if (event.clientY < 70) window.scrollBy(0, -14);
    else if (event.clientY > window.innerHeight - 70) window.scrollBy(0, 14);
    const pageY = event.clientY + window.scrollY;
    const dy = pageY - drag.startY;
    // A row makes way once the dragged row's leading edge passes its middle: the top edge
    // going up, the bottom edge going down. Where the finger sits on the row does not matter.
    const top = drag.top + dy;
    const bottom = drag.bottom + dy;
    const above = drag.mids.filter((mid, i) => i < drag.from && top < mid).length;
    const below = drag.mids.filter((mid, i) => i > drag.from && bottom > mid).length;
    setDrag({ ...drag, dy, to: drag.from - above + below });
  }

  function endDrag() {
    if (!drag) return;
    if (drag.to !== drag.from) moveTo(drag.section, drag.key, drag.to);
    setDrag(null);
  }

  function shiftFor(sectionTitle: string, index: number, key: string): React.CSSProperties | undefined {
    if (!drag || drag.section !== sectionTitle) return undefined;
    if (key === drag.key) return { transform: `translateY(${drag.dy}px)`, transition: 'none', zIndex: 2, position: 'relative' };
    const { from, to, height } = drag;
    if (from < to && index > from && index <= to) return { transform: `translateY(${-height}px)` };
    if (from > to && index >= to && index < from) return { transform: `translateY(${height}px)` };
    return { transform: 'translateY(0)' };
  }

  if (!sections) return error ? <div className="notice err">{error}</div> : <p className="empty">Loading…</p>;

  const titles = [...BACKLOG_SECTIONS, ...sections.map((s) => s.title).filter((t) => !(BACKLOG_SECTIONS as readonly string[]).includes(t))];
  const doneCount = sections.reduce((n, s) => n + s.items.filter((i) => i.done).length, 0);

  return (
    <div className="backlog">
      <form className="backlog-add" onSubmit={add}>
        <select value={addSection} onChange={(e) => setAddSection(e.target.value)} aria-label="Category">
          {titles.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <select value={addPriority} onChange={(e) => setAddPriority(e.target.value as Priority | '')} aria-label="Priority">
          <option value="">No priority</option>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {PRIORITY_LABELS[p]}
            </option>
          ))}
        </select>
        <input type="text" value={addText} onChange={(e) => setAddText(e.target.value)} placeholder="Add an item" aria-label="New item" maxLength={500} />
        <button className="primary" type="submit" disabled={!addText.trim()}>
          Add
        </button>
      </form>

      <p className="backlog-status" aria-live="polite">
        {status === 'pending' && 'Unsaved changes…'}
        {status === 'saving' && 'Saving…'}
        {status === 'saved' && 'Saved.'}
      </p>

      {ticked && (
        <div className="notice ok">
          Ticked off: &ldquo;{short(ticked.text)}&rdquo;{' '}
          <button
            type="button"
            className="linkish"
            onClick={() => {
              const item = latest.current?.flatMap((s) => s.items).find((i) => i.key === ticked.key);
              if (item) toggleDone(item, false);
            }}
          >
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
        const section = sections.find((s) => s.title === title) ?? { title, items: [] };
        const shown = visible(section);
        const open = section.items.filter((i) => !i.done).length;
        const isCollapsed = collapsed.has(title);
        return (
          <section key={title} className="backlog-section">
            <h3>
              <button type="button" className="backlog-fold" aria-expanded={!isCollapsed} onClick={() => toggleCollapsed(title)}>
                <span className="backlog-chevron" aria-hidden="true" />
                {title} <span className="backlog-count">{open} open</span>
              </button>
            </h3>
            {!isCollapsed &&
              (shown.length === 0 ? (
                <p className="hint">{section.items.length ? 'All done.' : 'Nothing here yet.'}</p>
              ) : (
                <ul
                  ref={(element) => {
                    if (element) lists.current.set(title, element);
                    else lists.current.delete(title);
                  }}
                >
                  {shown.map((item, index) => (
                    <li
                      key={item.key}
                      className={`${item.done ? 'done' : ''}${drag?.key === item.key ? ' dragging' : ''}`}
                      style={shiftFor(title, index, item.key)}
                    >
                      <div className="backlog-row">
                        <button
                          type="button"
                          className="backlog-handle"
                          aria-label={`Drag to reorder: ${short(item.text)}. Arrow keys move it.`}
                          onPointerDown={(e) => startDrag(e, section, item.key)}
                          onPointerMove={moveDrag}
                          onPointerUp={endDrag}
                          onPointerCancel={() => setDrag(null)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowUp' && index > 0) {
                              e.preventDefault();
                              moveTo(title, item.key, index - 1);
                            } else if (e.key === 'ArrowDown' && index < shown.length - 1) {
                              e.preventDefault();
                              moveTo(title, item.key, index + 1);
                            }
                          }}
                        >
                          <span aria-hidden="true">⋮⋮</span>
                        </button>
                        <input
                          type="checkbox"
                          checked={item.done}
                          onChange={(e) => toggleDone(item, e.target.checked)}
                          aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                        />
                        <span className="backlog-text">
                          {item.priority && <span className={`priority priority-${item.priority}`}>{PRIORITY_LABELS[item.priority]}</span>}
                          <RichText text={item.text} inline />
                          {item.doneOn && <span className="backlog-date"> · done {item.doneOn}</span>}
                        </span>
                        <button
                          type="button"
                          className="linkish backlog-edit"
                          aria-expanded={editing === item.key}
                          onClick={() => setEditing(editing === item.key ? null : item.key)}
                        >
                          {editing === item.key ? 'Close' : 'Edit'}
                        </button>
                      </div>
                      {editing === item.key && (
                        <ItemEditor
                          item={item}
                          titles={titles}
                          section={title}
                          canUp={index > 0}
                          canDown={index < shown.length - 1}
                          onMove={(to) => moveTo(title, item.key, to === 'top' ? 0 : to === 'up' ? index - 1 : index + 1)}
                          onSave={(change) => {
                            const edited: Item = { ...item, text: change.text, priority: change.priority || undefined };
                            if (change.section !== title) {
                              moveToSection(edited, change.section);
                            } else {
                              updateItem(item.key, () => edited, `edit "${short(change.text)}"`);
                            }
                            setEditing(null);
                          }}
                          onDelete={() => {
                            if (!window.confirm(`Delete "${short(item.text)}"? Ticking it off keeps a record; deleting does not.`)) return;
                            updateItem(item.key, () => null, `delete "${short(item.text)}"`);
                            setEditing(null);
                          }}
                        />
                      )}
                    </li>
                  ))}
                </ul>
              ))}
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
        Drag the ⋮⋮ handle to reorder within a category. Kept in <code>content/backlog.md</code>; it
        can also be edited as text under Edit a page → Backlog.
      </p>
    </div>
  );
}

function ItemEditor({
  item,
  titles,
  section,
  canUp,
  canDown,
  onMove,
  onSave,
  onDelete,
}: {
  item: Item;
  titles: string[];
  section: string;
  canUp: boolean;
  canDown: boolean;
  onMove: (to: 'top' | 'up' | 'down') => void;
  onSave: (change: { text: string; priority: Priority | ''; section: string }) => void;
  onDelete: () => void;
}) {
  const [text, setText] = useState(item.text);
  const [priority, setPriority] = useState<Priority | ''>(item.priority ?? '');
  const [target, setTarget] = useState(section);
  const clean = text.replace(/\s+/g, ' ').trim();

  return (
    <div className="backlog-editor">
      <textarea value={text} onChange={(e) => setText(e.target.value)} rows={3} maxLength={500} aria-label="Item text" />
      <div className="backlog-editor-row">
        <label>
          Priority
          <select value={priority} onChange={(e) => setPriority(e.target.value as Priority | '')}>
            <option value="">None</option>
            {PRIORITIES.map((p) => (
              <option key={p} value={p}>
                {PRIORITY_LABELS[p]}
              </option>
            ))}
          </select>
        </label>
        <label>
          Category
          <select value={target} onChange={(e) => setTarget(e.target.value)}>
            {titles.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="backlog-editor-row">
        <span className="hint">Move:</span>
        <button type="button" className="secondary small" disabled={!canUp} onClick={() => onMove('top')}>
          Top
        </button>
        <button type="button" className="secondary small" disabled={!canUp} onClick={() => onMove('up')}>
          Up
        </button>
        <button type="button" className="secondary small" disabled={!canDown} onClick={() => onMove('down')}>
          Down
        </button>
      </div>
      <div className="backlog-editor-row">
        <button type="button" className="primary" disabled={!clean} onClick={() => onSave({ text: clean, priority, section: target })}>
          Save
        </button>
        <button type="button" className="linkish danger" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
