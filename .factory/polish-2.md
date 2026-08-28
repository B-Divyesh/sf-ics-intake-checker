# Polish 2 — cumulative finding closure

**Reviewed candidate:** `7b3ee4d87d964e04e6ccb260faf8a965470a74f0`  
**Repair commit:** `f054b22ba1ba1173d5202f276ecdfeea07f79004`
**Live evidence:** `https://ics-intake-checker.sociobot.in` and `.factory/evidence/polish-2-live/`

| Finding | Change made | Evidence |
|---|---|---|
| F-1-1 | Demo reload works only from bundled memory and never touches `files/latest`. | `@claim:demo-isolation`; live seeded-file check. |
| F-1-2 | Demo notice remains sticky with both actions at every scroll position. | Mobile target/visibility test; `.factory/evidence/polish-2-live/demo-mobile.png`. |
| F-1-3 | Reset restores source, name, repairs, destination, and disclosure state. | `@claim:demo-isolation`. |
| F-1-4 | Valid SPA paths rewrite normally while unknown paths return the static status-404 document. | Route-status test; live unknown-path curl. |
| F-1-5 | Returning from demo immediately restores the saved real file. | `@claim:demo-isolation`; live seeded-file check. |
| F-1-6 | One-click sample test asserts timezone, repeat, people, alarm, link, and duplicate findings. | `@claim:sample-preflight`. |
| F-1-7 | Repair export test compares the original stored and reloaded bytes. | `@claim:repair-export`. |
| F-1-8 | Calendar export test covers Apple, Google, and Outlook filenames and output behavior. | `@claim:calendar-export`. |
| F-1-9 | README demo storage statement is true and declared. | `@claim:demo-isolation`; README audit. |
| F-1-10 | Demo non-persistence is declared and tested against a seeded real file. | `@claim:demo-isolation`. |
| F-1-11 | Removed the unverified Free statement. | Landing copy audit. |
| F-1-12 | Removed the unverified No account statement. | Landing copy audit. |
| F-1-13 | Narrowed calendar-access language to the checked-copy workflow. | `@claim:repair-export`; legal-route test. |
| F-1-14 | Removed unsupported import and sync promises. | `@claim:local-only`; landing copy audit. |
| F-1-15 | Declared and exercised the no-third-party-runtime claim on all product routes. | `@claim:no-third-party-runtime`. |
| F-1-16 | Header, demo controls, and legal/footer links have 44 px mobile targets. | Mobile target test; `.factory/evidence/polish-2-live/demo-mobile.png`. |
| F-1-17 | Replaced preflight jargon with Check a calendar file. | `.factory/copy-audit.md`. |
| F-1-18 | Landing audience sentence now names checking risks before import. | `.factory/copy-audit.md`. |
| F-1-19 | Caption now says Download only a copy you trust. | `.factory/copy-audit.md`. |
| F-1-20 | Intake heading now says Check your file privately. | `.factory/copy-audit.md`. |
| F-1-21 | Process section says Three steps. | `.factory/copy-audit.md`. |
| F-1-22 | Process heading says How the checker works. | `.factory/copy-audit.md`. |
| F-1-23 | Limitations section says What the checker cannot do. | `.factory/copy-audit.md`. |
| F-1-24 | README description was split below the 22-word cap. | `.factory/copy-audit.md`. |
| F-1-25 | README uses downloaded-copy wording instead of reversible cleanup. | `.factory/copy-audit.md`. |
| F-1-26 | README says matching details instead of event fingerprints. | `.factory/copy-audit.md`. |
| F-1-27 | README explains invitations and cancellations in plain words. | `.factory/copy-audit.md`. |
| F-1-28 | Visitor copy consistently uses calendar file, then file. | `.factory/copy-audit.md`. |
| F-1-29 | Paste ICS text uses the normal parser and real-mode storage path. | `@claim:paste-intake`. |
| F-2-1 | `risk-detection` fixture now includes an unknown timezone, attendee/organizer data, and an alarm, with visible assertions. | `@claim:risk-detection`; clean-clone run. |
| F-2-2 | Workspace promises now state exact downloaded-byte changes; claim/test verifies IDs, UTC stamps, people, alarms, METHOD removal, and CRLF lines. App help only states the tested filename. | `@claim:repair-export`, `@claim:calendar-export`; `.factory/evidence/polish-2-live/demo-desktop.png`. |
| F-2-3 | Static 404 now has self-hosted description, canonical, OG/Twitter metadata, favicon/apple icon, skip link, common header, legal footer, and accessibility check while keeping status 404. | Route/404/axe test; `.factory/evidence/polish-2-live/not-found.png`; live unknown-path 404. |
| F-2-4 | Removed the opaque fingerprint from event cards and renamed the export kicker Choose a calendar app. | `.factory/evidence/polish-2-live/demo-desktop.png`; `.factory/copy-audit.md`. |
| F-2-5 | Root document, runtime title, OG title, Twitter title, and title test now use Check files before import. | Metadata test; live root check in `polish-2-live/verify.json`. |

## Verification

- `npm ci && npm run build && npm test` passes locally.
- Each command in `.factory/claims.json` is run separately from a fresh clone after the repair commit.
- `verify-url.sh` captures cold desktop/mobile live evidence after deployment. The Playwright suite includes axe checks for all routes and the 404 response, keyboard/focus, mobile targets, privacy, and offline reload.
