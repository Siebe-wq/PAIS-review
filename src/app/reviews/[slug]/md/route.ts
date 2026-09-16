import { getReviewSource, getReview } from '@/lib/reviews';
import { dbConfigured } from '@/lib/db';
import { listComments, renderCommentsMarkdown } from '@/lib/comments';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * A review as plain markdown, frontmatter and all, with the comment thread appended —
 * the form a model should fetch. Comments are part of the record, so they travel with it.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const source = getReviewSource(slug);
  const review = getReview(slug);
  if (source === undefined || !review) return new Response('Not found', { status: 404 });

  let body = source.trimEnd();

  if (dbConfigured()) {
    try {
      const comments = await listComments('review', slug, null);
      if (comments.length > 0) {
        body += `\n\n## Comments\n\nReader comments, threaded. Each notes the method version it was written against.\n\n${renderCommentsMarkdown(comments)}\n`;
      }
    } catch {
      // A database hiccup should not make the review itself unavailable.
    }
  }

  return new Response(body + '\n', {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, must-revalidate',
    },
  });
}
