/** Single place to change the site's name and blurb. */
export const site = {
  name: 'PAIS Review',
  tagline: 'Claude-written reviews of research on post-acute infection syndromes',
  description:
    'Rigorous, openly published reviews of papers on ME/CFS, Long Covid and other post-acute infection syndromes (PAIS). Each review is written by Claude against a published guide and checked before publication.',
  editor: 'Siebe Rozendal',
  /** Shown as a banner under the header on every page. Set to '' to remove it. */
  pilotNotice:
    'Early pilot. These reviews are AI-written and lightly checked — expect rough edges, and treat any single review as one reading, not a verdict.',
  /**
   * Only needs setting if the site moves to a custom domain. `||` rather than `??` because
   * Vercel's env-var autodetect creates blank entries rather than leaving a variable absent,
   * and an empty string here crashes the build via metadataBase.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pais-review.vercel.app',
};
