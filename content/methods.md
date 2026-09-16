---
title: Methods
---

Every review on this site is produced the same way, and the whole method is public: the
guide it is graded against, the instructions the model follows, and the prompt that starts
it. All three share one version number, currently **{{GUIDE_VERSION}}**, and every review
records which version it was written under. When any of the three changes, the number goes
up and the change is logged at the bottom of the guide.

## What the reviewer is given

The model is asked to work from the **whole paper** — full text, figures and tables, and the
supplementary files where the claims rest on them — and to say at the top of the review if it
could not see any of that. A review written from an abstract alone is marked low confidence.

It is not confined to the paper. Where they bear on how to read the work, it is also given
**context**: prior publications from the same group, declared and undeclared conflicts of
interest, funding, company announcements and market reactions, and published commentary or
letters about the paper. Commentary is evaluated in its own context rather than repeated —
who wrote it, what they could see, what they might want. Facts from outside the paper are
listed separately on each review, with sources, so a reader can weigh them apart from the
methodological assessment.

The model that wrote each review is named on that review's page.

## What it is told to watch for

The project prompt, quoted in full below, says this in the editor's own words: be careful with
received wisdom about these conditions, which often rests on weak evidence; do not parrot
online comments on research; and have the whole paper. It also asks for calibration — when
something is good, it is good.

## Where to read the method in full

- The [review guide](/guide) — the domain-specific standard. Also served raw at
  [/guide.md]({{SITE_URL}}/guide.md).
- The [reviewing instructions]({{SITE_URL}}/instructions.md) — the output contract: format,
  grading rules, what goes where.
- The project prompt, below, verbatim.

## The project prompt

This is the exact text in the Claude project that produces the reviews. It points at the
instructions above, so updating them updates every future review without the prompt
changing.
