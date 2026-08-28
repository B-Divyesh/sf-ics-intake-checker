# Adversarial first-read review 1 — ICS Intake Checker

**Date:** 2026-08-28

**Live URL:** https://ics-intake-checker.sociobot.in

**Reviewed source:** `ab600f34b1aa39638095cd4b48af29ef1866136c`
**Verdict:** **FAIL**

The landing page passes the cold first-read test, the declared claim commands pass, and the core checker is immediately usable. The product still fails because demo mode can delete a real saved file, its demo notice is not persistent, Reset is incomplete, and unknown URLs return HTTP 200. There are also unlisted or incompletely tested claims, copy defects, undersized touch targets, and one design-promised intake path that is absent.

## Findings

### Blocking

#### F-1-1 — A demo control deletes the user's real saved file

- **Exact text/location:** `/demo`, workspace button: “Forget this file”; demo banner: “Demo — sample data, nothing is saved”; `src/main.ts:211`.
- **Evidence:** In a fresh 390 px context, I uploaded `must-survive.ics` in real mode and confirmed the `latest` IndexedDB record. I entered `/demo`, then chose **Forget this file**. The record became empty. After choosing **Start for real** and reloading, the real file was gone. The shared handler always calls `db('clear')`, including while `state.demo` is true.
- **Why this fails:** A visitor is explicitly told that demo actions are isolated. A control that appears to forget the sample instead erases hidden real data.
- **Concrete fix:** In demo mode, make this control clear or reload only in-memory demo state and never call the real database. Prefer the label **Reload sample file** in demo. Add a claim test that seeds a real record, enters demo, exercises every demo control, exits, reloads, and byte-compares the real record.

#### F-1-2 — The required demo banner disappears while the demo is being used

- **Exact text/location:** `/demo`: “Demo — sample data, nothing is saved”; `src/style.css:147` has no sticky or fixed positioning.
- **Evidence:** After the one-click sample navigation settled at the populated checker on 390 × 844, `scrollY` was 525 and the banner rectangle was `top=-525`, `bottom=-440`; it was entirely outside the viewport. It likewise disappears while scrolling through the long findings and repair controls.
- **Why this fails:** The visitor cannot tell that they are editing disposable sample data at the point where they make changes or export. The demo-sandbox requirement calls for a persistent banner.
- **Concrete fix:** Keep the complete notice and both actions in a sticky, viewport-visible bar throughout `/demo`, without covering focused content. Test its viewport intersection at the top, middle, and bottom on mobile and desktop.

#### F-1-3 — “Reset demo” does not reset the whole demo

- **Exact text/location:** `/demo`, button “Reset demo”; `src/main.ts:213` reparses the sample but does not reset `state.destination`.
- **Evidence:** I changed **Calendar app** from Apple Calendar to Outlook, selected **Remove attendee details**, and chose **Reset demo**. The repair checkbox reset, but the destination remained `outlook`.
- **Why this fails:** Reset promises a known clean sample state. Leaving a consequential export choice behind makes later results depend on earlier demo actions.
- **Concrete fix:** Reset the destination, repair options, sample source, filename, and any expanded or transient UI state to documented defaults. Add an assertion for every mutable demo field.

#### F-1-4 — Unknown routes are successful HTTP responses, not real 404s

- **Exact text/location:** `https://ics-intake-checker.sociobot.in/definitely-missing-review-path`; `public/staticwebapp.config.json:2-3`.
- **Evidence:** The unknown URL renders the designed “This calendar file took a wrong turn” view but returns HTTP **200**. The navigation fallback serves `index.html` before the configured response override can produce a 404.
- **Why this fails:** Crawlers, caches, link checkers, and assistive tooling are told that a nonexistent page is valid. This is broken 404 routing, despite the styled UI.
- **Concrete fix:** Configure the host so unknown routes return the designed 404 document with status 404 while `/demo`, `/privacy`, and `/terms` remain valid deep links. Add a deployment-level test that asserts both the status and the recovery link.

### Major

#### F-1-5 — “Start for real” hides an existing real file until reload

- **Exact text/location:** `/demo`, button “Start for real”; `src/main.ts:214` clears in-memory state without reading the saved real record.
- **Evidence:** With `private-real.ics` saved, entering demo left its IndexedDB record intact. Choosing **Start for real** showed “Open a calendar file here”; only a page reload restored `private-real.ics`.
- **Why this fails:** A visitor can reasonably conclude that their real work disappeared. The button does not return them to their actual real-mode state.
- **Concrete fix:** On exit, discard demo state and restore the latest real record before rendering. Rename the button to **Return to my file**, or **Open my own file** when no real record exists.

