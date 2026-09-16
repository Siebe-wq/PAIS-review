/** Single place to change the site's name and blurb. */
export const site = {
  name: 'IACI Peer Review',
  tagline: 'Claude-written reviews of research on infection-associated chronic illnesses',
  description:
    'Rigorous, openly published reviews of papers on ME/CFS, Long Covid and related infection-associated chronic illnesses. Each review is written by Claude against a published guide and checked before publication.',
  editor: 'Siebe Rozendal',
  /** Set NEXT_PUBLIC_SITE_URL in Vercel once you have a domain. */
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
};
