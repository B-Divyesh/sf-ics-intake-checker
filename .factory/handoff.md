# ICS Intake Checker — polish 5 handoff

## Completed

- Closed F-5-1 with a declared `intake-size-limit` claim and one tagged browser test.
- Proved exactly 5,000,000 bytes is accepted and checked, while 5,000,001 bytes is rejected without storage writes, for both file and paste intake.
- Removed the unreachable parser-level over-limit warning and kept one authoritative UI byte limit.
- Rechecked every finding from reviews 1–5. Demo isolation, direct `?demo=1`, first-screen copy, metadata, focus, status 404, legal links, mobile layout, and all prior claim coverage remain fixed.
- Updated the PWA cache/build marker to v1.3, the catalog description, copy audit, cumulative polish record, and claim inventory.
- Added `PLAYWRIGHT_BASE_URL` support so the same browser suite can verify a deployed origin without starting a local server.

## Source and deployment

- Repair commit: `2fa6f6ad737ba751224aa709d4b08585962bd69e`.
- Pushed branch: `origin/main`.
- Production URL: https://ics-intake-checker.sociobot.in.
- Static Web Apps deployment: `be55b098-6c91-4cc1-858f-79e214de918f`.
- Deployed artifact: the clean-clone `dist/` built from repair commit `2fa6f6a`.

## Clean-clone verification

Fresh clone: `/tmp/ics-polish5-clean-NdNad6` at `2fa6f6a`.

- `npm ci`: passed with zero vulnerabilities.
- Every command in `.factory/claims.json` ran separately and passed in desktop and 390 × 844 Chromium.
- Passed claim IDs: `sample-preflight`, `event-preview`, `demo-isolation`, `local-only`, `repair-export`, `risk-detection`, `calendar-export`, `paste-intake`, `intake-size-limit`, `local-restore`, `offline-reload`, and `no-third-party-runtime`.
- `npm test`: 32/32 passed.
- `npm run build`: passed; `dist/index.html` exists.
- Build size: JavaScript 31.66 KB raw / 11.19 KB gzip; CSS 15.58 KB raw / 4.46 KB gzip.

## Accessibility, privacy, offline, and performance

- Axe integration found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and the status-404 route in desktop and mobile checks.
- Keyboard checks passed for the skip link, route focus, Back/Forward, demo reset/reload, paste close, and Forget.
- Mobile checks passed at 390 × 844 with no horizontal overflow and 44 px minimum targets.
- `@claim:no-third-party-runtime` observed same-origin requests only across all routes and the complete demo flow.
- `@claim:demo-isolation` byte-compared the saved record after Reset, Reload, Return, wordmark, Back, Privacy, and Terms paths.
- `@claim:offline-reload` reloaded the populated demo after network access was disabled.
- Lighthouse 12.8.2 on the identical production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 394 ms, CLS 0. Evidence: `.factory/evidence/polish-5-local/lighthouse.json`.

## Post-deploy cold verification

- `/opt/fleet/lib/verify-url.sh` reported a 961 ms root load, correct title, `lang=en`, one H1, main landmark, complete alt text, named buttons, and no console errors. Evidence: `.factory/evidence/polish-5-live/verify.json`.
- `/`, `/demo`, `/privacy`, and `/terms` returned 200. `/definitely-missing-polish-5` returned 404 with the shared shell, metadata, legal links, and recovery action.
- All 12 claim paths passed against the custom domain in desktop and mobile. Remote navigation checks were run serially and the restore/offline claims were also rerun independently.
- The live 5 MB check accepted and rendered a 5,000,000-byte file and pasted value. It rejected 5,000,001 bytes on both paths and left IndexedDB empty.
- Direct `/?demo=1` canonicalized to `/demo`, displayed the persistent banner and populated sample, and opened no user-data database.
- A live seeded file remained byte-identical after every demo exit. Reset restored the Apple destination, unchecked fixes, filename, source, and collapsed disclosure.
- Screenshots: `.factory/evidence/polish-5-live/screenshot-desktop.png`, `screenshot-mobile.png`, `demo-desktop.png`, `demo-mobile.png`, and `not-found.png`.

## Run and verify

```sh
npm ci
npm test
npm run build
PLAYWRIGHT_BASE_URL=https://ics-intake-checker.sociobot.in npm test
```

## Known gaps

None.
