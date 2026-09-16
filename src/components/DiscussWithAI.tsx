/**
 * Hands the review to a chat model with a prompt that asks it to argue with the review,
 * not summarise it. The raw markdown URL is what the model fetches; the page is for people.
 */
export function DiscussWithAI({ rawUrl, title, doi }: { rawUrl: string; title: string; doi?: string }) {
  const prompt = [
    `Read this review: ${rawUrl}`,
    doi ? `It reviews the paper with DOI ${doi} — read that too if you can.` : `It reviews "${title}" — read the paper too if you can find it.`,
    'Then discuss it with me. Where is the review right, where might it be wrong or unfair, and what evidence would change its verdict? Do not just summarise it.',
  ].join(' ');
  const q = encodeURIComponent(prompt);

  return (
    <div className="discuss">
      <span className="discuss-label">Discuss this review with an AI</span>
      <a className="secondary small" href={`https://claude.ai/new?q=${q}`} target="_blank" rel="noreferrer">
        Open in Claude
      </a>
      <a className="secondary small" href={`https://chatgpt.com/?q=${q}`} target="_blank" rel="noreferrer">
        Open in ChatGPT
      </a>
      <a className="linkish" href={rawUrl}>
        Raw markdown
      </a>
    </div>
  );
}
