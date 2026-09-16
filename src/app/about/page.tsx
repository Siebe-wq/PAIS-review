import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  title: 'About',
  description: 'How these reviews are made, what they are for, and what they are not.',
};

const contact = process.env.NEXT_PUBLIC_CONTACT_EMAIL;

export default function AboutPage() {
  return (
    <article>
      <header className="review-head">
        <h1>About this site</h1>
      </header>

      <div className="prose">
        <h2>What this is</h2>
        <p>
          Research on ME/CFS, Long Covid and related infection-associated chronic illnesses is
          reviewed unevenly. Papers with fatal design problems get published and then get quoted
          in the press as if settled. Good work sometimes gets ignored. This site publishes
          careful reviews of individual papers so that anyone can see the reasoning, not just the
          conclusion.
        </p>

        <h2>How a review is made</h2>
        <p>
          Each paper is read by Claude against the <Link href="/guide">review guide</Link>, which
          is published here in full and versioned. Every review records which version of the
          guide produced it. {site.editor} reads the result before it goes up. Nothing is
          published automatically.
        </p>

        <h2>About the score</h2>
        <p>
          Each review carries a grade out of 10. It is a considered judgement about how much the
          paper&rsquo;s evidence can carry its claims, not a measurement. Small differences
          between scores are not meaningful — a 6.5 and a 7 are the same verdict in practice.
          Anything below 5 means the paper does not support its main claim. Read the verdict and
          the listed weaknesses before the number.
        </p>
        <p>
          A low score is not an accusation of bad faith. Most papers that score badly here are
          ordinary work with design limits that its authors may well acknowledge; the problem is
          usually how the result then gets used.
        </p>

        <h2>What this is not</h2>
        <p>
          These are not journal peer reviews, and no journal has commissioned them. They are not
          a consensus position, and they are not medical advice. They are one careful reading,
          published openly so it can be argued with. Claude can be confidently wrong, and so can
          the guide.
        </p>

        <h2>Corrections</h2>
        <p>
          If a review misreads a paper, misses something in a supplement, or is unfair to the
          people who wrote it, it will be corrected or taken down. Authors of reviewed papers get
          first call on that. Corrections are made openly, and the edit history of every review
          is public in the site&rsquo;s repository.
        </p>
        {contact ? (
          <p>
            Write to <a href={`mailto:${contact}`}>{contact}</a>.
          </p>
        ) : (
          <p>
            <em>
              Contact address not set yet — add NEXT_PUBLIC_CONTACT_EMAIL in the Vercel project
              settings and it will appear here.
            </em>
          </p>
        )}
      </div>
    </article>
  );
}
