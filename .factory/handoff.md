# Review 3 handoff — FAIL

## Delivered

- Wrote `.factory/review-3.md` with the complete cold-read, copy, demo, claim, privacy/offline, history, structure, accessibility, and missed-leverage review.
- Reproduced a blocking live demo isolation regression: the wordmark or browser Back can remove the demo banner while retaining sample state; **Forget this file** can then delete a hidden saved real record.
- Rechecked every prior F-1 and F-2 finding against the live site and current source.
- Did not modify product code.

## Verification

- Clean clone: `/tmp/ics-review3-clean-Rsw4Ao` at `060b7d39dc4904bedf68291fa11697355b8db145`.
- Every command in `.factory/claims.json` passed separately in desktop Chromium and the 390 px project.
- Full `npm test`: 24/24 passed.
- `npm run build`: passed; `dist/index.html` emitted; JS 11.18 KB gzip, CSS 4.46 KB gzip.
- Live cold checks: 390×844 and 1440×900, no console/page errors or overflow.
- Live service-worker/offline reload: passed in `/demo`; no foreign requests observed.
- Live route crawl: four valid routes returned 200; unknown route returned 404; collected destinations responded as expected.
- Live Axe: zero serious/critical violations on the checked root/demo contexts.
- `/opt/fleet/lib/verify-url.sh`: passed structural/console checks; evidence directory `/tmp/ics-review3-verify-5dDaDk`.

## Remaining work

The product verdict is FAIL. Fix every finding in `.factory/review-3.md`, especially reissued F-1-1/F-1-5, then add route-exit and focus regression coverage before another review.
