import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getDoc, renderTemplate } from '@/lib/doc';
import { site } from '@/lib/site';
import { Markdown } from '@/components/Markdown';
import { Comments } from '@/components/Comments';

export const metadata: Metadata = {
  title: 'Methods',
  description: 'How every review here is made: the guide it is graded against, and the prompt that starts it.',
};

export default function MethodsPage() {
  const methods = getDoc('methods');
  const guide = getDoc('guide');
  const prompt = getDoc('prompt');
  if (!methods || !guide) notFound();

  return (
    <article>
      <header className="review-head">
        <h1>{methods.title}</h1>
        <p className="cite">
          {[guide.version && `Version ${guide.version}`, guide.updated && `Updated ${guide.updated}`]
            .filter(Boolean)
            .join(' · ')}
        </p>
      </header>

      <Markdown>{renderTemplate(methods.body, site.url)}</Markdown>

      {prompt && (
        <details className="prompt-details">
          <summary>The prompt, word for word</summary>
          <pre className="prompt-block">
            <code>{renderTemplate(prompt.body, site.url)}</code>
          </pre>
          <p className="hint">
            Raw files: <a href="/prompt.md">/prompt.md</a>, <a href="/instructions.md">/instructions.md</a>,{' '}
            <a href="/guide.md">/guide.md</a>.
          </p>
        </details>
      )}

      <section className="guide-section" id="guide">
        <h2 className="guide-title">{guide.title}</h2>
        <Markdown>{guide.body}</Markdown>
      </section>

      <Comments type="guide" slug="guide" />
    </article>
  );
}
