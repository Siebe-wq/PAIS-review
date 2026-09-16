---
name: review
description: Peer-review a scientific paper against the IACI review guide and write it into this site as a publishable review file. Use when the user supplies a paper (PDF, link, DOI or pasted text) and asks for a review, a critique, an appraisal, or a grade.
---

# Review a paper for this site

Produce one file at `content/reviews/<slug>.md` that is ready to publish. Read
`content/guide.md` in full first — it is the standard, and it is specific to
infection-associated chronic illnesses in ways generic appraisal checklists are not.

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

## Grading

Grade out of 10, in steps of 0.5. The grade is about how much the paper's evidence can carry
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
authors: "Surname AB, Surname CD, et al."
journal: "<journal>"
year: 2024
doi: "10.xxxx/xxxxx"
url: ""
conditions: ["ME/CFS"]        # or ["Long Covid"], both, or another topic tag
studyType: "RCT, n=240, 12 weeks"
score: 6.5
verdict: "<one sentence; the single most useful thing a reader can take away>"
confidence: "high"            # high | moderate | low
importance: "moderate"        # high | moderate | low
strengths:
  - "<short clause, not a sentence>"
weaknesses:
  - "<short clause, not a sentence>"
reviewedOn: <today, YYYY-MM-DD>
guideVersion: "<version from content/guide.md frontmatter>"
model: "Claude"
---
```

`verdict` appears on the index page under the title, so it must stand alone. "No control group,
no blinding and only subjective outcomes, so the reported improvement cannot be separated from
placebo" works. "This study has several limitations" does not.

`strengths` and `weaknesses` become chips on the index. Keep each under about 60 characters.
Two to four of each.

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
