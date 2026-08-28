# Adversarial first-read review 6 — ICS Intake Checker

**Date:** 2026-08-28  
**Live URL:** https://ics-intake-checker.sociobot.in  
**Reviewed source:** `5179345b192daccbc05ed4e46f10d848905b2adf`  
**Verdict:** **FAIL**

The cold first screen, one-click sample, local-only behavior, offline reload, and all declared claim tests pass. This round fails on one unlisted, untestable live claim and two non-informative headings.

## Findings

### Major

#### F-6-1 — The landing makes an unlisted provenance claim

- **Exact quote/location:** Footer on `/`: “Original generated illustration.” (`src/main.ts`, `shell()`).
- **Evidence:** The visitor-facing assertion that the artwork is original and generated has no entry in `.factory/claims.json` and no tagged sandbox test. `.factory/design.md` records the prompt, but documentation is not a claim test.
- **Why this fails:** The claims contract requires claim-like live copy to be listed and testable, or removed.
- **Concrete fix:** Remove this footer sentence. Retain the required asset provenance in `.factory/design.md`; do not add an untestable browser claim to keep it.

### Minor

#### F-6-2 — The 404 headline is a metaphor instead of a page name

- **Exact quote/location:** Unknown URL `/definitely-missing-review-6`, `<h1>`: “This calendar file took a wrong turn” (`public/404.html`).
- **Why this fails:** A missing URL is not a calendar file, and “took a wrong turn” is a metaphor. In a screen-reader heading list it does not identify the page plainly.
- **Concrete fix:** Replace the H1 with “Page not found”. Keep the recovery sentence and action.

#### F-6-3 — The landing boundary H2 is a vague slogan

- **Exact quote/location:** `/`, boundary section `<h2>`: “You choose what happens next” (`src/main.ts`, `landing()`).
- **Why this fails:** Read out of context, it does not name the section or the action following a check. The preceding kicker contains the actual limitation.
- **Concrete fix:** Replace it with “What to do after checking” or “Import the checked copy yourself”.

## Cold first read

### 390 × 844 fresh context, before scrolling — PASS

- **What it does:** Checks an ICS calendar file before import.
- **For whom:** People who receive calendar files and want to check risks before importing.
- **What to click first:** **Try it with sample data**.
- **Evidence:** The screen showed “Check an ICS file before calendar import”; the audience sentence; **Try it with sample data**; its result; and all three plain facts. It had no horizontal overflow or console error.

### 1440 × 900 fresh context, before scrolling — PASS

- **What it does:** Checks an ICS calendar file before import.
- **For whom:** People receiving a calendar file.
- **What to click first:** **Try it with sample data**.
- **Evidence:** The same task, audience, action, action outcome, facts, and purpose-specific inspection illustration were visible with no console error.

## Copy audit

Counts use whitespace-separated displayed words; URLs and code identifiers count as one word. No audited sentence exceeds 22 words. No banned marketing adjective, inconsistent product term, or non-result-naming action was found. The three flags are F-6-1 through F-6-3.

### Landing sentences (`/`)

| Sentence | Words | Result |
|---|---:|---|
| For people who receive calendar files and want to check risks before importing them. | 14 | Pass |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | `sample-preflight` |
| Event details stay in this browser. | 6 | `local-only` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | `repair-export` |
| A glass calendar file passes over a lit inspection table before import. | 12 | Purposeful alt text |
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
| Original generated illustration. | 3 | **F-6-1** |

### Landing interactive sentences, headings, and actions

