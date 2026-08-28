# Adversarial first-read review 2 — ICS Intake Checker

**Date:** 2026-08-28  
**Live URL:** https://ics-intake-checker.sociobot.in  
**Reviewed commit:** `7b3ee4d87d964e04e6ccb260faf8a965470a74f0`  
**Verdict:** **FAIL**

The first-read, one-click demo, prior-finding regression, local build, and declared test-command checks pass. The product cannot pass this round because the `risk-detection` claim remains only partly verified, the used workspace contains several more-specific unlisted claims, and the real HTTP-404 document omits required route metadata and the common site shell. Two smaller plain-language defects also remain in the used workspace and root title.

## Findings

### Major

#### F-2-1 — The `risk-detection` claim test does not cover every advertised risk family

- **Exact quote/location:** `.factory/claims.json`, `risk-detection`: “Checks structure, IDs, times, timezones, repeat rules, duplicates, invitation modes, people, alarms, and links.” Its only tagged test is `tests/app.spec.ts:119–125`.
- **Evidence:** The test asserts structure, cancellation/invitation, invalid time, repeat rule, link, repeated ID, and duplicate. It does not assert a timezone finding, an attendee/organizer finding, or an alarm finding. The command passes because those outcomes are absent from its assertions.
- **Why this fails:** A visitor can rely on the complete list, but the required one tagged test for that claim does not verify three listed parts. The sample-preflight test happens to cover some of them, but it is not the declared `risk-detection` test.
- **Concrete fix:** Expand `@claim:risk-detection` with a fixture that produces timezone, attendee/organizer, and alarm findings, and assert each observable finding. Keep the assertion in this tagged test or split the public claim into separately claimed and tested statements.

#### F-2-2 — Detailed repair and calendar-app promises are unlisted claims

- **Exact quote/location:** Used workspace copy in `src/main.ts:77–82, 110–113`: “Prevents repaired events from importing twice.” “Adds the current UTC time to events without a stamp.” “Stops this export from adding notifications.” “Exports event details without a reply request.” “Uses the line format expected by calendar apps.” “Keeps standard timezone and repeat fields for Google Calendar import.”
- **Evidence:** None of these statements appears as a claim in `.factory/claims.json`. `repair-export` verifies selected byte changes, but not prevention of a duplicate import, that the added stamp is the current UTC time, or the claimed calendar-line expectation. `calendar-export` only checks filenames and `METHOD:PUBLISH` for Outlook.
- **Why this fails:** These are specific promises a visitor sees while choosing repairs or a destination. A general “selected repairs are applied” entry does not prove the safety/compatibility effects described here.
- **Concrete fix:** Either replace these lines with direct, already-verified descriptions (for example, “Adds an event ID to this downloaded copy”) or add exact claims and fixture tests for every retained outcome. For the calendar-app text, assert the relevant output fields for Apple, Google, and Outlook.

#### F-2-3 — The real 404 response lacks the required shared shell and route metadata

- **Exact quote/location:** `https://ics-intake-checker.sociobot.in/definitely-missing-review-path` returns HTTP 404 and serves `public/404.html:1`.
- **Evidence:** The page has one `h1`, a styled recovery link, title, and theme color. It has no meta description, canonical link, Open Graph/Twitter metadata, favicon or Apple-touch link, skip link, header/navigation, or footer with Privacy and Terms. The regular `/`, `/demo`, `/privacy`, and `/terms` routes include these elements.
- **Why this fails:** The route is correctly non-successful, but it is not a fully formed product route. Shared recovery/navigation and discoverability metadata disappear exactly when a visitor lands on a broken link.
- **Concrete fix:** Make the status-404 document include the same self-hosted metadata and a compact shared header/footer (wordmark home link, Privacy, Terms, build id), while retaining status 404 and the designed recovery content. Add a deployment-level 404 metadata/shell assertion.

### Minor

#### F-2-4 — “Route the copy” and “Fingerprint” use unexplained workspace jargon

