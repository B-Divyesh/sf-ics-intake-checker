# Adversarial first-read review 5 — ICS Intake Checker

**Date:** 2026-08-28

**Live URL:** https://ics-intake-checker.sociobot.in

**Reviewed source:** `e859bd010d4492a98b9629147fe9177a2c653956`

**Verdict:** **FAIL**

The product is clear on first read, opens a useful sample in one click, keeps demo work isolated, and passes every declared claim test. It does not meet the required zero-finding standard because the landing paste flow makes an exact 5 MB claim without a claim entry or boundary test. No blocking finding was found.

## Finding

### Minor

#### F-5-1 — The exact 5 MB intake limit is an unlisted, untested claim

- **Exact quotes/locations:** Expanded paste form on `/`: “Paste up to 5 MB of ICS text.” File error: “That file is larger than 5 MB.” Paste error: “That text is larger than 5 MB.” Sources: `src/main.ts:68`, `src/main.ts:196`, and `src/main.ts:204`.
- **Evidence:** `.factory/claims.json` has no size-limit claim. `rg -n "5 MB|5_000_000" tests .factory/claims.json` finds the copy and implementation but no browser assertion. The existing `@claim:paste-intake` test submits only a small valid fixture; it does not exercise 5,000,000 or 5,000,001 bytes. The parser also shows “Review the source before importing more than 5 MB of calendar data” at `src/ics.ts:153`, but the UI rejects such input before that parser path is reached.
- **Why this fails:** A visitor can rely on a precise quantitative limit. The claims contract requires the number to be listed and tested at its boundary. A green `paste-intake` test does not prove the advertised limit.
- **Concrete fix:** Add one `intake-size-limit` claim covering chosen files and pasted text. Its single tagged test should prove that 5,000,000-byte input reaches checking and that 5,000,001-byte input is rejected with the stated next step for both intake paths. Remove or reconcile the unreachable parser warning. Alternatively, remove the number from visitor copy and errors.

## Cold first read

Fresh Chromium contexts were opened without cookies or storage and without scrolling. Screenshots were captured as `/tmp/review5-mobile-cold.png` and `/tmp/review5-desktop-cold.png`.

### 390 × 844 — PASS

- **What it does:** Checks an ICS calendar file for risks before import.
- **For whom:** People who receive calendar files and want to inspect them before importing.
- **First click:** **Try it with sample data**.

The exact first-screen text that answers these questions is “Check an ICS file before calendar import”, “For people who receive calendar files and want to check risks before importing them”, and “Try it with sample data”. The action, its outcome line, and all three plain facts appear before the first screen ends. The illustration begins below the facts; it does not displace the task or action.

### 1440 × 900 — PASS

The answers are the same. The complete headline, audience sentence, primary action, action outcome, three facts, and purpose-built inspection illustration fit before scrolling.

The cold root request returned 200. Its only requests were the page, same-origin JS, same-origin CSS, and the same-origin illustration. No console error occurred.

## Copy audit

Counts below use whitespace-separated displayed words. Punctuation and hyphenated terms remain attached to their word. Inline URLs and filenames count as one word. No sentence exceeds 22 words and no banned marketing adjective appears. Headings make sense out of context, and actions use result-naming verbs. F-5-1 is the sole copy/claim flag.

### Landing sentences (`/`)

| Sentence | Words | Result |
|---|---:|---|
| For people who receive calendar files and want to check risks before importing them. | 14 | Pass |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | `sample-preflight` |
| Event details stay in this browser. | 6 | `local-only` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | `repair-export` |
| A glass calendar file passes over a lit inspection table before import. | 12 | Clear image alt |
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

### Interactive landing copy and errors

| Sentence | Words | Result |
|---|---:|---|
| Paste up to 5 MB of ICS text. | 8 | **F-5-1** |
| It is checked in this browser. | 6 | `paste-intake`, `local-only` |
| That file is not an ICS calendar. | 7 | Clear error |
| Choose a file ending in .ics. | 6 | Clear next step |
| That file is larger than 5 MB. | 7 | **F-5-1** |
| Choose a smaller calendar file. | 5 | Clear next step |
| The file could not be read. | 6 | Clear error |
| Save it again as plain-text ICS, then retry. | 8 | Clear next step |
| Paste ICS calendar text, then choose Check pasted text. | 9 | Clear next step |
| That text is larger than 5 MB. | 7 | **F-5-1** |
| Paste a smaller calendar file. | 5 | Clear next step |

