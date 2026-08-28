# Polish 1 — cumulative finding closure

**Candidate repaired:** `5c6776e72c24cfe1f7266024462bf7541ccfa7e4`  
**Repair commit:** recorded in the handoff after push  
**Local evidence:** `npm test`, `npm run build`, `.factory/evidence/demo-desktop.png`, `.factory/evidence/demo-mobile.png`, `.factory/evidence/verify-local/verify.json`

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo clear is now **Reload sample file** and only reloads in-memory sample state. | `@claim:demo-isolation`; mobile and desktop; screenshot paths above. |
| F-1-2 | The complete demo notice and actions are sticky at viewport top. | Mobile viewport-intersection assertion in `demo bar stays visible…`; screenshots above. |
| F-1-3 | Reset rebuilds the sample, filename, repair state, destination, and disclosure state. | `@claim:demo-isolation`. |
| F-1-4 | Removed broad navigation fallback; exact valid SPA routes rewrite to the app and unknown paths serve `404.html` with 404. | Route-status assertion in `demo bar stays visible…`; local `curl` confirms 404. |
| F-1-5 | **Return to my file** loads the saved real record immediately after discarding demo memory. | `@claim:demo-isolation`. |
| F-1-6 | The sample claim now asserts timezone, repeat, attendee, alarm, link, and duplicate findings. | `@claim:sample-preflight`. |
| F-1-7 | Repair export now byte-compares IndexedDB and reloaded source against the original. | `@claim:repair-export`. |
| F-1-8 | Calendar export loops over Apple Calendar, Google Calendar, and Outlook. | `@claim:calendar-export`. |
| F-1-9 | README behavior is now true and indexed under `demo-isolation`. | `@claim:demo-isolation`. |
| F-1-10 | Demo non-persistence is listed and tested with a seeded real record. | `@claim:demo-isolation`. |
| F-1-11 | Removed the untested “Free” landing promise. | Current landing copy audit. |
| F-1-12 | Removed the untested “No account” landing promise. | Current landing copy audit. |
| F-1-13 | Narrowed calendar-access language to the tested checked-copy workflow. | `@claim:repair-export`; Terms route scan. |
| F-1-14 | Removed broad import/sync promise; retained only tested link and download behavior. | `@claim:local-only`, `@claim:repair-export`. |
| F-1-15 | Added the `no-third-party-runtime` claim and all-route request/origin test. | `@claim:no-third-party-runtime`. |
| F-1-16 | Wordmark, demo buttons, and footer links have 44 px hit areas. | Mobile bounding-box assertion in `demo bar stays visible…`. |
| F-1-17 | Replaced “Calendar attachment preflight” with “Check a calendar file.” | `.factory/copy-audit.md`. |
| F-1-18 | Rewrote the audience sentence to name checking risks before import. | `.factory/copy-audit.md`. |
| F-1-19 | Replaced “Route only…” with “Download only a copy you trust.” | `.factory/copy-audit.md`. |
| F-1-20 | Replaced “Private intake deck” with “Check your file privately.” | `.factory/copy-audit.md`. |
| F-1-21 | Replaced “Three stops” with “Three steps.” | `.factory/copy-audit.md`. |
| F-1-22 | Replaced “How the preflight works” with “How the checker works.” | `.factory/copy-audit.md`. |
| F-1-23 | Replaced “Clear boundary” with “What the checker cannot do.” | `.factory/copy-audit.md`. |
| F-1-24 | Split and rewrote the README product description under the 22-word cap. | `.factory/copy-audit.md`. |
| F-1-25 | Replaced “reversible cleanup” with specific downloaded-copy wording. | `.factory/copy-audit.md`. |
| F-1-26 | Replaced “event fingerprints” with “events with matching details.” | README and copy audit. |
| F-1-27 | Replaced “invitation and cancellation modes” with plain descriptions. | README and copy audit. |
| F-1-28 | Standardized visitor copy on “calendar file,” then “file.” | README, landing, demo, and copy audit. |
| F-1-29 | Added an accessible Paste ICS text intake form with 5 MB validation, common parser, real-mode storage, and claim coverage. | `@claim:paste-intake`. |

## Current checks

- `npm run build`: passes; `dist/index.html` exists.
- `npm test`: passes across desktop Chromium and 390 × 844 mobile projects.
- Factory verifier: `.factory/evidence/verify-local/verify.json` has no console errors, one H1, one main, `lang=en`, and zero images missing alt text.
- Live URL check is recorded in `.factory/handoff.md` after deployment.
