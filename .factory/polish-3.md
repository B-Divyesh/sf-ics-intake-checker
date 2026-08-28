# Polish 3 — cumulative finding closure

**Reviewed candidate:** `060b7d39dc4904bedf68291fa11697355b8db145`

**Repair commit:** `41a0e7b8156d5f6d8e997f314aa5e8aa6911ff7d`
**Deployed URL:** https://ics-intake-checker.sociobot.in

All claim commands were run separately from clean clone `/tmp/ics-polish3-clean-RAkL1l`, then the complete 28-check desktop/mobile suite and build passed. Live evidence is in `.factory/evidence/polish-3-live/`; live checks below refer to the deployed URL.

## Review 1

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Centralized transitions so demo state is discarded before any non-demo render; all exits restore IndexedDB before showing real controls. | `@claim:demo-isolation`; live wordmark/Back/Privacy/Terms/Return byte checks; [demo mobile](evidence/polish-3-live/demo-mobile.png); live `/demo`. |
| F-1-2 | Kept the full demo notice and actions sticky at the viewport top. | Mobile visibility test; live scroll at 0/700/2200; [demo mobile](evidence/polish-3-live/demo-mobile.png). |
| F-1-3 | Demo load/reset rebuilds source, name, destination, fixes, and paste state. | `@claim:demo-isolation`; live `/demo` reset check. |
| F-1-4 | Preserved exact valid-route rewrites and static status-404 response. | Route/404 test; live `/definitely-missing-review-path` returns 404; [404](evidence/polish-3-live/not-found.png). |
| F-1-5 | Made wordmark, Back, and legal-route exits use the same real-file restoration path as Return. | `@claim:demo-isolation`; live seeded-record checks for every exit. |
| F-1-6 | Expanded sample assertion to every advertised finding family. | `@claim:sample-preflight`; live `/demo`. |
| F-1-7 | Kept stored/reloaded original byte comparisons after export. | `@claim:repair-export`; clean-clone run. |
| F-1-8 | Kept parameterized Apple, Google, and Outlook download assertions. | `@claim:calendar-export`; clean-clone run. |
| F-1-9 | Declared truthful demo isolation and fixed its behavior. | `demo-isolation` claim and live seeded-record check. |
| F-1-10 | Kept demo data in memory and tested every exit against a saved record. | `@claim:demo-isolation`; live `/demo`. |
| F-1-11 | Removed the unverified Free statement. | `.factory/copy-audit.md`; live landing screenshot. |
| F-1-12 | Removed the unverified No account statement. | `.factory/copy-audit.md`; live landing screenshot. |
| F-1-13 | Kept only tested checked-copy/calendar-app wording. | `@claim:repair-export`; live Terms check. |
| F-1-14 | Removed unsupported import and account-sync promises. | `@claim:local-only`; live landing check. |
| F-1-15 | Kept all-route same-origin request coverage, including the 404 page. | `@claim:no-third-party-runtime`; live route check. |
| F-1-16 | Preserved 44 px wordmark, banner, and footer targets. | Mobile target test; [demo mobile](evidence/polish-3-live/demo-mobile.png). |
| F-1-17 | Uses “Check a calendar file.” | Copy audit; live landing. |
| F-1-18 | Names checking risks before import. | Copy audit; live landing. |
| F-1-19 | Uses “Download only a copy you trust.” | Copy audit; live landing. |
| F-1-20 | Uses “Check your file privately.” | Copy audit; live landing. |
| F-1-21 | Uses “Three steps.” | Copy audit; live landing. |
| F-1-22 | Uses “How the checker works.” | Copy audit; live landing. |
| F-1-23 | Uses “What the checker cannot do.” | Copy audit; live landing. |
| F-1-24 | Re-audited visitor sentences to the 22-word cap. | `.factory/copy-audit.md`; live text check. |
| F-1-25 | Uses concrete downloaded-copy fixes. | Copy audit; live workspace. |
| F-1-26 | Keeps implementation fingerprints out of visitor copy. | Copy audit; live workspace. |
| F-1-27 | Uses plain invitation and cancellation wording. | `@claim:risk-detection`; live `/demo`. |
| F-1-28 | Keeps “calendar file”, then “file”, as the user term. | Copy audit; live routes. |
| F-1-29 | Kept the visible paste intake on the shared parser/storage path. | `@claim:paste-intake`; live landing route. |

