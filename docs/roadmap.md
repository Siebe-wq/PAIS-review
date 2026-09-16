# Roadmap

Ideas from the project notes that need either a decision, an account, or a bigger build
than is sensible to do unasked. Each one says what it would take and what the sticking
point is. Things already built are in the README, not here.

## Near term

### Comments and ratings — built

Both exist now. What they still lack, and what it would take:

- **Weighting by expertise, down-weighting people who rate everything five.** Needs users.
  ORCID login is the honest route for "verified researcher" and is free; a magic-link email
  account is enough for everyone else. Not worth building until there are enough votes for
  the weighting to matter.
- **A real spam filter.** The current defences (honeypot, rate limits, link cap, duplicate
  rejection) stop bots and repeats, not a person. Akismet is cheap if it becomes a problem.
- **Notifications.** Nobody is told when someone replies to them. Needs an email on the
  comment, which is a small privacy decision.

### Request a review

**What it takes.** A form (DOI or link, optional note), a table, and a "Requests" section in
`/admin` with approve / decline. If friends should skip the queue, an invite link that sets a
cookie marking their requests pre-approved. The database now exists, so this is half a day.

**Decisions.** Do requesters upload a PDF? If yes, files must be private and deleted after
review. Do you show a public "requested, not yet reviewed" list? That sets expectations you
may not want to be held to at four hours a week.

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
