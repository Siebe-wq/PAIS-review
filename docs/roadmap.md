# Roadmap

Ideas from the project notes that need either a decision, an account, or a bigger build
than is sensible to do unasked. Each one says what it would take and what the sticking
point is. Things already built are in the README, not here.

## Near term

### Reader ratings (1–5 stars on each review)

**What it takes.** A place to store votes (Vercel Postgres, Supabase, or Cloudflare D1 —
all have free tiers), one API route to record a vote, one to read the average, and a
widget under each review. Half a day.

**The problem is the data, not the build.** Anonymous stars are trivially gamed and say
more about who turned up than about the review: a review that annoys a researcher's
followers will get one-starred, one that pleases a patient community will get five. Your
note already says the long-term fix is weighting by expertise and down-weighting people
who rate everything five — and both need users, so this is really the same project as
accounts (below). Until then, a rating is a number that looks like information and isn't.

**What I'd do instead first.** A one-question reaction that produces a usable signal
without accounts: "Did this review help you understand the paper?" Yes / No, plus an
optional free-text "what's wrong with it?". The free text is the useful part — it feeds
the corrections process — and yes/no is hard to weaponise because it isn't a judgement of
the paper.

### Request a review

**What it takes.** A form (DOI or link, optional note, optional email), a table to hold
requests, and a "Requests" section in `/admin` with approve / decline. If friends should
skip the queue, an invite link that sets a cookie marking their requests pre-approved.
Same storage decision as ratings; about a day including the admin side.

**Decisions.** Do requesters upload a PDF? If yes, files must be private and deleted
after review — a paywalled paper sitting in your storage is a copyright problem the review
itself is not. Do you show a public "requested, not yet reviewed" list? That sets
expectations you may not want to be held to at four hours a week.

### Comments, with votes, nesting and agree/disagree

**What it takes.** This is the largest item and it changes what the site is. You need
identity (even lightweight — email magic link), storage, a moderation queue, a spam filter
(Akismet is cheap and works; or require a signed-in account, which kills most spam by
itself), nested rendering, two vote axes, and an abuse path. Two to three days to do
properly, and then it costs you time every week for as long as it exists.

**The parts that are cheap once the rest exists.** Auto-stamping the guide or review
version on every comment is one field written at post time — trivial. Making comments
readable to a model is just including them in the `.md` endpoint under a `## Comments`
heading — also trivial.

**The real question.** Moderation. These reviews criticise named researchers. Comments
under them will attract the researchers, their students, patients with strong views, and
people who want a fight. Someone has to read every comment before or shortly after it
goes up, and that someone has four hours a week. The EA Forum model you cite works
because the forum has full-time moderators.

**A middle path worth considering.** No comments on the site. Instead, a "Discuss" link per
review to a thread somewhere that already has moderation and identity — a GitHub
Discussion on this repo, or a Bluesky/Mastodon post — and pull the thread's URL back onto
the review page. You get discussion, provenance and version-stamping (the thread is
created with the version in its title) for zero build and zero moderation burden.

### Bulk import of two years of reviews

**Blocked on export, not build.** The reviews are in a claude.ai project, which nothing
can read from outside. Once they are files — copy-paste, or claude.ai's data export
unzipped — the path is: drop them in a Drive folder, and a session here reads each one,
runs it through the normaliser, and publishes. The normaliser refuses to invent a score,
so each imported paper review still needs you to set one; literature and preliminary
reviews need none. Budget an hour of your time per twenty reviews for scores.

### Citations on the About page for how well Claude reviews

**Needs the references.** The notes name "the Litvak error injection paper" and "that paper
on the distribution of scores given by various models". I won't cite papers I can't verify
exist — that's exactly the failure mode this site is about. Give me the DOIs or links and
this is a ten-minute edit to `content/about.md`.

### Full-text search

Search currently covers title, authors, journal, verdict, tags, strengths and weaknesses —
not the body — so "biobank" finds nothing even though a review discusses one. The body
would bloat the index page if shipped with it. The fix is a build-time
`/search-index.json` of body text that the search box fetches lazily on first keystroke.
An hour; no decision needed, just not done yet.

## Long term

### Auto-post to Twitter/X

Needs a developer account (paid tier for posting), a stored token, and a post-publish hook
— easiest as a GitHub Action on push to `content/reviews/`. The build is small; the cost
and the account approval are the friction. Bluesky is free and its API is simpler, if the
audience is there.

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

### Accounts, including verified researchers

Everything above that involves people gets better with this and most of it is gated on it.
Verification of researchers is the hard part — ORCID login is the honest route and it's
free. Not worth building until comments or ratings exist to need it.

### Flag a specific error in a review

A lighter cousin of comments: a per-review "report an error" form that opens a GitHub
issue with the review slug, the quoted passage and the reader's note. No accounts, no
moderation queue beyond the issue tracker you already have, and it feeds the corrections
promise on the About page directly. Could be done now in an afternoon; parking it only
because it overlaps with the comments decision.

### Sign up for updates

An email list. Buttondown or a similar service does this for free at small scale; embed
the form in the footer. Ten minutes once you've picked a provider.