| Copy | Words | Result |
|---|---:|---|
| Paste up to 5 MB of ICS text. | 8 | `intake-size-limit` |
| It is checked in this browser. | 6 | `paste-intake`, `local-only` |
| That file is not an ICS calendar. | 7 | Clear error |
| Choose a file ending in .ics. | 6 | Clear next step |
| That file is larger than 5 MB. | 7 | `intake-size-limit` |
| Choose a smaller calendar file. | 5 | Clear next step |
| The file could not be read. | 6 | Clear error |
| Save it again as plain-text ICS, then retry. | 8 | Clear next step |
| Paste ICS calendar text, then choose Check pasted text. | 9 | Clear next step |
| That text is larger than 5 MB. | 7 | `intake-size-limit` |
| Paste a smaller calendar file. | 5 | Clear next step |
| Skip to main content | 4 | Clear link |
| ICS Intake Checker | 3 | Product name |
| Demo / Privacy / Terms | 1 each | Clear navigation labels |
| Check a calendar file | 4 | Clear task label |
| Check an ICS file before calendar import | 7 | Clear H1 |
| Try it with sample data | 5 | Clear action |
| Check your file privately | 4 | Clear section label |
| Open a calendar file here | 5 | Clear heading |
| Drop an .ics file | 4 | Clear instruction |
| or choose one from this device | 6 | Clear instruction |
| Paste ICS text / Check pasted text | 3 each | Clear actions |
| Paste calendar file text | 4 | Clear form label |
| Three steps / How the checker works | 2 / 4 | Clear labels |
| Open the file / Read each finding / Export a copy | 3 / 3 / 3 | Clear step headings |
| What the checker cannot do | 5 | Clear section label |
| You choose what happens next | 5 | **F-6-3** |
| Built by Param Factory (external site) | 6 | Destination identified |

### README sentences

| Sentence | Words | Result |
|---|---:|---|
| Check and fix an ICS file before calendar import. | 9 | Pass |
| ICS Intake Checker is for people who receive calendar files from schools, clinics, conferences, and vendors. | 16 | Pass |
| It previews events and explains common import risks. | 8 | `event-preview`, `risk-detection` |
| Choose optional fixes for a downloaded copy for Apple Calendar, Google Calendar, or Outlook. | 14 | `repair-export`, `calendar-export` |
| Try the isolated sample at `/demo`. | 6 | `sample-preflight`, `demo-isolation` |
| It shows invitation, timezone, repeat, people, alarm, link, and duplicate findings. | 11 | `sample-preflight` |
| Demo work does not change your saved real file. | 9 | `demo-isolation` |
| The app can add missing IDs and creation stamps. | 9 | `repair-export` |
| It can remove people, alarms, or invitation mode from the downloaded copy. | 12 | `repair-export` |
| Event details stay in the browser, and the app does not open embedded links. | 14 | `local-only` |
| The latest real file survives refresh until you choose Forget this file. | 12 | `local-restore` |
| The app works offline after the first visit. | 8 | `offline-reload` |
| Requirements: Node.js 20 or newer and npm. | 7 | Developer requirement |
| Open `http://localhost:4173`. | 2 | Developer instruction |
| To open the checked sample in one click, visit `http://localhost:4173/demo` or `http://localhost:4173/?demo=1`. | 12 | Developer instruction |
| `npm test` builds the site and runs claims, accessibility, keyboard, mobile, route, fix, and offline checks in Chromium. | 18 | Verified developer instruction |
| `npm run build` creates the static site in `dist/`, with `index.html` at its root. | 14 | Verified developer instruction |
| Parsing and fixes run in the browser. | 7 | `local-only`, `repair-export` |
| Outside the demo, the browser saves your latest file in the `latest` IndexedDB record. | 14 | `local-restore` |
| Demo mode uses bundled in-memory data and does not change that record. | 12 | `demo-isolation` |
| The app loads no analytics, remote fonts, or scripts from other sites. | 12 | `no-third-party-runtime` |
| Use Forget this file or clear site data in your browser to remove the saved record. | 16 | `local-restore` |
| See Privacy and Terms. | 4 | Clear links |
| Deploy `dist/` as a static site. | 6 | Developer instruction |
| `staticwebapp.config.json` rewrites the four valid application routes and serves a status-404 document for unknown paths. | 15 | Verified deployment instruction |
| The service worker caches the built site so it can reload offline. | 11 | `offline-reload` |
| MIT. | 1 | License statement |
| The original generated illustration is documented in `.factory/design.md`. | 8 | Provenance documentation |

### README headings and list fragments

| Copy | Words | Result |
|---|---:|---|
| ICS Intake Checker | 3 | Product name |
| What it checks | 3 | Clear heading |
| Calendar structure, event IDs, start and end times | 8 | `risk-detection` |
| Floating and unknown timezones | 4 | `risk-detection` |
| Repeat rules that are invalid or never end | 8 | `risk-detection` |
| Repeated event IDs and events with matching details | 8 | `risk-detection` |
| Invitations that request a reply and files that cancel events | 10 | `risk-detection` |
| Attendee addresses, organizer addresses, alarms, and external links | 8 | `risk-detection` |
| Run locally / Test and build / Privacy and storage / Deployment / License | 2 / 3 / 3 / 1 / 1 | Clear headings |

