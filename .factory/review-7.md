# Adversarial first-read review 7 — ICS Intake Checker

**Date:** 2026-08-28  
**Live URL:** https://ics-intake-checker.sociobot.in  
**Reviewed source:** `c4d20b5220f83a2f5b9881ae50eb7ef1b62a0ad1`  
**Verdict:** **PASS**

No blocking, major, or minor finding remains. The first screen answers the job, audience, and first action at both required widths. The sample is useful in one click, demo state is isolated, every declared claim passes its exact command from a clean clone, all prior findings remain fixed, and the deployed assets match the reviewed build.

## Findings

None.

## Cold first read

Fresh Chromium contexts had no cookies, local storage, session storage, or prior service-worker state. Nothing was scrolled before recording the result.

### 390 × 844 — PASS

- **What it does:** Checks an ICS calendar file before calendar import.
- **For whom:** People who receive calendar files and want to check risks before importing them.
- **What to click first:** **Try it with sample data**.
- **Exact supporting copy:** “Check an ICS file before calendar import”; “For people who receive calendar files and want to check risks before importing them.”; “Try it with sample data”.
- The action, its result line, and all three privacy/offline/copy facts fit before the 844 px viewport edge. There was no horizontal overflow or console error.

### 1440 × 900 — PASS

The same three answers, action result, three facts, and product-specific inspection artwork were visible without scrolling. There was no horizontal overflow or console error.

## Copy audit

Counts are whitespace-separated displayed words. Punctuation, hyphenated terms, URLs, filenames, and code identifiers remain attached to one word. No sentence exceeds 22 words. No banned marketing adjective, unexplained jargon, inconsistent visitor term, metaphor heading, or non-result-naming action was found.

### Landing-page sentences

| Sentence | Words | Result |
|---|---:|---|
| Preview, check, fix, and export an ICS calendar file before you import it. | 13 | `event-preview`, `risk-detection`, `repair-export`, `calendar-export` |
| Your event details stay in your browser. | 7 | `local-only` |
| For people who receive calendar files and want to check risks before importing them. | 14 | Pass |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | `sample-preflight` |
| Event details stay in this browser. | 6 | `local-only` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | `repair-export` |
| A glass calendar file passes over a lit inspection table before import. | 12 | Clear image alt |
| Inspect the file. | 3 | Direct instruction |
| Download only a copy you trust. | 6 | Direct instruction |
| The checker reads the file in this browser. | 8 | `local-only` |
| It never opens embedded links. | 5 | `local-only` |
| Drop a calendar file, choose one, or paste its text. | 10 | `paste-intake` |
| Check times, repeats, people, alarms, links, and duplicates. | 8 | `risk-detection` |
| Apply optional fixes and download for your calendar app. | 9 | `repair-export`, `calendar-export` |
| The checker prepares a checked copy. | 6 | `repair-export` |
| You decide whether to import it. | 6 | Direct responsibility statement |
| It shows embedded links as text. | 6 | `local-only` |
| It does not open them. | 5 | `local-only` |
| Check and fix an ICS file before calendar import. | 9 | Plain footer description |

### Landing interactive and error sentences

| Sentence | Words | Result |
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

