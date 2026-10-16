# Roadmap

Ideas from the project notes that need either a decision, an account, or a bigger build
than is sensible to do unasked. Each one says what it would take and what the sticking
point is. Things already built are in the README, not here.

## Near term

### Comments and ratings — built

Both exist now. What they still lack, and what it would take:

- **Weighting by expertise, down-weighting people who rate everything five.** Needs
  accounts; see "Accounts and readers" below.
- **A real spam filter.** The current defences (honeypot, rate limits, link cap, duplicate
  rejection) stop bots and repeats, not a person. When that matters, a small model can read
  each new comment before it shows — spam, abuse, off-topic — for a fraction of a cent each, and
  hold doubtful ones for you. Akismet is the off-the-shelf alternative.
- **Notifications.** Nobody is told when someone replies to them. Needs accounts and email;
  see "Accounts and readers" below.

### Grade last, shown first — built 2026-10-16 (methods 0.8)

Built as described below, with two differences. The judgement fields in the frontmatter
(score, verdict, strengths, weaknesses) are also written last, after the summary: the
`/review` skill writes the analysis to the file first and adds the frontmatter at the end, and
the claude.ai instructions have the first draft in the chat come without frontmatter. And the
"worst domain sets the ceiling" rule mentioned at the end is gone: the grade is now holistic.
The parser is `src/lib/hoist.ts`, with tests in `tests/hoist.test.mjs` (`npm test`).

**The problem.** A review file starts with its frontmatter — the block of `key: value`
lines between two `---` markers at the top — and that block holds `score`, `verdict`,
`strengths` and `weaknesses`. So the model writes the grade before it has written a word
of the analysis. Everything after is written knowing the number it already committed to.
The body then opens with `## Executive summary`, which has the same problem one level
down. A model's output conditions its own continuation, so this is not a small effect: it
turns the analysis into justification for a number picked early.

**The change.** The judgement is written last and displayed first. The executive summary
stays where readers want it, near the top of the page, but the model writes it after the
analysis rather than before, and it ends by stating the grade. Bibliographic frontmatter
(title, authors, journal, DOI, `kind`) stays at the top of the file and is written first —
there is no judgement in it, so writing it first costs nothing.

So the body's section order, as written, ends with:

```
## Final assessment
## Executive summary   <- written last, ends with the grade
```

and the publishing step reads the grade out of that closing section into the frontmatter,
which every other part of the site already uses. The page then renders the executive
summary above the body. Nothing downstream changes: the index, the search, the score bands
and the sitemap keep reading frontmatter as they do now, and the strengths and weaknesses
bullets stay exactly as they are.

**The stored file keeps the writing order.** The summary stays last in the markdown and
the page moves it, rather than the publish step rewriting the file. That keeps an honest
record of the order the review was written in, and a model reading the raw `.md` gets the
analysis before the conclusion, which is the better order for it too.

**What it takes.**

1. `content/instructions.md` and `.claude/skills/review/SKILL.md`: the section order, the
   rule that the summary is written last, and the rule that it ends with the grade. Both
   carry the same body template, so both change.
2. A parser, roughly `src/lib/hoist.ts`, that finds the closing summary and reads the grade
   out of its last line. It fails with a named error on a malformed grade, the way the
   frontmatter parser already does, rather than guessing.
3. `src/app/reviews/[slug]/page.tsx`: render that section above the body instead of in
   place.
4. `src/lib/publish.ts`: call the parser from `buildReviewFile`, so `/admin` and the
   `/review` skill get the same result, and the `/admin` preview shows what was extracted.
5. `src/lib/normalise.ts`: the tidy-up model puts the summary last too. It still must never
   invent a grade.
6. A methods version bump. This changes how a grade is arrived at, so it is a middle-number
   bump (0.3.1 to 0.4), not a patch, and the changelog should say why. Reviews already
   published keep their own version stamp, which is the point of having one.
7. Tests: grade present, grade absent, malformed grade, an old-format file, and a file
   where the body and the frontmatter disagree.

**Back-compatibility.** Both published reviews have the old shape, with the executive
summary first and no grade line in it. The parser treats the closing section as optional
and falls back to the frontmatter, so old files keep working untouched. If a file has both
and they disagree, it should fail loudly rather than pick one — a review whose displayed
grade does not match its own text is the exact failure this site exists to point at.

**Settled.** The executive summary stays as prose near the top and is not replaced by
bullets. It is written last and ends with the grade.

**Still open.** When the body and the frontmatter disagree about the grade, fail or prefer
one? Recommend fail.

**What it does not fix.** The model can still form a view early and write toward it in its
hidden reasoning. This removes the anchor that is actually in the text and in the context
for the rest of the generation, which is the part that is measurable. (When this was
written, the "worst domain sets the ceiling" rule was the guard against an analysis that
finds a fatal flaw and then awards 6.5 anyway. Methods 0.8 replaced it with a holistic grade,
explained both ways in the final assessment; the blind fact check and the editor are the
remaining guards.)

