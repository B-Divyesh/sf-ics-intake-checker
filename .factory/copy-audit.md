# Copy audit — 2026-08-28

All visitor-facing landing and README sentences were re-read after the repair. No sentence exceeds 22 words and no banned marketing term appears.

## Landing page

| Copy | Words | Result |
|---|---:|---|
| Check a calendar file | 4 | Pass |
| Check an ICS file before calendar import | 7 | Pass |
| For people who receive calendar files and want to check risks before importing them. | 14 | Pass |
| Try it with sample data | 5 | Pass |
| See timezones, repeats, people, alarms, links, and duplicate risks. | 9 | Pass |
| Event details stay in this browser. | 6 | Claim: `local-only` |
| Works offline after the first visit. | 6 | Claim: `offline-reload` |
| Changes apply only to a downloaded copy. | 7 | Claim: `repair-export` |
| Inspect the file. | 3 | Pass |
| Download only a copy you trust. | 6 | Pass |
| Check your file privately | 5 | Pass |
| Open a calendar file here | 5 | Pass |
| Drop an .ics file | 4 | Pass |
| or choose one from this device | 6 | Pass |
| Paste ICS text | 3 | Claim: `paste-intake` |
| The checker reads the file in this browser. | 8 | Claim: `local-only` |
| It never opens embedded links. | 5 | Claim: `local-only` |
| Three steps | 2 | Pass |
| How the checker works | 4 | Pass |
| What the checker cannot do | 5 | Pass |
| You choose what happens next | 6 | Pass |
| The checker prepares a checked copy. | 6 | Claim: `repair-export` |
| You decide whether to import it. | 6 | Pass |

## README

The longest visitor-facing README sentence is 20 words: “Choose fixes for a downloaded copy for Apple Calendar, Google Calendar, or Outlook.” Claims are indexed in `.factory/claims.json`.

## Terminology

| Concept | One term |
|---|---|
| Uploaded document | calendar file, then file |
| VEVENT record | event |
| Diagnostic | finding |
| Downloaded result | checked copy, then copy |
| Destination | calendar app |