### Landing headings, labels, and actions

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Clear link |
| ICS Intake Checker | 3 | Product name |
| Demo / Privacy / Terms | 1 each | Clear navigation labels |
| Check a calendar file | 4 | Clear task label |
| Check an ICS file before calendar import | 7 | Direct H1; under nine words |
| Try it with sample data | 5 | Required sample action |
| Check your file privately | 4 | Clear section label |
| Open a calendar file here | 5 | Clear heading |
| Drop an .ics file | 4 | Clear instruction |
| or choose one from this device | 6 | Clear instruction |
| Paste ICS text | 3 | Result-naming action |
| Paste calendar file text | 4 | Clear form label |
| Check pasted text | 3 | Result-naming action |
| Three steps | 2 | Clear section label |
| How the checker works | 4 | Clear section heading |
| Open the file / Read each finding / Export a copy | 3 each | Clear step headings |
| What the checker cannot do | 5 | Clear limitation label |
| Import the checked copy yourself | 5 | Direct section heading |
| Built by Param Factory (external site) | 6 | External destination identified |
| v1.4 · build 2026.08 | 4 | Build label |

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
| The latest real file survives refresh until you choose **Forget this file**. | 12 | `local-restore` |
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
| Use **Forget this file** or clear site data in your browser to remove the saved record. | 16 | `local-restore` |
| See Privacy and Terms. | 4 | Clear links |
| Deploy `dist/` as a static site. | 6 | Developer instruction |
| `staticwebapp.config.json` rewrites the four valid application routes and serves a status-404 document for unknown paths. | 15 | Verified deployment instruction |
| The service worker caches the built site so it can reload offline. | 11 | `offline-reload` |
| MIT. | 1 | License statement |
| The original generated illustration is documented in `.factory/design.md`. | 8 | Repository provenance record |

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

Visitor terminology is consistent: **calendar file**, then **file**; **event**; **finding**; **fix**; **checked copy**, then **copy**; and **calendar app**. Technical terms occur only where the format or developer instructions require them.

## Demo and sandbox verification

- The first landing action opened `/demo` in one click.
- At 390 × 844, the first demo screen showed the persistent banner, sample description, realistic filename, and `3 events / 0 stop issues / 4 warnings / 5 notices` without scrolling. Desktop also showed the findings and event-preview headings.
- The sample contains a clinic follow-up and two matching vendor workshops. It exposes invitation, timezone, repeat, attendee, alarm, external-link, and duplicate findings.
- The banner says “Demo — sample data, nothing is saved” and includes **Reset demo** and **Return to my file**. It remains sticky while scrolling.
- After changing the destination to Outlook, selecting **Remove attendee details**, and opening raw source, **Reset demo** restored Apple Calendar, cleared the fix, closed raw source, and restored `sample-clinic-and-vendor.ics`.
- A real `review7-private.ics` IndexedDB record was seeded first. Its name and source were byte-identical before demo, during demo after Reset, and after exit. **Return to my file** immediately restored it.
- Root and demo request logs contained only `https://ics-intake-checker.sociobot.in`. Embedded sample links remained text.
- The direct demo reloaded with the network disabled after service-worker readiness.

## Claims verification

Clean clone: `/tmp/ics-review7-clean-KQwGwA/repo` at `c4d20b5220f83a2f5b9881ae50eb7ef1b62a0ad1`. `npm ci` completed with zero vulnerabilities. Every declared command was run separately against the clean local build; each passed in desktop and 390 px Chromium.

| Claim ID | Result | Verified outcome |
|---|---|---|
| `sample-preflight` | PASS, 2/2 | One click opens three events and all seven named finding families. |
| `event-preview` | PASS, 2/2 | Both uploaded titles and rendered start dates appear. |
| `demo-isolation` | PASS, 2/2 | Reset, reload, Return, wordmark, Back, Privacy, and Terms exits preserve the seeded real record. |
| `local-only` | PASS, 2/2 | Embedded links stay text; no foreign request or navigation occurs. |
| `repair-export` | PASS, 2/2 | Selected output bytes change; saved and reloaded source bytes do not. |
| `risk-detection` | PASS, 2/2 | Every advertised risk family produces a finding. |
| `calendar-export` | PASS, 2/2 | Apple, Google, and Outlook checked copies have the asserted output. |
| `paste-intake` | PASS, 2/2 | Pasted ICS reaches the checker and the real storage path. |
| `intake-size-limit` | PASS, 2/2 | 5,000,000 bytes is accepted and 5,000,001 is rejected for file and paste. |
| `local-restore` | PASS, 2/2 | Refresh restores the latest real file; Forget removes it. |
| `offline-reload` | PASS, 2/2 | The populated demo reloads with network disabled. |
| `no-third-party-runtime` | PASS, 2/2 | All routes and the 404 load only same-origin runtime resources. |

