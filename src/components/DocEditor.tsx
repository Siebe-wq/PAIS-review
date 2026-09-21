'use client';

import { useEffect, useState } from 'react';
import { CHANGE_KINDS, CHANGE_LABELS, bumpVersion, type ChangeKind } from '@/lib/version';

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
  version?: string;
  error?: string;
}

export function DocEditor({ onExpired }: { onExpired: () => void }) {
  const [name, setName] = useState('about');
  const [content, setContent] = useState('');
  const [versioned, setVersioned] = useState(false);
  const [currentVersion, setCurrentVersion] = useState<string | null>(null);
  const [change, setChange] = useState<ChangeKind>('patch');
  const [note, setNote] = useState('');
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
            setChange('patch');
            setNote('');
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
        body: JSON.stringify({
          name,
          content,
          change: versioned ? change : undefined,
          note: versioned ? note : undefined,
        }),
      });
      if (response.status === 401) {
        onExpired();
        return;
      }
      const json = (await response.json()) as Result;
      setResult(json);
      if (json.ok) setNote('');
    } catch {
      setResult({ error: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  }

  const nextVersion = bumpVersion(currentVersion, change);

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
          This page is part of the versioned method — the guide, the reviewing instructions and
          the project prompt share one number, currently v{currentVersion ?? '?'}. Saving any of
          them bumps it and writes your note into the guide&rsquo;s changelog, so there is
          nothing to edit by hand afterwards.
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
              ? 'Markdown. Leave version and updated in the frontmatter alone — both are set for you on save.'
              : name === 'instructions' || name === 'prompt' || name === 'methods'
                ? 'Markdown. {{GUIDE_VERSION}} and {{SITE_URL}} are filled in when served — never hard-code them.'
                : 'Markdown, including the frontmatter block at the top.'}
        </p>
      </div>

      {versioned && (
        <>
          <div className="field">
            <label htmlFor="doc-change">What kind of change is this?</label>
            <select
              id="doc-change"
              value={change}
              onChange={(event) => setChange(event.target.value as ChangeKind)}
            >
              {CHANGE_KINDS.map((kind) => (
                <option key={kind} value={kind}>
                  {CHANGE_LABELS[kind].label} (v{currentVersion ?? '?'} &rarr; v
                  {bumpVersion(currentVersion, kind)})
                </option>
              ))}
            </select>
            <p className="hint">{CHANGE_LABELS[change].help}</p>
          </div>

          <div className="field">
            <label htmlFor="doc-note">What changed</label>
            <textarea
              id="doc-note"
              rows={2}
              value={note}
              onChange={(event) => setNote(event.target.value)}
              placeholder="One line. Published as the changelog entry."
              maxLength={300}
              required
            />
            <p className="hint">
              Goes in as <code>- **{nextVersion}** ({new Date().toISOString().slice(0, 10)}) &mdash;
              your note</code>, at the top of the guide&rsquo;s changelog.
            </p>
          </div>
        </>
      )}

      <button className="primary" type="submit" disabled={busy || loading}>
        {busy ? 'Publishing…' : 'Publish'}
      </button>

      {result?.ok && (
        <div className="notice ok">
          Saved <code>{result.path}</code>
          {result.version ? ` as methods v${result.version}, changelog entry included` : ''}.
          Vercel is rebuilding — the change will be live in a minute or two.
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
