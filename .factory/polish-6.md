# Polish 6 — cumulative zero-finding closure

**Reviewed candidate:** `5179345b192daccbc05ed4e46f10d848905b2adf`  
**Review commit:** `57079900c9207d54619a9f3077c36acdac8457e4`  
**Repair commit:** `783235bfe1a29ea2fc471f75ca605be2ae049fef`  
**Deployment:** `6a542f3f-a291-4ad9-bcd7-236040494c48`  
**Live URL:** https://ics-intake-checker.sociobot.in

Evidence shorthand: **live root** is the cold production landing page with [desktop](evidence/polish-6-live/screenshot-desktop.png) and [390 px](evidence/polish-6-live/screenshot-mobile.png) captures; **live demo** is the direct `?demo=1`/`/demo` sandbox with [desktop](evidence/polish-6-live/demo-desktop.png) and [390 px](evidence/polish-6-live/demo-mobile.png) captures; **live 404** is `/definitely-missing-review-6`, which returned HTTP 404 and has [this capture](evidence/polish-6-live/not-found.png). Every cited browser test passed against production in desktop and 390 px Chromium.

## Review 1

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo reset/reload stays in memory; every demo exit restores the real record before real controls render. | `@claim:demo-isolation`; live demo; seeded-record checks at `/demo`. |
| F-1-2 | The complete demo notice and both actions remain sticky and visible. | `demo bar stays visible…`; demo mobile screenshot; live `?demo=1` at three scroll positions. |
| F-1-3 | Reset restores the source, filename, Apple destination, unchecked fixes, and collapsed source disclosure. | `@claim:demo-isolation`; demo desktop screenshot; live `/demo`. |
| F-1-4 | Valid routes use explicit rewrites; unknown paths serve the designed status-404 document. | `demo bar stays visible…`; 404 screenshot; live missing URL returned 404. |
| F-1-5 | Return, wordmark, Back, Privacy, and Terms exits immediately restore a saved real file. | `@claim:demo-isolation`; live demo; production seeded-file run. |
| F-1-6 | The one-click sample assertion covers invitation, timezone, repeat, attendee, alarm, link, and duplicate findings. | `@claim:sample-preflight`; demo screenshots; live `/?demo=1`. |
| F-1-7 | Export byte-compares the stored and reloaded original after fixes. | `@claim:repair-export`; demo desktop screenshot; live `/demo`. |
| F-1-8 | Apple, Google, and Outlook downloads are each exercised. | `@claim:calendar-export`; demo desktop screenshot; live `/demo`. |
| F-1-9 | Demo isolation is declared and tested against a seeded real record. | `@claim:demo-isolation`; demo mobile screenshot; live `/demo`. |
| F-1-10 | Demo data remains in memory and cannot create, replace, or delete the saved record. | `@claim:demo-isolation`; live demo; direct production sandbox run. |
| F-1-11 | Removed the unsupported “Free” statement. | `landing, metadata…`; root screenshot; live `/` copy audit. |
| F-1-12 | Removed the unsupported “No account” statement. | `landing, metadata…`; root screenshot; live `/` copy audit. |
| F-1-13 | Removed broad calendar-access promises and kept observable checked-copy wording. | `@claim:repair-export`; root screenshot; live `/terms`. |
| F-1-14 | Removed unsupported import/account-sync promises and retained tested link behavior. | `@claim:local-only`; root screenshot; live `/`. |
| F-1-15 | Declares and tests same-origin runtime behavior across every route and the 404. | `@claim:no-third-party-runtime`; 404 screenshot; live route request capture. |
| F-1-16 | Header, demo, and footer controls keep 44 px minimum targets at 390 px. | `demo bar stays visible…`; demo mobile screenshot; live `/demo`. |
| F-1-17 | The task label says “Check a calendar file.” | `landing, metadata…`; root screenshot; live `/`. |
| F-1-18 | The audience line names checking risks before import. | `landing, metadata…`; root screenshot; live `/`. |
| F-1-19 | The image caption says “Download only a copy you trust.” | `landing, metadata…`; root screenshot; live `/`. |
| F-1-20 | The intake label says “Check your file privately.” | `landing, metadata…`; root screenshot; live `/`. |
| F-1-21 | The process label says “Three steps.” | `landing, metadata…`; root screenshot; live `/`. |
| F-1-22 | The process heading says “How the checker works.” | `landing, metadata…`; root screenshot; live `/`. |
| F-1-23 | The limitation label says “What the checker cannot do.” | `round 6 copy uses direct headings…`; root screenshot; live `/`. |
| F-1-24 | All audited visitor and README sentences remain at or below 22 words. | `.factory/copy-audit.md`; root screenshot; cold live copy audit. |
| F-1-25 | Optional changes are concrete downloaded-copy fixes. | `@claim:repair-export`; demo screenshot; live `/demo`. |
| F-1-26 | Implementation fingerprints remain absent from visitor copy. | `@claim:event-preview`; demo screenshot; live `/demo`. |
| F-1-27 | Invitation and cancellation text states direct file behavior. | `@claim:risk-detection`; demo screenshot; live `/demo`. |
| F-1-28 | Visitor copy uses “calendar file,” then “file.” | `.factory/copy-audit.md`; root screenshot; live route audit. |
| F-1-29 | Visible paste intake uses the shared parser and real IndexedDB path. | `@claim:paste-intake`; root screenshot; live `/`. |