### Landing headings, labels, and actions

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Clear link |
| ICS Intake Checker | 3 | Product name |
| Demo | 1 | Clear navigation label |
| Privacy | 1 | Clear navigation label |
| Check a calendar file | 4 | Clear task label |
| Check an ICS file before calendar import | 7 | Clear H1; under nine words |
| Try it with sample data | 5 | Clear sample action |
| Check your file privately | 4 | Clear section label |
| Open a calendar file here | 5 | Clear heading |
| Drop an .ics file | 4 | Clear intake instruction |
| or choose one from this device | 6 | Clear intake instruction |
| Paste ICS text | 3 | Result-naming action |
| Paste calendar file text | 4 | Clear form label |
| Check pasted text | 3 | Result-naming action |
| Three steps | 2 | Clear section label |
| How the checker works | 4 | Clear heading |
| Open the file | 3 | Clear step heading |
| Read each finding | 3 | Clear step heading |
| Export a copy | 3 | Clear step heading |
| What the checker cannot do | 5 | Clear limitation label |
| You choose what happens next | 5 | Clear heading |
| Terms | 1 | Clear navigation label |
| Built by Param Factory (external site) | 6 | External destination identified |

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
| `staticwebapp.config.json` rewrites the four valid application routes and serves a status-404 document for unknown paths. | 15 | Verified deployment detail |
| The service worker caches the built site so it can reload offline. | 11 | `offline-reload` |
| MIT. | 1 | License statement |
| The original generated illustration is documented in `.factory/design.md`. | 8 | Verified provenance |

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
| Run locally | 2 | Clear developer heading |
| Test and build | 3 | Clear developer heading |
| Privacy and storage | 3 | Clear heading |
| Deployment | 1 | Clear developer heading |
| License | 1 | Clear heading |

Terminology is consistent in visitor copy: **calendar file**, then **file**; **event**; **finding**; **fix**; **checked copy**, then **copy**; and **calendar app**. “ICS”, “IndexedDB”, “service worker”, and `staticwebapp.config.json` occur only where the file format or developer documentation requires the technical name. They do not replace a plain-language task description.

## Demo and sandbox verification

- The root primary action opens `/demo` in one click. With no extra scroll, mobile shows the demo banner, sample heading, realistic filename, and `3 events / 0 stop issues / 4 warnings / 5 notices`; desktop additionally shows the first finding and event preview. Screenshots: `/tmp/review5-mobile-demo-first.png` and `/tmp/review5-desktop-demo-first.png`.
- The persistent banner says “Demo — sample data, nothing is saved” and keeps **Reset demo** and **Return to my file** visible. It is sticky at the top.
- The sample contains a clinic follow-up and duplicate vendor workshops, with invitation, timezone, repeat, attendee, alarm, external-link, and duplicate findings.
- Reset restored Apple Calendar, cleared the selected people fix, collapsed raw source, restored the sample filename, and kept the banner.
- In a live 390 px context, `must-survive.ics` was saved in `ics-intake-checker/files/latest`. Its name and source bytes were identical before demo, during demo, after reset/reload, and after exit. **Return to my file** immediately restored it.
- A separate clean context opened `/demo` directly with no IndexedDB databases and empty local/session storage. Demo state is in memory.
- The whole live demo flow produced only same-origin requests. Embedded links remained text and were not requested.
- After the first live `/demo` visit and service-worker readiness, disabling the context network and reloading kept the sample and demo banner usable.
- `/?demo=1` redirects to `/demo` and loads the same populated sandbox.

Demo and storage behavior pass. The only open issue is the separate quantitative intake claim in F-5-1.

## Claims verification

Every command in `.factory/claims.json` was run separately from fresh clone `/tmp/ics-review5-clean-hbcNMR`. Each command ran the tagged test in desktop and mobile Chromium.

| Claim | Result | Observable evidence |
|---|---|---|
| `sample-preflight` | PASS | One click opened three events and all seven named finding families. |
| `event-preview` | PASS | Both uploaded event titles and rendered start dates appeared. |
| `demo-isolation` | PASS | Reset, reload, Return, wordmark, Back, Privacy, and Terms exits preserved the seeded real record. |
| `local-only` | PASS | Embedded link stayed text; no foreign request or navigation occurred. |
| `repair-export` | PASS | Download bytes changed as selected; stored and reloaded original bytes did not. |
| `risk-detection` | PASS | The malformed fixture produced every advertised risk family. |
| `calendar-export` | PASS | Apple, Google, and Outlook checked copies had the asserted names and destination output. |
| `paste-intake` | PASS | Pasted fixture populated the checker and the real-mode record. It does not cover the 5 MB boundary (F-5-1). |
| `local-restore` | PASS | Refresh restored the latest file; Forget removed it. |
| `offline-reload` | PASS | Demo reloaded after the context went offline. |
| `no-third-party-runtime` | PASS | All application routes and the 404 used same-origin runtime resources only. |

