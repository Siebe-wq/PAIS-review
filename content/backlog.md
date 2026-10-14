---
title: Backlog
---

What is weak, missing or broken about the site, and ideas worth keeping. Add and tick items off
in /admin → Backlog. Longer write-ups live in `docs/roadmap.md`. Not shown on the public site.

## Weaknesses

- [ ] No automated tests in the repository. Every check so far was run by hand in a session, so nothing stops a change from quietly breaking publishing.
- [ ] Saving the About, Methods, instructions or prompt page from a tab opened before another save overwrites that save. Only the guide, site text and backlog check for this.
- [x] Reviews write the grade before the analysis, so the analysis can become justification for an early number. Fix written up in the roadmap: grade last, shown first. (done 2026-10-14)
- [ ] Search covers the title, verdict, strengths and weaknesses, not the text of the review.
- [ ] Ratings are one per browser, so clearing cookies allows another vote.
- [ ] Spam defences stop bots and repeats, not a determined person.
- [ ] Nobody is told when someone replies to their comment.
- [ ] Which model wrote a review rests on its frontmatter; nothing verifies it.
- [ ] Human input is "Not recorded" on the reviews published before it existed. Set it in the Reviews tab.
- [ ] The abbreviation check is a rough heuristic: an unusual name can be flagged, and an abbreviation followed by a word like "study" can slip through.

## Missing features

- [x] Grade last, shown first: the summary written after the analysis, ending in the grade, and shown at the top. (done 2026-10-14)
- [ ] Bulk import of the reviews in the claude.ai project. Needs a data export or a connected browser, then one session.
- [ ] Citations on the About page for how well models review. A session with web search can find and verify them.
- [ ] Request a review, with a queue in admin.
- [ ] A "report an error" link on each review.
- [ ] Full-text search across review bodies.
- [ ] Email updates or Bluesky posts when a review is published.

## Bugs

- [ ] No favicon, so every browser gets a 404 when it asks for one.

## Ideas

- [ ] A weekly scheduled Claude session that checks the site (build, mobile layout, abbreviations, broken links, new comments reporting problems) and adds what it finds here.
- [ ] Extract structured claims from each review, so the whole collection can be asked "what does the evidence say about X?".
- [ ] Re-generate a review with its comment thread as extra input, and show what changed.
- [ ] ORCID sign-in for researchers, so votes and ratings can be weighted by expertise.