## Review 2

| Finding | Change made | Evidence |
|---|---|---|
| F-2-1 | The malformed fixture covers every listed risk family, including timezone, people, and alarm. | `@claim:risk-detection`; demo screenshot; live browser run. |
| F-2-2 | Fix and destination help describes observable output bytes and filenames only. | `@claim:repair-export`, `@claim:calendar-export`; demo screenshot; live `/demo`. |
| F-2-3 | The status-404 document has metadata, icons, skip link, shared shell, legal links, and recovery. | `demo bar stays visible…` plus Axe; 404 screenshot; live missing URL returned 404. |
| F-2-4 | “Fingerprint” and “Route the copy” remain absent. | `@claim:event-preview`; demo screenshot; live `/demo`. |
| F-2-5 | Root title is “ICS Intake Checker — Check files before import.” | `landing, metadata…`; root screenshot; live verifier JSON. |

## Review 3

The reissued F-1-1 and F-1-5 paths are covered above, including every ordinary demo exit.

| Finding | Change made | Evidence |
|---|---|---|
| F-3-1 | Back and Forward focus and announce the destination H1. | `demo bar stays visible…`; demo screenshot; live Demo → Privacy → Back → Forward. |
| F-3-2 | Reset, reload, Forget, and paste-close restore useful keyboard focus. | `keyboard focus stays…`; demo screenshot; live browser run. |
| F-3-3 | Invitation is part of the sample claim and one-click assertion. | `@claim:sample-preflight`; demo screenshot; live `/?demo=1`. |
| F-3-4 | Invitation detail names the exact `METHOD` line removed from the downloaded copy. | `@claim:repair-export`; demo screenshot; live `/demo`. |
| F-3-5 | Missing-ID detail names the generated UID added to the copy. | `@claim:repair-export`; demo screenshot; live `/demo`. |
| F-3-6 | Floating-time detail names missing TZID/UTC information. | `@claim:sample-preflight`; demo screenshot; live `/demo`. |
| F-3-7 | Creation-stamp detail names the UTC DTSTAMP added to the copy. | `@claim:repair-export`; demo screenshot; live `/demo`. |
| F-3-8 | People and alarm blocks remain by default and leave only when selected. | `@claim:repair-export`; demo screenshot; live `/demo`. |
| F-3-9 | Alarm copy describes its block and direct removal, not notifications. | `@claim:sample-preflight`, `@claim:repair-export`; demo screenshot; live `/demo`. |
| F-3-10 | README names only asserted sample families; the sample titles and count are checked. | `@claim:sample-preflight`; demo screenshot; live `/?demo=1`. |
| F-3-11 | Optional changes consistently use “fixes.” | `@claim:repair-export`; demo screenshot; live `/demo`. |
| F-3-12 | README says “open the checked sample in one click.” | `.factory/copy-audit.md`; demo screenshot; live `/demo`. |
| F-3-13 | README says “Outside the demo.” | `@claim:local-restore`; root screenshot; live `/privacy`. |
| F-3-14 | Privacy wording says “scripts from other sites.” | `@claim:no-third-party-runtime`; root screenshot; live `/privacy`. |
| F-3-15 | Offline wording states the observable reload result. | `@claim:offline-reload`; demo screenshot; live offline reload. |
| F-3-16 | Footer labels Param Factory as an external site. | `demo bar stays visible…`; 404 screenshot; live route link crawl. |