#### F-1-6 — The sample-preflight claim test does not test most of its claim

- **Exact claim:** `.factory/claims.json`: “The sample shows timezone, repeat, attendee, alarm, and link risks in one click.”
- **Evidence:** `tests/app.spec.ts:16-25` asserts timezone, attendee, an unclaimed duplicate, and export availability. It does not assert the promised repeat, alarm, or link findings.
- **Why this fails:** A green tagged test can coexist with three missing promised outcomes, so the claim is not fully verified.
- **Concrete fix:** In the single `@claim:sample-preflight` test, assert all five named risk families after the one click.

#### F-1-7 — The repair-export test does not prove that the original is unchanged

- **Exact claim:** `.factory/claims.json`: “Selected repairs are applied to a downloaded copy without changing the original.”
- **Evidence:** `tests/app.spec.ts:39-58` checks only the downloaded bytes. It does not compare the original source or reload the stored original after repair/export.
- **Why this fails:** Half of the privacy/safety promise is untested.
- **Concrete fix:** Save a real fixture, export repairs, then verify the stored and reloaded original is byte-for-byte unchanged.

#### F-1-8 — The three-calendar export claim tests only Outlook

- **Exact claim:** `.factory/claims.json`: “Exports a checked ICS copy for Apple Calendar, Google Calendar, or Outlook.”
- **Evidence:** `tests/app.spec.ts:60-73` selects only `outlook` and asserts only the Outlook filename and `METHOD:PUBLISH` behavior.
- **Why this fails:** Apple Calendar and Google Calendar remain untested parts of the listed claim.
- **Concrete fix:** Parameterize the tagged test across Apple, Google, and Outlook and assert each filename and destination-specific output.

#### F-1-9 — The README makes an unlisted storage claim that live behavior disproves

- **Exact quote/location:** `README.md:42`: “Demo mode uses bundled in-memory data and never reads or writes that record.”
- **Why this fails:** No claim entry states or tests this promise, and **Forget this file** in demo deletes that real record (F-1-1).
- **Concrete fix:** Correct the behavior first. Then add a `demo-isolation` claim and the seeded-real-data test described in F-1-1.

#### F-1-10 — Demo non-persistence is an unlisted claim

- **Exact quotes/locations:** `README.md:7`: “Demo work is not saved.” Privacy route: “Demo data uses a separate in-memory workspace and is never saved.”
- **Why this fails:** Neither sentence has a matching `.factory/claims.json` entry or a storage-isolation test. The existing `local-only` test observes network requests only.
- **Concrete fix:** Add the `demo-isolation` claim and verify no demo action creates, overwrites, or deletes the real IndexedDB record.

#### F-1-11 — “Free” is an unlisted claim

- **Exact quote/location:** landing first screen: “Free.”
- **Why this fails:** Visitors can rely on this pricing statement, but `.factory/claims.json` has no corresponding entry.
- **Concrete fix:** Remove it or add a maintained pricing/access claim with a testable source of truth.

#### F-1-12 — “No account” is an unlisted claim

- **Exact quote/location:** landing first screen: “No account.”
- **Why this fails:** Account-free access is a testable product promise but has no claim entry.
- **Concrete fix:** Add a claim test that reaches the complete real and demo flows in a fresh context without authentication, or remove the sentence.

#### F-1-13 — Calendar non-access is an unlisted claim

- **Exact quotes/locations:** landing heading: “This checker does not access calendars”; terms: “The app does not access, change, or sync your calendars.”
- **Why this fails:** The `local-only` claim covers event details and embedded links, not calendar permissions or calendar-account access.
- **Concrete fix:** Add a `no-calendar-access` claim and test that no permission, account, or calendar API is invoked throughout import, repair, and export; otherwise narrow the copy.

#### F-1-14 — Import and sync non-actions are only partially listed

- **Exact quote/location:** landing: “It does not import events, sync accounts, or open links from a file.”
- **Why this fails:** Only the embedded-link portion is represented in `local-only`; import and account sync are not listed or tested.
- **Concrete fix:** Cover the whole sentence in the `no-calendar-access` claim/test, or rewrite it to the already-tested link behavior.

#### F-1-15 — The README's third-party-runtime claim is unlisted