- **Exact quote/location:** Sample workspace, `src/main.ts:92` label “Fingerprint”; `src/main.ts:100` section kicker “Route the copy”.
- **Why this fails:** “Route” does not identify a download/export action, and a calendar-file recipient cannot infer what an event “Fingerprint” means from the label and opaque value.
- **Concrete fix:** Change “Route the copy” to “Choose a calendar app” or “Download a checked copy”. Change “Fingerprint” to “Matching details” and add a short explanation, or hide the implementation hash from the visitor-facing card.

#### F-2-5 — The root title uses a vague outcome word instead of the shown task

- **Exact quote/location:** `<title>` on `/`: “ICS Intake Checker — Check calendar files safely”; `src/main.ts:117`.
- **Why this fails:** “Safely” does not say what the tool actually does and is less plain than the visible headline. Search, history, and screen-reader users get weaker context than landing-page visitors.
- **Concrete fix:** Use `ICS Intake Checker — Check files before import` (49 characters), matching the actual job and the required product-name/em-dash/plain-words pattern.

## Cold first read

### 390 × 844 fresh context, before scrolling — PASS

- **What it does:** Checks an ICS calendar file before I import it.
- **For whom:** People who receive calendar files and want to check them before importing.
- **What to click first:** **Try it with sample data**.
- **Visible exact text:** “Check an ICS file before calendar import”; “For people who receive calendar files and want to check risks before importing them.”; “Try it with sample data”. The three plain facts were also visible. There was no horizontal overflow and no console error.

### 1440 × 900 fresh context, before scrolling — PASS

- **What it does:** Checks an ICS calendar file before import.
- **For whom:** People who receive calendar files and need to find risks first.
- **What to click first:** **Try it with sample data**.
- **Result:** The same three exact strings were visible with the purpose-specific inspection illustration; no console error occurred.

## Demo and sandbox check

- The landing action reaches `/demo` in one click. Its first screen is already a populated, realistic three-event sample: `sample-clinic-and-vendor.ics`, 10 findings, the event preview, and repair/export controls.
- The live demo banner reads “Demo — sample data, nothing is saved” and includes **Reset demo** and **Return to my file**. It remains sticky on the local mobile verification path.
- In a fresh live mobile context, I seeded `real-private.ics`, entered demo, changed the app and a repair, reset, reloaded the sample, and exited. Reset restored Apple Calendar and unchecked the repair. The IndexedDB record before and after was byte-for-byte identical, and real mode immediately restored the real file.
- The clean-clone `@claim:offline-reload` test uses the demo route, waits for the service worker, disables network, reloads, and passes. `@claim:local-only` intercepts requests during the demo and passes with no foreign request. The direct live cold/demo capture likewise recorded no external request or console error.

## Claims and local verification

Clean clone: `/tmp/ics-intake-checker-review-2-clean` at `7b3ee4d87d964e04e6ccb260faf8a965470a74f0`; `npm ci` completed with 0 vulnerabilities.

| Claim ID | Declared command | Result |
|---|---|---|
| `sample-preflight` | `npm test -- --grep @claim:sample-preflight` | Pass |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | Pass |
| `local-only` | `npm test -- --grep @claim:local-only` | Pass |
| `repair-export` | `npm test -- --grep @claim:repair-export` | Pass |
| `risk-detection` | `npm test -- --grep @claim:risk-detection` | Pass, incomplete coverage: F-2-1 |
| `calendar-export` | `npm test -- --grep @claim:calendar-export` | Pass |
| `paste-intake` | `npm test -- --grep @claim:paste-intake` | Pass |
| `local-restore` | `npm test -- --grep @claim:local-restore` | Pass |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | Pass |
| `no-third-party-runtime` | `npm test -- --grep @claim:no-third-party-runtime` | Pass |

`npm test` then passed all 24 desktop/mobile checks; `npm run build` passed and produced `dist/index.html`. No declared command failed. F-2-1 and F-2-2 are coverage and claim-inventory failures, not false reports of a red test.

## Copy audit

Counts use whitespace-separated displayed words. This table includes headings, labels, actions, and sentence fragments so button and heading wording is checked too. No landing or README string exceeds 22 words. The flags are the findings above.

