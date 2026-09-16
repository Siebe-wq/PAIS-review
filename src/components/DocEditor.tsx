'use client';

import { useEffect, useState } from 'react';

const PAGES = [
  { value: 'about', label: 'About page' },
  { value: 'guide', label: 'Review guide' },
  { value: 'instructions', label: 'Reviewing instructions' },
];

interface Result {
  ok?: boolean;
  path?: string;
  commitUrl?: string;
  error?: string;
}

export function DocEditor({ onExpired }: { onExpired: () => void }) {
  const [name, setName] = useState('about');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setResult(null);

    fetch(`/api/admin/doc?name=${name}`)
      .then((response) => response.json())
      .then((json: { content?: string; error?: string }) => {
        if (cancelled) return;
        if (json.content !== undefined) setContent(json.content);
        else setResult({ error: json.error ?? 'Could not load the current page content.' });
      })
      .catch(() => {
        if (!cancelled) setResult({ error: 'Could not load the current page content.' });
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [name]);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    try {
      const response = await fetch('/api/admin/doc', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content }),
      });
      if (response.status === 401) {
        onExpired();
        return;
      }
      setResult(await response.json());
    } catch {
      setResult({ error: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="doc-name">Page</label>
        <select id="doc-name" value={name} onChange={(event) => setName(event.target.value)}>
          {PAGES.map((page) => (
            <option key={page.value} value={page.value}>
              {page.label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="doc-content">Content</label>
        <textarea
          id="doc-content"
          rows={22}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={loading}
          required
        />
        <p className="hint">
          {loading
            ? 'Loading the current content…'
            : name === 'guide'
              ? 'Markdown. Bump the version field at the top whenever the standard itself changes — reviews record which version they were written under.'
              : name === 'instructions'
                ? 'Served at /instructions.md. {{GUIDE_VERSION}} and {{SITE_URL}} are filled in when it is served, so never hard-code them.'
                : 'Markdown, including the frontmatter block at the top.'}
        </p>
      </div>

      <button className="primary" type="submit" disabled={busy || loading}>
        {busy ? 'Publishing…' : 'Publish'}
      </button>

      {result?.ok && (
        <div className="notice ok">
          Saved <code>{result.path}</code>. Vercel is rebuilding — the change will be live in a
          minute or two.
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
