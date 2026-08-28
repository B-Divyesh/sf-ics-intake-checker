# ICS Intake Checker v1 handoff

## Shipped

- A Vite and TypeScript offline PWA at `/`, with deep-link routes for `/demo`, `/privacy`, `/terms`, and the styled 404.
- Drag, file-picker, and keyboard intake for ICS files up to 5 MB.
- Tolerant line unfolding, parameter parsing, escaped text, date and timezone checks, recurrence checks, duplicate UID and content fingerprints, invitation and cancellation warnings, and attendee, alarm, link, and status notices.
- Event previews that show time type, timezone, location, repeat rule, and a stable content fingerprint.
- Optional cleanup for missing UIDs, missing DTSTAMP fields, alarms, people, invitation mode, and ICS line endings. Cleanup changes only the downloaded copy.
- Export routes for Apple Calendar, Google Calendar, and Outlook. Outlook export adds `METHOD:PUBLISH` when no invitation mode exists.
- IndexedDB restore for the latest real file and an explicit **Forget this file** action.
- An isolated `/demo` with three bundled events, a persistent banner, reset, real-mode exit, and no storage writes.
- A hand-written service worker with versioned caches, fresh shell precaching, cache-first assets, network-first pages, an offline fallback, and update notification.
- Manifest, install icons, social image, canonical and social metadata, sitemap, robots, security headers, privacy, terms, and MIT license.
- The luminous glass visual system and original generated illustration. Prompt and provenance are in `.factory/design.md` and `assets/src/`.

## Verify

From a clean checkout:

```sh
npm install
npm test
npm run build
```

Results on 2026-08-28:

- `npm test`: 18 passed across desktop Chromium and a 390 × 844 Chromium mobile context.
- Claim tests: sample preflight, same-origin privacy, repaired download contents, calendar-specific export, IndexedDB restore/forget, risk detection, and offline reload all passed.
- Offline claim was also repeated three times in fresh contexts after fixing `Vary`-aware cache matching: 3 passed.
- `npm run build`: passed; `dist/index.html` exists.
- Production bundle: 10.95 KB gzip JavaScript and 4.29 KB gzip CSS.
- Hero WebP: 26.5 KB. Social preview: 106.5 KB.
- `/opt/fleet/lib/verify-url.sh`: passed with no console errors, one H1, one main landmark, `lang=en`, and no missing image alt text.
- Playwright axe scan: no serious or critical violations.
- `npm audit`: 0 vulnerabilities.

Lighthouse mobile on the production preview:

| Category | Score |
|---|---:|
| Performance | 100 |
| Accessibility | 100 |
| Best practices | 100 |
| SEO | 100 |

Measured LCP was 1.5 s, FCP 0.9 s, Speed Index 0.9 s, total blocking time 0 ms, and CLS 0.

## Known gaps

- The checker validates `VEVENT` data. It does not preview `VTODO`, `VJOURNAL`, or free/busy blocks.
- It recognizes embedded `VTIMEZONE` identifiers but does not calculate custom historical timezone transitions. Event time text preserves the file's wall-clock value and labels its timezone.
- Calendar apps may interpret vendor extensions differently. The original file remains unchanged so users can compare results.
- No external problematic fixture pack was supplied. The automated suite covers representative malformed structure, dates, recurrence, duplicate, cancellation, people, alarm, link, privacy, and offline cases.

## Next steps

- Add newly reported vendor fixtures to the risk-detection test before changing parser behavior.
- Add a repair editor for invalid start/end values after a safe timezone-aware editing design is defined.
- Validate import output against future major versions of Apple Calendar, Google Calendar, and Outlook as their behavior changes.
