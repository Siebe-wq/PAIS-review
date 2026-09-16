import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

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
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
