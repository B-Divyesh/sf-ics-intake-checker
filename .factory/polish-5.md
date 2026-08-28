# Polish 5 — cumulative zero-finding closure

**Reviewed candidate:** `e859bd010d4492a98b9629147fe9177a2c653956`

**Review commit:** `e28bf1068ec23c3a2ff69682a8eb7ae3dc6d5f83`

**Repair commit:** `2fa6f6ad737ba751224aa709d4b08585962bd69e`

**Deployed URL:** https://ics-intake-checker.sociobot.in
**Deployment:** Static Web Apps deployment `be55b098-6c91-4cc1-858f-79e214de918f`

Round 5 retains the product-specific luminous inspection-table design. Evidence references below use the complete desktop/mobile Playwright suite, the named claim test, [local mobile landing](evidence/polish-5-local/screenshot-mobile.png), [local mobile demo](evidence/polish-5-local/demo-mobile.png), [live landing](evidence/polish-5-live/screenshot-desktop.png), [live mobile demo](evidence/polish-5-live/demo-mobile.png), and [live 404](evidence/polish-5-live/not-found.png).

## Review 1

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo reload/reset only rebuild in-memory sample state; every demo exit restores the real record before real controls render. | `@claim:demo-isolation`; local/live `/demo`; mobile demo screenshots. |
| F-1-2 | The complete demo banner and both actions remain sticky. | Mobile banner intersection test; local/live `/demo` at top, middle, and bottom; mobile demo screenshots. |
| F-1-3 | Reset restores source, filename, Apple destination, unchecked fixes, and collapsed source. | `@claim:demo-isolation`; local/live `/demo`. |
| F-1-4 | Valid routes use explicit rewrites; an unknown URL serves the designed document with status 404. | Route/404/Axe test; local/live `/definitely-missing-polish-5`; 404 screenshot. |
| F-1-5 | Return, wordmark, Back, Privacy, and Terms exits immediately restore the saved real file. | `@claim:demo-isolation`; local/live seeded-file check. |
| F-1-6 | The one-click test asserts all seven advertised finding families. | `@claim:sample-preflight`; local/live `/demo`; demo screenshots. |
| F-1-7 | Export assertions byte-compare IndexedDB and the reloaded original. | `@claim:repair-export`; clean-clone claim run. |
| F-1-8 | Apple, Google, and Outlook downloads are each asserted. | `@claim:calendar-export`; clean-clone claim run. |
| F-1-9 | Demo isolation is declared and exercises a seeded real record. | `@claim:demo-isolation`; local/live `/demo`. |
| F-1-10 | Demo data remains in memory and cannot create, replace, or delete the saved record. | `@claim:demo-isolation`; local/live direct demo check. |
| F-1-11 | The unproved “Free” statement remains removed. | `.factory/copy-audit.md`; local/live `/`; landing screenshots. |
| F-1-12 | The unproved “No account” statement remains removed. | `.factory/copy-audit.md`; local/live `/`; landing screenshots. |
| F-1-13 | Broad calendar-access wording remains removed; copy describes the tested checked-copy workflow. | `@claim:repair-export`; local/live Terms. |
| F-1-14 | Unsupported import/account-sync promises remain removed; embedded-link behavior is exact. | `@claim:local-only`; local/live `/demo`. |
| F-1-15 | Runtime resources and requests stay same-origin on every route and the 404. | `@claim:no-third-party-runtime`; local/live route request capture. |
| F-1-16 | Header, demo, and footer controls keep 44 px minimum targets at 390 px. | Mobile target test; local/live mobile screenshots. |
| F-1-17 | The task label remains “Check a calendar file.” | Copy audit; local/live landing screenshots. |
| F-1-18 | The audience line names checking risks before import. | Copy audit; local/live landing screenshots. |
| F-1-19 | The caption remains “Download only a copy you trust.” | Copy audit; local/live landing screenshots. |
| F-1-20 | The intake label remains “Check your file privately.” | Copy audit; local/live landing screenshots. |
| F-1-21 | The process label remains “Three steps.” | Copy audit; local/live `/`; landing screenshots. |
| F-1-22 | The heading remains “How the checker works.” | Copy audit; local/live `/`; landing screenshots. |
| F-1-23 | The limitation label remains “What the checker cannot do.” | Copy audit; local/live `/`; landing screenshots. |
| F-1-24 | Every audited visitor sentence is at most 22 words. | `.factory/copy-audit.md`; local/live route text audit. |
| F-1-25 | Copy names fixes to a downloaded copy, not “reversible cleanup.” | Copy audit; `@claim:repair-export`; local/live demo. |
| F-1-26 | Visitor copy contains no implementation fingerprint. | Copy audit; local/live demo screenshots. |
| F-1-27 | Invitation and cancellation text states the file behavior plainly. | `@claim:risk-detection`; local/live demo. |
| F-1-28 | Visitor wording consistently uses “calendar file,” then “file.” | `.factory/copy-audit.md`; local/live routes. |
| F-1-29 | The visible paste form uses the shared parser and real IndexedDB path. | `@claim:paste-intake`; local/live `/`; landing screenshots. |