No listed claim test failed. F-5-1 is the only unlisted claim found in the landing, loaded checker, legal copy, metadata, or README.

## Earlier-finding regression check

Every earlier review and polish report was read. Each finding was checked against both current source and the deployed site.

### Review 1

| ID | Status in round 5 |
|---|---|
| F-1-1 | Fixed. Live seeded-record byte checks confirm demo reset/reload cannot delete real storage; `db('clear')` is not used by demo reload. |
| F-1-2 | Fixed. The complete banner is sticky and viewport-visible on mobile and desktop. |
| F-1-3 | Fixed. Live Reset restores source, filename, Apple destination, fixes, and disclosure state. |
| F-1-4 | Fixed. Valid deep links return 200; the tested unknown path returns 404 with recovery UI. |
| F-1-5 | Fixed. Every tested demo exit restores the saved real file; the dedicated action says **Return to my file**. |
| F-1-6 | Fixed. `@claim:sample-preflight` asserts every named sample family. |
| F-1-7 | Fixed. `@claim:repair-export` compares stored and reloaded original bytes. |
| F-1-8 | Fixed. `@claim:calendar-export` covers all three calendar apps. |
| F-1-9 | Fixed. README isolation wording is listed and the live seeded-record check passes. |
| F-1-10 | Fixed. Demo non-persistence is the `demo-isolation` claim; the direct demo context creates no user-data store. |
| F-1-11 | Fixed. “Free” is absent from live and source copy. |
| F-1-12 | Fixed. “No account” is absent from live and source copy. |
| F-1-13 | Fixed. Broad calendar-access wording remains removed; copy describes the checked-copy workflow. |
| F-1-14 | Fixed. Unsupported import/sync promises remain removed; link behavior is listed and tested. |
| F-1-15 | Fixed. `no-third-party-runtime` is listed and passed on all routes; live request logs were same-origin. |
| F-1-16 | Fixed. Source uses 44 px minimums; mobile tests and live measurements pass for banner, wordmark, and legal/footer controls. |
| F-1-17 | Fixed. Live eyebrow says “Check a calendar file”. |
| F-1-18 | Fixed. Live audience copy names checking risks before import. |
| F-1-19 | Fixed. Live caption says “Download only a copy you trust.” |
| F-1-20 | Fixed. Intake label says “Check your file privately”. |
| F-1-21 | Fixed. Process label says “Three steps”. |
| F-1-22 | Fixed. Heading says “How the checker works”. |
| F-1-23 | Fixed. Limitation label says “What the checker cannot do”. |
| F-1-24 | Fixed. The complete current audit above has no sentence over 22 words. |
| F-1-25 | Fixed. Copy names fixes to a downloaded copy; “reversible cleanup” is absent. |
| F-1-26 | Fixed. “Event fingerprints” is absent from visitor copy. |
| F-1-27 | Fixed. Invitation/cancellation wording states the file behavior plainly. |
| F-1-28 | Fixed. The current terminology table consistently uses calendar file, then file. |
| F-1-29 | Fixed. **Paste ICS text** is live, uses the common parser, and passes `paste-intake`; its separate size claim is F-5-1. |

### Review 2

| ID | Status in round 5 |
|---|---|
| F-2-1 | Fixed. The tagged malformed fixture asserts timezone, people, alarm, and every other advertised family. |
| F-2-2 | Fixed. Workspace help describes direct output bytes; `repair-export` and `calendar-export` pass. |
| F-2-3 | Fixed. The live 404 has description, canonical, OG/Twitter metadata, icons, skip link, shared header/footer, legal links, and recovery action. |
| F-2-4 | Fixed. “Fingerprint” and “Route the copy” are absent; headings are “Event preview” and “Choose a calendar app”. |
| F-2-5 | Fixed. Root title is “ICS Intake Checker — Check files before import”. |

### Review 3