## Demo, sandbox, and privacy verification

- The root action reached `/demo` in one click. At 390 px the first demo screen already showed the persistent banner, realistic sample filename, and populated `3 events / 0 stop issues / 4 warnings / 5 notices` inspection state. Desktop also showed a finding and event preview without setup.
- The banner read “Demo — sample data, nothing is saved” and exposed **Reset demo** plus **Return to my file**. It remained visible while scrolling.
- `@claim:demo-isolation` exercised reset, reload, Return, wordmark, Back, Privacy, and Terms exits against a seeded real IndexedDB record; the saved source and name remained byte-identical until the real **Forget this file** action.
- `@claim:offline-reload` loaded the direct demo, waited for service-worker control, disabled the network, and reloaded the populated demo successfully.
- Fresh live request logs during root and demo flows contained only `https://ics-intake-checker.sociobot.in`. The sample embedded link remained text and did not navigate or request its origin.

## Claims and clean-clone verification

Clean clone: `/tmp/ics-review6-clean-NQ0udl`, created from this repository at `5179345b192daccbc05ed4e46f10d848905b2adf`; `npm ci` passed with zero vulnerabilities.

Every declared command was run separately with `PLAYWRIGHT_BASE_URL=https://ics-intake-checker.sociobot.in` and passed in desktop and 390 px Chromium:

| Claim ID | Result |
|---|---|
| `sample-preflight` | PASS |
| `event-preview` | PASS |
| `demo-isolation` | PASS |
| `local-only` | PASS |
| `repair-export` | PASS |
| `risk-detection` | PASS |
| `calendar-export` | PASS |
| `paste-intake` | PASS |
| `intake-size-limit` | PASS |
| `local-restore` | PASS |
| `offline-reload` | PASS |
| `no-third-party-runtime` | PASS |

The complete deployed suite passed **32/32**. `npm run build` then passed in the same clone and produced `dist/index.html`. `test-results/.last-run.json` recorded `"status": "passed"` and no failed tests.

## Earlier findings: live and code regression check

All earlier `review-*.md`, `polish-*.md`, and the preceding handoff were read. Each earlier finding was checked again in current source and on the live site; no earlier ID is reissued.

