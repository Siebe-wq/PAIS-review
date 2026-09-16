import { getDoc, renderTemplate } from '@/lib/doc';
import { site } from '@/lib/site';

export const dynamic = 'force-static';

/** The project prompt, verbatim, with the site URL filled in. */
export function GET() {
  const doc = getDoc('prompt');
  if (!doc) return new Response('Not found', { status: 404 });

  return new Response(renderTemplate(doc.body, site.url), {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
