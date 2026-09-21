# PAIS Review

A small site that publishes reviews of research on post-acute infection syndromes
(PAIS) — ME/CFS, Long Covid and related conditions. Each review is written by Claude against
[the review guide](content/guide.md), graded out of 10, and published here with its main
strengths and weaknesses on the front page.

Reviews are plain markdown files in `content/reviews/`. There is no database. Git is the
record: every review's edit history is public, which is the point.

## Publishing a review

Two routes, both of which end up as a commit to `content/reviews/`.

**From Claude Code.** Give Claude the paper and run `/review`. It reads the guide, writes the
file, and builds the site to check the frontmatter parses. Review what it wrote, then commit
and push. Vercel redeploys.

**From the browser.** Go to `/admin` and sign in — the session lasts 30 days on that device, so
publishing several reviews does not mean retyping the password. Paste the whole review file
into the box — frontmatter and all, exactly as Claude wrote it. Everything is read from that
frontmatter, so there are no fields to fill in by hand. A preview appears underneath showing the
review exactly as it will look on the index; if the frontmatter is missing something, you get a
named error instead. Publishing commits the file through the GitHub API, which triggers the same
redeploy.

The filename is derived from the title. Override it only if you want something shorter.

**Tidy up with Claude** converts review text that is not already in this format — an older
review, a chat transcript, anything — into a publishable file. It restructures only: it never
invents a grade, never softens a judgement, and never appends a section summarising what
changed. If the source states no overall grade, it leaves the score unset for you to fill in
rather than guessing one. Needs `ANTHROPIC_API_KEY`; see the deployment table below.

For reviews written in a claude.ai project, point that project at
`https://pais-review.vercel.app/instructions.md` — see "One source of truth" below.

The "Edit a page" tab does the same for the About and Methods pages, the guide, the
instructions and the prompt: it loads the current markdown, you edit it, publishing commits it.

The "Reviews" tab lists every review, drafts included, with a Withdraw / Restore button, and
collects the `guideNotes` that reviews have flagged for the next guide version. Withdrawing sets
`draft: true` — the review and its raw URL vanish from the site at once and it can be put back;
the commit history keeps the text. A takedown that needs the text gone from the repository is a
deliberate git step, not a button.

## Review file format

```yaml
---
title: "Paper title"
authors: "Surname AB, Surname CD, Surname EF"  # full list; the site shows 3 + "et al." with an expander
journal: "Journal name"
year: 2024
doi: "10.xxxx/xxxxx"        # optional
url: ""                     # optional; used in preference to the DOI
conditions: ["ME/CFS"]      # becomes the index filters
studyType: "RCT, n=240"
kind: paper                 # paper | literature | preliminary
score: 6.5                  # papers only, 0–10 in steps of 0.5
verdict: "One sentence. Shows on the index under the title."
confidence: "high"          # optional: high | moderate | low
importance: "moderate"      # optional: high | moderate | low
strengths: ["Short clause"] # become chips on the index
weaknesses: ["Short clause"]
context:                    # optional; see below
  - note: "A fact outside the paper that bears on reading it."
    source: "https://..."
guideNotes:                 # optional: points the guide doesn't cover, for the editor
  - "Nothing in the guide on cluster-randomised designs"
reviewedOn: 2026-09-16
guideVersion: "0.2"
model: "claude-opus-5"      # the exact model, not a generic "Claude"
draft: false                # true keeps it off the site
---
```

`title`, `kind`, `verdict` and `reviewedOn` are always required. The build fails with a named
error if one is missing or malformed, so a broken review cannot reach the site silently.

The body starts at `##`. The page supplies the H1.

### kind, and what verdict each takes

| kind | verdict field | why |
|---|---|---|
| `paper` (default) | `score`, 0–10 | A single study can be graded on whether its evidence carries its claims. |
| `literature` | neither | "How good is this body of evidence" is not the question the 0–10 scale answers. The verdict sentence carries it. |
| `preliminary` | `signal` | Unpublished data, abstracts, preprints. One of `promising`, `mixed`, `unconvincing`, `too-early` — a decimal grade here would be false precision. |

Supplying the wrong one is rejected with an explanation, rather than silently accepted.

Score bands for papers, used for the colour and the label under the number: 8+ Strong,
6.5–7.9 Solid, 5–6.4 Borderline, 3–4.9 Fails, below 3 Fatal flaws.

### context

Facts outside the paper that bear on how to read it — a funder's history, a market reaction, an
undisclosed tie. These publish as statements of fact about named people and organisations, so
each note should carry a `source` URL; the site marks unsourced notes as unsourced and `/admin`
warns before publishing one. They render in their own panel, labelled as circumstance rather
than as part of the methodological assessment.

## The method, and its one version number

Three documents are "the method": the guide (`content/guide.md`), the reviewing instructions
(`content/instructions.md`) and the project prompt (`content/prompt.md`). They share one
version number, kept in the guide's frontmatter, and every review records which version it was
written under. Saving any of the three from `/admin` requires a new version; for the
instructions and the prompt the editor writes it into the guide for you. Log what changed in
the guide's changelog.

`/methods` explains the whole thing publicly, shows the prompt verbatim, and links the raw
files. Raw markdown URLs, for pointing a model at:

| URL | What it is |
|---|---|
| `/guide.md` | The guide. |
| `/instructions.md` | The reviewing instructions, version and site URL filled in. |
| `/prompt.md` | The project prompt, verbatim. |
| `/reviews/<slug>.md` | Any published review, frontmatter and all. |

