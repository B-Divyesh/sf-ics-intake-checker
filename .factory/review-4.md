# Adversarial first-read review 4 — ICS Intake Checker

**Date:** 2026-08-28  
**Live URL:** https://ics-intake-checker.sociobot.in  
**Reviewed source:** `15ff7082025f8539252dabb3bdd6b0d68f274586`  
**Verdict:** **FAIL**

The product is clear, immediately tryable, and behaves safely in the checked demo flows. It does not meet the required zero-finding standard because the README makes one unlisted product claim. No declared claim test failed.

## Finding

### Minor

#### F-4-1 — README promises event previewing without a declared claim

- **Exact quote/location:** `README.md`, opening description: “It previews events and explains common import risks.”
- **Evidence:** `.factory/claims.json` has entries for sample findings, risk detection, repairs, calendar downloads, paste intake, storage, offline reload, and runtime requests. None claims that a chosen real calendar file displays an event preview. The tagged `risk-detection` test asserts findings, while `sample-preflight` asserts the supplied demo's event titles; neither is the declared observable proof of the README's general preview promise.
- **Why this fails:** A visitor can rely on the tool showing what is inside their file before import. The claims contract requires every such promise to have a matching claimed, sandboxed observable outcome.
- **Concrete fix:** Either add an `event-preview` entry to `.factory/claims.json` and exactly one `@claim:event-preview` test that uploads a clean multi-event fixture and asserts each title/date in **Event preview**, or narrow the README sentence to: “It explains common import risks.”

## Cold first read

### 390 × 844, fresh context, before scrolling — PASS

- **What it does:** Checks an ICS calendar file before calendar import.
- **For whom:** People who receive calendar files and want to check risks before importing them.
- **What to click first:** **Try it with sample data**.
- **Exact visible text:** “Check an ICS file before calendar import”; “For people who receive calendar files and want to check risks before importing them.”; “Try it with sample data”. All three plain facts and the primary action fit in the viewport. `scrollWidth === clientWidth === 390`; no console errors occurred.

### 1440 × 900, fresh context, before scrolling — PASS

- The same job, audience, and first action are visible without scrolling. The original inspection-table illustration is visible beside the copy. No console errors or horizontal overflow occurred.

## Copy audit

Counts treat a URL, product name, `.ics`, and a code identifier as one displayed word. No landing or README sentence exceeds 22 words. No banned marketing adjective, inconsistent visitor-facing term, confusing heading, or non-result-naming action was found. **F-4-1** is the one claim-inventory flag.

### Landing sentences (`/`)

| Sentence | Words | Result |
|---|---:|---|
| For people who receive calendar files and want to check risks before importing them. | 14 | Pass |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | `sample-preflight` |
| Event details stay in this browser. | 6 | `local-only` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | `repair-export` |
| Inspect the file. | 3 | Pass |
| Download only a copy you trust. | 6 | Pass |
| The checker reads the file in this browser. | 8 | `local-only` |
| It never opens embedded links. | 5 | `local-only` |
| Drop a calendar file, choose one, or paste its text. | 10 | `paste-intake` |
| Check times, repeats, people, alarms, links, and duplicates. | 8 | `risk-detection` |
| Apply optional fixes and download for your calendar app. | 9 | `repair-export`, `calendar-export` |
| The checker prepares a checked copy. | 6 | `repair-export` |
| You decide whether to import it. | 6 | Pass |
| It shows embedded links as text. | 6 | `local-only` |
| It does not open them. | 5 | `local-only` |
| Check and fix an ICS file before calendar import. | 9 | Pass |
| Original generated illustration. | 3 | Pass |

The meaningful image alt is “A glass calendar file passes over a lit inspection table before import.” (12 words); it is clear and purpose-describing. Heading fragments such as “Check a calendar file”, “How the checker works”, and “What the checker cannot do” make sense out of context. The actions **Try it with sample data**, **Paste ICS text**, and **Download checked .ics** use result-naming verbs; the demo controls **Reset demo**, **Reload sample file**, and **Return to my file** do likewise.

### README sentences