## Review 2

| Finding | Change made | Evidence |
|---|---|---|
| F-2-1 | The malformed fixture covers every listed risk family, including timezone, people, and alarm. | `@claim:risk-detection`; clean-clone claim run. |
| F-2-2 | Fix and destination help describes observable downloaded bytes and filenames only. | `@claim:repair-export`, `@claim:calendar-export`; local/live demo screenshots. |
| F-2-3 | The status-404 document retains metadata, icons, skip link, shared shell, legal links, and recovery. | Route/404/Axe test; local/live unknown URL; 404 screenshot. |
| F-2-4 | “Fingerprint” and “Route the copy” remain absent. | Copy audit; local/live demo screenshots. |
| F-2-5 | Root title remains “ICS Intake Checker — Check files before import.” | Skeleton/metadata test; local/live verifier JSON. |

## Review 3

The reissued F-1-1 and F-1-5 cases are covered above, including every ordinary demo exit.

| Finding | Change made | Evidence |
|---|---|---|
| F-3-1 | Back and forward focus and announce the destination H1. | Route focus test; local/live Demo → Privacy → Back → Forward. |
| F-3-2 | Reset, reload, Forget, and paste-close restore useful keyboard focus. | Keyboard focus test; local/live browser run. |
| F-3-3 | Invitation is part of the sample claim and its one-click assertion. | `@claim:sample-preflight`; local/live `/demo`. |
| F-3-4 | Invitation detail states the exact `METHOD` line change. | `@claim:repair-export`; local/live demo screenshot. |
| F-3-5 | Missing-ID detail states the generated UID change. | `@claim:repair-export`; local/live demo screenshot. |
| F-3-6 | Floating-time detail names the missing TZID/UTC suffix. | `@claim:sample-preflight`; local/live demo screenshot. |
| F-3-7 | Creation-stamp detail states the UTC DTSTAMP change. | `@claim:repair-export`; local/live demo screenshot. |
| F-3-8 | People and alarm blocks remain by default and leave only when selected. | `@claim:repair-export`; clean-clone claim run. |
| F-3-9 | Alarm text describes its block and removal, not notifications. | `@claim:sample-preflight`, `@claim:repair-export`; local/live demo. |
| F-3-10 | README names only asserted sample families; the sample titles/count are checked. | `@claim:sample-preflight`; clean-clone claim run. |
| F-3-11 | Optional changes consistently use “fixes.” | `.factory/copy-audit.md`; local/live demo screenshot. |
| F-3-12 | README says “open the checked sample in one click.” | Copy audit; README review. |
| F-3-13 | README says “Outside the demo.” | Copy audit; README and local/live Privacy. |
| F-3-14 | Privacy wording says “scripts from other sites.” | `@claim:no-third-party-runtime`; README and local/live Privacy. |
| F-3-15 | Offline wording states the observable reload result. | `@claim:offline-reload`; local/live offline reload. |
| F-3-16 | Footer visibly labels Param Factory as an external site. | Link/route test; local/live landing/demo/404 screenshots. |

## Review 4

| Finding | Change made | Evidence |
|---|---|---|
| F-4-1 | Event preview is declared and proves both titles and rendered start dates for an uploaded two-event file. | `@claim:event-preview`; clean-clone claim run; local/live uploaded fixture. |

## Review 5

| Finding | Change made | Evidence |
|---|---|---|
| F-5-1 | Added `intake-size-limit`. Its single tagged test proves exactly 5,000,000 bytes is checked and 5,000,001 bytes is rejected for both file and paste intake. Removed the parser’s unreachable over-limit warning and centralized the UI limit. | `@claim:intake-size-limit` in desktop and 390 px Chromium; `.factory/claims.json`; local/live expanded paste form; landing screenshots. |

## Verification

- Local full suite: `npm test` passed 32/32 browser checks; `npm run build` produced `dist/`.
- Local verifier: `evidence/polish-5-local/verify.json` records the correct title, `lang=en`, one H1, main, image alt coverage, named buttons, and no console errors.
- Build output: JavaScript 31.66 KB raw / 11.19 KB gzip; CSS 15.58 KB raw / 4.46 KB gzip.
- Clean clone `/tmp/ics-polish5-clean-NdNad6` at `2fa6f6a`: every one of the 12 claim commands passed separately, then `npm test` passed 32/32 and `npm run build` passed.
- Live verifier: `evidence/polish-5-live/verify.json` records a 961 ms cold load, correct structure, and no console errors. Valid routes returned 200 and the unknown path returned 404.
- Post-deploy claim checks passed on the custom domain in desktop and mobile, including the new 5,000,000/5,000,001-byte boundary, every demo exit, offline reload, privacy, and Axe scans.
- Lighthouse 12.8.2 on the identical production build: Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 394 ms, CLS 0. See `evidence/polish-5-local/lighthouse.json`.