So a claude.ai project needs only the prompt, which tells it to fetch `/instructions.md`.
Update the guide here and the project follows, with nothing to re-upload anywhere.

Never hard-code a version number in the instructions, prompt or methods pages. Write
`{{GUIDE_VERSION}}` and `{{SITE_URL}}`; both are filled in when served.

## Updating the guide

Edit it from the "Edit a page" tab in `/admin`, or edit `content/guide.md` directly, and bump
`version` in its frontmatter. Saving from `/admin` is refused if the version is unchanged,
because forgetting is the normal failure mode and it makes older reviews look current.

Wording and small clarifications are a patch bump (0.3 → 0.3.1), which the editor suggests by
default. A change that could move a grade — a new criterion, a changed rule — bumps the middle
number (0.3 → 0.4). The first number is for a rewrite.

A review that does not state its own `guideVersion` is stamped with whatever the guide is at
publish time. A review that does state one keeps it, so importing older work does not
retroactively claim it met the current standard.

## Running it locally

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # also validates every review's frontmatter
```

## Deploying

Import the repo at [vercel.com/new](https://vercel.com/new). It is a standard Next.js app and
needs no configuration to deploy.

Environment variables, all optional — the site works without any of them, and you only need the
first four if you want the `/admin` publishing page:

| Variable | What it is |
|---|---|
| `ADMIN_PASSWORD` | Guards `/admin`. Make it long. It is the only thing between the internet and your repository. |
| `GITHUB_TOKEN` | Fine-grained personal access token, scoped to this repository only, with Contents: Read and write. |
| `GITHUB_REPO` | `Siebe-wq/PAIS-review` |
| `GITHUB_BRANCH` | Defaults to `main`. |
| `NEXT_PUBLIC_SITE_URL` | Only needed if the site moves off `pais-review.vercel.app`. Used for the sitemap and link previews. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the About page as the corrections address. Left unset, no address is shown. |
| `ANTHROPIC_API_KEY` | Only for the "Tidy up with Claude" button in `/admin`. Without it, that button reports it is not configured and everything else works as normal. |
| `DATABASE_URL` (or any name) | Postgres, for comments and ratings. In Vercel: Storage → Create Database → Postgres (Neon), connect it to the project, and the URL is set for you under whatever prefix you chose (`DATABASE_URL`, `STORAGE_URL`, ...). The code takes any variable whose value is a Postgres URL, so the name does not matter. Tables are created on first use. Without one, the comment and rating sections do not appear. **Redeploy after connecting the database** — environment variables only reach new builds. `/api/db-status` lists the variable names it found and says whether the database answers. |
| `NORMALISER_MODEL` | Which model the tidy-up button uses. Defaults to `claude-sonnet-5`. `claude-haiku-4-5` halves the cost per review; see the note in `src/lib/normalise.ts` before switching. |

Until `ADMIN_PASSWORD`, `GITHUB_TOKEN` and `GITHUB_REPO` are all set, `/admin` loads but
publishing returns a clear "not configured" error rather than failing quietly.

## Other things the site does

- Dark by default, with a toggle in the header that is remembered per device.
- A pilot banner on every page, set in `src/lib/site.ts` (`pilotNotice`; empty string removes it).
- Search on the index over title, authors, journal, verdict, tags, strengths and weaknesses. Not
  the body — see `docs/roadmap.md`.
- Each row on the index carries its comment count, the time of the latest comment, and the mean
  reader rating as part-filled stars to one decimal. Sorts: Active, newest, oldest, highest or
  lowest score, most comments, recently discussed, highest reader rating. Without a database the
  engagement sorts and the totals are simply absent.
- **Active**, the default sort, blends three things (`src/lib/ranking.ts`): a live discussion
  (comment count, damped by a logarithm, fading with a three-day half-life since the last
  comment), reader interest (how many ratings, undecayed), and freshness (one-week half-life
  since publication, so a new review is not published straight to the bottom of the page).
  Weights 3, 1 and 2. Ties break on publication date. "Highest reader rating" pulls averages
  toward 3.5 until a review has a few ratings, so a single five-star does not top the list; the
  number shown on the card is still the plain mean.
- A contents list on long reviews: collapsed bar on phones, sticky sidebar on wide screens.
- "Discuss this review with an AI" under each review: opens Claude or ChatGPT with a prompt
  pointing at the raw markdown and asking it to argue with the review rather than summarise it.
- Comments under every review and under the guide: threaded, with a self-chosen username and
  no account. Two vote axes — karma (is this a good comment) and agree/disagree — open to
  anyone, one vote per browser. A new comment starts at one karma, its author's own upvote,
  which they can take back like any other vote. Each comment records the method version it
  was written against. Any comment can be collapsed, which folds its replies with it.
  Spam defences: honeypot field, per-browser and per-network rate limits, a link cap,
  duplicate rejection. When signed in, `/admin` sessions get two buttons on each comment:
  Hide keeps the row, so replies to it are not orphaned, and shows "hidden by the editor" in
  its place; Remove deletes it and everything under it after a confirmation that names how
  many comments will go.
- Star ratings, 1–5, one per browser, under each review.
- The `.md` endpoint for a review appends its comment thread, so a model reading the review
  sees the discussion too.

Things not built yet, and what each would take, are in `docs/roadmap.md`.

## Editorial notes

Reviews name real researchers. The About page states plainly that these are one careful reading
rather than a journal decision, and that disagreement goes to the comments first, in the open.
Reviews do get corrected; the edit history is public.

Papers themselves are never stored in this repository. Only the reviews.