### Landing route (`/`), default state

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| ICS Intake Checker | 3 | Pass |
| Demo | 1 | Pass |
| Privacy | 1 | Pass |
| Check a calendar file | 4 | Pass |
| Check an ICS file before calendar import | 7 | Pass |
| For people who receive calendar files and want to check risks before importing them. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | Listed: `sample-preflight` |
| Event details stay in this browser. | 6 | Listed: `local-only` |
| Works offline after the first visit. | 6 | Listed: `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | Listed: `repair-export` |
| Inspect the file. | 3 | Pass |
| Download only a copy you trust. | 6 | Pass |
| Check your file privately | 5 | Pass |
| Open a calendar file here | 5 | Pass |
| Drop an .ics file | 4 | Pass |
| or choose one from this device | 6 | Pass |
| The checker reads the file in this browser. | 8 | Listed: `local-only` |
| It never opens embedded links. | 5 | Listed: `local-only` |
| Paste ICS text | 3 | Listed: `paste-intake` |
| Three steps | 2 | Pass |
| How the checker works | 4 | Pass |
| Open the file | 3 | Pass |
| Drop a calendar file, choose one, or paste its text. | 10 | Listed: `paste-intake` |
| Read each finding | 3 | Pass |
| Check times, repeats, people, alarms, links, and duplicates. | 8 | Listed: `risk-detection`; coverage gap F-2-1 |
| Export a copy | 3 | Pass |
| Apply optional cleanup and download for your calendar app. | 9 | Listed: `repair-export`, `calendar-export` |
| What the checker cannot do | 5 | Pass |
| You choose what happens next | 6 | Pass |
| The checker prepares a checked copy. | 6 | Listed: `repair-export` |
| You decide whether to import it. | 6 | Pass |
| It shows embedded links as text. | 6 | Listed: `local-only` |
| It does not open them. | 5 | Listed: `local-only` |
| Check and repair an ICS file before calendar import. | 9 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.1 · build 2026.08 | 4 | Pass |
| Original generated illustration. | 3 | Pass |

### README

| Copy | Words | Result |
|---|---:|---|
| ICS Intake Checker | 3 | Pass |
| Check and repair an ICS file before calendar import. | 9 | Pass |
| ICS Intake Checker is for people who receive calendar files from schools, clinics, conferences, and vendors. | 16 | Pass |
| It previews events and explains common import risks. | 8 | Listed: `risk-detection` |
| Choose fixes for a downloaded copy for Apple Calendar, Google Calendar, or Outlook. | 14 | Listed: `repair-export`, `calendar-export` |
| Try the isolated sample at `/demo`. | 6 | Pass |
| The sample includes a clinic appointment and duplicate vendor workshops. | 9 | Pass |
| Demo work does not change your saved real file. | 9 | Listed: `demo-isolation` |
| What it checks | 3 | Pass |
| Calendar structure, event IDs, start and end times | 8 | Listed: `risk-detection` |
| Floating and unknown timezones | 4 | Listed: `risk-detection`; coverage gap F-2-1 |
| Repeat rules that are invalid or never end | 8 | Listed: `risk-detection` |
| Repeated event IDs and events with matching details | 8 | Listed: `risk-detection` |
| Invitations that request a reply and files that cancel events | 10 | Listed: `risk-detection` |
| Attendee addresses, organizer addresses, alarms, and external links | 7 | Listed: `risk-detection`; coverage gap F-2-1 |
| The app can add missing IDs and creation stamps. | 9 | Listed broadly: `repair-export` |
| It can remove people, alarms, or invitation mode from the downloaded copy. | 12 | Listed broadly: `repair-export` |
| Event details stay in the browser, and the app does not open embedded links. | 13 | Listed: `local-only` |
| The latest real file survives refresh until you choose **Forget this file**. | 12 | Listed: `local-restore` |
| The app works offline after the first visit. | 8 | Listed: `offline-reload` |
| Run locally | 2 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Open `http://localhost:4173`. | 1 | Pass |
| For a one-click populated workspace, open `http://localhost:4173/demo` or `http://localhost:4173/?demo=1`. | 7 | Pass |
| Test and build | 3 | Pass |
| `npm test` builds the site and runs claims, accessibility, keyboard, mobile, route, repair, and offline checks in Chromium. | 17 | Pass |
| `npm run build` creates the static site in `dist/`, with `index.html` at its root. | 13 | Pass |
| Privacy and storage | 3 | Pass |
| Parsing and repair run in the browser. | 7 | Listed: `local-only`, `repair-export` |
| Real-mode files use one IndexedDB record named `latest` in the `ics-intake-checker` database. | 10 | Pass — implementation/storage detail |
| Demo mode uses bundled in-memory data and does not change that record. | 11 | Listed: `demo-isolation` |
| There are no analytics, remote fonts, or third-party runtime scripts. | 9 | Listed: `no-third-party-runtime` |
| Use **Forget this file** or clear site data in your browser to remove the saved record. | 15 | Listed: `local-restore` |
| See Privacy and Terms. | 4 | Pass |
| Deployment | 1 | Pass |
| Deploy `dist/` as a static site. | 6 | Pass |
| `staticwebapp.config.json` rewrites the four valid application routes and serves a status-404 document for unknown paths. | 12 | Pass — deployment detail |
| The service worker caches the built application shell for offline use. | 10 | Listed: `offline-reload` |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| The original generated illustration is documented in `.factory/design.md`. | 8 | Pass |

