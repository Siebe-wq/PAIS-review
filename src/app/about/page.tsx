import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDoc } from '@/lib/doc';
import { Markdown } from '@/components/Markdown';
import { getSiteText } from '@/lib/site-text';

export function generateMetadata(): Metadata {
  return { title: 'About', description: getSiteText()['about.description'] };
}

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
