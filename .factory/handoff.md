# ICS Intake Checker — polish 6 handoff

## Completed

- Closed F-6-1 by removing the untestable artwork-provenance sentence from every visitor footer. Asset provenance remains documented in `.factory/design.md` and README.
- Closed F-6-2 with the direct “Page not found” H1 in both the SPA fallback and the real status-404 document.
- Closed F-6-3 with the landing heading “Import the checked copy yourself.”
- Rechecked every finding from reviews 1–5. Demo isolation, direct `?demo=1`, reset, claims, real route status, metadata, focus, legal links, mobile targets, privacy, and offline use did not regress.
- Added a desktop/mobile browser regression for all three round-6 copy fixes and bumped the PWA cache/build marker to v1.4.
- Updated `.factory/catalog-description.txt` to a 92-character, verb-first sentence and refreshed `.factory/copy-audit.md`.
- Audited `.factory/claims.json` and `.factory/demo.md`; all 12 claims remain accurate, and the documented direct demo/reset/storage behavior matches production.

## Source and deployment

- Repair commit: `783235bfe1a29ea2fc471f75ca605be2ae049fef`.
- Pushed branch: `origin/main`.
- Static Web Apps deployment: `6a542f3f-a291-4ad9-bcd7-236040494c48`.
- Production URL: https://ics-intake-checker.sociobot.in.
- Deployed JS, CSS, service worker, and 404 SHA-256 hashes match the local `dist/` files.

## Verification

- Clean clone: `/tmp/ics-polish6-clean-cE9MrP/repo` at the repair commit.
- `npm ci`: passed; zero vulnerabilities.
- Each of the 12 commands in `.factory/claims.json`: passed separately in desktop and 390 × 844 Chromium.
- `npm test`: 34/34 passed locally, in the clean clone, during the work-order build, and against production.
- `npm run build`: passed; `dist/index.html` exists.
- Bundle: JavaScript 31.58 KB raw / 11.15 KB gzip; CSS 15.51 KB raw / 4.43 KB gzip.
- Accessibility: all-route Playwright Axe scans found zero serious or critical violations; keyboard, focus, 44 px target, reduced-motion, and mobile-overflow checks passed.
- Privacy: runtime request capture stayed same-origin; the embedded sample link remained text; demo actions preserved the seeded real IndexedDB record.
- Offline: the populated demo reloaded after the browser context went offline.
- Routing: `/`, `/demo`, `/privacy`, and `/terms` returned 200; the tested unknown URL returned 404 with metadata, shell, legal links, and recovery.
- Cold verifier: 853 ms load, no console errors, correct title/lang/H1/main/alt/button results in `.factory/evidence/polish-6-live/verify.json`.
- Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1.1 s, CLS 0, TBT 0 ms.

## Evidence

- Cumulative finding map: `.factory/polish-6.md`.
- Local: `.factory/evidence/polish-6-local/`.
- Live: `.factory/evidence/polish-6-live/`.
- Key live captures: `screenshot-mobile.png`, `demo-mobile.png`, and `not-found.png`.

## Run locally

```sh
npm ci
npm test
npm run build
```

## Known gaps

None.
