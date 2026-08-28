# Polish 4 — zero-finding closure

**Reviewed candidate:** `15ff7082025f8539252dabb3bdd6b0d68f274586`  
**Repair commit:** `be8d1bbc198b2f64d6b28f119c514136836c04eb`  
**Deployed URL:** https://ics-intake-checker.sociobot.in  
**Deployment:** Static Web Apps deployment `d5a418c9-d553-403f-8a14-11615b3405e2`

The only newly open issue in review 4 was closed by declaring and testing the existing event-preview behavior. All earlier findings were rechecked locally and on the deployed site; none regressed.

## Review 1

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo clear reloads only in-memory sample state; every exit restores the real record before real controls render. | `@claim:demo-isolation`; live seeded-file recheck of Return, wordmark, Back, Privacy, and Terms exits. |
| F-1-2 | The full demo banner and actions remain sticky at the viewport top. | Mobile visibility test; live `/demo` scroll positions 0/700/2200; [demo desktop](evidence/polish-4-live/demo-desktop.png), [demo mobile](evidence/polish-4-live/demo-mobile.png). |
| F-1-3 | Reset reconstructs source, name, Apple destination, unchecked fixes, and collapsed raw source. | `@claim:demo-isolation`; live `/demo` reset recheck. |
| F-1-4 | Valid SPA routes are explicit rewrites and unknown paths serve the static status-404 document. | Route/404 test; live `https://ics-intake-checker.sociobot.in/definitely-missing-review-path` returned 404; [404](evidence/polish-4-live/not-found.png). |
| F-1-5 | Every non-demo navigation discards sample state and restores the real file immediately. | `@claim:demo-isolation`; live seeded-file recheck of all five exits. |
| F-1-6 | The sample test asserts invitation, timezone, repeat, attendee, alarm, link, and duplicate findings. | `@claim:sample-preflight` from clean clone; live `/demo`. |
| F-1-7 | Export checks stored and reloaded original bytes after downloading the repaired copy. | `@claim:repair-export` from clean clone. |
| F-1-8 | Apple, Google, and Outlook each have a parameterized checked-copy assertion. | `@claim:calendar-export` from clean clone. |
| F-1-9 | Truthful demo isolation is declared. | `demo-isolation` claim; clean-clone `@claim:demo-isolation`; live seeded-file recheck. |
| F-1-10 | Demo state remains in memory and does not mutate the real IndexedDB record. | `@claim:demo-isolation`; live `/demo` exit checks. |
| F-1-11 | Removed the unsupported “Free” statement. | `.factory/copy-audit.md`; [live landing](evidence/polish-4-live/landing-desktop.png). |
| F-1-12 | Removed the unsupported “No account” statement. | `.factory/copy-audit.md`; live landing recheck. |
| F-1-13 | Removed broad calendar-access promises and retained only tested checked-copy language. | `.factory/copy-audit.md`; `@claim:repair-export`; live Terms recheck. |
| F-1-14 | Removed unsupported import/account-sync promises. | `.factory/copy-audit.md`; `@claim:local-only`; live landing recheck. |
| F-1-15 | Declared and tested all-route same-origin runtime behavior. | `@claim:no-third-party-runtime`; live request-origin recheck across all routes. |
| F-1-16 | Header, demo actions, and legal links use 44 px minimum targets. | Mobile target test; live 390 px recheck and [demo mobile](evidence/polish-4-live/demo-mobile.png). |
| F-1-17 | Replaced “preflight” with “Check a calendar file.” | `.factory/copy-audit.md`; live landing. |
| F-1-18 | Audience copy now says “check risks before importing them.” | `.factory/copy-audit.md`; live landing. |
| F-1-19 | Caption now says “Download only a copy you trust.” | `.factory/copy-audit.md`; live landing. |
| F-1-20 | Intake heading now says “Check your file privately.” | `.factory/copy-audit.md`; live landing. |
| F-1-21 | Process kicker now says “Three steps.” | `.factory/copy-audit.md`; live landing. |
| F-1-22 | Process heading now says “How the checker works.” | `.factory/copy-audit.md`; live landing. |
| F-1-23 | Boundary kicker identifies “What the checker cannot do.” | `.factory/copy-audit.md`; live landing. |
| F-1-24 | Reviewed visitor and README sentences remain at or below 22 words. | `.factory/copy-audit.md`; live copy recheck. |
| F-1-25 | Replaced vague cleanup wording with downloaded-copy fixes. | `.factory/copy-audit.md`; `@claim:repair-export`. |
| F-1-26 | Removed visitor-facing “event fingerprints.” | `.factory/copy-audit.md`; live demo recheck. |
| F-1-27 | Invitation/cancellation copy now explains the file behavior plainly. | `@claim:risk-detection`; live `/demo`. |
| F-1-28 | Uses “calendar file,” then “file,” consistently for the uploaded document. | `.factory/copy-audit.md`; live route recheck. |
| F-1-29 | Paste intake uses the normal parser and real-mode storage path. | `@claim:paste-intake` from clean clone; live landing recheck. |

