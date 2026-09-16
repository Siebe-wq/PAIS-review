'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/toc';

/**
 * Contents for long reviews. One component, two shapes:
 *
 * On a phone it is a collapsed disclosure at the top of the review — closed it costs one
 * line, open it lists the sections. On a wide screen the toggle disappears and the list
 * becomes a sticky sidebar.
 *
 * The open/closed state is only ever a data attribute; CSS decides whether it means
 * anything. That avoids a JS media query, which would need the viewport width during
 * render and mismatch between server and client.
 */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const ids = entries.map((entry) => entry.id);

    // getBoundingClientRect rather than offsetTop: offsetTop is relative to the nearest
    // positioned ancestor, which the sidebar's grid container changed, so it silently
    // stopped tracking. Rect top is always viewport-relative.
    const update = () => {
      let current = ids[0];
      for (const id of ids) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top <= 120) current = id;
      }
      setActive(current);
    };

    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [entries]);

  if (entries.length < 3) return null;

  const activeLabel = entries.find((entry) => entry.id === active)?.text;

  return (
    <nav className="toc" data-open={open ? 'true' : 'false'} aria-label="Sections">
      <button
        type="button"
        className="toc-toggle"
        aria-expanded={open}
        aria-controls="toc-list"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="toc-toggle-label">Contents</span>
        {/* Shows where you are without opening it, so the closed state still earns its line. */}
        <span className="toc-toggle-current">{activeLabel}</span>
        <span className="toc-chevron" aria-hidden="true" />
      </button>

      <p className="toc-label">Contents</p>

      <ol id="toc-list" className="toc-list">
        {entries.map((entry) => (
          <li key={entry.id}>
            <a
              href={`#${entry.id}`}
              aria-current={active === entry.id ? 'true' : undefined}
              onClick={() => setOpen(false)}
            >
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
