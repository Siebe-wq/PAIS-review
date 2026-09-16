import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDoc } from '@/lib/doc';
import { Markdown } from '@/components/Markdown';

export const metadata: Metadata = {
  title: 'Review guide',
  description:
    'The standard every review on this site is written against, specific to post-acute infection syndromes.',
};

export default function GuidePage() {
  const doc = getDoc('guide');
  if (!doc) notFound();

  return (
    <article>
      <header className="review-head">
        <h1>{doc.title}</h1>
        <p className="cite">
          {[doc.authors, doc.version && `Version ${doc.version}`, doc.updated && `Updated ${doc.updated}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </header>
      <Markdown>{doc.body}</Markdown>
    </article>
  );
}
