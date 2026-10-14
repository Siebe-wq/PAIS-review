/**
 * Hands the review to a chat model with a prompt that asks it to argue with the review,
 * not summarise it. The raw markdown URL is what the model fetches; the page is for people.
 */
export function DiscussWithAI({
  rawUrl,
  title,
  doi,
  label,
  instruction,
}: {
  rawUrl: string;
  title: string;
  doi?: string;
  /** Editable site text. */
  label: string;
  instruction: string;
}) {
  const prompt = [
    `Read this review: ${rawUrl}`,
    doi ? `It reviews the paper with DOI ${doi} — read that too if you can.` : `It reviews "${title}" — read the paper too if you can find it.`,
    instruction,
  ].join(' ');
  const q = encodeURIComponent(prompt);

  return (
    <div className="discuss">
      <span className="discuss-label">{label}</span>
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