| Sentence | Words | Result |
|---|---:|---|
| Check and fix an ICS file before calendar import. | 9 | Pass |
| ICS Intake Checker is for people who receive calendar files from schools, clinics, conferences, and vendors. | 16 | Pass |
| It previews events and explains common import risks. | 8 | **F-4-1** |
| Choose optional fixes for a downloaded copy for Apple Calendar, Google Calendar, or Outlook. | 14 | `repair-export`, `calendar-export` |
| Try the isolated sample at `/demo`. | 6 | Pass |
| It shows invitation, timezone, repeat, people, alarm, link, and duplicate findings. | 11 | `sample-preflight` |
| Demo work does not change your saved real file. | 9 | `demo-isolation` |
| The app can add missing IDs and creation stamps. | 9 | `repair-export` |
| It can remove people, alarms, or invitation mode from the downloaded copy. | 12 | `repair-export` |
| Event details stay in the browser, and the app does not open embedded links. | 14 | `local-only` |
| The latest real file survives refresh until you choose **Forget this file**. | 12 | `local-restore` |
| The app works offline after the first visit. | 8 | `offline-reload` |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Open `http://localhost:4173`. | 2 | Pass |
| To open the checked sample in one click, visit `http://localhost:4173/demo` or `http://localhost:4173/?demo=1`. | 12 | Pass |
| `npm test` builds the site and runs claims, accessibility, keyboard, mobile, route, fix, and offline checks in Chromium. | 18 | Pass |
| `npm run build` creates the static site in `dist/`, with `index.html` at its root. | 13 | Pass |
| Parsing and fixes run in the browser. | 7 | `local-only`, `repair-export` |
| Outside the demo, the browser saves your latest file in the `latest` IndexedDB record. | 14 | `local-restore` |
| Demo mode uses bundled in-memory data and does not change that record. | 12 | `demo-isolation` |
| The app loads no analytics, remote fonts, or scripts from other sites. | 12 | `no-third-party-runtime` |
| Use **Forget this file** or clear site data in your browser to remove the saved record. | 14 | `local-restore` |
| See Privacy and Terms. | 4 | Pass |
| Deploy `dist/` as a static site. | 5 | Pass |
| `staticwebapp.config.json` rewrites the four valid application routes and serves a status-404 document for unknown paths. | 15 | Pass — deployment detail |
| The service worker caches the built site so it can reload offline. | 11 | `offline-reload` |
| MIT. | 1 | Pass |
| The original generated illustration is documented in `.factory/design.md`. | 8 | Pass |

## Demo, sandbox, and privacy verification

- The first landing action opens `/demo` in one click. The first destination screen is a populated, realistic three-event workspace with ten findings, event previews, fixes, calendar choice, and an enabled checked-copy download.
- At both 390 × 844 and 1440 × 900, the persistent banner reads “Demo — sample data, nothing is saved” and offers **Reset demo** and **Return to my file**. Its rectangle remained at `y=0` at page scroll positions 0, 700, and 2200.
- Changing Calendar app to Outlook and selecting **Remove attendee details**, then choosing **Reset demo**, restored Apple Calendar, cleared the checkbox, and closed raw source. **Reload sample file** restored the sample. The sample export was named `sample-clinic-and-vendor-checked-apple.ics` after reset.
- A real `review4-private.ics` IndexedDB record was seeded, then compared byte-for-byte after exits through **Return to my file**, the wordmark, browser Back, Privacy → wordmark, and Terms → wordmark. All five returned to the saved file and preserved the record.
- Fresh live request logs for landing and demo contained only `https://ics-intake-checker.sociobot.in`; no console errors occurred. This confirms the privacy/runtime behavior in addition to the claim test.
- The live demo uses no real storage namespace: it is built from `SAMPLE_ICS` in memory. The code writes IndexedDB only when `persist && !state.demo`; demo reset/reload call `loadDemo`, not database operations.

## Claim commands from a clean clone

Clean clone: `/tmp/ics-review4-clean-t7HDU1` at the reviewed commit. `npm ci` completed with zero vulnerabilities. Each declared command was run separately and passed in Chromium and the 390 px project.

| Claim | Result |
|---|---|
| `sample-preflight` | PASS |
| `demo-isolation` | PASS |
| `local-only` | PASS |
| `repair-export` | PASS |
| `risk-detection` | PASS |
| `calendar-export` | PASS |
| `paste-intake` | PASS |
| `local-restore` | PASS |
| `offline-reload` | PASS |
| `no-third-party-runtime` | PASS |

`npm test` passed **28/28** checks and `npm run build` produced `dist/`. The claim inventory test confirms every currently declared ID has exactly one tagged test. F-4-1 is an inventory gap, not a failing declared test.

## Earlier-finding regression check

Every finding in `review-1.md`, `review-2.md`, `review-3.md`, every polish record, and the prior handoff was checked on the live site and in current source. None is reissued.

