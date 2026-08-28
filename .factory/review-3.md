# Adversarial first-read review 3 — ICS Intake Checker

**Date:** 2026-08-28  
**Live URL:** https://ics-intake-checker.sociobot.in  
**Reviewed commit:** `060b7d39dc4904bedf68291fa11697355b8db145`  
**Verdict:** **FAIL**

The cold first screen is clear at both required viewports, and the normal one-click demo path is populated, offline-capable, and visually distinct. The product still fails. Leaving the demo through the wordmark or browser Back preserves the sample after the demo banner disappears. A subsequent **Forget this file** click deletes a hidden real file. This regresses the safety invariant behind F-1-1 and F-1-5. The deployed demo also contains unlisted calendar-behaviour claims, and keyboard focus is lost on Back and several rerendering controls.

## Findings

### Blocking

#### F-1-1 — Reissued: demo state can still lead to deletion of a saved real file

- **Exact text/location:** `/demo` banner: “Demo — sample data, nothing is saved”; header link: “ICS Intake Checker”; resulting `/` control: “Forget this file”. Code: `src/main.ts:236-245`.
- **Evidence:** In a fresh 390 px live context, I saved `must-survive.ics` and byte-read its `ics-intake-checker/files/latest` IndexedDB record. I entered `/demo`, then chose the header wordmark. The URL became `/`, the demo banner disappeared, and `sample-clinic-and-vendor.ics` remained loaded while `must-survive.ics` was hidden. Choosing **Forget this file** then deleted the real IndexedDB record. Reload showed the empty intake.
- **Why this fails:** The sample has crossed into real mode without disclosure. A control attached to that leaked sample deletes unrelated real data. The earlier repair protects only the dedicated **Return to my file** path, not every way out of the demo.
- **Concrete fix:** Make every transition from demo to a non-demo route discard all sample state before rendering. When the destination is `/`, load the real IndexedDB record before showing the workspace. Never let a demo-originated workspace render with `state.demo === false`. Extend `@claim:demo-isolation` to seed a real record and byte-compare it after leaving through the wordmark, browser Back, Privacy → wordmark, Terms → wordmark, and **Return to my file**, including a click on every resulting clear/reset control.

#### F-1-5 — Reissued: ordinary demo exits hide the existing real file

- **Exact text/location:** `/demo` header wordmark and browser Back; `src/main.ts:236-258`. The dedicated button says “Return to my file”, but other route exits bypass `returnToRealFile()`.
- **Evidence:** With `must-survive.ics` saved, choosing the wordmark from `/demo` showed `sample-clinic-and-vendor.ics` at `/` with no demo banner and no visible real file. Starting at `/`, choosing **Try it with sample data**, then browser Back produced the same leaked sample at `/`. A hard reload restored the real file only if **Forget this file** had not already deleted it.
- **Why this fails:** The visitor cannot tell that the visible sample is disposable or that a real file remains underneath it. The header and Back button are normal exit paths, so the dedicated exit button is not a complete repair.
- **Concrete fix:** Centralize route transitions. If the old route is `/demo` and the new route is not, clear sample state and restore the real record before rendering. Add explicit Back/forward and header/footer navigation assertions to the demo-isolation claim test.

### Major

#### F-3-1 — Browser Back restores `/demo` without moving focus to its H1

- **Exact location:** Live sequence `/demo` → **Privacy** → browser Back; `src/main.ts:256-258`.
- **Evidence:** Back restored `/demo` and the correct H1, but `document.activeElement` was `<body>`. The `/demo` popstate branch calls `loadDemo()`, whose render path does not request focus. Forward navigation to Privacy did focus its H1.
- **Why this fails:** A keyboard or screen-reader visitor receives no reliable route-change focus target after Back, contrary to the routing contract.
- **Concrete fix:** Let `loadDemo` accept route-change focus or call a shared render-and-focus function after loading the sample. Add an assertion that Back and forward focus the destination H1, not only that its text appears.

#### F-3-2 — Reset, reload, clear, and paste-close actions drop keyboard focus

- **Exact locations:** **Reset demo**, **Reload sample file**, **Forget this file**, and the closing state of **Paste ICS text**; `src/main.ts:243-250`.
- **Evidence:** Activating **Reset demo** with Enter replaced the focused button and left `document.activeElement` on `<body>`. Closing **Paste ICS text** did the same. The same render pattern is used by reload and forget.
- **Why this fails:** Keyboard users lose their place after common actions and must restart navigation from the document.
- **Concrete fix:** After Reset/Reload, focus the newly rendered equivalent button; after Forget, focus “Open a calendar file here” or the file input; after closing paste, focus the new **Paste ICS text** button. Add keyboard assertions for each action.

