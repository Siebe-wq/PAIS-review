import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

/**
 * Editable site text. Markdown, so the editor can add links and emphasis; raw HTML is
 * not rendered, and react-markdown drops unsafe link protocols.
 *
 * `inline` drops the paragraph wrapper, for text that sits inside an existing line or
 * block — a banner, a label. Multi-paragraph text should use the block form.
 */
export function RichText({ text, inline = false }: { text: string; inline?: boolean }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={inline ? { p: ({ children }) => <>{children}</> } : undefined}
    >
      {text}
    </ReactMarkdown>
  );
}
