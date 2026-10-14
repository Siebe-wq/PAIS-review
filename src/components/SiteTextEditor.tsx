'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  DEFAULTS,
  FIELDS,
  GROUPS,
  KEYS,
  checkValue,
  normalise,
  resolve,
  type SiteText,
  type SiteTextKey,
} from '@/lib/site-text-schema';

interface SaveResult {
  ok?: boolean;
  error?: string;
  commitUrl?: string;
  sha?: string;
  changed?: SiteTextKey[];
  fieldErrors?: Partial<Record<SiteTextKey, string>>;
}

/**
 * One labelled box per piece of public site text, grouped by where it appears. Shows
 * which fields differ from their default and which have unsaved edits, and saves the
 * lot as one commit.
 */
export function SiteTextEditor({
  onExpired,
  onDirtyChange,
}: {
  onExpired: () => void;
  /** Lets the page picker warn before switching away from unsaved edits. */
  onDirtyChange?: (dirty: boolean) => void;
}) {
  const [saved, setSaved] = useState<SiteText | null>(null);
  const [values, setValues] = useState<SiteText>(DEFAULTS);
  const [sha, setSha] = useState<string | null>(null);
  const [problems, setProblems] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<SaveResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<SiteTextKey, string>>>({});

  const load = useCallback(async () => {
    setLoadError(null);
    try {
      const response = await fetch('/api/admin/site-text');
      if (response.status === 401) return onExpired();
      const json = (await response.json()) as {
        overrides?: Partial<SiteText>;
        sha?: string | null;
        problems?: string[];
        error?: string;
      };
      if (!response.ok || !json.overrides) {
        setLoadError(json.error ?? 'Could not load the site text.');
        return;
      }
      const current = resolve(json.overrides);
      setSaved(current);
      setValues(current);
      setSha(json.sha ?? null);
      setProblems(json.problems ?? []);
      setFieldErrors({});
    } catch {
      setLoadError('Could not reach the server.');
    }
  }, [onExpired]);

  useEffect(() => {
    load();
  }, [load]);

  const unsaved = useMemo(
    () => (saved ? KEYS.filter((key) => normalise(values[key]) !== saved[key]) : []),
    [saved, values],
  );

  useEffect(() => {
    onDirtyChange?.(unsaved.length > 0);
  }, [unsaved.length, onDirtyChange]);

  // Leaving with unsaved edits loses them; say so first.
  useEffect(() => {
    if (unsaved.length === 0) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [unsaved.length]);

  function set(key: SiteTextKey, value: string) {
    setValues((current) => ({ ...current, [key]: value }));
    setFieldErrors((current) => {
      if (!current[key]) return current;
      const next = { ...current };
      delete next[key];
      return next;
    });
    setResult(null);
  }

  async function publish() {
    const errors: Partial<Record<SiteTextKey, string>> = {};
    for (const key of KEYS) {
      const problem = checkValue(key, normalise(values[key]));
      if (problem) errors[key] = problem;
    }
    setFieldErrors(errors);
    if (Object.keys(errors).length) {
      setResult({ error: 'Some fields need fixing first. They are marked below.' });
      return;
    }

    setBusy(true);
    setResult(null);
    try {
      const response = await fetch('/api/admin/site-text', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ values, sha }),
      });
      if (response.status === 401) return onExpired();
      const json = (await response.json()) as SaveResult;
      setResult(json);
      if (json.fieldErrors) setFieldErrors(json.fieldErrors);
      if (json.ok) {
        const normalised = Object.fromEntries(KEYS.map((key) => [key, normalise(values[key])])) as SiteText;
        setSaved(normalised);
        setValues(normalised);
        if (json.sha) setSha(json.sha);
      }
    } catch {
      setResult({ error: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  }

  if (loadError) {
    return (
      <div className="notice err">
        {loadError}{' '}
        <button type="button" className="linkish" onClick={load}>
          Try again
        </button>
      </div>
    );
  }
  if (!saved) return <p className="hint">Loading the current site text…</p>;

  return (
    <div className="site-text-editor">
      <p className="hint">
        Changes go live about a minute after publishing, once the site has rebuilt. Boxes marked
        Markdown take links as <code>[text](/methods)</code> and bold as <code>**text**</code>.
      </p>

      {problems.length > 0 && (
        <div className="notice err">
          The stored site text had problems, so these fields are showing their defaults:
          <ul>
            {problems.map((problem) => (
              <li key={problem}>{problem}</li>
            ))}
          </ul>
        </div>
      )}

      {GROUPS.map((group) => {
        const customised = group.keys.filter((key) => normalise(values[key]) !== DEFAULTS[key]).length;
        const pending = group.keys.filter((key) => unsaved.includes(key)).length;
        const hasError = group.keys.some((key) => fieldErrors[key]);
        return (
          <details key={group.title} className="text-group" open={group.open || pending > 0 || hasError}>
            <summary>
              {group.title}
              <span className="text-group-meta">
                {customised > 0 && ` · ${customised} changed from default`}
                {pending > 0 && ` · ${pending} unsaved`}
              </span>
            </summary>

            {group.keys.map((key) => {
              const field = FIELDS[key];
              const value = values[key];
              const isDefault = normalise(value) === DEFAULTS[key];
              const isUnsaved = unsaved.includes(key);
              const length = normalise(value).length;
              const id = `text-${key.replace(/\W/g, '-')}`;
              return (
                <div key={key} className={`field text-field${isUnsaved ? ' unsaved' : ''}`}>
                  <label htmlFor={id}>{field.label}</label>
                  <p className="hint">{field.where}</p>
                  {field.kind === 'line' ? (
                    <input
                      id={id}
                      type="text"
                      value={value}
                      onChange={(event) => set(key, event.target.value)}
                      maxLength={field.max + 20}
                      aria-invalid={Boolean(fieldErrors[key])}
                    />
                  ) : (
                    <textarea
                      id={id}
                      value={value}
                      rows={Math.min(8, Math.max(2, Math.ceil(value.length / 70) + value.split('\n').length - 1))}
                      onChange={(event) => set(key, event.target.value)}
                      aria-invalid={Boolean(fieldErrors[key])}
                    />
                  )}
                  <div className="text-field-meta">
                    {field.kind === 'markdown' && <span>Markdown</span>}
                    {isUnsaved && <span className="text-unsaved">Unsaved</span>}
                    {length > field.max * 0.8 && (
                      <span className={length > field.max ? 'text-over' : ''}>
                        {length}/{field.max}
                      </span>
                    )}
                    {isDefault ? (
                      <span>Default</span>
                    ) : (
                      <button type="button" className="linkish" onClick={() => set(key, DEFAULTS[key])}>
                        Reset to default
                      </button>
                    )}
                  </div>
                  {fieldErrors[key] && <p className="notice err">{fieldErrors[key]}</p>}
                </div>
              );
            })}
          </details>
        );
      })}

      <div className="publish-bar">
        <span className="hint">
          {unsaved.length === 0
            ? 'No unsaved changes.'
            : `${unsaved.length} unsaved change${unsaved.length === 1 ? '' : 's'}.`}
        </span>
        <button type="button" className="secondary" onClick={() => setValues(saved)} disabled={busy || unsaved.length === 0}>
          Discard
        </button>
        <button type="button" className="primary" onClick={publish} disabled={busy || unsaved.length === 0}>
          {busy ? 'Publishing…' : 'Publish'}
        </button>
      </div>

      {result?.ok && (
        <div className="notice ok">
          Published. Vercel is rebuilding — the new text will be live in a minute or two.
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
      {result?.error && (
        <div className="notice err">
          {result.error}
          {/reload/i.test(result.error) && (
            <>
              {' '}
              <button type="button" className="linkish" onClick={load}>
                Reload now
              </button>{' '}
              (your unsaved edits will be lost).
            </>
          )}
        </div>
      )}
    </div>
  );
}
