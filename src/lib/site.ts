/**
 * Code-level site settings. The visible text — name, description, banner, footer and the
 * rest — lives in content/site-text.json and is edited from /admin; see site-text-schema.ts.
 */
export const site = {
  /**
   * Only needs setting if the site moves to a custom domain. `||` rather than `??` because
   * Vercel's env-var autodetect creates blank entries rather than leaving a variable absent,
   * and an empty string here crashes the build via metadataBase.
   */
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://pais-review.vercel.app',
};
