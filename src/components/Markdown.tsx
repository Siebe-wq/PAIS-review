import type { ReactNode } from 'react';
import type { Element, ElementContent } from 'hast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * A paragraph whose whole content is one bold run is being used as a sub-heading —
 * "**Sample counts do not add up.**" on its own line, followed by a list. Reviews are
 * written that way, but markdown renders it as ordinary bold, so the third level of
 * structure disappears and everything below H2 reads flat.
 *
 * A run-in label like "**Cases.** The inclusion criteria are…" is a sentence, not a
 * heading, so it stays a paragraph.
 */
function isStandaloneBold(node: Element | undefined): boolean {
  const children = (node?.children ?? []).filter(
    (child: ElementContent) => !(child.type === 'text' && child.value.trim() === ''),
  );
  return (
    children.length === 1 && children[0].type === 'element' && children[0].tagName === 'strong'
  );
}

/**
 * Reviews are trusted content, but raw HTML stays disabled anyway — react-markdown
 * ignores it unless rehype-raw is added, and it should not be.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ href, children: inner }) => (
            <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer">
              {inner}
            </a>
          ),
          p: ({ node, children: inner }: { node?: Element; children?: ReactNode }) =>
            isStandaloneBold(node) ? <h3 className="run-in">{inner}</h3> : <p>{inner}</p>,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
