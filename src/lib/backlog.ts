/**
 * The site's own to-do list: content/backlog.md. One "## " heading per category, a
 * GitHub-style task list under each, items in priority order as the editor arranged them.
 *
 *   - [ ] [high] Item text
 *   - [x] Item text (done 2026-10-14)
 *
 * Kept as markdown so it reads fine in the repository and can be edited as text. The admin
 * panel edits a parsed copy and writes the whole list back in this one canonical form, so a
 * reorder shows in the history as lines moving, not as a rewrite.
 */

export const BACKLOG_PATH = 'content/backlog.md';
export const BACKLOG_SECTIONS = ['Weaknesses', 'Missing features', 'Bugs', 'Ideas'] as const;
export const PRIORITIES = ['high', 'medium', 'low'] as const;
export type Priority = (typeof PRIORITIES)[number];

export const LIMITS = { itemText: 500, sectionTitle: 60, items: 500 };

export interface BacklogItem {
  text: string;
  done: boolean;
  /** Date ticked off, if recorded. */
  doneOn?: string;
  priority?: Priority;
}

export interface BacklogSection {
  title: string;
  items: BacklogItem[];
  /** Lines under the heading that are not items — notes typed by hand. Kept as they are. */
  notes: string[];
}

export interface Backlog {
  /** Everything above the first section: frontmatter and the intro. Kept as it is. */
  head: string;
  sections: BacklogSection[];
}

const ITEM = /^- \[( |x|X)\] (?:\[(high|medium|low)\] )?(.*)$/i;
const DONE_SUFFIX = / \(done (\d{4}-\d{2}-\d{2})\)$/;

export function isPriority(value: unknown): value is Priority {
  return typeof value === 'string' && (PRIORITIES as readonly string[]).includes(value);
}

export function parseBacklog(source: string): Backlog {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const first = lines.findIndex((line) => /^## /.test(line));
  const head = (first === -1 ? lines : lines.slice(0, first)).join('\n').trimEnd();
  const sections: BacklogSection[] = [];

  for (const line of first === -1 ? [] : lines.slice(first)) {
    const heading = /^## (.+?)\s*$/.exec(line);
    if (heading) {
      sections.push({ title: heading[1], items: [], notes: [] });
      continue;
    }
    const current = sections[sections.length - 1];
    const item = ITEM.exec(line);
    if (item) {
      const suffix = DONE_SUFFIX.exec(item[3]);
      const priority = item[2]?.toLowerCase();
      current.items.push({
        text: suffix ? item[3].slice(0, suffix.index) : item[3],
        done: item[1] !== ' ',
        ...(suffix ? { doneOn: suffix[1] } : {}),
        ...(isPriority(priority) ? { priority } : {}),
      });
    } else if (line.trim()) {
      current.notes.push(line);
    }
  }
  return { head, sections };
}

export function itemLine(item: BacklogItem): string {
  const box = item.done ? '[x]' : '[ ]';
  const priority = item.priority ? `[${item.priority}] ` : '';
  const done = item.done && item.doneOn ? ` (done ${item.doneOn})` : '';
  return `- ${box} ${priority}${item.text}${done}`;
}

export function serializeBacklog(backlog: Backlog): string {
  const parts = [backlog.head.trimEnd()];
  for (const section of backlog.sections) {
    const block = [`## ${section.title}`];
    if (section.notes.length) block.push('', ...section.notes);
    if (section.items.length) block.push('', ...section.items.map(itemLine));
    parts.push(block.join('\n'));
  }
  return `${parts.filter(Boolean).join('\n\n')}\n`;
}

export function cleanItemText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Checks a list sent from the admin panel and returns it in clean form, or throws with a
 * reason a person can act on. Notes and the head are not taken from the client; the
 * server keeps whatever the file already has.
 */
export function validateSections(input: unknown): Omit<BacklogSection, 'notes'>[] {
  if (!Array.isArray(input)) throw new Error('The list is malformed.');
  let count = 0;
  const seen = new Set<string>();
  return input.map((raw) => {
    const section = raw as { title?: unknown; items?: unknown };
    const title = cleanItemText(String(section.title ?? ''));
    if (!title || title.length > LIMITS.sectionTitle) throw new Error('A category needs a name of up to 60 characters.');
    if (seen.has(title)) throw new Error(`The category "${title}" appears twice.`);
    seen.add(title);
    if (!Array.isArray(section.items)) throw new Error(`"${title}" has no item list.`);
    const items = section.items.map((rawItem): BacklogItem => {
      const item = rawItem as Record<string, unknown>;
      const text = cleanItemText(String(item.text ?? ''));
      if (!text) throw new Error(`An item in "${title}" is empty.`);
      if (text.length > LIMITS.itemText) throw new Error(`Keep items under ${LIMITS.itemText} characters; detail goes in docs/roadmap.md.`);
      const done = item.done === true;
      const doneOn = typeof item.doneOn === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(item.doneOn) ? item.doneOn : undefined;
      return {
        text,
        done,
        ...(done && doneOn ? { doneOn } : {}),
        ...(isPriority(item.priority) ? { priority: item.priority } : {}),
      };
    });
    count += items.length;
    if (count > LIMITS.items) throw new Error(`The backlog is limited to ${LIMITS.items} items.`);
    return { title, items };
  });
}

/** The edited sections, with the notes and head the file already had. */
export function mergeIntoBacklog(current: Backlog, sections: Omit<BacklogSection, 'notes'>[]): Backlog {
  return {
    head: current.head,
    sections: sections.map((section) => ({
      ...section,
      notes: current.sections.find((s) => s.title === section.title)?.notes ?? [],
    })),
  };
}
