/**
 * The site's own to-do list: content/backlog.md, a markdown file with one "## " heading per
 * kind of item and a GitHub-style task list under each. Readable in the repository, editable
 * as text, and edited here one line at a time so each change is a one-line diff.
 */

export const BACKLOG_PATH = 'content/backlog.md';
export const BACKLOG_SECTIONS = ['Weaknesses', 'Missing features', 'Bugs', 'Ideas'] as const;

export interface BacklogItem {
  text: string;
  done: boolean;
  /** Date ticked off, if recorded. */
  doneOn?: string;
}

export interface BacklogSection {
  title: string;
  items: BacklogItem[];
}

const ITEM = /^- \[( |x|X)\] (.*)$/;
const DONE_SUFFIX = / \(done (\d{4}-\d{2}-\d{2})\)$/;

export function parseBacklog(source: string): BacklogSection[] {
  const sections: BacklogSection[] = [];
  let current: BacklogSection | undefined;
  for (const line of source.split('\n')) {
    const heading = /^## (.+?)\s*$/.exec(line);
    if (heading) {
      current = { title: heading[1], items: [] };
      sections.push(current);
      continue;
    }
    const item = ITEM.exec(line);
    if (item && current) {
      const done = item[1] !== ' ';
      const suffix = DONE_SUFFIX.exec(item[2]);
      current.items.push({
        text: suffix ? item[2].slice(0, suffix.index) : item[2],
        done,
        ...(suffix ? { doneOn: suffix[1] } : {}),
      });
    }
  }
  return sections;
}

export function cleanItemText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/** Appends an item at the end of its section, creating the section if needed. */
export function addBacklogItem(source: string, section: string, text: string): string {
  const item = cleanItemText(text);
  if (!item) throw new Error('Write what the item is.');
  if (item.length > 500) throw new Error('Keep an item under 500 characters; put detail in docs/roadmap.md.');

  const lines = source.replace(/\n+$/, '').split('\n');
  const start = lines.findIndex((line) => line.trim() === `## ${section}`);
  if (start === -1) return `${lines.join('\n')}\n\n## ${section}\n\n- [ ] ${item}\n`;

  // After the last item in the section, or straight after the heading if it has none.
  let insertAt = start + 1;
  for (let i = start + 1; i < lines.length && !lines[i].startsWith('## '); i++) {
    if (ITEM.test(lines[i])) insertAt = i + 1;
  }
  const block = insertAt === start + 1 ? ['', `- [ ] ${item}`] : [`- [ ] ${item}`];
  lines.splice(insertAt, 0, ...block);
  return `${lines.join('\n')}\n`;
}

/**
 * Ticks an item off, or back on. Found by section and exact text, so an item edited
 * elsewhere since the list was loaded is reported as missing rather than guessed at.
 */
export function setBacklogItemDone(
  source: string,
  section: string,
  text: string,
  done: boolean,
  today: string,
): string {
  const lines = source.split('\n');
  let inSection = false;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].startsWith('## ')) {
      inSection = lines[i].trim() === `## ${section}`;
      continue;
    }
    if (!inSection) continue;
    const match = ITEM.exec(lines[i]);
    if (!match) continue;
    const bare = match[2].replace(DONE_SUFFIX, '');
    if (bare !== text) continue;
    lines[i] = done ? `- [x] ${bare} (done ${today})` : `- [ ] ${bare}`;
    return lines.join('\n');
  }
  throw new Error('That item has changed since the list was loaded. Reload and try again.');
}
