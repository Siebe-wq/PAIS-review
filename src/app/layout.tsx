import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';
import { ThemeToggle } from '@/components/ThemeToggle';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  openGraph: { title: site.name, description: site.description, type: 'website' },
};

/**
 * Runs before first paint so the page never flashes the wrong theme. Dark unless this
 * device has chosen light. Kept tiny and dependency-free on purpose.
 */
const themeScript = `(function(){var t;try{t=localStorage.getItem('theme')}catch(e){}document.documentElement.dataset.theme=(t==='light')?'light':'dark'})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning: data-theme is set by the script above, before React runs.
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="wrap">
            <Link className="site-title" href="/">
              {site.name}
            </Link>
            <nav className="site-nav">
              <Link href="/">Reviews</Link>
              <Link href="/methods">Methods</Link>
              <Link href="/about">About</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        {site.pilotNotice && (
          <div className="pilot-banner" role="note">
            <div className="wrap">{site.pilotNotice}</div>
          </div>
        )}

        <main className="wrap">{children}</main>

        <footer className="site-footer">
          <div className="wrap">
            <p>
              Reviews are written by Claude against a published{' '}
              <Link href="/methods">method</Link>, then read and published by {site.editor}. They
              are one considered opinion, not a journal decision or a consensus view, and they
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
