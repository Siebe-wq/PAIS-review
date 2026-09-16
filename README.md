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

For reviews written in a claude.ai project, `docs/project-instructions.md` holds a block to
paste into that project's custom instructions, so its output already matches this format.

The "Edit a page" tab does the same thing for the About page and the guide: it loads the page's
current markdown, you edit it, and publishing commits it. Plain markdown, no rich-text editor.

## Review file format

```yaml
---
title: "Paper title"
authors: "Surname AB, Surname CD, et al."
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

## Updating the guide

Edit the guide from the "Edit a page" tab in `/admin`, or edit `content/guide.md` directly, and
bump `version` in its frontmatter. Saving from `/admin` is refused if the version is unchanged,
because forgetting is the normal failure mode and it makes older reviews look current.

Bump the minor version (0.2 → 0.3) for clarifications and additions that would not move a
grade. Bump the major version (0.x → 1.0) for a new required criterion or a changed scoring
rule — anything that could change a verdict on a paper already reviewed.

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
| `NORMALISER_MODEL` | Which model the tidy-up button uses. Defaults to `claude-sonnet-5`. `claude-haiku-4-5` halves the cost per review; see the note in `src/lib/normalise.ts` before switching. |

Until `ADMIN_PASSWORD`, `GITHUB_TOKEN` and `GITHUB_REPO` are all set, `/admin` loads but
publishing returns a clear "not configured" error rather than failing quietly.

## Editorial notes

Reviews name real researchers. The About page states plainly that these are one careful reading
rather than a journal decision, and that corrections and withdrawals are available on request.
Keep that promise — it is what makes publishing critical reviews of named people defensible.

Papers themselves are never stored in this repository. Only the reviews.
