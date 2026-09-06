# ICS Intake Checker — independent re-review 8

**Date:** 2026-09-06  
**Live URL:** https://ics-intake-checker.sociobot.in  
**Implementation candidate:** `783235bfe1a29ea2fc471f75ca605be2ae049fef` (`fix: close cumulative review copy findings`)  
**Documentation SHA reviewed:** `8dd47598646fb043b527e37102a0c19656d30aa1` (review-7/handoff only; it does not change shipped product files). `c4d20b5` is likewise report/evidence-only.

## Verdict: PASS

**Finding count: 0. Untested-claim count: 0.**

The last implementation candidate is deployed: the live JavaScript, CSS, social image, manifest, service worker, and 404 document matched a clean build of the reviewed source by hash. No product code was modified in this review.

## Job, audience, and first action before scrolling

Fresh Chromium desktop (1440 × 900) and fresh iPhone 13-emulated Chromium (390 × 664) contexts both loaded at `scrollY: 0`, without horizontal overflow or console errors.

| Check | Result on both fresh views |
|---|---|
| Job | “Check an ICS file before calendar import” |
| Audience | “For people who receive calendar files and want to check risks before importing them.” |
| First action | **Try it with sample data** — visible without scrolling |
| Plain facts | Browser-local details; offline after first visit; downloaded-copy-only changes |

The desktop and phone first screens were also visually inspected. The primary action is clear, the action result is adjacent, and the phone layout remains readable without overflow.

## Demo, data safety, and recovery

- One click from `/` opens `/demo`, which immediately shows the realistic `sample-clinic-and-vendor.ics` workspace: three events, 0 stop issues, 4 warnings, and 5 notices.
- The sample exposes invitation, timezone, repeat, attendee, alarm, external-link, and duplicate findings. It includes a clinic follow-up and two matching vendor workshops.
- The sticky label says **“Demo — sample data, nothing is saved”**. It remains in view at the top, middle, and lower demo scroll positions. It has **Reset demo** and **Return to my file**.
- Reset restores the sample filename, source disclosure, Apple destination, and unchecked repair options.
- The declared isolation test seeded a real IndexedDB record, then exercised reset, reload, Return, wordmark, Back, Privacy, and Terms exits. Each preserved the real filename and source byte-for-byte; the demo uses in-memory data.
- The normal valid-file path, malformed-file findings, 5,000,000/5,000,001-byte file and paste boundaries, reset/reload/forget recovery, downloads, and refresh persistence all passed in both browser profiles.
- Request capture during the demo observed only the product origin. Embedded links are shown as text and are not opened.

This is a static PWA, not a backend or installed CLI/library product. Tenant isolation, restart persistence, health endpoint, rate limit, and consumer-install checks are not applicable.

## Claims from a clean checkout

Clean checkout: `/tmp/ics-review8-clean-jc6PNk/repo` at documentation SHA `8dd4759`, containing implementation candidate `783235b`.

- `npm ci` passed: 23 packages audited, 0 vulnerabilities.
- `npm run build` passed and produced `dist/index.html`. The initial built JS is 11.15 kB gzip; CSS is 4.43 kB gzip.
- Each exact command declared in `.factory/claims.json` was run separately, against a clean local build, in desktop and 390 px mobile Chromium. Every command passed (2/2).

| Claim | Exact declared command | Result |
|---|---|---|
| `sample-preflight` | `npm test -- --grep @claim:sample-preflight` | PASS — three events and all seven finding families |
| `event-preview` | `npm test -- --grep @claim:event-preview` | PASS — every uploaded event title and start date |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS — seeded real record survives every demo exit |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — same-origin only; embedded links stay inert |
| `repair-export` | `npm test -- --grep @claim:repair-export` | PASS — selected bytes change only in the download |
| `risk-detection` | `npm test -- --grep @claim:risk-detection` | PASS — all advertised risk families |
| `calendar-export` | `npm test -- --grep @claim:calendar-export` | PASS — Apple, Google, and Outlook outputs |
| `paste-intake` | `npm test -- --grep @claim:paste-intake` | PASS — pasted file uses checker and real storage path |
| `intake-size-limit` | `npm test -- --grep @claim:intake-size-limit` | PASS — exact accept/reject boundary on both inputs |
| `local-restore` | `npm test -- --grep @claim:local-restore` | PASS — refresh restores until Forget |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS — populated demo reloads offline after first visit |
| `no-third-party-runtime` | `npm test -- --grep @claim:no-third-party-runtime` | PASS — all routes load same-origin runtime resources only |

