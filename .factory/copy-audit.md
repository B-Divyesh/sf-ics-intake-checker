# Copy audit — Polish 4, 2026-08-28

All visitor-facing landing, demo, workspace, legal, and README copy was re-read after the repair. Every sentence is 22 words or fewer. No banned marketing term appears.

## First screen

| Copy | Words | Evidence |
|---|---:|---|
| Check a calendar file | 4 | Plain task label |
| Check an ICS file before calendar import | 7 | One H1 |
| For people who receive calendar files and want to check risks before importing them. | 14 | Audience and outcome |
| Try it with sample data | 5 | One-click primary action |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | `sample-preflight` |
| Event details stay in this browser. | 6 | `local-only` |
| Works offline after the first visit. | 6 | `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | `repair-export` |

## Demo and loaded file

| Copy | Words | Evidence |
|---|---:|---|
| Demo — sample data, nothing is saved | 6 | `demo-isolation` |
| The sample shows invitation, timezone, repeat, attendee, alarm, link, and duplicate findings. | 12 | `sample-preflight` |
| Optional fixes | 2 | Selected term |
| Choose fixes for a checked copy | 6 | Selected term |
| Fixes to apply | 3 | Selected term |
| Add a generated ID to this downloaded copy. | 8 | `repair-export` |
| Add a UTC creation stamp to this downloaded copy. | 10 | `repair-export` |
| Remove the alarm block from the downloaded copy if you do not need it. | 13 | `repair-export` |
| The start time has no TZID or UTC Z suffix. | 11 | Observable ICS detail |

## README and legal wording

| Copy | Words | Evidence |
|---|---:|---|
| Check and fix an ICS file before calendar import. | 9 | Selected term |
| It previews events and explains common import risks. | 8 | `event-preview`, `risk-detection` |
| It shows invitation, timezone, repeat, people, alarm, link, and duplicate findings. | 11 | `sample-preflight` |
| To open the checked sample in one click, visit `http://localhost:4173/demo`. | 10 | Demo URL |
| Outside the demo, the browser saves your latest file in the `latest` IndexedDB record. | 13 | `local-restore` |
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
