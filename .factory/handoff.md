# Review 1 handoff — FAIL

## What was done

- Completed an adversarial cold read at 390 × 844 and 1440 × 900 against the live deployment.
- Audited every landing-page and README sentence, heading, and relevant control in `.factory/review-1.md`.
- Entered the one-click demo, then tested reset, exit, storage isolation, same-origin behavior, and offline reload.
- Ran every command in `.factory/claims.json` separately from a fresh clone.
- Checked prior handoff and verification statements against the live site and source.
- Crawled routes, links, and metadata assets; checked titles, descriptions, canonicals, headings, landmarks, history, focus, 404 behavior, touch targets, console output, and visual identity.
- Ran the full Playwright suite, production build, live URL verifier, and live axe scans.
- Did not modify product code.

## Verdict

**FAIL.** Full findings and fixes are in `.factory/review-1.md`.

The primary blocker is a demo isolation breach: with a real file already saved, choosing **Forget this file** in `/demo` deletes the real IndexedDB record. The demo banner also scrolls out of view, Reset leaves the selected calendar destination changed, and unknown routes return HTTP 200.

## How to verify

```sh
npm ci
npm test
npm run build
```

Observed on 2026-08-28:

- Each of the seven declared claim commands: PASS, 2 tests per command.
- Full suite: 18 passed.
- Build: passed; `dist/` produced.
- Live verifier: passed its structural checks with no console errors.
- Live axe: zero violations on five routes.
- Live offline `/demo` reload: passed.
- Live unknown URL: incorrectly returned 200.
- Live seeded-real-data demo isolation: failed; the demo clear action erased the saved real record.

## Work left

Resolve F-1-1 through F-1-29, then perform another full adversarial review. Do not accept a fresh-context-only demo isolation test; it must seed real data before entering demo and exercise every demo control.
