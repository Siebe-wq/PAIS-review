import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllReviews, getReview, paperLink } from '@/lib/reviews';
import { HUMAN_INPUT_LABELS, KIND_LABELS, modelLabel } from '@/lib/types';
import { extractToc } from '@/lib/toc';
import { displayOrder } from '@/lib/hoist';
import { TableOfContents } from '@/components/TableOfContents';
import { Authors } from '@/components/Authors';
import { DiscussWithAI } from '@/components/DiscussWithAI';
import { Rating } from '@/components/Rating';
import { Comments } from '@/components/Comments';
import { ScoreBadge } from '@/components/ScoreBadge';
import { Markdown } from '@/components/Markdown';
import { site } from '@/lib/site';
import { getSiteText } from '@/lib/site-text';
import { RichText } from '@/components/RichText';

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

  const text = getSiteText();
  const link = paperLink(review);
  // The executive summary is written last and shown first.
  const body = displayOrder(review.body);
  const toc = extractToc(body);
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
          {review.authors && <Authors authors={review.authors} />}
          {review.authors && (review.journal || review.year) ? ' · ' : ''}
          {[review.journal, review.year].filter(Boolean).join(' · ')}
          {review.preprint && (
            <>
              {' '}
              <span className="tag-preprint">{text['label.preprint']}</span>
            </>
          )}
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
            <dt>{text['label.type']}</dt>
            <dd>
              {KIND_LABELS[review.kind]}
              {review.preprint ? ` · ${text['label.preprint']}` : ''}
            </dd>
          </div>
          {review.studyType && (
            <div className="wide">
              <dt>{text['label.design']}</dt>
              <dd>{review.studyType}</dd>
            </div>
          )}
          {review.confidence && (
            <div>
              <dt>{text['label.confidence']}</dt>
              <dd className="cap">{review.confidence}</dd>
            </div>
          )}
          {review.importance && (
            <div>
              <dt>{text['label.importance']}</dt>
              <dd className="cap">{review.importance}</dd>
            </div>
          )}
          <div>
            <dt>{text['label.reviewed']}</dt>
            <dd>{reviewedOn}</dd>
          </div>
          <div>
            <dt>{text['label.writtenBy']}</dt>
            <dd>{modelLabel(review, 'an unrecorded model')}</dd>
          </div>
          {review.guideVersion && (
            <div>
              <dt>{text['label.guideVersion']}</dt>
              <dd>v{review.guideVersion}</dd>
            </div>
          )}
          <div className={review.humanInput ? 'wide' : undefined}>
            <dt>{text['label.humanInput']}</dt>
            <dd>
              {review.humanInput ? (
                <>
                  {HUMAN_INPUT_LABELS[review.humanInput]}
                  <span className="fact-note"> — {text[`humanInput.${review.humanInput}`]}</span>
                </>
              ) : (
                <span className="fact-note">{text['humanInput.unrecorded']}</span>
              )}
            </dd>
          </div>
          {review.conditions && review.conditions.length > 0 && (
            <div>
              <dt>{text['label.topic']}</dt>
              <dd>{review.conditions.join(', ')}</dd>
            </div>
          )}
        </dl>

        {((review.strengths?.length ?? 0) > 0 || (review.weaknesses?.length ?? 0) > 0) && (
          <div className="two-col">
            {review.weaknesses && review.weaknesses.length > 0 && (
              <section className="panel weaknesses">
                <h3>{text['review.weaknessesHeading']}</h3>
                <ul>
                  {review.weaknesses.map((w) => (
                    <li key={w}>{w}</li>
                  ))}
                </ul>
              </section>
            )}
            {review.strengths && review.strengths.length > 0 && (
              <section className="panel strengths">
                <h3>{text['review.strengthsHeading']}</h3>
                <ul>
                  {review.strengths.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

      </header>

      <div className="review-body">
        <TableOfContents entries={toc} />
        <Markdown>{body}</Markdown>
      </div>

      {review.context && review.context.length > 0 && (
        <section className="context-panel">
          <h3>{text['review.contextHeading']}</h3>
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
          <div className="context-note">
            <RichText text={text['review.contextNote']} />
          </div>
        </section>
      )}

      {review.guideNotes && review.guideNotes.length > 0 && (
        <aside className="guide-notes">
          <h3>{text['review.guideNotesHeading']}</h3>
          <RichText text={text['review.guideNotesIntro']} />
          <ul>
            {review.guideNotes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </aside>
      )}

      <Rating slug={review.slug} label={text['rating.label']} />

      <DiscussWithAI
        rawUrl={`${site.url}/reviews/${review.slug}.md`}
        title={review.title}
        doi={review.doi}
        label={text['discuss.label']}
        instruction={text['discuss.prompt']}
      />

      <Comments type="review" slug={review.slug} intro={<RichText text={text['comments.intro']} inline />} />

      <aside className="provenance">
        <p>
          Written by {modelLabel(review, 'an unrecorded Claude model')} against{' '}
          <Link href="/methods">the guide</Link>
          {review.guideVersion ? ` (v${review.guideVersion})` : ''}.{' '}
          <RichText text={text['review.provenance']} inline />
        </p>
      </aside>
    </article>
  );
}
