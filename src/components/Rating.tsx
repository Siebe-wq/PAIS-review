'use client';

import { useEffect, useState } from 'react';

interface Summary {
  configured: boolean;
  average?: number | null;
  count?: number;
  mine?: number | null;
  error?: string;
}

/** One-to-five stars from anyone. One rating per browser; changing it replaces it. */
export function Rating({ slug }: { slug: string }) {
  const [summary, setSummary] = useState<Summary | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    fetch(`/api/ratings?slug=${encodeURIComponent(slug)}`)
      .then(async (response) => {
        const json = (await response.json()) as Summary;
        if (!response.ok && !json.error) json.error = 'Ratings could not be loaded.';
        setSummary(json);
      })
      .catch(() => setSummary({ configured: true, error: 'Ratings could not be loaded.' }));
  }, [slug]);

  if (!summary || !summary.configured) return null;

  if (summary.error) {
    return (
      <div className="rating">
        <span className="rating-label">Rate this review</span>
        <span className="rating-summary">Unavailable right now. {summary.error}</span>
      </div>
    );
  }

  async function rate(stars: number) {
    setBusy(true);
    try {
      const response = await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, stars }),
      });
      if (response.ok) setSummary({ ...((await response.json()) as Summary), configured: true });
    } finally {
      setBusy(false);
    }
  }

  const shown = hover ?? summary.mine ?? 0;

  return (
    <div className="rating">
      <span className="rating-label">Rate this review</span>
      <span className="stars" onMouseLeave={() => setHover(null)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            type="button"
            className={`star${n <= shown ? ' on' : ''}`}
            onMouseEnter={() => setHover(n)}
            onFocus={() => setHover(n)}
            onBlur={() => setHover(null)}
            onClick={() => rate(n)}
            disabled={busy}
            aria-label={`${n} star${n === 1 ? '' : 's'}`}
          >
            ★
          </button>
        ))}
      </span>
      <span className="rating-summary">
        {summary.count
          ? `${summary.average} from ${summary.count} rating${summary.count === 1 ? '' : 's'}`
          : 'No ratings yet'}
        {summary.mine ? ` · yours: ${summary.mine}` : ''}
      </span>
    </div>
  );
}