The inventory check confirms exactly one tagged test per claim. The landing, demo/workspace, Privacy, Terms, metadata, and README cross-check found no unlisted claim and no untested claim.

## Earlier-finding regression check

Every earlier review, polish record, and handoff was read. Each prior finding was checked in current source and on the deployed site.

| Earlier ID | Round-7 confirmation |
|---|---|
| F-1-1 | Fixed: reset/reload and every demo exit preserve the seeded real record. |
| F-1-2 | Fixed: the complete demo notice remains viewport-visible while scrolling. |
| F-1-3 | Fixed: Reset restores source, filename, destination, fixes, and disclosure state. |
| F-1-4 | Fixed: an unknown live path returns the designed document with HTTP 404. |
| F-1-5 | Fixed: Return, wordmark, Back, Privacy, and Terms exits restore the real file. |
| F-1-6 | Fixed: the sample test asserts every named finding family. |
| F-1-7 | Fixed: export testing byte-compares stored and reloaded original data. |
| F-1-8 | Fixed: Apple, Google, and Outlook exports are each exercised. |
| F-1-9 | Fixed: demo storage isolation is declared and verified. |
| F-1-10 | Fixed: demo state stays in memory and does not alter the real record. |
| F-1-11 | Fixed: the unlisted “Free” claim remains absent. |
| F-1-12 | Fixed: the unlisted “No account” claim remains absent. |
| F-1-13 | Fixed: broad calendar-access wording remains absent. |
| F-1-14 | Fixed: unsupported import/account-sync wording remains absent. |
| F-1-15 | Fixed: same-origin runtime behavior is declared and passes on all routes. |
| F-1-16 | Fixed: checked mobile header, demo, and footer targets are at least 44 px. |
| F-1-17 | Fixed: the task label remains “Check a calendar file”. |
| F-1-18 | Fixed: the audience sentence names checking risks before import. |
| F-1-19 | Fixed: the caption directly names downloading a trusted copy. |
| F-1-20 | Fixed: the intake label remains “Check your file privately”. |
| F-1-21 | Fixed: the process label remains “Three steps”. |
| F-1-22 | Fixed: the process heading remains “How the checker works”. |
| F-1-23 | Fixed: the limitation label names what the checker cannot do. |
| F-1-24 | Fixed: the complete current audit has no sentence over 22 words. |
| F-1-25 | Fixed: optional changes are described as concrete fixes to a copy. |
| F-1-26 | Fixed: visitor copy contains no implementation fingerprint. |
| F-1-27 | Fixed: invitation and cancellation wording explains the file behavior. |
| F-1-28 | Fixed: uploaded-document terminology is calendar file, then file. |
| F-1-29 | Fixed: paste intake is visible and uses the shared parser/storage path. |
| F-2-1 | Fixed: the risk fixture asserts every advertised family. |
| F-2-2 | Fixed: repair and destination help state observable output changes only. |
| F-2-3 | Fixed: the status-404 document has metadata, shared shell, legal links, and recovery. |
| F-2-4 | Fixed: “Fingerprint” and “Route the copy” remain absent. |
| F-2-5 | Fixed: the root title names checking before import. |
| F-3-1 | Fixed: Back and Forward focus and announce the destination H1. |
| F-3-2 | Fixed: reset, reload, Forget, and paste-close restore useful focus. |
| F-3-3 | Fixed: invitation is declared and asserted in the one-click sample. |
| F-3-4 | Fixed: invitation help names the direct `METHOD` output change. |
| F-3-5 | Fixed: missing-ID help names the generated UID change. |
| F-3-6 | Fixed: floating-time help names missing TZID/UTC information. |
| F-3-7 | Fixed: stamp help names the UTC DTSTAMP change. |
| F-3-8 | Fixed: people and alarm blocks are proved to remain unless selected. |
| F-3-9 | Fixed: alarm copy describes the block and its removal. |
| F-3-10 | Fixed: README sample copy matches asserted sample content. |
| F-3-11 | Fixed: visitor copy consistently calls optional changes fixes. |
| F-3-12 | Fixed: README says “open the checked sample in one click”. |
| F-3-13 | Fixed: README uses “Outside the demo”. |
| F-3-14 | Fixed: README says “scripts from other sites”. |
| F-3-15 | Fixed: README states the observable offline reload result. |
| F-3-16 | Fixed: the footer visibly identifies the external site. |
| F-4-1 | Fixed: event preview has a declared two-event title/date test. |
| F-5-1 | Fixed: the exact 5 MB boundary is declared and tested on both intake paths. |
| F-6-1 | Fixed: visitor pages contain no artwork-provenance claim. |
| F-6-2 | Fixed: both 404 implementations use the direct H1 “Page not found”. |
| F-6-3 | Fixed: the boundary H2 is “Import the checked copy yourself”. |

