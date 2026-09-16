'use client';

import { useEffect, useState } from 'react';

const PAGES = [
  { value: 'about', label: 'About page' },
  { value: 'guide', label: 'Review guide' },
];

interface Result {
  ok?: boolean;
  path?: string;
  commitUrl?: string;
  error?: string;
}

export function DocEditor() {
  const [name, setName] = useState('about');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
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
        body: JSON.stringify({ name, content, password }),
      });
      setResult(await response.json());
    } catch {
      setResult({ error: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin">
      <h1>Edit a page</h1>
      <p>
        Edits the About page or the review guide directly, frontmatter and all. If you change the
        guide, bump its <code>version</code> field at the top — reviews record which version they
        were written under, so this is how a reader can tell whether a review used the current
        standard.
      </p>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="doc-name">Page</label>
          <select id="doc-name" value={name} onChange={(e) => setName(e.target.value)}>
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
            rows={20}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={loading}
            required
          />
          <p className="hint">
            {loading ? 'Loading the current content…' : 'Markdown, including the frontmatter block at the top.'}
          </p>
        </div>

        <div className="field">
          <label htmlFor="doc-password">Password</label>
          <input
            id="doc-password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className="primary" type="submit" disabled={busy || loading}>
          {busy ? 'Publishing…' : 'Publish'}
        </button>
      </form>

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
    </div>
  );
}