- **Exact quotes/locations:** `README.md:42`: “There are no accounts, analytics, remote fonts, or third-party runtime scripts.” Privacy route: “It uses no analytics, advertising, third-party scripts, or remote fonts.”
- **Why this fails:** The same-origin demo test is useful evidence, but no claims entry states this broader promise and it does not crawl every route.
- **Concrete fix:** Add a `no-third-party-runtime` claim and intercept all routes and demo actions, or remove/narrow the sentences.

#### F-1-16 — Several mobile touch targets are below 44 px

- **Exact locations:** `/demo` at 390 px. **Reset demo** and **Start for real** measured 39 px high; the home wordmark measured 38 px; footer Privacy, Terms, and Built by Param Factory links measured 25 px high. `src/style.css:150` explicitly sets demo buttons to 38 px minimum.
- **Why this fails:** These controls miss the attached accessibility baseline of 44 × 44 px and are harder to operate one-handed.
- **Concrete fix:** Give each standalone interactive target a minimum 44 px hit box. Keep checkbox inputs inside their existing larger label hit areas. Add a mobile bounding-box test.

### Minor copy and scope findings

#### F-1-17 — “Calendar attachment preflight” uses unexplained specialist language

- **Exact quote/location:** landing eyebrow: “Calendar attachment preflight”.
- **Why this fails:** “Preflight” is an aviation/production metaphor rather than the user's task.
- **Concrete rewrite:** “Check a calendar file”.

#### F-1-18 — “Choosing the right calendar” is ambiguous

- **Exact quote/location:** landing lede: “For people who receive calendar files and need to spot risky details before choosing the right calendar.”
- **Why this fails:** It can mean choosing a calendar service, not deciding whether and where to import the file.
- **Concrete rewrite:** “For people who receive calendar files and want to check risks before importing them.”

#### F-1-19 — “Route only the copy you trust” obscures the action

- **Exact quote/location:** landing illustration caption: “Route only the copy you trust.”
- **Why this fails:** “Route” does not name anything the UI lets a visitor do.
- **Concrete rewrite:** “Download only a copy you trust.”

#### F-1-20 — “Private intake deck” is jargon

- **Exact quote/location:** landing checker kicker: “Private intake deck”.
- **Why this fails:** It does not make sense as a standalone heading and introduces an unexplained metaphor.
- **Concrete rewrite:** “Check your file privately”.

#### F-1-21 — “Three stops” is an unclear heading

- **Exact quote/location:** landing process kicker: “Three stops”.
- **Why this fails:** The section contains steps, not stops.
- **Concrete rewrite:** “Three steps”.

#### F-1-22 — “How the preflight works” repeats unexplained jargon

- **Exact quote/location:** landing heading: “How the preflight works”.
- **Why this fails:** The heading is less direct than the product's established word “checker”.
- **Concrete rewrite:** “How the checker works”.

#### F-1-23 — “Clear boundary” does not identify its section

- **Exact quote/location:** landing section kicker: “Clear boundary”.
- **Why this fails:** Heard in a heading list, it does not say whose boundary or what limitation follows.
- **Concrete rewrite:** “What the checker cannot do”.

#### F-1-24 — One README sentence exceeds the 22-word cap

- **Exact quote/location:** `README.md:5`: “It previews the events, explains common import risks, offers reversible cleanup, and exports a checked copy for Apple Calendar, Google Calendar, or Outlook.” — **23 words**.
- **Why this fails:** It combines preview, explanation, cleanup, and export in one sentence.
- **Concrete rewrite:** “It previews events and explains common import risks. You can clean up a copy for Apple Calendar, Google Calendar, or Outlook.”

#### F-1-25 — “Reversible cleanup” is vague README jargon

- **Exact quote/location:** `README.md:5`: “offers reversible cleanup”.
- **Why this fails:** The UI has no undo history; the intended safety property is that only the downloaded copy changes.
- **Concrete rewrite:** “lets you choose fixes for a downloaded copy”.

#### F-1-26 — “Event fingerprints” is unexplained jargon

- **Exact quote/location:** `README.md:14`: “Duplicate event IDs and matching event fingerprints”.
- **Why this fails:** A non-technical reader cannot tell that this means events with matching content.
- **Concrete rewrite:** “Repeated event IDs and events with matching details”.

#### F-1-27 — “Invitation and cancellation modes” is unexplained jargon