## Review 2

| Finding | Change made | Evidence |
|---|---|---|
| F-2-1 | Risk fixture covers every claimed family, including timezone, people, and alarm. | `@claim:risk-detection` from clean clone. |
| F-2-2 | Replaced downstream-calendar promises with observable downloaded-ICS byte descriptions. | `@claim:repair-export`, `@claim:calendar-export`; [live demo](evidence/polish-4-live/demo-desktop.png). |
| F-2-3 | Status-404 page has metadata, icons, skip link, common shell, legal links, and recovery. | Route/404 and Axe tests; live 404 check; [404](evidence/polish-4-live/not-found.png). |
| F-2-4 | Removed “fingerprint” and unclear “Route the copy” visitor text. | `.factory/copy-audit.md`; live demo recheck. |
| F-2-5 | Root title is “ICS Intake Checker — Check files before import.” | Metadata test; live root `verify.json`. |

## Review 3

| Finding | Change made | Evidence |
|---|---|---|
| F-3-1 | Back/forward routes focus and announce the destination H1. | Route focus test; live Demo → Back focus recheck. |
| F-3-2 | Reset, reload, Forget, and paste-close return focus to the equivalent new control or intake heading. | Keyboard focus test in `npm test`. |
| F-3-3 | Added invitation to the one-click sample claim and assertion. | `@claim:sample-preflight`; live `/demo`. |
| F-3-4 | Invitation finding states the exact `METHOD` line removed from the downloaded copy. | `@claim:repair-export`; live demo recheck. |
| F-3-5 | Missing-ID finding states the direct UID byte change. | `@claim:repair-export`; live demo recheck. |
| F-3-6 | Floating-time finding names the missing TZID/UTC suffix. | `@claim:sample-preflight`; live `/demo`. |
| F-3-7 | Creation-stamp finding names the direct DTSTAMP byte change. | `@claim:repair-export`; live demo recheck. |
| F-3-8 | Tests prove people/alarm blocks remain by default and leave only when selected. | `@claim:repair-export` from clean clone. |
| F-3-9 | Alarm text names the alarm block instead of promising downstream notifications. | `@claim:sample-preflight`; live `/demo`. |
| F-3-10 | README sample copy names only claimed findings and sample event titles/count are asserted. | `@claim:sample-preflight` from clean clone. |
| F-3-11 | Standardized the visitor term to “fixes.” | `.factory/copy-audit.md`; live demo recheck. |
| F-3-12 | README says “open the checked sample in one click.” | `.factory/copy-audit.md`. |
| F-3-13 | README says “Outside the demo.” | `.factory/copy-audit.md`; live Privacy recheck. |
| F-3-14 | Privacy copy says “scripts from other sites.” | `@claim:no-third-party-runtime`; live request-origin recheck. |
| F-3-15 | Offline copy states the observable reload result. | `@claim:offline-reload`; live offline reload. |
| F-3-16 | Footer identifies Param Factory as an external site. | Route/link test; live demo and 404 recheck. |

## Review 4

| Finding | Change made | Evidence |
|---|---|---|
| F-4-1 | Added the `event-preview` claim and its one tagged two-event upload test. It asserts every title plus the rendered start-date `<time datetime>` in **Event preview**. | Clean-clone `npm test -- --grep @claim:event-preview` passed in desktop and mobile; live upload recheck asserted School pickup/20261012T081500Z and Team lunch/20261013T121500Z. |

## Verification

- Fresh clone `/tmp/ics-polish4-clean-w1jVXc` at `be8d1bb`: `npm ci`, every command in `.factory/claims.json` separately, then `npm run build` all passed. The 11 claim IDs are `sample-preflight`, `event-preview`, `demo-isolation`, `local-only`, `repair-export`, `risk-detection`, `calendar-export`, `paste-intake`, `local-restore`, `offline-reload`, and `no-third-party-runtime`.
- Local full suite: `npm test` passed 30/30 browser checks; `npm run build` passed. Built JS is 11.23 KB gzip and CSS is 4.46 KB gzip.
- Local cold verifier: [verify.json](evidence/polish-4-local/verify.json) records correct title/lang/one-H1/main/alt/button checks and no console errors.
- Live cold verifier: [verify.json](evidence/polish-4-live/verify.json) records the same structural checks, no console errors, and 819 ms load time. The live browser recheck additionally passed seeded demo isolation, reset, route focus, title/metadata/404, direct `?demo=1`, mobile fit/targets, request-origin privacy, all-route Axe scans with zero serious/critical violations, and service-worker offline reload.
- Live HTTP checks: `/`, `/demo`, `/privacy`, and `/terms` returned 200; the unknown-route check returned 404. The root response includes CSP, `nosniff`, strict-origin referrer policy, and permissions policy.
- Live Lighthouse mobile: [lighthouse.json](evidence/polish-4-live/lighthouse.json) records Performance 100, Accessibility 100, Best Practices 100, SEO 100, LCP 1,153 ms, and CLS 0.
