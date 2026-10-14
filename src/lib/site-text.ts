import fs from 'node:fs';
import path from 'node:path';
import { parseOverrides, resolve, type SiteText } from './site-text-schema';

/** Repository path of the edited site text. Holds only what differs from the defaults. */
export const SITE_TEXT_PATH = 'content/site-text.json';

/** The site text as deployed: defaults, with whatever the editor has changed on top. */
export function getSiteText(): SiteText {
  const file = path.join(process.cwd(), SITE_TEXT_PATH);
  if (!fs.existsSync(file)) return resolve({});

  let raw: unknown;
  try {
    raw = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    // A broken file must not take the site down; the defaults still read correctly.
    console.error(`${SITE_TEXT_PATH} is not valid JSON; using the defaults.`, error);
    return resolve({});
  }
  const { overrides, problems } = parseOverrides(raw);
  for (const problem of problems) console.warn(`${SITE_TEXT_PATH}: ${problem}`);
  return resolve(overrides);
}