#### F-3-3 — The demo introduction makes an unlisted sample-content claim

- **Exact quote/location:** `/demo`: “The sample contains invitation details, attendee addresses, an alarm, a repeat rule, and a floating time.”
- **Why this fails:** `sample-preflight` lists timezone, repeat, attendee, alarm, link, and duplicate risks, but not invitation details. Its tagged test does not assert the invitation finding. `risk-detection` tests invitation handling on another fixture, not this sample.
- **Concrete fix:** Add invitation mode to the `sample-preflight` claim and assert “This is an invitation (REQUEST)” after the one click, or remove invitation details from this sentence.

#### F-3-4 — The invitation advice is an unlisted calendar-app claim

- **Exact quote/location:** `/demo`, first finding: “Import it only if you want to respond through your calendar app.” Source: `src/ics.ts:163`.
- **Why this fails:** No claim entry or sandbox test proves what importing a `METHOD:REQUEST` file will do in the named calendar apps.
- **Concrete rewrite:** “This file contains `METHOD:REQUEST`. Remove that line from the downloaded copy if you do not need it.” The existing repair test can verify that byte-level statement.

#### F-3-5 — The missing-ID advice is an unlisted duplicate-import claim

- **Exact quote/location:** `/demo`: “A calendar may import it more than once. Add a generated ID before export.” Source: `src/ics.ts:197`.
- **Why this fails:** `repair-export` proves that a UID is added; it does not prove duplicate-import behaviour in Apple Calendar, Google Calendar, or Outlook.
- **Concrete rewrite:** “This event has no UID. Add a generated ID to the downloaded copy.”

#### F-3-6 — The floating-time explanation is an unlisted calendar-app claim

- **Exact quote/location:** `/demo`: “It will use the timezone of the calendar that imports it. Confirm the shown local time.” Source: `src/ics.ts:204`.
- **Why this fails:** The claim promises importer behaviour but has no entry or cross-calendar sandbox test.
- **Concrete rewrite:** “The start time has no TZID or UTC `Z` suffix. Confirm the shown local time before import.”

#### F-3-7 — “Better duplicate handling” is an unlisted outcome claim

- **Exact quote/location:** `/demo`: “Add a UTC DTSTAMP for better duplicate handling.” Source: `src/ics.ts:207`.
- **Why this fails:** The test proves that a stamp is added, not that downstream duplicate handling improves.
- **Concrete rewrite:** “This event has no DTSTAMP. Add a UTC creation stamp to the downloaded copy.”

#### F-3-8 — Default attendee retention is not covered by the repair claim test

- **Exact quote/location:** `/demo`: “These addresses stay in the exported file unless you remove attendee details.” Source: `src/ics.ts:216`.
- **Why this fails:** `repair-export` verifies removal when the option is selected. It never exports with the option clear and asserts that attendee and organizer lines remain.
- **Concrete fix:** Add the default-retention assertion to `repair-export`, or rewrite the detail to the already tested action: “Remove attendee and organizer addresses from the downloaded copy.”

#### F-3-9 — The alarm wording makes an unlisted notification claim

- **Exact quotes/locations:** `/demo`: “Event 1 will add 1 alarm” and “Remove alarms if you do not want notifications after import.” Source: `src/ics.ts:217`.
- **Why this fails:** The test proves presence and removal of a `VALARM` block. It does not prove how each destination app will schedule notifications.
- **Concrete rewrite:** “Event 1 contains 1 alarm” and “Remove the alarm block from the downloaded copy if you do not need it.”

#### F-3-10 — The README’s sample-description claim is not tested as written

- **Exact quote/location:** `README.md:7`: “The sample includes a clinic appointment and duplicate vendor workshops.”
- **Why this fails:** The sample claim test asserts six finding families, but it does not assert the named clinic appointment, the vendor workshops, or the three-event sample composition.
- **Concrete fix:** Expand `sample-preflight` and its test to assert the three sample event titles/count, or narrow the README to the six tested finding families.

### Minor

#### F-3-11 — The same optional changes are called fixes, cleanup, repairs, and repair

