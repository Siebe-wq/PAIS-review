import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDoc, renderTemplate } from '@/lib/doc';
import { site } from '@/lib/site';
import { Markdown } from '@/components/Markdown';

export const metadata: Metadata = {
  title: 'Methods',
  description:
    'How every review here is produced: what the model is given, what it is told, and the exact prompt and guide it works from.',
};

export default function MethodsPage() {
  const methods = getDoc('methods');
  const prompt = getDoc('prompt');
  const guide = getDoc('guide');
  if (!methods) notFound();

  return (
    <article>
      <header className="review-head">
        <h1>{methods.title}</h1>
        <p className="cite">
          {[guide?.version && `Methods version ${guide.version}`, guide?.updated && `Updated ${guide.updated}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </header>

      <Markdown>{renderTemplate(methods.body, site.url)}</Markdown>

      {prompt && (
        <div className="prose">
          <pre className="prompt-block">
            <code>{renderTemplate(prompt.body, site.url)}</code>
          </pre>
          <p>
            Raw versions, for pointing a model at:{' '}
            <a href="/prompt.md">/prompt.md</a>, <a href="/instructions.md">/instructions.md</a>,{' '}
            <a href="/guide.md">/guide.md</a>. The full guide is at <Link href="/guide">/guide</Link>
            , with its changelog at the bottom.
          </p>
        </div>
      )}
    </article>
  );
}
