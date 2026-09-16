import { getDocSource } from '@/lib/doc';

export const dynamic = 'force-static';

/**
 * The guide as plain markdown, so Claude (or anything else) can fetch the current
 * standard instead of working from a copy that has drifted.
 */
export function GET() {
  const source = getDocSource('guide');
  if (source === undefined) return new Response('Not found', { status: 404 });

  return new Response(source, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
