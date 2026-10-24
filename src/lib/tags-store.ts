import fs from 'node:fs';
import path from 'node:path';
import { EMPTY_TAGS, TAGS_PATH, parseTagList, type TagList } from './tags';

/** The tag list as deployed. A missing or broken file means no tags, never a broken site. */
export function getTags(): TagList {
  const file = path.join(process.cwd(), TAGS_PATH);
  if (!fs.existsSync(file)) return EMPTY_TAGS;
  try {
    const { tags, problems } = parseTagList(JSON.parse(fs.readFileSync(file, 'utf8')));
    for (const problem of problems) console.warn(`${TAGS_PATH}: ${problem}`);
    return tags;
  } catch (error) {
    console.error(`${TAGS_PATH} is not valid JSON; showing no tags.`, error);
    return EMPTY_TAGS;
  }
}