- **Exact quotes/locations:** Landing: “Apply optional cleanup”; workspace: “Optional cleanup” and “Repairs to apply”; README: “Choose fixes”; footer/README: “repair”.
- **Why this fails:** The terminology table does not select one word for this concept, so a first-time visitor must infer that all four terms mean the same selectable changes.
- **Concrete rewrite:** Use **fixes** throughout: “Apply optional fixes”, “Optional fixes”, “Fixes to apply”, and “Check and fix an ICS file before calendar import.”

#### F-3-12 — “Populated workspace” is README jargon

- **Exact quote/location:** `README.md:29`: “For a one-click populated workspace, open …”
- **Why this fails:** “Workspace” is not a visitor-facing product term and “populated” does not say that the sample is already checked.
- **Concrete rewrite:** “To open the checked sample in one click, visit `http://localhost:4173/demo`.”

#### F-3-13 — “Real-mode files” is unexplained README jargon

- **Exact quote/location:** `README.md:42`: “Real-mode files use one IndexedDB record named `latest` in the `ics-intake-checker` database.”
- **Why this fails:** The interface says “your file”, not “real mode”.
- **Concrete rewrite:** “Outside the demo, the browser saves your latest file in the `latest` IndexedDB record.”

#### F-3-14 — “Third-party runtime scripts” is avoidable README jargon

- **Exact quote/location:** `README.md:42`: “There are no analytics, remote fonts, or third-party runtime scripts.”
- **Why this fails:** “Runtime scripts” is implementation language in a privacy promise.
- **Concrete rewrite:** “The app loads no analytics, remote fonts, or scripts from other sites.”

#### F-3-15 — “Application shell” is avoidable README jargon

- **Exact quote/location:** `README.md:48`: “The service worker caches the built application shell for offline use.”
- **Why this fails:** “Application shell” does not explain the observable outcome.
- **Concrete rewrite:** “The service worker caches the built site so it can reload offline.”

#### F-3-16 — The external footer link is not identified as external to visitors

- **Exact quote/location:** Footer link “Built by Param Factory”; `src/main.ts:38` has `rel="external"` but no visible or accessible indication.
- **Why this fails:** The site-structure contract requires external links to say so. The HTML relationship does not inform a screen-reader or visual visitor.
- **Concrete fix:** Use visible text “Built by Param Factory (external site)” or an accessible label with an explained external-link icon.

## Cold first read

### 390 × 844, fresh browser, before scrolling — PASS

- **What it does:** Checks an ICS calendar file before import.
- **For whom:** People who receive calendar files and want to check risks before importing.
- **What to click first:** **Try it with sample data**.
- **Exact visible text:** “Check an ICS file before calendar import”; “For people who receive calendar files and want to check risks before importing them.”; “Try it with sample data”; “See timezones, repeats, people, alarms, links, and duplicate risks.”
- **Measured viewport:** H1 bottom 380 px, audience sentence bottom 482 px, action bottom 563 px, three facts bottom 730 px. All fit within 844 px. `scrollWidth === clientWidth === 390`. No console or page error.

### 1440 × 900, fresh browser, before scrolling — PASS

- The same three answers were visible. The action ended at 745 px and the three facts at 849 px.
- The original glass-calendar inspection illustration was visible beside the copy. No horizontal overflow, console error, or page error occurred.

## Demo and sandbox

- The landing action opens `/demo` in one click.
- Its first screen is already in use: `sample-clinic-and-vendor.ics`, three events, ten findings, event previews, repair choices, and enabled export.
- The banner says “Demo — sample data, nothing is saved” and contains **Reset demo** and **Return to my file**.
- With reduced motion enabled and actual scroll positions 0, 700, 2200, and the document bottom, the banner remained fully visible at the viewport top on mobile and desktop.
- Reset restored Apple Calendar, cleared the selected attendee repair, and collapsed raw source. **Reload sample file** restored the bundled sample.
- The explicit **Return to my file** route byte-preserved and immediately restored a seeded real file.
- The wordmark and Back exit paths fail isolation and recovery as documented in F-1-1 and F-1-5.
- In a fresh context, the service worker controlled `/demo`; after network disable, reload retained the sample and banner. Request interception recorded no foreign origins.

## Claims

Clean clone: `/tmp/ics-review3-clean-Rsw4Ao` at `060b7d39dc4904bedf68291fa11697355b8db145`. `npm ci` completed with zero vulnerabilities. Every command below was run separately from that clone.