**Effort.** About three hours here, mostly the parser and its tests. Your time is one
decision and a read of the reworded instructions.

### Bulk import of two years of reviews

**Needs one action from you; after that it is a session's work.** Two ways in:

- **The claude.ai data export.** Settings → Privacy → Export data emails you a zip of every
  conversation. Put it in Google Drive (sessions here can read Drive) or attach it to a session.
  The session finds the review conversations, takes the final version of each review, runs it
  through the normaliser, and publishes the batch as withdrawn drafts for you to release. If the
  export does not record which project a chat came from, reviews are easy to recognise by content.
- **Your own logged-in browser.** With Claude in Chrome, or the Claude desktop app's browser,
  connected to a session, it can open the project and read each conversation directly. No
  export needed.

**Scores.** Reviews that state a grade keep it. For the rest, a model can propose one against the
guide, with its reasoning, stored as a proposal that the review page does not show until you
accept or change it. That turns grading a backlog into checking one, which takes minutes per
review rather than a re-read. It needs a "proposed score" field and a button in the Reviews
tab — an afternoon.

### Citations on the About page for how well Claude reviews

**A session can do this end to end.** The notes name "the Litvak error injection paper" and "that
paper on the distribution of scores given by various models". A session with web search finds
both, checks each against its DOI and abstract so nothing unverified is cited, and drafts the
paragraph for `content/about.md`. Your part is approving the wording.

### Full-text search

Search currently covers title, authors, journal, verdict, tags, strengths and weaknesses —
not the body — so "biobank" finds nothing even though a review discusses one. The body
would bloat the index page if shipped with it. The fix is a build-time
`/search-index.json` of body text that the search box fetches lazily on first keystroke.
An hour; no decision needed, just not done yet.

### Tags on reviews

`conditions` already works as a tag (ME/CFS, Long Covid) and drives the filters on the
index. Tags would add what kind of research it is: treatment trial, diagnostic test,
biomarker, genetics, epidemiology, mechanism, exercise and so on.

**What it takes.** A `tags` field in the frontmatter, chips and a filter on the index, a page
per tag, and tags in search. The tags come from one list kept in the repository, so they do not
drift into "RCT", "trial" and "clinical trial" as three different tags; the publish preview
warns about a tag that is not on the list. The instructions and the tidy-up step pick tags from
that list, which is a wording change to the method. Existing reviews get tagged in the same
session. Half a day. No accounts needed.

**Decision.** The starting list of tags. A session can draft one from the reviews so far.

### A heart reaction on comments

A way to say "thank you" or "this matters" that is neither a quality vote nor agreement.

**What it takes.** A third kind of vote next to the upvote and agree/disagree, using the same
table and the same one-per-browser rule, with a count beside a heart. An hour or two. It works
with or without accounts; with accounts it becomes one per person.

**Decision.** Whether hearts count towards karma (below). Recommend not: karma should mean
"writes useful comments", and a heart is often given for a personal story rather than for
usefulness.

### Posting new reviews to X and Bluesky

**What it takes.** On publish, post the title, the verdict line and a link. The cleanest hook
is a small GitHub Action that runs when a file in `content/reviews/` is added, so it fires
however the review was published. The account token is stored as a secret. A few hours for both.

**Bluesky** is free and its posting API is simple. **X** has changed its API terms and prices
several times; check the current terms for a low-volume posting account before building.
Each needs an account you control.

## Accounts and readers

These belong together because almost all of them rest on two things the site does not have
yet: **sending email**, and **accounts**. They are listed in the order they have to be built.

### 0. Sending email — the shared prerequisite

Sign-in codes, "your review is ready" messages and the weekly digest are all email.

**What it takes.**
- **A domain of our own**, about €10–15 a year. A `vercel.app` address cannot be set up to send
  email, because sending needs records in the domain's settings that only the domain's owner
  can add. The site would move to it too, which also makes its address independent of Vercel.
- **An email-sending service** (Resend, Postmark, Amazon SES or similar). Free or near-free
  tiers cover this scale.
- **A short privacy notice**, and a way to delete your account and your email address. Storing
  readers' email addresses brings data-protection law into play, including the GDPR for
  readers in the EU.

**Your part.** Choosing and buying the domain, and signing up for the email service. A session
can then do the settings and the rest.

### 1. Accounts by email, with one-time codes

Required to comment, vote, rate and request reviews.

**What it takes.** Enter an email address, get a six-digit code, type it in, stay signed in on
that device for months. A code rather than a link, because on a phone the email app often
opens links in a different browser from the one you signed in on. Codes expire after ten
minutes, are stored hashed, and are rate-limited per address and per network. A display name
is chosen once, and the address is never shown. About a day, once email works.