| ID | Status in round 5 |
|---|---|
| F-1-1 | Fixed again. Wordmark, Back, Privacy, Terms, Return, reset, and reload paths preserve and restore the real record. |
| F-1-5 | Fixed again. Ordinary demo exits no longer leak sample state into real mode. |
| F-3-1 | Fixed. Live Privacy → Back → Forward focuses the destination H1; source uses the shared focus path. |
| F-3-2 | Fixed. Full keyboard tests confirm reset, reload, Forget, and paste-close focus restoration. |
| F-3-3 | Fixed. Invitation is listed in `sample-preflight` and asserted after one click. |
| F-3-4 | Fixed. Invitation detail names the `METHOD` line removed from the downloaded copy. |
| F-3-5 | Fixed. Missing-ID detail names the generated UID added to the copy. |
| F-3-6 | Fixed. Floating-time detail names the missing TZID/UTC suffix. |
| F-3-7 | Fixed. Creation-stamp detail names the UTC DTSTAMP added to the copy. |
| F-3-8 | Fixed. `repair-export` proves people and alarm blocks remain by default and leave only when selected. |
| F-3-9 | Fixed. Alarm copy describes the block and its removal, not downstream notifications. |
| F-3-10 | Fixed. README names only asserted sample families; the sample test confirms event count and titles. |
| F-3-11 | Fixed. Visitor copy consistently calls optional changes “fixes”. |
| F-3-12 | Fixed. README says “open the checked sample in one click”. |
| F-3-13 | Fixed. README says “Outside the demo” rather than “real-mode files”. |
| F-3-14 | Fixed. README uses “scripts from other sites”; the claim test passes. |
| F-3-15 | Fixed. README states the observable offline reload outcome. |
| F-3-16 | Fixed. Footer visibly says “Built by Param Factory (external site)”. |

### Review 4

| ID | Status in round 5 |
|---|---|
| F-4-1 | Fixed. `event-preview` is listed exactly once and its two-event title/date test passed in both projects. |

No earlier finding is unfixed, half-fixed, or regressed. None is reissued.

## Structure, links, identity, and accessibility

| Route | HTTP | Title | H1 | Canonical |
|---|---:|---|---|---|
| `/` | 200 | ICS Intake Checker — Check files before import | Check an ICS file before calendar import | `/` |
| `/demo` | 200 | Demo — ICS Intake Checker | Inspect a sample calendar file | `/demo` |
| `/privacy` | 200 | Privacy — ICS Intake Checker | Your event details stay on this device | `/privacy` |
| `/terms` | 200 | Terms — ICS Intake Checker | Use checked copies with care | `/terms` |
| unknown path | 404 | Page not found — ICS Intake Checker | This calendar file took a wrong turn | `/404` |

- Every route has `lang=en`, one H1, one main landmark, a route-specific description/title/canonical, OG/Twitter metadata, SVG favicon, and 180 px Apple touch icon.
- The OG image is a real 1200 × 630 product-art JPEG. `robots.txt` and `sitemap.xml` return 200; the sitemap lists all four valid routes.
- Every discovered internal link and the identified Param Factory external link returned 200. The deliberate missing route returned 404. No dead link was found.
- Header/footer structure is consistent, includes Privacy and Terms, and labels the external destination. The static 404 keeps the same shell and recovery path.
- Deep links load directly. Back/forward restore the correct route and focus its H1. The skip link is first in keyboard order.
- Live Axe scans found zero serious or critical violations on `/`, `/demo`, `/privacy`, `/terms`, and the designed 404. The mobile pages had no horizontal overflow.
- `/opt/fleet/lib/verify-url.sh` passed the live root with title, `lang`, one H1, main, image alt, named-button, and zero-console-error checks; output was written to `/tmp/ics-review5-verify-T5OL6S`.
- Valid live routes emitted no console errors. Chromium reports the expected failed-resource diagnostic for the deliberately requested 404 document itself; there is no application exception or missing subresource.
- `npm test` passed 30/30 across desktop and 390 px Chromium. `npm run build` passed and produced `dist/`. Built JS is 31.82 KB raw / 11.23 KB gzip; CSS is 15.58 KB raw / 4.46 KB gzip.
- The deep-ink inspection grid, clipped glass panes, cyan route line, amber warning bar, mono data labels, and original calendar-specimen art match `.factory/design.md`. The composition is recognizably product-specific and not a generic centered-hero/feature-card template. Reduced motion is handled in CSS.

## Missed leverage

No missed-leverage finding is justified. The brief calls for deterministic ICS inspection and repair. The product already supports file selection, drag/drop, pasted text, checked-copy export, three calendar-app destinations, and offline use. AI would make rule-based validation less predictable and would add privacy/cost setup without an implied user benefit. Account sync would contradict the explicit local checked-copy handoff.

## What would make this perfect

Close F-5-1: declare the 5 MB behavior and add one exact boundary test for both file and paste intake, or remove the numeric promise. Then rerun every claim command and this full checklist. No other change is indicated by this round.