| Claim ID | Declared command | Command result | Audit result |
|---|---|---|---|
| `sample-preflight` | `npm test -- --grep @claim:sample-preflight` | PASS, 2 projects | Incomplete for the live invitation/sample-composition copy: F-3-3, F-3-10 |
| `demo-isolation` | `npm test -- --grep @claim:demo-isolation` | PASS, 2 projects | Live claim contradicted through untested wordmark/Back exits: F-1-1, F-1-5 |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS, 2 projects | Covered |
| `repair-export` | `npm test -- --grep @claim:repair-export` | PASS, 2 projects | Byte changes covered; extra outcome/default claims remain: F-3-5, F-3-7, F-3-8, F-3-9 |
| `risk-detection` | `npm test -- --grep @claim:risk-detection` | PASS, 2 projects | Listed families covered; extra downstream-app explanations remain unlisted: F-3-4 to F-3-9 |
| `calendar-export` | `npm test -- --grep @claim:calendar-export` | PASS, 2 projects | Covered |
| `paste-intake` | `npm test -- --grep @claim:paste-intake` | PASS, 2 projects | Covered |
| `local-restore` | `npm test -- --grep @claim:local-restore` | PASS, 2 projects | Normal flow covered; demo exit regression hides/deletes the saved file: F-1-1, F-1-5 |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS, 2 projects | Covered live and locally |
| `no-third-party-runtime` | `npm test -- --grep @claim:no-third-party-runtime` | PASS, 2 projects | Covered |

Each claim tag occurs exactly once. No declared command returned nonzero. The full clean-clone suite passed 24/24 checks in desktop and 390 px projects. `npm run build` passed and emitted `dist/index.html`; JavaScript was 11.18 KB gzip and CSS was 4.46 KB gzip. A passing under-scoped test does not override the reproduced live contradiction.

## Copy audit

Counts use whitespace-separated displayed words. Hyphenated terms, URLs, and `.ics` count as one word. Navigation labels, headings, button labels, fragments, and meaningful alt text are included so that context and action wording are also checked. No sentence exceeds 22 words and no banned marketing adjective appears. The flags below correspond to findings F-3-11 through F-3-15.

### Landing page, default state