**Existing comments** keep their names and stay up; from then on, posting and voting need an
account. Votes cast before accounts existed stay counted but cannot be tied to anyone.

**Decision.** Accounts stop most spam and vote stuffing, but every step costs readers energy,
and many of the readers are people with ME/CFS. Keeping people signed in for a long time, and
asking for nothing but an email address, keeps that cost low. One option is to let people read
and rate without an account and require one only to comment.

### 2. Verified scientists

A badge for people who have shown they work at a university or research institute.

**What it takes.** An account can add a second email address at an institution and confirm it
with a code. The domain is checked against an open list of university domains, with research
institutes and hospitals added by you from `/admin`. The badge names the institution's domain
("verified: ucl.ac.uk"). ORCID sign-in is a second route, and free. Manual approval is a third,
for researchers who fit neither. Half a day.

**Worth saying on the site.** An institutional address shows where someone works, not that
they know this field. Some of the most careful readers of ME/CFS research are patients without
one. The badge should read as "this person is who they say", not "trust this person more".

### 3. User karma

**What it takes.** The sum of upvotes minus downvotes a person's comments have received, shown
beside their name. Agree/disagree votes do not count, so that disagreeing with the majority is
never penalised. Later, votes from new accounts can count for less, which makes karma hard to
inflate with fresh sign-ups. An hour or two once accounts exist.

### 4. Request a review

**The flow.**
1. Paste a DOI or a link.
2. The site checks whether a review already exists, by DOI and by title. A preprint and its
   later journal version have different DOIs, so a title match matters too. If one exists, it
   shows it.
3. It checks whether the full text is openly available, using Unpaywall (a free service that
   says where a paper can legally be read for free), Europe PMC and the preprint servers.
4. If it is not, it asks for a PDF. Uploaded PDFs stay private, are used only for the review,
   and are deleted afterwards.
5. The request goes into a public queue that signed-in readers can upvote, one vote each.
6. When the review is published, the requester, and anyone who upvoted and asked to be told,
   gets an email.

**What it takes.** A request page, a queue page, a requests table, private file storage for PDFs,
a Requests view in `/admin` (accept, decline, mark duplicate) and the notification email. About
two days, after accounts.

**The bigger choice: who writes the requested reviews.** At four hours a week, a queue can grow
faster than you can review. The alternative is to have the site generate the review itself,
through the API, with the guide, the instructions and the full text — and hold it as a draft
for you to read and publish. That also solves the high-priority "what did the model actually
see?" problem: when the site fetches the paper itself, it knows exactly which text, figures and
supplements went in, and can record them on the review. A review costs a few dollars at most in
model use at current prices; worth checking against the model used. Recommend building the
queue so that either route works.

**Decision.** Whether the queue is visible to everyone. Recommend yes, with the order set by
votes and your accept or decline, so it is clear that a request is not a promise.

### 5. Weekly email digest, with filters

**What it takes.** A sign-up form (email address, then confirm with a link, so nobody is signed
up by someone else), a page to set filters — condition, tag, type of review, score band — and a
weekly send listing new reviews that match, plus the most active discussions. Every email has
a one-click unsubscribe. The weekly send is a scheduled job on Vercel. About a day, once email
works. With accounts it becomes a setting on your account; without, the manage-your-filters
link in each email is the account.

## Long term

### A "worldview" / turning reviews into a database

These are the same idea: extract structured claims from each review (paper, finding,
verdict on the finding, evidence grade) so the corpus can be queried — "what does the
site's evidence say about mitochondrial dysfunction?" The frontmatter is already
structured; the body isn't. The path is a per-review extraction step (a model call with a
schema, like the normaliser) writing `claims:` into the frontmatter, then a page that
aggregates them. Interesting, and a real differentiator, but it needs a claim schema
designed carefully first or the aggregate will be mush.

### Provenance: what the model actually saw

Currently the review says what it had access to only if the model writes that down. Real
provenance means logging, per review, which files were provided and which URLs were
fetched. That's available when reviews are generated through the API (the tool-call log)
but not from a claude.ai chat. It becomes tractable if generation moves server-side — see
the next item.

### Re-generate a review incorporating comments

Depends on comments existing, and on generation being reproducible: same paper, same
guide version, same prompt, plus the comment thread as extra input. Best done through the
API rather than a chat, so it's the same feature as the "visitors can generate a review"
idea from earlier, with a stored input bundle per review.

### Flag a specific error in a review

A lighter cousin of comments: a per-review "report an error" form that opens a GitHub
issue with the review slug, the quoted passage and the reader's note. No accounts, no
moderation queue beyond the issue tracker you already have, and it feeds the corrections
promise on the About page directly. Could be done now in an afternoon; parking it only
because it overlaps with the comments decision.

