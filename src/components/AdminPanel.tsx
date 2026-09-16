'use client';

import { useState } from 'react';
import { ReviewPublisher } from './ReviewPublisher';
import { DocEditor } from './DocEditor';

const TABS = [
  { id: 'review', label: 'Publish a review' },
  { id: 'page', label: 'Edit a page' },
] as const;

type TabId = (typeof TABS)[number]['id'];

export function AdminPanel() {
  const [tab, setTab] = useState<TabId>('review');
  const [password, setPassword] = useState('');

  return (
    <div className="admin">
      <h1>Admin</h1>
      <p>Anything published here is committed to the repository, which redeploys the site.</p>

      <div className="tabs" role="tablist">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="field">
        <label htmlFor="admin-password">Admin password</label>
        <input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
      </div>

      {tab === 'review' ? <ReviewPublisher password={password} /> : <DocEditor password={password} />}
    </div>
  );
}