No earlier finding is unfixed, half-fixed, or regressed.

## Structure, links, accessibility, and visual identity

| Route | HTTP | Title | H1 | Canonical |
|---|---:|---|---|---|
| `/` | 200 | ICS Intake Checker — Check files before import | Check an ICS file before calendar import | `/` |
| `/demo` | 200 | Demo — ICS Intake Checker | Inspect a sample calendar file | `/demo` |
| `/privacy` | 200 | Privacy — ICS Intake Checker | Your event details stay on this device | `/privacy` |
| `/terms` | 200 | Terms — ICS Intake Checker | Use checked copies with care | `/terms` |
| unknown URL | 404 | Page not found — ICS Intake Checker | Page not found | `/404` |

- Every route has `lang=en`, one H1, one main, a description, canonical, OG/Twitter metadata, SVG favicon, and Apple touch icon. The product image is 768 × 512 and the social image is 1200 × 630.
- All discovered links returned 200, including the identified external Param Factory link. The intentional missing route returned 404.
- Direct deep links load. Back/Forward restore the correct route, title, H1 focus, and live announcement. The skip link is first in keyboard order.
- The shared header/footer includes Privacy and Terms on every route, including the status-404 document.
- The deployed CSP is a response header, matches observed requests, and includes `frame-ancestors 'none'`. HSTS, `nosniff`, referrer policy, and permissions policy are present.
- The full live suite found zero serious or critical Axe violations. The factory URL verifier reported the correct title, `lang`, one H1, one main, complete alt text, named buttons, and no console errors.
- The production JavaScript and CSS byte-match the clean build. JavaScript is 31.58 KB raw / 11.15 KB gzip; CSS is 15.51 KB raw / 4.43 KB gzip. `npm run build` produced `dist/`.
- The deep-ink grid, cyan route line, amber finding edges, clipped inspection panes, mono labels, asymmetric composition, and original calendar-specimen art match `.factory/design.md`. The result is recognizably product-specific, not a generic SaaS template. Reduced motion is supported.

## Full verification

- Clean-clone `npm test`: **34/34 passed** across desktop and 390 px Chromium.
- Clean-clone `npm run build`: **PASS**; `dist/index.html` exists.
- Production `PLAYWRIGHT_BASE_URL=https://ics-intake-checker.sociobot.in npm test`: **34/34 passed**.
- Live URL verifier: **PASS**, 1,971 ms load, no console errors.
- Live asset parity: JS, CSS, service worker, manifest, and 404 SHA-256 hashes match the clean build.
- Live route crawl: all valid routes and assets returned 200; the unknown route returned 404.

## Missed leverage

No missing feature is implied by the brief. The product already supports drag/drop, file selection, pasted ICS text, checked-copy export for three calendar apps, local restoration, and offline use. Deterministic parsing is appropriate here; an AI step would add uncertainty and key/privacy overhead without improving the stated job. Account sync would conflict with the local checked-copy boundary.

## What would make this perfect

Nothing remains within the researched brief or factory contract. The appropriate next action is to retain the current behavior and regression suite.
