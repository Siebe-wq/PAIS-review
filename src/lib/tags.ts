/**
 * Tags from one controlled list, so filters and tag pages stay tidy: a design (one per
 * review: what kind of study it is) and topics (any number: what it is about).
 *
 * The list lives in content/tags.json and is edited in /admin → Tags. Reviews store tag
 * ids, so renaming a tag's label never touches the reviews or breaks a /tags/<id> link.
 * Pure functions only, so the build, the admin API and the tests share them.
 */

export const TAGS_PATH = 'content/tags.json';
export const TAG_GROUPS = ['designs', 'topics'] as const;
export type TagGroup = (typeof TAG_GROUPS)[number];
export const TAG_LIMITS = { label: 60, perGroup: 100 };

export interface Tag {
  id: string;
  label: string;
}

export type TagList = Record<TagGroup, Tag[]>;

export const EMPTY_TAGS: TagList = { designs: [], topics: [] };

/** "Heart, blood vessels & circulation" → "heart-blood-vessels-and-circulation". */
export function tagId(label: string): string {
  return label
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60)
    .replace(/-+$/, '');
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function cleanLabel(value: unknown): string {
  return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : '';
}

/**
 * Reads the stored file. Bad entries are dropped with a note rather than thrown, so a
 * hand edit gone wrong cannot take the site down.
 */
export function parseTagList(raw: unknown): { tags: TagList; problems: string[] } {
  const problems: string[] = [];
  const tags: TagList = { designs: [], topics: [] };
  const seen = new Set<string>();
  const record = raw && typeof raw === 'object' ? (raw as Record<string, unknown>) : {};

  for (const group of TAG_GROUPS) {
    const entries = record[group];
    if (entries === undefined) continue;
    if (!Array.isArray(entries)) {
      problems.push(`"${group}" is not a list.`);
      continue;
    }
    for (const entry of entries) {
      const item = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {};
      const label = cleanLabel(item.label);
      const id = typeof item.id === 'string' ? item.id : '';
      if (!label || !ID.test(id)) {
        problems.push(`Skipped a ${group.slice(0, -1)} without a usable id and label.`);
        continue;
      }
      if (seen.has(id)) {
        problems.push(`Skipped a second tag with the id "${id}".`);
        continue;
      }
      seen.add(id);
      tags[group].push({ id, label });
    }
  }
  return { tags, problems };
}

/**
 * Checks a list sent from the admin form. A new tag arrives without an id and gets one
 * from its label; an existing tag keeps its id whatever its label becomes.
 */
export function validateTagList(input: unknown): { tags: TagList } | { error: string } {
  const record = input && typeof input === 'object' ? (input as Record<string, unknown>) : null;
  if (!record) return { error: 'Nothing to save.' };

  const tags: TagList = { designs: [], topics: [] };
  const seen = new Map<string, string>();
  for (const group of TAG_GROUPS) {
    const entries = record[group];
    if (!Array.isArray(entries)) return { error: `The ${group} list is missing.` };
    if (entries.length > TAG_LIMITS.perGroup) return { error: `At most ${TAG_LIMITS.perGroup} ${group}.` };
    for (const entry of entries) {
      const item = entry && typeof entry === 'object' ? (entry as Record<string, unknown>) : {};
      const label = cleanLabel(item.label);
      if (!label) return { error: `A tag in ${group} has no name.` };
      if (label.length > TAG_LIMITS.label) return { error: `"${label.slice(0, 30)}…" is longer than ${TAG_LIMITS.label} characters.` };
      const id = typeof item.id === 'string' && item.id ? item.id : tagId(label);
      if (!ID.test(id)) return { error: `"${label}" needs at least one letter or digit.` };
      const clash = seen.get(id);
      if (clash) return { error: `"${label}" and "${clash}" would share the address /tags/${id}. Rename one.` };
      seen.set(id, label);
      tags[group].push({ id, label });
    }
  }
  return { tags };
}

export function serialiseTagList(tags: TagList): string {
  return `${JSON.stringify(tags, null, 2)}\n`;
}

export function findTag(tags: TagList, id: string): (Tag & { group: TagGroup }) | undefined {
  for (const group of TAG_GROUPS) {
    const tag = tags[group].find((t) => t.id === id);
    if (tag) return { ...tag, group };
  }
  return undefined;
}

/** A review's own tags, in list order, leaving out ids the list no longer has. */
export function tagsOf(review: { design?: string; topics?: string[] }, tags: TagList): { design?: Tag; topics: Tag[] } {
  return {
    design: review.design ? tags.designs.find((t) => t.id === review.design) : undefined,
    topics: tags.topics.filter((t) => review.topics?.includes(t.id)),
  };
}

/**
 * Checks the tags chosen for one review against the list. Returns clean values, or the
 * first problem found.
 */
export function checkReviewTags(
  input: { design?: unknown; topics?: unknown },
  tags: TagList,
): { design: string | null; topics: string[] } | { error: string } {
  const design = typeof input.design === 'string' && input.design ? input.design : null;
  if (design && !tags.designs.some((t) => t.id === design)) return { error: `Unknown design: ${design}` };
  if (input.topics !== undefined && !Array.isArray(input.topics)) return { error: 'Topics must be a list.' };
  const chosen = new Set((input.topics as unknown[] | undefined ?? []).map(String));
  for (const id of chosen) if (!tags.topics.some((t) => t.id === id)) return { error: `Unknown topic: ${id}` };
  // List order, so the file does not churn when the same topics are ticked in another order.
  return { design, topics: tags.topics.filter((t) => chosen.has(t.id)).map((t) => t.id) };
}

/** The list cut down to tags at least one of these reviews carries, in list order. */
export function usedTags(reviews: { design?: string; topics?: string[] }[], tags: TagList): TagList {
  const used = new Set(reviews.flatMap((review) => [review.design, ...(review.topics ?? [])]));
  return {
    designs: tags.designs.filter((tag) => used.has(tag.id)),
    topics: tags.topics.filter((tag) => used.has(tag.id)),
  };
}
