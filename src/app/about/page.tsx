import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDoc } from '@/lib/doc';
import { Markdown } from '@/components/Markdown';

export const metadata: Metadata = {
  title: 'About',
  description: 'How these reviews are made, what they are for, and what they are not.',
};

const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function AboutPage() {
  const doc = getDoc('about');
  if (!doc) notFound();

  return (
    <article>
      <header className="review-head">
        <h1>{doc.title}</h1>
      </header>

      <Markdown>{doc.body}</Markdown>

      <div className="prose">
        {contact ? (
          <p>
            Write to <a href={`mailto:${contact}`}>{contact}</a>.
          </p>
        ) : (
          <p>
            <em>
              Contact address not set yet — add NEXT_PUBLIC_CONTACT_EMAIL in the Vercel project
              settings and it will appear here.
            </em>
          </p>
        )}
      </div>
    </article>
  );
}