## Reviews 4 and 5

| Finding | Change made | Evidence |
|---|---|---|
| F-4-1 | `event-preview` declares and proves uploaded event titles and rendered start dates. | `@claim:event-preview`; demo screenshot; live upload check. |
| F-5-1 | `intake-size-limit` proves 5,000,000 bytes is checked and 5,000,001 bytes is rejected for file and paste. | `@claim:intake-size-limit`; root screenshot; live boundary run. |

## Review 6

| Finding | Change made | Evidence |
|---|---|---|
| F-6-1 | Removed “Original generated illustration.” from the application and static-404 footers. Provenance remains only in `.factory/design.md` and README. | `round 6 copy uses direct headings and keeps artwork provenance off visitor pages`; root and 404 screenshots; live `/` and missing URL contain no sentence. |
| F-6-2 | Replaced both SPA and static-404 metaphors with the H1 “Page not found”; changed the static label to “404 · PAGE NOT FOUND.” | Same round-6 copy test plus route-status test; 404 screenshot; live missing URL returned 404. |
| F-6-3 | Replaced “You choose what happens next” with “Import the checked copy yourself.” | Same round-6 copy test; root screenshots; live `/`. |

## Acceptance evidence

- Clean clone `/tmp/ics-polish6-clean-cE9MrP/repo` at `783235bfe1a29ea2fc471f75ca605be2ae049fef`: `npm ci` found zero vulnerabilities; every one of the 12 `.factory/claims.json` commands passed separately in both projects; `npm test` passed 34/34; `npm run build` produced `dist/index.html`.
- The claims inventory remains 12 entries because F-6-1 was removed rather than converted into an untestable claim. The inventory test confirms one matching tagged browser test per entry.
- Work-order build: exact command `npm ci && npm test && npm run build` passed before upload. JavaScript is 31.58 KB raw / 11.15 KB gzip; CSS is 15.51 KB raw / 4.43 KB gzip.
- Production: `PLAYWRIGHT_BASE_URL=https://ics-intake-checker.sociobot.in npm test` passed 34/34. This includes all claim, Axe, keyboard, focus, route, mobile, privacy, and offline checks.
- Cold verifier: [verify.json](evidence/polish-6-live/verify.json) records an 853 ms load, correct title, `lang=en`, one H1, one main, complete alt text, named buttons, and zero console errors.
- Live routing: `/`, `/demo`, `/privacy`, and `/terms` returned 200; `/definitely-missing-review-6` returned 404. CSP, `nosniff`, strict-origin referrer policy, and permissions policy were present.
- Deployed JS, CSS, service worker, and 404 document SHA-256 hashes exactly matched `dist/`.
- Lighthouse 12.8.2: Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1.1 s, CLS 0, TBT 0 ms. See [lighthouse.json](evidence/polish-6-live/lighthouse.json).

All findings from reviews 1–6 are closed. No known gap or deferred minor item remains.