The loaded sample workspace adds the two jargon flags in F-2-4 and the claim inventory flags in F-2-2.

## History regression check

Every earlier finding F-1-1 through F-1-29 was checked in current source and on the live product, not merely accepted from `.factory/polish-1.md`.

| Earlier IDs | Current verification |
|---|---|
| F-1-1 to F-1-5 | Pass: demo branch never clears the real record; live byte comparison passed; sticky banner/reset/return behavior works; unknown route returns 404. |
| F-1-6 to F-1-10 | Pass: sample assertions now include all six named families; repair test compares the original; calendar test loops all three apps; demo isolation is declared and tested. |
| F-1-11 to F-1-16 | Pass: untested Free/No-account copy is absent; access/sync copy is narrowed; third-party claim is declared; controls have 44 px checks. |
| F-1-17 to F-1-28 | Pass: the cited preflight/route/deck/stops/boundary wording and README terminology/length defects are fixed in live/current source. |
| F-1-29 | Pass: the visible **Paste ICS text** path uses the normal parser/storage path and its tagged test passes. |

No earlier finding is reissued with its F-1 id. F-2-1 and F-2-2 are new, more-specific claim-audit defects exposed by the completed claim inventory.

## Structure, accessibility, and visual checks

- `/`, `/demo`, `/privacy`, and `/terms` have one H1, main landmark, route-specific title/description/canonical, OG/Twitter data, favicon, consistent header/footer, deep-link loads, and valid 200 responses. Browser back returned demo from Privacy, and route focus behavior is covered by the passing suite.
- The unknown URL returns a real HTTP 404, has a designed recovery view, and its home link returns 200. Its omissions are F-2-3.
- All links collected from the five checked routes returned 200 or were same-page anchors; the external Param Factory link returned 200.
- The fresh live browser capture had no console/page errors, no external request, and no mobile horizontal overflow. The clean suite includes zero serious/critical axe violations, target-size checks, keyboard skip-link, reduced motion, and offline reload.
- The visual identity is distinct and matches the design record: a dark gridded inspection field, cyan/amber instrument colors, clipped glass panels, original calendar-specimen art, and restrained motion. It is not a generic SaaS card/gradient treatment.
- The brief describes a deterministic ICS inspection and repair task. AI would add no obvious useful step here; no decorative AI feature or embedded provider key was found.

## What would make this perfect

1. Make every specific repair and calendar-app promise either demonstrably tested or more modestly worded.
2. Put all risk families promised by `risk-detection` in its one tagged fixture/assertion set.
3. Give the status-404 document the same navigation, legal exits, and metadata as every other route.
4. Replace the remaining workspace jargon and align the root title with the visible job statement.