The claim-inventory test confirms exactly one tagged browser test per declared claim. Landing, workspace, Privacy, Terms, README, and metadata text were cross-checked against this inventory: no unlisted public claim was found.

## Live verification

- `PLAYWRIGHT_BASE_URL=https://ics-intake-checker.sociobot.in npm test` passed **34/34**. Playwright recorded `{ "status": "passed", "failedTests": [] }`.
- The live suite covers route titles, H1/main structure, valid/invalid/boundary/recovery paths, keyboard focus, history focus, mobile targets, demo persistence, privacy requests, offline reload, status-404, and serious/critical Axe findings.
- `/opt/fleet/lib/verify-url.sh https://ics-intake-checker.sociobot.in /tmp/ics-review8-verify` passed: title, `lang=en`, one H1, main landmark, image alt coverage, named buttons, and zero console errors.
- The standalone `@axe-core/cli` attempt could not launch because its transient package had no Chrome binary. This does not leave accessibility untested: the pinned `@axe-core/playwright` integration completed on `/`, `/demo`, `/privacy`, `/terms`, and the 404 route in the passing live suite, with zero serious or critical violations.
- `/`, `/demo`, `/privacy`, `/terms`, offline document, manifest, robots, sitemap, icons, and all product-internal linked resources returned 200. An unknown product URL returned the designed page with HTTP 404, which is expected and correct.
- Every checked route has its own title, one H1, main landmark, metadata, canonical URL, common header/footer, legal routes, visible focus treatment, skip link, reduced-motion rules, and a response-header CSP. The external Param Factory link is labelled as external; it was not followed because this work order forbids connecting to another product.
- Live headers include CSP with `frame-ancestors 'none'`, HSTS, `nosniff`, strict referrer policy, and a restrictive permissions policy.
- The service worker has versioned precache/activation behavior, an update-ready control path, and the live offline claim passed in a separate browser context.

## Earlier findings: current disposition

All prior review, verification, polish, and handoff records were read. Every prior finding, including minor copy findings, was exercised or inspected in the current source and live runtime.

| Earlier findings | Current disposition and proof |
|---|---|
| F-1-1, F-1-5 | Fixed — all demo controls and all exits preserve and restore a seeded real record. |
| F-1-2 | Fixed — the complete demo label/actions remain visible during use. |
| F-1-3 | Fixed — Reset restores every mutable demo default. |
| F-1-4 | Fixed — unknown live URLs return the designed HTTP 404 document. |
| F-1-6, F-1-7, F-1-8 | Fixed — sample families, unchanged original bytes, and all three calendar exports are asserted. |
| F-1-9, F-1-10 | Fixed — demo isolation/non-persistence is declared and byte-tested. |
| F-1-11, F-1-12, F-1-13, F-1-14, F-1-15 | Fixed — unsupported or unlisted promises remain absent; same-origin runtime is declared and tested. |
| F-1-16 | Fixed — checked phone targets meet 44 px. |
| F-1-17 through F-1-29 | Fixed — direct calendar-file terminology, audience/action/headings, copy length, concrete fixes, plain invitation/cancellation wording, and visible paste intake remain present; no cited jargon or ambiguous wording regressed. |
| F-2-1 | Fixed — malformed fixture asserts structure, IDs, times, timezone, repeat, duplicate, invitation/cancel, people, alarm, and link outcomes. |
| F-2-2 | Fixed — repair and destination promises describe observable downloaded output only. |
| F-2-3 | Fixed — status-404 has metadata, shared shell, legal links, skip link, and recovery. |
| F-2-4, F-2-5 | Fixed — workspace jargon remains absent and root title names checking before import. |
| F-3-1, F-3-2 | Fixed — Back/Forward and reset/reload/forget/paste-close retain useful focus and announcement behavior. |
| F-3-3 through F-3-10 | Fixed — invitation/sample/repair details have declared, observable coverage. |
| F-3-11 through F-3-16 | Fixed — visitor wording uses “fixes,” README/Privacy wording is observable, offline wording is tested, and footer names its external destination. |
| F-4-1 | Fixed — event preview has the distinct declared `event-preview` claim and two-event test. |
| F-5-1 | Fixed — the exact 5 MB file/paste limit is declared and tested at both boundaries. |
| F-6-1, F-6-2, F-6-3 | Fixed — no visitor-side art provenance copy, direct 404 H1s, and the direct import-boundary H2 remain in place. |

## Result

**PASS.** There are zero findings at every severity and zero untested claims.
