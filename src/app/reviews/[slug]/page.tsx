import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { citationOf, getAllReviews, getReview, paperLink } from '@/lib/reviews';
import { KIND_LABELS } from '@/lib/types';
import { ScoreBadge } from '@/components/ScoreBadge';
import { Markdown } from '@/components/Markdown';
import { site } from '@/lib/site';

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllReviews().map((review) => ({ slug: review.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const review = getReview((await params).slug);
  if (!review) return { title: 'Review not found' };
  return {
    title: review.title,
    description: review.verdict,
    openGraph: { title: review.title, description: review.verdict, type: 'article' },
  };
}

export default async function ReviewPage({ params }: Params) {
  const review = getReview((await params).slug);
  if (!review) notFound();

  const link = paperLink(review);
  const reviewedOn = new Date(`${review.reviewedOn}T00:00:00Z`).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });

  return (
    <article>
      <header className="review-head">
        <Link className="back" href="/">
          ← All reviews
        </Link>
        <h1>{review.title}</h1>
        <p className="cite">
          {citationOf(review)}
          {link && (
            <>
              {' · '}
              <a href={link} target="_blank" rel="noreferrer">
                Read the paper
              </a>
            </>
          )}
        </p>

        <div className="verdict-box">
          <ScoreBadge review={review} />
          <p className="verdict">{review.verdict}</p>
        </div>

        <dl className="facts">
          <div>
            <dt>Type</dt>
            <dd>{KIND_LABELS[review.kind]}</dd>
          </div>
          {review.studyType && (
            <div>
              <dt>Design</dt>
              <dd>{review.studyType}</dd>
            </div>
          )}
          {review.confidence && (
            <div>
              <dt>Confidence in this grade</dt>
              <dd>{review.confidence}</dd>
            </div>
          )}
          {review.importance && (
            <div>
              <dt>Importance if true</dt>
              <dd>{review.importance}</dd>
            </div>
          )}
          <div>
            <dt>Reviewed</dt>
            <dd>{reviewedOn}</dd>
          </div>
          <div>
            <dt>Written by</dt>
            <dd>{review.model ?? 'an unrecorded model'}</dd>
          </div>
          {review.guideVersion && (
            <div>
              <dt>Guide version</dt>
              <dd>v{review.guideVersion}</dd>
            </div>
          )}
          {review.conditions && review.conditions.length > 0 && (
            <div>
              <dt>Topic</dt>
              <dd>{review.conditions.join(', ')}</dd>
            </div>
          )}
        </dl>

        {(review.strengths?.length || review.weaknesses?.length) && (
          <div className="two-col">
            {review.weaknesses && review.weaknesses.length > 0 && (
              <section className="panel">
                <h3>Main weaknesses</h3>
                <ul>
                  {review.weaknesses.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </section>
            )}
            {review.strengths && review.strengths.length > 0 && (
              <section className="panel">
                <h3>Main strengths</h3>
                <ul>
                  {review.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        {review.context && review.context.length > 0 && (
          <section className="context-panel">
            <h3>Context beyond the paper</h3>
            <ul>
              {review.context.map((item) => (
                <li key={item.note}>
                  {item.note}{' '}
                  {item.source ? (
                    <a href={item.source} target="_blank" rel="noreferrer">
                      Source
                    </a>
                  ) : (
                    <span className="unsourced">(no source given)</span>
                  )}
                </li>
              ))}
            </ul>
            <p className="context-note">
              These are facts about the circumstances around the work, not part of the
              assessment of its methods. They are listed so readers can weigh them
              themselves, not as a claim that the findings are wrong.
            </p>
          </section>
        )}
      </header>

      <Markdown>{review.body}</Markdown>

      <aside className="provenance">
        <p>
          Written by {review.model ?? 'an unrecorded Claude model'} against{' '}
          <Link href="/guide">the review guide</Link>
          {review.guideVersion ? ` (v${review.guideVersion})` : ''}, then read and published by{' '}
          {site.editor}. The grade is a judgement about this paper&rsquo;s evidence, not a
          statement about the researchers.
        </p>
      </aside>
    </article>
  );
}