| Earlier ID | Current result |
|---|---|
| F-1-1 | Fixed: all demo controls and exits preserve the seeded real record. |
| F-1-2 | Fixed: banner remains sticky and visible at mobile and desktop scroll positions. |
| F-1-3 | Fixed: Reset restores sample defaults. |
| F-1-4 | Fixed: unknown live URL returns status 404. |
| F-1-5 | Fixed: Return, wordmark, Back, Privacy, and Terms restore the real file. |
| F-1-6 | Fixed: sample test covers all seven advertised finding families. |
| F-1-7 | Fixed: repair test compares stored and reloaded source bytes. |
| F-1-8 | Fixed: export test covers Apple, Google, and Outlook. |
| F-1-9 | Fixed: demo storage wording is declared and tested. |
| F-1-10 | Fixed: demo uses in-memory state and cannot mutate real storage. |
| F-1-11 | Fixed: unsupported “Free” wording remains absent. |
| F-1-12 | Fixed: unsupported “No account” wording remains absent. |
| F-1-13 | Fixed: unsupported calendar-access promise remains absent. |
| F-1-14 | Fixed: unsupported import/account-sync promise remains absent. |
| F-1-15 | Fixed: all-route same-origin runtime assertion is declared and passes. |
| F-1-16 | Fixed: checked mobile targets meet 44 px. |
| F-1-17 | Fixed: task label says “Check a calendar file”. |
| F-1-18 | Fixed: audience copy says before importing. |
| F-1-19 | Fixed: caption names downloading a copy. |
| F-1-20 | Fixed: intake label is plain. |
| F-1-21 | Fixed: process label says “Three steps”. |
| F-1-22 | Fixed: process heading says “How the checker works”. |
| F-1-23 | Fixed: limitation label names the checker boundary. |
| F-1-24 | Fixed: audited visitor sentences remain at most 22 words. |
| F-1-25 | Fixed: optional changes are concrete downloaded-copy fixes. |
| F-1-26 | Fixed: implementation “fingerprint” is absent from visitor copy. |
| F-1-27 | Fixed: invitation/cancellation wording states file behavior plainly. |
| F-1-28 | Fixed: uploaded document terminology is “calendar file”, then “file”. |
| F-1-29 | Fixed: visible paste intake uses the common parser and storage path. |
| F-2-1 | Fixed: risk fixture asserts every advertised risk family. |
| F-2-2 | Fixed: repair and destination help describe observable output bytes. |
| F-2-3 | Fixed: status-404 document has metadata, shell, legal links, and recovery. |
| F-2-4 | Fixed: “Fingerprint” and “Route the copy” remain absent. |
| F-2-5 | Fixed: root title names the check-before-import task. |
| F-3-1 | Fixed: Back and Forward focus and announce the destination H1. |
| F-3-2 | Fixed: reset, reload, Forget, and paste close restore useful focus. |
| F-3-3 | Fixed: invitation is in the sample claim and assertion. |
| F-3-4 | Fixed: invitation detail names the downloaded-copy METHOD change. |
| F-3-5 | Fixed: missing-ID detail names the generated UID change. |
| F-3-6 | Fixed: floating-time detail names missing TZID/UTC information. |
| F-3-7 | Fixed: creation-stamp detail names the UTC DTSTAMP change. |
| F-3-8 | Fixed: tests prove people and alarms remain until selected. |
| F-3-9 | Fixed: alarm copy describes the block and its removal. |
| F-3-10 | Fixed: README sample wording matches asserted sample content. |
| F-3-11 | Fixed: optional changes are consistently called fixes. |
| F-3-12 | Fixed: README no longer calls the result a “populated workspace”. |
| F-3-13 | Fixed: README says “Outside the demo”. |
| F-3-14 | Fixed: README says “scripts from other sites”. |
| F-3-15 | Fixed: README states the observable offline reload behavior. |
| F-3-16 | Fixed: footer identifies the Param Factory link as external. |
| F-4-1 | Fixed: `event-preview` is declared and its upload assertion passes. |
| F-5-1 | Fixed: 5 MB file and paste boundary is declared and asserted. |

## Structure, links, accessibility, and identity

| Route | HTTP | Title | H1 | Canonical |
|---|---:|---|---|---|
| `/` | 200 | ICS Intake Checker — Check files before import | Check an ICS file before calendar import | `/` |
| `/demo` | 200 | Demo — ICS Intake Checker | Inspect a sample calendar file | `/demo` |
| `/privacy` | 200 | Privacy — ICS Intake Checker | Your event details stay on this device | `/privacy` |
| `/terms` | 200 | Terms — ICS Intake Checker | Use checked copies with care | `/terms` |
| unknown URL | 404 | Page not found — ICS Intake Checker | This calendar file took a wrong turn | `/404` |

- All routes had `lang=en`, one H1, one main landmark, route-specific descriptions, canonical URLs, OG/Twitter metadata, favicon, and Apple touch icon. F-6-2 is the remaining plain-words defect on the otherwise complete 404 route.
- The crawler found all internal route links, skip anchors, and the external Param Factory link. Valid destinations returned 200; the deliberate unknown page returned 404.
- The shared header/footer includes Privacy and Terms. Direct deep links worked, and the suite verified route-change focus and browser Back/Forward behavior.
- The live suite included Axe scans with zero serious or critical violations, keyboard coverage, mobile target checks, reduced-motion handling, offline reload, and no console errors on valid routes.
- The deep-ink grid, cyan data path, amber findings, clipped panes, mono labels, and calendar-specimen art match `.factory/design.md` and are product-specific rather than a generic SaaS template.

## Missed leverage

No missing feature is indicated by the brief. The product already supplies drag/drop, file selection, pasted ICS text, checked-copy export for three calendar apps, storage restoration, and offline reload. AI assistance or account sync would add privacy/cost or contradict the local checked-copy workflow without improving the stated job.

## What would make this perfect

1. Remove the untestable footer provenance assertion from the live page.
2. Replace the two metaphor/vague headings with the direct rewrites above.
3. Re-run the 12 declared claim commands, full suite, build, and cold-page copy audit. With those changes, no other issue was found in this round.