| Earlier finding | Current confirmation |
|---|---|
| F-1-1 | Fixed — demo clear reloads only in-memory sample data; all five exit routes byte-preserved a seeded record. |
| F-1-2 | Fixed — full demo notice/actions were visible at mobile and desktop top/middle/bottom scroll positions. |
| F-1-3 | Fixed — Reset restored sample source/name, Apple destination, unchecked fixes, and collapsed source. |
| F-1-4 | Fixed — live unknown route returned HTTP 404 with the designed document. |
| F-1-5 | Fixed — Return and every non-demo exit immediately restored the saved file. |
| F-1-6 | Fixed — `sample-preflight` asserts all advertised sample finding families. |
| F-1-7 | Fixed — `repair-export` compares stored and reloaded source bytes. |
| F-1-8 | Fixed — `calendar-export` covers Apple, Google, and Outlook downloads. |
| F-1-9 | Fixed — truthful demo isolation is declared and tested. |
| F-1-10 | Fixed — demo non-persistence is declared and tested against a seeded record. |
| F-1-11 | Fixed — “Free” is absent. |
| F-1-12 | Fixed — “No account” is absent. |
| F-1-13 | Fixed — broad calendar-access claim is absent. |
| F-1-14 | Fixed — unsupported import/sync claim is absent. |
| F-1-15 | Fixed — all-route third-party-runtime claim and tagged test exist. |
| F-1-16 | Fixed — tested mobile header, banner, and legal targets are at least 44 px. |
| F-1-17 | Fixed — the landing says “Check a calendar file”. |
| F-1-18 | Fixed — audience sentence names risks before import. |
| F-1-19 | Fixed — caption says “Download only a copy you trust.” |
| F-1-20 | Fixed — intake says “Check your file privately”. |
| F-1-21 | Fixed — process kicker says “Three steps”. |
| F-1-22 | Fixed — process heading says “How the checker works”. |
| F-1-23 | Fixed — limitation heading says “What the checker cannot do”. |
| F-1-24 | Fixed — no reviewed landing/README sentence exceeds 22 words. |
| F-1-25 | Fixed — “reversible cleanup” is absent. |
| F-1-26 | Fixed — visitor-facing “fingerprint” is absent. |
| F-1-27 | Fixed — invitation/cancellation language is plain. |
| F-1-28 | Fixed — “calendar file”, then “file”, is used consistently. |
| F-1-29 | Fixed — Paste ICS text uses the normal parser/storage path and has claim coverage. |
| F-2-1 | Fixed — risk fixture asserts timezone, people, and alarm as well as the other listed families. |
| F-2-2 | Fixed — repair/deck text states observable downloaded-byte changes only. |
| F-2-3 | Fixed — live 404 has status, metadata, skip link, common header/footer, legal links, and recovery. |
| F-2-4 | Fixed — “Fingerprint” and “Route the copy” are absent. |
| F-2-5 | Fixed — root title is “ICS Intake Checker — Check files before import”. |
| F-3-1 | Fixed — live Privacy → Back restores focus to the destination H1. |
| F-3-2 | Fixed — reset, reload, Forget, and paste-close focus checks pass. |
| F-3-3 | Fixed — invitation is in `sample-preflight` and its sample assertion. |
| F-3-4 | Fixed — invitation text states the direct `METHOD` downloaded-copy change. |
| F-3-5 | Fixed — missing-ID text states the direct UID change. |
| F-3-6 | Fixed — floating-time text describes the missing timezone/UTC information. |
| F-3-7 | Fixed — creation-stamp text states the direct DTSTAMP change. |
| F-3-8 | Fixed — repair test proves people/alarm retention unless selected. |
| F-3-9 | Fixed — alarm wording now describes its block and direct removal. |
| F-3-10 | Fixed — README names only the claimed sample findings; titles/count are asserted. |
| F-3-11 | Fixed — visitor-facing optional changes consistently use “fixes”. |
| F-3-12 | Fixed — README says “open the checked sample in one click”. |
| F-3-13 | Fixed — README says “Outside the demo”. |
| F-3-14 | Fixed — privacy copy says “scripts from other sites”. |
| F-3-15 | Fixed — offline copy states the observable reload outcome. |
| F-3-16 | Fixed — footer labels Param Factory as an external site. |

## Structure, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` returned 200; an unknown route returned 404. Each had one H1, one main landmark, a route-specific title, description, canonical URL, OG/Twitter data, favicon, shared header/footer, and Privacy/Terms links. `?demo=1` canonicalized to `/demo`.
- All collected links returned 200, including the external Param Factory page. Browser Back/Forward restored route title, focus, and live announcement after the asynchronous transition settled.
- Live Axe scans found no serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, or the 404 route. The visible skip link works, the 390 px page has no horizontal overflow, and no console errors were captured.
- `robots.txt`, `sitemap.xml`, manifest, canonical/social image, apple touch icon, status-404 document, and the same-origin CSP were present. Response headers include `nosniff`, strict-origin referrer policy, and a restrictive permissions policy.
- The visual system is product-specific rather than a generic SaaS template: original calendar-specimen artwork, deep inspection field, cyan safe path, amber warnings, clipped glass panes, instrument-like controls, and reduced-motion handling follow `.factory/design.md`.

## Missed leverage

No additional AI feature is indicated. ICS inspection and byte-level repair are deterministic and privacy-sensitive. The brief-implied high-value paths are present: file selection, drag/drop, pasted text, local restoration, checked-copy export, calendar-app filenames, and offline demo. No provider key or decorative AI feature was found.

## What would make this perfect

Add a declared, observable event-preview claim and its one tagged fixture test, or remove that one README promise. With that resolved, this review would have zero findings.
