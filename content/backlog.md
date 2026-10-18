---
title: Backlog
---

What is weak, missing or broken about the site, and ideas worth keeping. Add and tick items off
in /admin → Backlog. Longer write-ups live in `docs/roadmap.md`. Not shown on the public site.

## Weaknesses

- [ ] [high] Almost no automated tests. Only the grade parser has any (`npm test`); nothing else stops a change from quietly breaking publishing.
- [ ] [high] No check to see what the model accessed (did it see full text? graphs? supplementary data? Which other sources did the model view?)
- [ ] [medium] Saving the About, Methods, instructions or prompt page from a tab opened before another save overwrites that save. Only the guide, site text and backlog check for this.
- [ ] [medium] Human input is "Not recorded" on the reviews published before it existed. Set it in the Reviews tab.
- [ ] [medium] No sources/citation management
- [ ] [medium] The blind fact check only runs for reviews written with the `/review` skill in Claude Code. Reviews from the claude.ai project get none.
- [ ] [low] Search covers the title, verdict, strengths and weaknesses, not the text of the review.
- [ ] [low] Ratings are one per browser, so clearing cookies allows another vote.
- [ ] [low] Spam defences stop bots and repeats, not a determined person.
- [ ] [low] Nobody is told when someone replies to their comment.
- [ ] [low] Which model wrote a review rests on its frontmatter; nothing verifies it.
- [ ] [low] The abbreviation check is a rough heuristic: an unusual name can be flagged, and an abbreviation followed by a word like "study" can slip through.
- [x] Reviews write the grade before the analysis, so the analysis can become justification for an early number. Fixed by grade last, shown first, in methods 0.8. It was first ticked on 2026-10-14 when only the roadmap write-up existed. (done 2026-10-16)

## Missing features

- [ ] [high] Bulk import of the reviews in the claude.ai project. Needs a data export or a connected browser, then one session.
- [ ] [medium] Citations on the About page for how well models review. A session with web search can find and verify them.
- [ ] [medium] Bluesky posts when a review is published.
- [ ] [medium] Weekly email digest that readers sign up for, with filters (condition, tag, type of review, score band). Needs the site to send email.
- [ ] [medium] Request a review: paste a DOI or link; the site checks whether a review already exists and whether the full text is openly available, and asks for a PDF if not. Requests go in a public queue others can upvote; needs an account; the requester is emailed when the review is up. Reviews written by a scheduled Claude Code session, rate-limited, saved as drafts for the editor. See the roadmap.
- [ ] [medium] Accounts by email with one-time codes: required to comment, vote and request reviews. Needs a domain of our own and an email-sending service first.
- [ ] [medium] Tags on reviews (treatment trial, diagnostic test, genetics…), from one controlled list, with filters on the index and a page per tag.
- [ ] [medium] Preview links for site changes: move the live site to the main branch. First ask Claude to bring main up to date. Then in Vercel: Settings → Environments → Production → Branch Tracking → main; Settings → Environment Variables → GITHUB_BRANCH → main; then redeploy once.
- [ ] [low] A "report an error" link on each review.
- [ ] [low] Full-text search across review bodies.
- [ ] [low] Verified scientists: a badge for accounts that confirm a professional (university or research institute) email address, with ORCID and manual approval as other routes.
- [ ] [low] User karma: upvotes received on comments, shown next to the name. Agree/disagree votes do not count towards it.
- [ ] [low] A heart reaction on comments, alongside the upvote and the agree/disagree votes.
- [ ] [low] Post new reviews to X.
- [x] Grade last, shown first: the summary written after the analysis, ending in the grade, and shown at the top. (done 2026-10-16)

## Bugs

- [ ] [low] No favicon, so every browser gets a 404 when it asks for one.

## Ideas

- [ ] [medium] A weekly scheduled Claude session that checks the site (build, mobile layout, abbreviations, broken links, new comments reporting problems) and adds what it finds here.
- [ ] [low] Extract structured claims from each review, so the whole collection can be asked "what does the evidence say about X?".
- [ ] [low] Re-generate a review with its comment thread as extra input, and show what changed.
