# IACI Peer Review

A small site that publishes reviews of research on infection-associated chronic illnesses
(ME/CFS, Long Covid and related conditions). Each review is written by Claude against
[the review guide](content/guide.md), graded out of 10, and published here with its main
strengths and weaknesses on the front page.

Reviews are plain markdown files in `content/reviews/`. There is no database. Git is the
record: every review's edit history is public, which is the point.

## Publishing a review

Two routes, both of which end up as a commit to `content/reviews/`.

**From Claude Code.** Give Claude the paper and run `/review`. It reads the guide, writes the
file, and builds the site to check the frontmatter parses. Review what it wrote, then commit
and push. Vercel redeploys.

**From the browser.** Go to `/admin`, enter the admin password, paste the review, and publish.
That commits the file through the GitHub API, which triggers the same redeploy. If you paste a
whole review file including its frontmatter, the frontmatter wins and you can leave the form
fields empty.

## Review file format

```yaml
---
title: "Paper title"
authors: "Surname AB, Surname CD, et al."
journal: "Journal name"
year: 2024
doi: "10.xxxx/xxxxx"        # optional
url: ""                      # optional; used in preference to the DOI
conditions: ["ME/CFS"]       # becomes the index filters
studyType: "RCT, n=240"
score: 6.5                   # 0–10, in steps of 0.5
verdict: "One sentence. Shows on the index under the title."
confidence: "high"           # optional: high | moderate | low
importance: "moderate"       # optional: high | moderate | low
strengths: ["Short clause"]  # become chips on the index
weaknesses: ["Short clause"]
reviewedOn: 2026-09-16
guideVersion: "0.2"
model: "Claude"
draft: false                 # true keeps it off the site
---
```

`title`, `score`, `verdict` and `reviewedOn` are required. The build fails with a named error
if one is missing or malformed, so a broken review cannot reach the site silently.

The body starts at `##`. The page supplies the H1.

Score bands, used for the colour and the label under the number: 8+ Strong, 6.5–7.9 Solid,
5–6.4 Borderline, 3–4.9 Fails, below 3 Fatal flaws.

## Updating the guide

Edit `content/guide.md` and bump `version` in its frontmatter. Reviews record the version they
were written under, so old reviews keep pointing at the standard that actually produced them.

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
| `NEXT_PUBLIC_SITE_URL` | Your domain. Used for the sitemap and social previews. |
| `NEXT_PUBLIC_CONTACT_EMAIL` | Shown on the About page as the corrections address. Left unset, no address is shown. |

Until `ADMIN_PASSWORD`, `GITHUB_TOKEN` and `GITHUB_REPO` are all set, `/admin` loads but
publishing returns a clear "not configured" error rather than failing quietly.

## Editorial notes

Reviews name real researchers. The About page states plainly that these are one careful reading
rather than a journal decision, and that corrections and withdrawals are available on request.
Keep that promise — it is what makes publishing critical reviews of named people defensible.

Papers themselves are never stored in this repository. Only the reviews.
