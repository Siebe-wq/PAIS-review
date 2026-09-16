import { getDoc, renderTemplate } from '@/lib/doc';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * The reviewing instructions, with the live guide version filled in. Point a Claude
 * project at this URL and updating the guide updates what the project follows —
 * nothing to re-upload anywhere.
 */
export function GET() {
  const doc = getDoc('instructions');
  if (!doc) return new Response('Not found', { status: 404 });

  return new Response(renderTemplate(doc.body, site.url), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