- **Exact quote/location:** `README.md:15`: “Invitation and cancellation modes”.
- **Why this fails:** “Mode” does not tell the reader that a file may ask for a reply or cancel an event.
- **Concrete rewrite:** “Invitations that request a reply and files that cancel events”.

#### F-1-28 — The same uploaded object has three names

- **Exact locations:** landing uses “calendar files”, “attachment”, and “file”; README uses “event files”, “calendar files”, “attachment”, and “file”.
- **Why this fails:** This contradicts the repository's own terminology table, which selects “file”, and makes “event file” sound like a different format.
- **Concrete fix:** Use **calendar file** on first reference and **file** afterward. Reserve **event** for a VEVENT inside the file.

#### F-1-29 — The design-promised paste path is missing

- **Exact source/location:** `.factory/design.md`: “Drop, paste, or file selection feeds the same parser.” The live intake offers only “Drop an .ics file” and “or choose one from this device”; `src/main.ts:207-210` has change and drop handlers but no paste handler.
- **Why this fails:** People often receive ICS text in email or support tools and the source-of-truth design explicitly includes paste intake.
- **Concrete fix:** Add a clearly labelled **Paste ICS text** input or paste action that uses the same parser, size/error handling, local storage policy, and claim coverage. An AI feature is not indicated; deterministic parsing is the appropriate core behavior here.

## Cold first read

### 390 × 844, fresh context, before scrolling

- **What it does:** Checks an ICS calendar file before import.
- **For whom:** People who receive calendar files and want to spot risky details before choosing an import destination.
- **What to click first:** **Try it with sample data**.
- **Result:** PASS. The exact headline was “Check an ICS file before calendar import”; the audience sentence and sample action were visible, followed by privacy, offline, and price/account facts. There was no horizontal overflow and no console error.

### 1440 × 900, fresh context, before scrolling

- **What it does:** Checks an ICS calendar file before import.
- **For whom:** People who receive calendar files and need to inspect risks.
- **What to click first:** **Try it with sample data**.
- **Result:** PASS. The same three answers were visible without scrolling, with the product-specific inspection illustration.

## Copy audit

Counts treat hyphenated strings, URLs, `.ics`, and product names separated by spaces as individual displayed words. Repeated navigation labels are counted once; commands in code blocks are not sentences. Landing average: **5.18 words**. README average: **8.32 words**. No banned marketing word appears. All landing actions name a result; the allowed sample action is present.

### Landing page

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| ICS Intake Checker | 3 | Pass |
| Demo | 1 | Pass — navigation label |
| Privacy | 1 | Pass — navigation label |
| Terms | 1 | Pass — navigation label |
| Calendar attachment preflight | 3 | F-1-17, F-1-28 |
| Check an ICS file before calendar import | 7 | Pass |
| For people who receive calendar files and need to spot risky details before choosing the right calendar. | 17 | F-1-18 |
| Try it with sample data | 5 | Pass |
| See timezones, repeats, people, alarms, and duplicate risks. | 8 | Pass |
| Event details stay in this browser. | 6 | Listed claim: `local-only` |
| Works offline after the first visit. | 6 | Listed claim: `offline-reload` |
| Free. | 1 | F-1-11 |
| No account. | 2 | F-1-12 |
| Inspect the attachment. | 3 | F-1-28 |
| Route only the copy you trust. | 6 | F-1-19 |
| Private intake deck | 3 | F-1-20 |
| Open a calendar file here | 5 | Pass |
| Drop an .ics file | 4 | Pass |
| or choose one from this device | 6 | Pass |
| The checker reads the file in this browser. | 8 | Listed claim: `local-only` |
| It never opens embedded links. | 5 | Listed claim: `local-only` |
| Three stops | 2 | F-1-21 |
| How the preflight works | 4 | F-1-22 |
| Open the file | 3 | Pass |
| Drop an attachment or choose it from this device. | 9 | F-1-28 |
| Read each finding | 3 | Pass — established product term |
| Check times, repeats, people, alarms, links, and duplicates. | 8 | Listed claim: `risk-detection` |
| Export a copy | 3 | Pass |
| Apply optional cleanup and download for your calendar. | 8 | Listed claims: `repair-export`, `calendar-export` |
| Clear boundary | 2 | F-1-23 |
| This checker does not access calendars | 6 | F-1-13 |
| It does not import events, sync accounts, or open links from a file. | 13 | F-1-14 |
| It checks one attachment and prepares a new copy for you. | 11 | F-1-28; listed by `risk-detection`/`repair-export` |
| Check and repair an ICS file before calendar import. | 9 | Pass |
| Built by Param Factory | 4 | Pass |
| v1.0 · build 2026.08 | 4 | Pass |
| Original generated illustration. | 3 | Pass — provenance |

