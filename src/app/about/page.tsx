import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDoc } from '@/lib/doc';
import { Markdown } from '@/components/Markdown';

export const metadata: Metadata = {
  title: 'About',
  description: 'How these reviews are made, what they are for, and what they are not.',
};

export default function AboutPage() {
  const doc = getDoc('about');
  if (!doc) notFound();

  return (
    <article>
      <header className="review-head">
        <h1>{doc.title}</h1>
      </header>
      <Markdown>{doc.body}</Markdown>
    </article>
  );
}
