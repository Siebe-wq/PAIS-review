import { getReviewSource } from '@/lib/reviews';

export const dynamic = 'force-static';

/** A review as plain markdown, frontmatter and all — the form a model should fetch. */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = getReviewSource(slug);
  if (source === undefined) return new Response('Not found', { status: 404 });

  return new Response(source, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