### README

| Copy | Words | Result |
|---|---:|---|
| ICS Intake Checker | 3 | Pass |
| Check and repair an ICS file before calendar import. | 9 | Pass |
| ICS Intake Checker is for people who receive event files from schools, clinics, conferences, and vendors. | 16 | F-1-28 |
| It previews the events, explains common import risks, offers reversible cleanup, and exports a checked copy for Apple Calendar, Google Calendar, or Outlook. | 23 | F-1-24, F-1-25 |
| Try the isolated sample at /demo. | 6 | Pass |
| The sample includes a clinic appointment and a duplicated vendor workshop. | 11 | Pass |
| Demo work is not saved. | 5 | F-1-10 |
| What it checks | 3 | Pass |
| Calendar structure, event IDs, start and end times | 8 | Listed claim: `risk-detection` |
| Floating and unknown timezones | 4 | Listed claim: `risk-detection` |
| Repeat rules that are invalid or never end | 8 | Listed claim: `risk-detection` |
| Duplicate event IDs and matching event fingerprints | 7 | F-1-26; listed claim: `risk-detection` |
| Invitation and cancellation modes | 4 | F-1-27; listed claim: `risk-detection` |
| Attendee addresses, organizer addresses, alarms, and external links | 8 | Listed claim: `risk-detection` |
| The app can add missing IDs and creation stamps. | 9 | Listed claim: `repair-export` |
| It can also remove people, alarms, or invitation mode from the downloaded copy. | 13 | Listed claim: `repair-export` |
| Event details stay in the browser, and the app does not open embedded links. | 14 | Listed claim: `local-only` |
| The latest real file survives refresh until you choose Forget this file. | 12 | Listed claim: `local-restore`; contradicted in demo by F-1-1 |
| The app works offline after the first visit. | 8 | Listed claim: `offline-reload` |
| Run locally | 2 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass — developer context |
| Open http://localhost:4173. | 2 | Pass |
| For a one-click populated workspace, open http://localhost:4173/demo. | 7 | Pass |
| Test and build | 3 | Pass |
| npm test starts the production preview and runs claim, accessibility, keyboard, mobile, repair, and offline checks in Chromium. | 18 | Pass |
| npm run build creates the static site in dist/, with index.html at its root. | 14 | Pass |
| Privacy and storage | 3 | Pass |
| Parsing and repair run in the browser. | 7 | Listed claims: `local-only`, `repair-export` |
| Real-mode files use one IndexedDB record named latest in the ics-intake-checker database. | 12 | Pass — developer storage detail |
| Demo mode uses bundled in-memory data and never reads or writes that record. | 13 | F-1-9 |
| There are no accounts, analytics, remote fonts, or third-party runtime scripts. | 11 | F-1-15 |
| Use Forget this file or clear site data in your browser to remove the saved record. | 16 | Pass as instruction; demo ambiguity is F-1-1 |
| See Privacy and Terms. | 4 | Pass |
| Deployment | 1 | Pass |
| Deploy the contents of dist/ as a static site. | 9 | Pass — developer instruction |
| staticwebapp.config.json supplies SPA routing, security headers, asset caching, and the 404 rewrite. | 12 | F-1-4 for the ineffective 404 behavior |
| The service worker caches the built application shell for offline use. | 11 | Listed claim: `offline-reload` |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| The original generated illustration is documented in .factory/design.md. | 8 | Pass — verified provenance |

### Terminology check

| Concept | Terms found | Required term |
|---|---|---|
| Uploaded calendar document | `calendar file`, `event file`, `attachment`, `file` | `calendar file` once, then `file` |
| VEVENT record | `event` | `event` |
| Diagnostic | `finding` | `finding` |
| Downloaded result | `copy`, `checked copy` | `checked copy` once, then `copy` |
| Destination | `calendar`, `calendar app` | `calendar app` |

## Demo and sandbox verification

