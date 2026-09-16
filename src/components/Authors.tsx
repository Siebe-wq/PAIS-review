'use client';

import { useState } from 'react';
import { SHOWN_AUTHORS, abbreviateAuthors, isAbbreviated, splitAuthors } from '@/lib/authors';

/** Shortened author list with a control to show the whole thing. */
export function Authors({ authors }: { authors: string }) {
  const [expanded, setExpanded] = useState(false);
  const names = splitAuthors(authors);
  const canExpand = !isAbbreviated(authors) && names.length > SHOWN_AUTHORS;

  if (!canExpand) return <>{abbreviateAuthors(authors)}</>;

  return (
    <>
      {expanded ? names.join(', ') : abbreviateAuthors(authors)}{' '}
      <button
        type="button"
        className="linkish inline"
        onClick={() => setExpanded((current) => !current)}
        aria-expanded={expanded}
      >
        {expanded ? 'fewer' : `all ${names.length} authors`}
      </button>
    </>
  );
}
