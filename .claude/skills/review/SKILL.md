---
name: review
description: Peer-review a scientific paper against the PAIS review guide and write it into this site as a publishable review file. Use when the user supplies a paper (PDF, link, DOI or pasted text) and asks for a review, a critique, an appraisal, or a grade.
---

# Review a paper for this site

Produce one file at `content/reviews/<slug>.md` that is ready to publish. Read
`content/guide.md` in full first — it is the standard, and it is specific to
post-acute infection syndromes in ways generic appraisal checklists are not.

## Standing instruction

Evaluate objectively and rigorously. Be alert to bias, p-hacking, spin and hype. But be well
calibrated: do not manufacture criticism to look rigorous, and say plainly when a paper is good.
A short review of a sound paper is a correct outcome.

## Before writing

1. Read `content/guide.md`.
2. Read the paper properly. If you only have the abstract, say so at the top of the review and
   set `confidence: low` — an abstract cannot be reviewed as if it were a paper.
3. Check whether a review of this paper already exists in `content/reviews/`.
4. Where it matters, verify claims against primary sources: trial registry entries for
   pre-registration and outcome switching, the supplement for methods the main text skips,
   cited papers where a claim leans on them. Note what you could not check.

## Kind

- `paper` — one study. Takes `score`.
- `literature` — a body of work, several papers, a field. Takes **no score and no signal**; the
  verdict sentence carries it. "How good is this body of evidence" is not the question the 0–10
  scale was built to answer, and forcing a number on it invents precision.
- `preliminary` — unpublished data, a conference abstract, an early preprint, a company
  announcement. Takes `signal`: one of `promising`, `mixed`, `unconvincing`, `too-early`.

Supplying the wrong verdict field for the kind is rejected at publish time.

## Context beyond the paper

`context` records facts outside the paper that bear on how to read it: a funder's or author's
history, a market reaction after publication, an undisclosed tie, a regulatory action, a pattern
of self-citation. These are published as statements of fact about named people and
organisations, so:

- Include only what a citable public source supports, and put the URL in `source`.
- State it neutrally and specifically. "The sponsor's CEO was convicted of securities fraud in
  2019" — not "the company has a questionable history".
- Never speculate about motive. A fact about a funder is not a claim that the science is
  fraudulent.
- If you cannot check it, leave it out.

## Notes for the guide

If the paper surfaced a methodological point the guide does not cover, or gets wrong, record it
in `guideNotes` as a short clause. Do not apply it as if it were already in the guide and do not
edit the guide. The editor collects these for the next version.

## What to be careful of

Be very careful with received wisdom/common knowledge like "ME/CFS involves x", because in
many cases it rests on (very) weak evidence.

Be careful with parroting online comments on research — evaluate the comment in its context
rather than just parroting.

Make sure you have access to the whole paper, and ideally also graphs. Plus supplementary files
when needed.

## Grading

For `kind: paper`, grade out of 10, in steps of 0.5. The grade is about how much the paper's evidence can carry
its own claims, not about how interesting the topic is or how much you like the conclusion.

- **8–10** — Strong. Design and measures support the claims. Limitations are stated and minor.
- **6.5–7.9** — Solid. Claims hold with specific caveats.
- **5–6.4** — Borderline. Real contribution, real limits; the main claim is weaker than stated.
- **3–4.9** — Does not pass. The design cannot separate the claimed effect from bias, placebo,
  regression to the mean or natural history.
- **0–2.9** — Fatally flawed. The data contradict the claim, or the method cannot produce the
  stated result at all.

Two rules:

- **Worst domain sets the ceiling.** Do not average sub-scores. A missing control group is fatal
  no matter how good the sample size and follow-up are. The guide is built around fatal flaws.
- **Separate trustworthiness from importance.** A small careful study is not a bad study. Put
  "how much would this matter if true" in `importance`, never in the score.

In the final section, state explicitly what prevents a higher score and what prevents a lower
one. That is what makes the grade auditable.

Set `confidence` honestly. If the paper does not describe how PEM was assessed, or the
supplement is unavailable, or the statistics cannot be checked from what is reported, say
`low` or `moderate` and name the reason in the review body.

## Output

Write the file with this frontmatter. Omit fields you genuinely do not have rather than
guessing — never invent a DOI, a journal or an author list.

```yaml
---
title: "<paper title, plain, no trailing full stop>"
authors: "Surname AB, Surname CD, Surname EF"   # full list; the site abbreviates
journal: "<journal>"
year: 2024
doi: "10.xxxx/xxxxx"
url: ""
conditions: ["ME/CFS"]        # or ["Long Covid"], both, or another topic tag
studyType: "RCT, n=240, 12 weeks"
kind: paper                   # paper | literature | preliminary
score: 6.5                    # papers only
verdict: "<one sentence; the single most useful thing a reader can take away>"
confidence: "high"            # high | moderate | low
importance: "moderate"        # high | moderate | low
strengths:
  - "<short clause, not a sentence>"
weaknesses:
  - "<short clause, not a sentence>"
context:                      # optional, see below
  - note: "<a fact outside the paper that bears on reading it>"
    source: "<url>"
guideNotes:                   # optional, see below
  - "<a point the guide does not cover>"
reviewedOn: <today, YYYY-MM-DD>
guideVersion: "<version from content/guide.md frontmatter>"
model: "claude-opus-5"   # the model actually writing this, not a generic "Claude"
---
```

`verdict` appears on the index page under the title, so it must stand alone. "No control group,
no blinding and only subjective outcomes, so the reported improvement cannot be separated from
placebo" works. "This study has several limitations" does not.

`strengths` and `weaknesses` become chips on the index. Keep each under about 60 characters.
Two to four of each.

`model` records which model wrote the review — the exact model ID, not "Claude". It shows on
the review page. Reviews will eventually be written by more than one model, and two reviews
disagreeing is only interpretable if a reader can see what wrote each one. If you genuinely
cannot tell which model you are, leave the field out rather than guessing.

The body starts at `##`, because the page supplies the H1. Cover the guide's domains that apply
to this paper, in roughly this order, skipping any that do not apply:

- Executive summary
- Study design
- Sample selection — case definition, PEM ascertainment, controls, severity, comorbidity status
- Outcome measures — and specifically where each sits on the objective/performance-bias scale
- Bias — including author preconceptions and funding, which standard risk-of-bias tools miss
- Statistical and methodological issues
- Biological plausibility
- Interpretation and spin — claims versus what the data show
- What the study actually demonstrates, and what it does not
- Critical missing elements
- Recommendations, split by audience where useful
- Final assessment, with the grade and the reasoning both ways

Quote the paper's own claims when assessing spin, so a reader can check the comparison.

Write in plain English and short sentences. Say what is wrong without sneering. The reviews name
real researchers, so criticise the evidence and the framing, never the people.

## Filename

`content/reviews/<year>-<first-author-or-topic>-<short-descriptor>.md`, lowercase and
hyphenated. For example `2024-lidocaine-hpbcd-post-covid.md`.

## After writing

1. Run `npm run build` to confirm the frontmatter parses and the site still builds.
2. Show the user the verdict, score, strengths and weaknesses before committing.
3. Commit and push only when they say so.