## Review 2

| Finding | Change made | Evidence |
|---|---|---|
| F-2-1 | The malformed fixture covers structure, IDs, times, timezone, repeat, duplicates, invitation/cancel, people, alarms, and links. | `@claim:risk-detection`; clean-clone run. |
| F-2-2 | Replaced downstream-app promises with observable ICS bytes; repair tests prove selected and default retention output. | `@claim:repair-export`, `@claim:calendar-export`; live demo screenshot. |
| F-2-3 | Kept status-404 metadata, skip link, shared shell, legal exits, and recovery link. | Route/404/Axe test; live 404 status and [screenshot](evidence/polish-3-live/not-found.png). |
| F-2-4 | Keeps “fingerprint” hidden and names the export action plainly. | Copy audit; live demo screenshot. |
| F-2-5 | Keeps root title as “ICS Intake Checker — Check files before import”. | Metadata test; live verifier JSON. |

## Review 3

| Finding | Change made | Evidence |
|---|---|---|
| F-3-1 | Back and forward route changes focus and announce the destination H1. | Route focus test; live Privacy → Back → Forward check. |
| F-3-2 | Reset, reload, Forget, and paste-close focus the new equivalent control or intake heading. | Keyboard focus test; live reset/reload focus check. |
| F-3-3 | Added invitation to the declared sample claim and asserted it in the one-click fixture. | `@claim:sample-preflight`; live `/demo`. |
| F-3-4 | Invitation finding now states the exact `METHOD` line and its downloaded-copy removal. | `@claim:repair-export`; live demo screenshot. |
| F-3-5 | Missing-ID finding now states the direct UID byte change. | `@claim:repair-export`; live `/demo`. |
| F-3-6 | Floating-time finding now states the missing TZID/UTC suffix. | `@claim:sample-preflight`; live `/demo`. |
| F-3-7 | Creation-stamp finding now states the direct DTSTAMP byte change. | `@claim:repair-export`; live `/demo`. |
| F-3-8 | Repair coverage now proves attendee/organizer and alarm blocks remain by default, then disappear only when selected. | `@claim:repair-export`; live `/demo`. |
| F-3-9 | Alarm finding now says it contains an alarm block and describes its direct removal. | `@claim:sample-preflight`; live `/demo`. |
| F-3-10 | README now names only the claimed, tested sample findings; the test also checks all three sample events. | `@claim:sample-preflight`; live `/demo`. |
| F-3-11 | Standardized the visitor term to “fixes”. | Copy audit; live demo screenshot. |
| F-3-12 | Rewrote README setup text as “open the checked sample in one click”. | Copy audit; live README. |
| F-3-13 | Rewrote storage text as “Outside the demo…”. | Copy audit; live Privacy/README check. |
| F-3-14 | Rewrote privacy text as “scripts from other sites”. | `@claim:no-third-party-runtime`; live Privacy check. |
| F-3-15 | Rewrote service-worker text as the observable offline reload result. | `@claim:offline-reload`; live offline reload. |
| F-3-16 | Identified the footer destination as “Built by Param Factory (external site)”. | Route/link test; live demo and 404 screenshots. |

## Verification summary

- Clean clone: `npm ci`, every command declared in `.factory/claims.json`, `npm test` (28/28), and `npm run build` all passed.
- Local verifier: `verify-url.sh` reported root title, `lang=en`, one H1, main, no missing alt text, no unnamed buttons, and no console errors. See `evidence/polish-3-local/verify.json`.
- Live verifier: the same root structural check passed in 659 ms. See `evidence/polish-3-live/verify.json`.
- Live Playwright Axe integration: zero serious/critical violations across `/`, `/demo`, `/privacy`, `/terms`, and a real-404 route.
- Live cold re-check: root first-screen fit, one-click demo, `?demo=1`, banner positions, every seeded-file demo exit, keyboard focus, same-origin behavior, and service-worker offline reload all passed.
