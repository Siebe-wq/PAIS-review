'use client';

import { useState } from 'react';

interface Result {
  ok?: boolean;
  slug?: string;
  path?: string;
  replaced?: boolean;
  commitUrl?: string;
  error?: string;
  exists?: boolean;
}

const today = () => new Date().toISOString().slice(0, 10);

export function AdminForm() {
  const [password, setPassword] = useState('');
  const [overwrite, setOverwrite] = useState(false);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<Result | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    setBusy(true);
    setResult(null);
    try {
      const response = await fetch('/api/admin/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, password, overwrite }),
      });
      const json = (await response.json()) as Result;
      setResult(json);
      if (json.ok) setOverwrite(false);
    } catch {
      setResult({ error: 'Could not reach the server. Check your connection and try again.' });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="admin">
      <h1>Publish a review</h1>
      <p>
        This commits a markdown file to the repository, which redeploys the site. If you paste a
        whole review file — frontmatter and all — into the body box, its frontmatter wins and you
        can leave the fields below empty.
      </p>

      <form onSubmit={onSubmit}>
        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="field">
          <label htmlFor="body">Review</label>
          <textarea id="body" name="body" rows={16} required />
          <p className="hint">Markdown. Start headings at ## — the page supplies the H1.</p>
        </div>

        <div className="field">
          <label htmlFor="title">Paper title</label>
          <input id="title" name="title" type="text" />
        </div>

        <div className="field">
          <label htmlFor="verdict">Verdict</label>
          <textarea id="verdict" name="verdict" rows={2} />
          <p className="hint">One sentence. This is what shows on the index page.</p>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="score">Score out of 10</label>
            <input id="score" name="score" type="number" min="0" max="10" step="0.5" />
          </div>
          <div className="field">
            <label htmlFor="reviewedOn">Reviewed on</label>
            <input id="reviewedOn" name="reviewedOn" type="date" defaultValue={today()} />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="authors">Authors</label>
            <input id="authors" name="authors" type="text" placeholder="Smith J, Jones A, et al." />
          </div>
          <div className="field">
            <label htmlFor="journal">Journal</label>
            <input id="journal" name="journal" type="text" />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="year">Year</label>
            <input id="year" name="year" type="number" min="1900" max="2100" />
          </div>
          <div className="field">
            <label htmlFor="doi">DOI</label>
            <input id="doi" name="doi" type="text" placeholder="10.1016/j.eclinm.2024.102873" />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="conditions">Topics</label>
            <input id="conditions" name="conditions" type="text" placeholder="ME/CFS, Long Covid" />
            <p className="hint">Comma separated. These become the index filters.</p>
          </div>
          <div className="field">
            <label htmlFor="studyType">Study design</label>
            <input id="studyType" name="studyType" type="text" placeholder="RCT, n=240" />
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="weaknesses">Main weaknesses</label>
            <textarea id="weaknesses" name="weaknesses" rows={4} placeholder={'No control group\nUnblinded'} />
            <p className="hint">One per line, short. These become the chips on the index.</p>
          </div>
          <div className="field">
            <label htmlFor="strengths">Main strengths</label>
            <textarea id="strengths" name="strengths" rows={4} />
            <p className="hint">One per line, short.</p>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="confidence">Confidence in the grade</label>
            <select id="confidence" name="confidence" defaultValue="">
              <option value="">Not stated</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>
          <div className="field">
            <label htmlFor="importance">Importance if true</label>
            <select id="importance" name="importance" defaultValue="">
              <option value="">Not stated</option>
              <option value="high">High</option>
              <option value="moderate">Moderate</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="slug">Filename</label>
            <input id="slug" name="slug" type="text" placeholder="left blank: made from the title" />
          </div>
          <div className="field">
            <label htmlFor="guideVersion">Guide version</label>
            <input id="guideVersion" name="guideVersion" type="text" defaultValue="0.2" />
          </div>
        </div>

        <div className="field">
          <label htmlFor="overwrite" style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <input
              id="overwrite"
              type="checkbox"
              checked={overwrite}
              onChange={(e) => setOverwrite(e.target.checked)}
              style={{ width: 'auto' }}
            />
            Replace the existing review at this filename
          </label>
        </div>

        <button className="primary" type="submit" disabled={busy}>
          {busy ? 'Publishing…' : 'Publish'}
        </button>
      </form>

      {result?.ok && (
        <div className="notice ok">
          {result.replaced ? 'Replaced' : 'Published'} <code>{result.path}</code>. Vercel is
          rebuilding — it will be live at <a href={`/reviews/${result.slug}`}>/reviews/{result.slug}</a>{' '}
          in a minute or two.
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
