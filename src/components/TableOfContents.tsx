'use client';

import { useEffect, useState } from 'react';
import type { TocEntry } from '@/lib/toc';

/**
 * Sticky contents list for long reviews. Highlights the section you are reading so the
 * list doubles as a position indicator rather than only a set of jump links.
 */
export function TableOfContents({ entries }: { entries: TocEntry[] }) {
  const [active, setActive] = useState<string | null>(entries[0]?.id ?? null);

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

  return (
    <nav className="toc" aria-label="Sections">
      <p className="toc-label">Contents</p>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id}>
            <a href={`#${entry.id}`} aria-current={active === entry.id ? 'true' : undefined}>
              {entry.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