| Copy | Words | Result |
|---|---:|---|
| Skip to main content | 4 | Pass |
| ICS Intake Checker | 3 | Pass |
| Demo | 1 | Pass — navigation label |
| Privacy | 1 | Pass — navigation label |
| Check a calendar file | 4 | Pass |
| Check an ICS file before calendar import | 7 | Pass |
| For people who receive calendar files and want to check risks before importing them. | 14 | Pass |
| Try it with sample data | 5 | Pass — permitted sample action |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | Listed: `sample-preflight` |
| Event details stay in this browser. | 6 | Listed: `local-only` |
| Works offline after the first visit. | 6 | Listed: `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | Listed: `repair-export` |
| A glass calendar file passes over a lit inspection table before import. | 12 | Pass — image alt |
| Inspect the file. | 3 | Pass |
| Download only a copy you trust. | 6 | Pass |
| Check your file privately | 4 | Pass |
| Open a calendar file here | 5 | Pass |
| Drop an .ics file | 4 | Pass |
| or choose one from this device | 6 | Pass |
| The checker reads the file in this browser. | 8 | Listed: `local-only` |
| It never opens embedded links. | 5 | Listed: `local-only` |
| Paste ICS text | 3 | Listed: `paste-intake`; result-naming verb |
| Three steps | 2 | Pass |
| How the checker works | 4 | Pass |
| Open the file | 3 | Pass |
| Drop a calendar file, choose one, or paste its text. | 10 | Listed: `paste-intake` |
| Read each finding | 3 | Pass |
| Check times, repeats, people, alarms, links, and duplicates. | 8 | Listed: `risk-detection` |
| Export a copy | 3 | Pass |
| Apply optional cleanup and download for your calendar app. | 9 | F-3-11 |
| What the checker cannot do | 5 | Pass |
| You choose what happens next | 5 | Pass |
| The checker prepares a checked copy. | 6 | Listed: `repair-export` |
| You decide whether to import it. | 6 | Pass |
| It shows embedded links as text. | 6 | Listed: `local-only` |
| It does not open them. | 5 | Listed: `local-only` |
| Check and repair an ICS file before calendar import. | 9 | F-3-11 |
| Terms | 1 | Pass — navigation label |
| Built by Param Factory | 4 | F-3-16 |
| v1.1 · build 2026.08 | 4 | Pass |
| Original generated illustration. | 3 | Pass |

### README

| Copy | Words | Result |
|---|---:|---|
| ICS Intake Checker | 3 | Pass |
| Check and repair an ICS file before calendar import. | 9 | F-3-11 |
| ICS Intake Checker is for people who receive calendar files from schools, clinics, conferences, and vendors. | 16 | Pass |
| It previews events and explains common import risks. | 8 | Listed: `risk-detection` |
| Choose fixes for a downloaded copy for Apple Calendar, Google Calendar, or Outlook. | 13 | F-3-11; claims listed |
| Try the isolated sample at `/demo`. | 6 | Pass |
| The sample includes a clinic appointment and duplicate vendor workshops. | 10 | F-3-10 |
| Demo work does not change your saved real file. | 9 | Listed but contradicted by F-1-1 |
| What it checks | 3 | Pass |
| Calendar structure, event IDs, start and end times | 8 | Listed: `risk-detection` |
| Floating and unknown timezones | 4 | Listed: `risk-detection` |
| Repeat rules that are invalid or never end | 8 | Listed: `risk-detection` |
| Repeated event IDs and events with matching details | 8 | Listed: `risk-detection` |
| Invitations that request a reply and files that cancel events | 10 | Listed: `risk-detection` |
| Attendee addresses, organizer addresses, alarms, and external links | 8 | Listed: `risk-detection` |
| The app can add missing IDs and creation stamps. | 9 | Listed: `repair-export` |
| It can remove people, alarms, or invitation mode from the downloaded copy. | 12 | Listed: `repair-export` |
| Event details stay in the browser, and the app does not open embedded links. | 14 | Listed: `local-only` |
| The latest real file survives refresh until you choose **Forget this file**. | 12 | Listed: `local-restore`; normal path passes |
| The app works offline after the first visit. | 8 | Listed: `offline-reload` |
| Run locally | 2 | Pass |
| Requirements: Node.js 20 or newer and npm. | 7 | Pass |
| Open `http://localhost:4173`. | 2 | Pass |
| For a one-click populated workspace, open `http://localhost:4173/demo` or `http://localhost:4173/?demo=1`. | 9 | F-3-12 |
| Test and build | 3 | Pass |
| `npm test` builds the site and runs claims, accessibility, keyboard, mobile, route, repair, and offline checks in Chromium. | 18 | Pass — developer instruction |
| `npm run build` creates the static site in `dist/`, with `index.html` at its root. | 14 | Pass — developer instruction |
| Privacy and storage | 3 | Pass |
| Parsing and repair run in the browser. | 7 | F-3-11 |
| Real-mode files use one IndexedDB record named `latest` in the `ics-intake-checker` database. | 12 | F-3-13 |
| Demo mode uses bundled in-memory data and does not change that record. | 12 | Listed: `demo-isolation`; transition gap F-1-1 |
| There are no analytics, remote fonts, or third-party runtime scripts. | 10 | F-3-14; listed: `no-third-party-runtime` |
| Use **Forget this file** or clear site data in your browser to remove the saved record. | 16 | Listed: `local-restore` |
| See Privacy and Terms. | 4 | Pass |
| Deployment | 1 | Pass |
| Deploy `dist/` as a static site. | 6 | Pass — developer instruction |
| `staticwebapp.config.json` rewrites the four valid application routes and serves a status-404 document for unknown paths. | 15 | Pass — developer instruction and verified |
| The service worker caches the built application shell for offline use. | 11 | F-3-15; listed: `offline-reload` |
| License | 1 | Pass |
| MIT. | 1 | Pass |
| The original generated illustration is documented in `.factory/design.md`. | 8 | Pass — provenance |

## Earlier-finding regression check

Every earlier finding was checked against current live behaviour and current source.

