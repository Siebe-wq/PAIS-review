import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: 'website' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link className="site-title" href="/">
              {site.name}
            </Link>
            <nav className="site-nav">
              <Link href="/">Reviews</Link>
              <Link href="/guide">Guide</Link>
              <Link href="/about">About</Link>
            </nav>
          </div>
        </header>

        <main className="wrap">{children}</main>

        <footer className="site-footer">
          <div className="wrap">
            <p>
              Reviews are written by Claude against the{' '}
              <Link href="/guide">review guide</Link>, then read and published by {site.editor}.
              They are one considered opinion, not a journal decision or a consensus view, and they
              can be wrong.
            </p>
            <p>
              Something here is mistaken or unfair? <Link href="/about">Get in touch</Link> and it
              will be corrected or withdrawn.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
