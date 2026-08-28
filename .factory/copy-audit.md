# Copy audit — Polish 5, 2026-08-28

All landing states, demo/workspace copy, legal routes, metadata, and README text were re-read after the repair. Every sentence is 22 words or fewer. No banned marketing term appears. Every claim-like statement maps to `.factory/claims.json`.

## First screen

| Copy | Words | Evidence |
|---|---:|---|
| Check a calendar file | 4 | Plain task label |
| Check an ICS file before calendar import | 7 | One H1; direct job statement |
| For people who receive calendar files and want to check risks before importing them. | 14 | Audience and outcome |
| Try it with sample data | 5 | One-click primary action |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | `sample-preflight` |
| Event details stay in this browser. | 6 | `local-only` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | `repair-export` |
| A glass calendar file passes over a lit inspection table before import. | 12 | Purpose-describing image alt |
| Inspect the file. | 3 | Direct instruction |
| Download only a copy you trust. | 6 | Direct instruction |

The headline starts with a verb, uses seven words, and names the job. The audience sentence and primary action fit the first 390 × 844 screen.

## Landing checker and process

| Copy | Words | Evidence |
|---|---:|---|
| The checker reads the file in this browser. | 8 | `local-only` |
| It never opens embedded links. | 5 | `local-only` |
| Paste up to 5 MB of ICS text. | 8 | `intake-size-limit` |
| It is checked in this browser. | 6 | `paste-intake`, `local-only` |
| Drop a calendar file, choose one, or paste its text. | 10 | `paste-intake` |
| Check times, repeats, people, alarms, links, and duplicates. | 8 | `risk-detection` |
| Apply optional fixes and download for your calendar app. | 9 | `repair-export`, `calendar-export` |
| The checker prepares a checked copy. | 6 | `repair-export` |
| You decide whether to import it. | 6 | User instruction, not a product outcome claim |
| It shows embedded links as text. | 6 | `local-only` |
| It does not open them. | 5 | `local-only` |

## Intake errors

| Copy | Words | Evidence |
|---|---:|---|
| That file is not an ICS calendar. | 7 | Clear error |
| Choose a file ending in .ics. | 6 | Clear next step |
| That file is larger than 5 MB. | 7 | `intake-size-limit` |
| Choose a smaller calendar file. | 5 | Clear next step |
| The file could not be read. | 6 | Clear error |
| Save it again as plain-text ICS, then retry. | 8 | Clear next step |
| Paste ICS calendar text, then choose Check pasted text. | 9 | Clear next step |
| That text is larger than 5 MB. | 7 | `intake-size-limit` |
| Paste a smaller calendar file. | 5 | Clear next step |

## Demo and loaded file

| Copy | Words | Evidence |
|---|---:|---|
| Demo — sample data, nothing is saved | 6 | `demo-isolation` |
| The sample shows invitation, timezone, repeat, attendee, alarm, link, and duplicate findings. | 12 | `sample-preflight` |
| Changes apply only to the downloaded copy. | 7 | `repair-export` |
| Your original file stays unchanged. | 5 | `repair-export` |
| Add a generated ID to this downloaded copy. | 8 | `repair-export` |
| Add a UTC creation stamp to this downloaded copy. | 10 | `repair-export` |
| Remove the alarm block from the downloaded copy if you do not need it. | 13 | `repair-export` |
| The start time has no TZID or UTC Z suffix. | 10 | Observable file detail |

## README and legal wording

| Copy | Words | Evidence |
|---|---:|---|
| Check and fix an ICS file before calendar import. | 9 | Plain product description |
| It previews events and explains common import risks. | 8 | `event-preview`, `risk-detection` |
| It shows invitation, timezone, repeat, people, alarm, link, and duplicate findings. | 11 | `sample-preflight` |
| Demo work does not change your saved real file. | 9 | `demo-isolation` |
| Outside the demo, the browser saves your latest file in the latest IndexedDB record. | 14 | `local-restore` |
| The app loads no analytics, remote fonts, or scripts from other sites. | 12 | `no-third-party-runtime` |
| The service worker caches the built site so it can reload offline. | 11 | `offline-reload` |

## Terminology

| Concept | One term |
|---|---|
| Uploaded document | calendar file, then file |
| VEVENT record | event |
| Diagnostic | finding |
| Optional downloaded-copy change | fix |
| Downloaded result | checked copy, then copy |
| Destination | calendar app |
