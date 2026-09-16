'use client';

import { useEffect, useState } from 'react';

const PAGES = [
  { value: 'about', label: 'About page' },
  { value: 'methods', label: 'Methods page' },
  { value: 'guide', label: 'Review guide' },
  { value: 'instructions', label: 'Reviewing instructions' },
  { value: 'prompt', label: 'Project prompt' },
];

interface Result {
  ok?: boolean;
  path?: string;
  commitUrl?: string;
  bumpedGuide?: boolean;
  error?: string;
}

/**
 * Suggests the next version. A wording change is a patch: "0.3" -> "0.3.1",
 * "0.3.1" -> "0.3.2". Edit the field for a change that could move a grade.
 */
function nextPatch(version: string | null): string {
  if (!version) return '';
  const parts = version.split('.').map((part) => part.trim());
  if (parts.some((part) => !/^\d+$/.test(part))) return '';
  if (parts.length < 3) return `${parts.join('.')}.1`;
  parts[parts.length - 1] = String(Number(parts[parts.length - 1]) + 1);
  return parts.join('.');
}

export function DocEditor({ onExpired }: { onExpired: () => void }) {
  const [name, setName] = useState('about');
  const [content, setContent] = useState('');
  const [versioned, setVersioned] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [version, setVersion] = useState('');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setResult(null);

    fetch(`/api/admin/doc?name=${name}`)
      .then((response) => response.json())
      .then(
        (json: {
          content?: string;
          versioned?: boolean;
          guideVersion?: string | null;
          error?: string;
        }) => {
          if (cancelled) return;
          if (json.content !== undefined) {
            setContent(json.content);
            setVersioned(Boolean(json.versioned));
            setCurrentVersion(json.guideVersion ?? null);
            setVersion(nextPatch(json.guideVersion ?? null));
          } else {
            setResult({ error: json.error ?? 'Could not load the current page content.' });
          }
        },
      )
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
        body: JSON.stringify({ name, content, version: versioned ? version : undefined }),
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

  // The guide carries its version inside its own frontmatter; the other versioned pages
  // take it from this field and write it into the guide on save.
  const showVersionField = versioned && name !== 'guide';

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

      {versioned && (
        <p className="hint warn">
          This page is part of the versioned method (guide + instructions + prompt, currently v
          {currentVersion ?? '?'}). Saving it needs a new version number, and the change should
          be logged in the guide&rsquo;s changelog.
        </p>
      )}

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
              ? 'Markdown. Bump the version field at the top; the updated date is stamped for you.'
              : name === 'instructions' || name === 'prompt' || name === 'methods'
                ? 'Markdown. {{GUIDE_VERSION}} and {{SITE_URL}} are filled in when served — never hard-code them.'
                : 'Markdown, including the frontmatter block at the top.'}
        </p>
      </div>

      {showVersionField && (
        <div className="field" style={{ maxWidth: '14rem' }}>
          <label htmlFor="doc-version">New methods version</label>
          <input
            id="doc-version"
            type="text"
            value={version}
            onChange={(event) => setVersion(event.target.value)}
            placeholder={nextPatch(currentVersion)}
            required
          />
          <p className="hint">
            Suggested: a patch bump for wording. Use the middle number for a change that could
            move a grade. Written into the guide&rsquo;s frontmatter with this save.
          </p>
        </div>
      )}

      <button className="primary" type="submit" disabled={busy || loading}>
        {busy ? 'Publishing…' : 'Publish'}
      </button>

      {result?.ok && (
        <div className="notice ok">
          Saved <code>{result.path}</code>
          {result.bumpedGuide ? ' and bumped the methods version' : ''}. Vercel is rebuilding —
          the change will be live in a minute or two.
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