- One-click sample path: **PASS**. From `/`, one click on **Try it with sample data** reached `/demo` and immediately showed `sample-clinic-and-vendor.ics`, 3 events, 10 findings, repairs, and an enabled download.
- Realistic data: **PASS**. The sample includes a clinic follow-up and duplicate vendor workshops with invitation, attendee, timezone, recurrence, alarm, link, UID, and timestamp findings.
- Demo notice persistence: **FAIL**, F-1-2.
- Reset: **FAIL**, F-1-3.
- Real data isolation: **FAIL**, F-1-1.
- Exit behavior: **FAIL**, F-1-5.
- Network isolation: **PASS**. No cross-origin request occurred during the inspected demo flow.
- Offline demo: **PASS**. After the service worker reported readiness, `/demo` reloaded with the context offline and retained the sample and demo notice.

## Claims verification

Every command below was run separately from a fresh local clone created from the reviewed repository.

| Claim ID | Command | Result |
|---|---|---|
| `sample-preflight` | `npm test -- --grep @claim:sample-preflight` | PASS, 2/2; coverage incomplete per F-1-6 |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS, 2/2 |
| `repair-export` | `npm test -- --grep @claim:repair-export` | PASS, 2/2; coverage incomplete per F-1-7 |
| `risk-detection` | `npm test -- --grep @claim:risk-detection` | PASS, 2/2 |
| `calendar-export` | `npm test -- --grep @claim:calendar-export` | PASS, 2/2; coverage incomplete per F-1-8 |
| `local-restore` | `npm test -- --grep @claim:local-restore` | PASS, 2/2 |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, 2/2 |

There was no declared test failure. F-1-6 through F-1-15 identify untested portions or unlisted claims that prevent a clean claim audit.

## History verification

No earlier `.factory/review-*.md` or `.factory/polish-*.md` file exists, so there is no earlier finding ID to carry forward.

The prior `.factory/handoff.md` and `.factory/verification.md` were read and checked. Their build, bundle, route rendering, axe, offline, metadata, and declared-test results reproduced. Their assertion that the demo is isolated was tested only in a fresh context with no real record. F-1-1 reproduces the missed existing-real-data path. Their “persistent” banner statement is contradicted by F-1-2.

## Structure, links, identity, and accessibility

- `/`, `/demo`, `/privacy`, and `/terms` returned 200, deep-linked correctly, had route-specific titles, one H1, one main, a consistent header/footer, updated descriptions and canonicals, and working back navigation.
- All crawled links and metadata assets returned 200: home, demo, privacy, terms, Param Factory, favicon, apple-touch icon, social preview, manifest, robots, and sitemap.
- The favicon, 180 × 180 apple-touch icon, and 1200 × 630 social image are present. The sitemap lists all four valid routes.
- The unknown route renders a coherent, branded recovery view, but its response status fails per F-1-4.
- No console or page errors occurred. `/opt/fleet/lib/verify-url.sh` passed with `lang=en`, one H1, one main, alt text, and labelled buttons.
- Playwright axe scans on five routes at 390 px found zero violations. Keyboard skip-link and route-heading focus checks passed. The manual touch-target check failed per F-1-16.
- Reduced-motion CSS is present. The live JavaScript byte-matches the clean build and is 10.95 KB gzip, below the budget.
- The luminous inspection-table art, asymmetric layout, clipped glass panels, cyan/amber status language, and grid background are distinct and match `.factory/design.md`; this is not a generic SaaS template.

## Missed leverage

F-1-29 is the only justified missed feature: pasted ICS input is promised by the design and fits the existing local parser. AI assistance would add privacy, cost, and nondeterminism without improving this rules-based validation job. Calendar sync would contradict the product's stated boundary. Existing checked-copy export is the right handoff.

## Quality-gate evidence

- Clean clone `npm test`: **18 passed** across desktop and 390 px projects.
- Clean clone `npm run build`: **PASS**; `dist/index.html` produced.
- Build sizes: JavaScript 29.94 KB raw / 10.95 KB gzip; CSS 14.81 KB raw / 4.29 KB gzip.
- Live JS and CSS SHA-256 hashes matched the clean build.
- Live offline reload: **PASS**.
- Live same-origin demo request capture: **PASS**.
- Live axe: zero violations across `/`, `/demo`, `/privacy`, `/terms`, and an unknown route.

## What would make this perfect

Resolve every finding above, beginning with demo isolation. The acceptance run should seed a real file before entering demo, exercise every demo control at mobile and desktop widths, confirm the record is unchanged, confirm a fully deterministic Reset, keep the notice visible throughout, and return to the real workspace. Then complete the claim matrix, replace the jargon and inconsistent terms, restore 44 px targets, add paste intake, and make the designed 404 return HTTP 404. A subsequent review must rerun the whole checklist and produce zero findings.
