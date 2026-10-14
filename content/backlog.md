---
title: Backlog
---

What is weak, missing or broken about the site, and ideas worth keeping. Add and tick items off
in /admin → Backlog. Longer write-ups live in `docs/roadmap.md`. Not shown on the public site.

## Weaknesses

- [ ] [high] No automated tests in the repository. Every check so far was run by hand in a session, so nothing stops a change from quietly breaking publishing.
- [ ] [high] No check to see what the model accessed (did it see full text? graphs? supplementary data? Which other sources did the model view?)
- [ ] [medium] Saving the About, Methods, instructions or prompt page from a tab opened before another save overwrites that save. Only the guide, site text and backlog check for this.
- [ ] [medium] Human input is "Not recorded" on the reviews published before it existed. Set it in the Reviews tab.
- [ ] [medium] No sources/citation management
- [ ] [low] Search covers the title, verdict, strengths and weaknesses, not the text of the review.
- [ ] [low] Ratings are one per browser, so clearing cookies allows another vote.
- [ ] [low] Spam defences stop bots and repeats, not a determined person.
- [ ] [low] Nobody is told when someone replies to their comment.
- [ ] [low] Which model wrote a review rests on its frontmatter; nothing verifies it.
- [ ] [low] The abbreviation check is a rough heuristic: an unusual name can be flagged, and an abbreviation followed by a word like "study" can slip through.
- [x] Reviews write the grade before the analysis, so the analysis can become justification for an early number. Fix written up in the roadmap: grade last, shown first. (done 2026-10-14)

## Missing features

- [ ] [high] Bulk import of the reviews in the claude.ai project. Needs a data export or a connected browser, then one session.
- [ ] [medium] Citations on the About page for how well models review. A session with web search can find and verify them.
- [ ] [medium] Email updates or Bluesky posts when a review is published.
- [ ] [low] Request a review, with a queue in admin.
- [ ] [low] A "report an error" link on each review.
- [ ] [low] Full-text search across review bodies.
- [x] Grade last, shown first: the summary written after the analysis, ending in the grade, and shown at the top. (done 2026-10-14)

## Bugs

- [ ] [low] No favicon, so every browser gets a 404 when it asks for one.

## Ideas

- [ ] [medium] A weekly scheduled Claude session that checks the site (build, mobile layout, abbreviations, broken links, new comments reporting problems) and adds what it finds here.
- [ ] [low] Extract structured claims from each review, so the whole collection can be asked "what does the evidence say about X?".
- [ ] [low] Re-generate a review with its comment thread as extra input, and show what changed.
- [ ] [low] ORCID sign-in for researchers, so votes and ratings can be weighted by expertise.