| Earlier ID | Review-3 result |
|---|---|
| F-1-1 | **BLOCKING, reissued.** The original demo clear button is fixed, but sample state can cross to `/` and the resulting clear control deletes the hidden real record. |
| F-1-2 | Fixed. Banner remains fully visible at real top/middle/bottom scroll positions on both viewports. |
| F-1-3 | Fixed. Reset restores destination, repair state, source disclosure, filename, and sample source. |
| F-1-4 | Fixed. Unknown live route returns HTTP 404 with the designed document. |
| F-1-5 | **BLOCKING, reissued.** The dedicated exit restores the real file; the wordmark and Back exits hide it behind leaked sample state. |
| F-1-6 | Fixed. Sample test asserts all six listed risk families. |
| F-1-7 | Fixed. Repair test byte-compares stored/reloaded original source. |
| F-1-8 | Fixed. Apple, Google, and Outlook exports are covered. |
| F-1-9 | Fixed as an inventory item. Demo isolation is listed, though the newly reproduced route gap contradicts it. |
| F-1-10 | Fixed as an inventory item. Demo non-persistence is listed and its dedicated exit is tested; route gap is reissued under F-1-1/F-1-5. |
| F-1-11 | Fixed. “Free” is absent. |
| F-1-12 | Fixed. “No account” is absent. |
| F-1-13 | Fixed. Broad calendar-access copy is absent. |
| F-1-14 | Fixed. Broad import/sync copy is absent. |
| F-1-15 | Fixed. No-third-party-runtime claim and tagged test exist and pass. |
| F-1-16 | Fixed. Checked mobile targets meet 44 px. |
| F-1-17 | Fixed. “Preflight” eyebrow is absent. |
| F-1-18 | Fixed. Audience sentence now says “before importing them.” |
| F-1-19 | Fixed. Caption says “Download only a copy you trust.” |
| F-1-20 | Fixed. Intake heading says “Check your file privately.” |
| F-1-21 | Fixed. Heading says “Three steps.” |
| F-1-22 | Fixed. Heading says “How the checker works.” |
| F-1-23 | Fixed. Boundary heading names what the checker cannot do. |
| F-1-24 | Fixed. No landing/README sentence exceeds 22 words. |
| F-1-25 | Fixed. “Reversible cleanup” is absent. |
| F-1-26 | Fixed. “Event fingerprints” is absent from visitor copy. |
| F-1-27 | Fixed. README explains invitation/cancellation conditions. |
| F-1-28 | Fixed for the uploaded document: “calendar file”, then “file”. |
| F-1-29 | Fixed. Paste intake is present and its claim test passes. |
| F-2-1 | Fixed. The risk fixture asserts timezone, people, and alarm findings as well as the other listed families. |
| F-2-2 | Fixed for its exact prior repair-deck quotes. New unlisted finding-detail claims are F-3-4 through F-3-9. |
| F-2-3 | Fixed. Live 404 has status 404, metadata, icons, skip link, header, footer, and legal exits. |
| F-2-4 | Fixed. “Fingerprint” and “Route the copy” are absent. |
| F-2-5 | Fixed. Root title is “ICS Intake Checker — Check files before import”. |

## Structure, links, accessibility, and visual identity

- `/`, `/demo`, `/privacy`, and `/terms` return 200. The unknown route returns 404.
- Each route has the expected title, one H1, one main, description, canonical, OG title/image, favicon, header, and footer. The social image is a real 1200×630 JPEG; the Apple icon is 180×180.
- `robots.txt` points to a sitemap that lists all four valid routes. Deep links load directly.
- All collected internal route links returned 200. `https://hello-factory.sociobot.in/` returned 200. The same-page skip link on the 404 correctly remains on the 404 response.
- The header/footer shell is consistent. The external-link disclosure defect is F-3-16.
- Route content and browser history work, but demo transition state and Back focus fail as described above.
- Live Axe scans found zero serious or critical violations. `verify-url.sh` reported title, `lang=en`, one H1, one main, zero missing image alts, zero unlabeled buttons, and no console errors. Its measured load was 909 ms.
- Reduced motion is supported. Mobile has no horizontal overflow. The keyboard focus-loss defects are F-3-1 and F-3-2.
- The identity is distinct: dark inspection grid, clipped glass surfaces, cyan/amber instrument palette, original glass-calendar art, and product-specific warning route. It is not a generic centered SaaS gradient/card template.
- Response headers include HSTS, nosniff, strict-origin referrer policy, permissions policy, and a same-origin CSP matching the observed requests.

## Missed leverage

No AI feature is indicated. ICS structure inspection and byte-level repair are deterministic, privacy-sensitive tasks; an AI step would add uncertainty without closing an obvious user need. The brief-implied high-value inputs and outputs are present: file selection, drag/drop, pasted text, checked export, local restore, and offline demo. No provider key or decorative AI feature was found.

## What would make this perfect

1. Make demo state impossible to render without the demo banner, and restore the real record on every exit path before exposing real-data controls.
2. Test all demo exits, Back/forward focus, and focus continuity after every rerendering action.
3. Remove or formally list and test every downstream calendar-behaviour claim; prefer observable ICS-byte descriptions where cross-app outcomes cannot be sandboxed.
4. Standardize the optional-change vocabulary and remove the remaining README jargon.
5. Identify the external footer destination in visible or accessible text.

Until all findings are closed, the required zero-finding standard is not met.
