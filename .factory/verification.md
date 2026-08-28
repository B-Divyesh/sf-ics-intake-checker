# Independent verification — PASS

**Candidate:** `5c6776e72c24cfe1f7266024462bf7541ccfa7e4`  
**Verified URL:** https://ics-intake-checker.sociobot.in  
**Date:** 2026-08-28  
**Verdict:** **PASS**

The deployed artifact byte-matches the production build from the stated candidate for `index.html`, the hashed JavaScript and CSS bundles, hero WebP, `sw.js`, and `manifest.webmanifest`.

## Required first checks

### Cold first read — PASS

In a fresh browser at `/`, the first screen states:

- what it does: “Check an ICS file before calendar import”;
- for whom: people who receive calendar files and need to find risks before choosing a calendar;
- what to do first: the visible, one-click **Try it with sample data** action, accompanied by the risks it will show.

The sample action navigates to `/demo`, immediately opens a populated three-event inspection, and displays the persistent **Demo — sample data, nothing is saved** banner with **Reset demo** and **Start for real**.

### Claims — PASS

From the clean candidate checkout, after `npm ci`, every command listed in `.factory/claims.json` was run in a chained clean local test flow. The final Playwright status was `passed`; the `&&` chain reached the seventh command, so every predecessor passed.

| Claim ID | Command | Result |
|---|---|---|
| `sample-preflight` | `npm test -- --grep @claim:sample-preflight` | PASS — desktop and 390px projects |
| `local-only` | `npm test -- --grep @claim:local-only` | PASS — desktop and 390px projects |
| `repair-export` | `npm test -- --grep @claim:repair-export` | PASS |
| `risk-detection` | `npm test -- --grep @claim:risk-detection` | PASS |
| `calendar-export` | `npm test -- --grep @claim:calendar-export` | PASS |
| `local-restore` | `npm test -- --grep @claim:local-restore` | PASS |
| `offline-reload` | `npm test -- --grep @claim:offline-reload` | PASS |

Each claim tag occurs exactly once in `tests/app.spec.ts`.

## Local quality gates — PASS

- `npm ci`: completed, 0 audit vulnerabilities.
- `npm test`: PASS; all 18 Playwright tests across desktop Chromium and the 390 × 844 mobile context completed with final runner status `passed`.
- `npm run build`: PASS. This runs `tsc --noEmit` and Vite production build; `dist/index.html` exists.
- No lint script is declared; TypeScript checking is part of the build.
- Production bundle: JavaScript 10,863 bytes gzip; CSS 4,294 bytes gzip; hero WebP 26,528 bytes. All are within the applicable static-PWA budgets.

## Live product verification — PASS

- `/`, `/demo`, `/privacy`, `/terms`, and an unknown SPA route all rendered the intended one-H1 pages with correct route titles. The footer’s external Param Factory link returned HTTP 200.
- Live normal flow: uploaded a valid `normal-qa.ics`, selected Outlook, and downloaded `normal-qa-checked-outlook.ics`; it retained the event UID and added `METHOD:PUBLISH`.
- Live sample repair flow: selected attendee, alarm, invitation-mode, UID, and DTSTAMP repairs; downloaded `sample-clinic-and-vendor-checked-apple.ics` removed `ATTENDEE`/`ORGANIZER`, `VALARM`, and `METHOD:REQUEST`, and added a generated UID and DTSTAMP.
- Live malformed-input recovery: a `.txt` file showed “That file is not an ICS calendar…”, a 5,000,001-byte ICS showed the 5 MB limit message, and a valid ICS immediately recovered to its inspection screen.
- Demo isolation: a fresh `/demo` browser had no IndexedDB databases. **Start for real** returned to an empty real intake, removed the banner, and still had no demo database.
- Privacy/network: cold-page and demo-flow capture recorded only same-origin product requests. Embedded ICS URLs were rendered as text; no external request opened. Source review found no API, analytics, auth, or server-side endpoint. Rate-limiting and sign-in checks are therefore not applicable.
- PWA: in a fresh live context, the active controller scope was the site root and cache `ics-intake-checker-v1.0.0` was present. After `context.setOffline(true)`, `/demo` reloaded with its sample heading and demo banner intact and no errors. `sw.js` is served `Cache-Control: no-cache`; its versioned-cache, `skipWaiting`, `clientsClaim`, and in-app update-toast path were reviewed. No newer deployment was available to trigger an actual update toast.
- Response policies: HTTPS, HSTS, `X-Content-Type-Options: nosniff`, strict-origin referrer policy, permissions policy, and a same-origin CSP were present. Hashed JS/CSS/WebP assets use one-year immutable caching; `sw.js` is no-cache.

## Accessibility, responsive, and browser checks — PASS

- `/opt/fleet/lib/verify-url.sh` passed: HTTP 200, title, `lang=en`, one H1, main landmark, zero images without alt text, zero unlabeled buttons, and no console errors. Fresh measured live load was 1,497 ms.
- Live axe scan found **zero serious or critical violations**.
- At 390 × 844, the page had no horizontal overflow. Keyboard Tab focused the visible skip link; its computed focus outline was amber, solid, 3 px. The existing test suite also covers navigation/back and mobile layout.
- With reduced motion emulated, event animation and transition durations reduced to `0.00001s`.
- Browser console and `pageerror` captures were empty throughout cold load, invalid/recovery, demo, and offline checks.

## Defects by severity

- Critical: none.
- High: none.
- Medium: none.
- Low: none.

## Evidence paths

- Live structural/console screenshots and JSON: `/tmp/ics-verify-url.fyO8zZ/`.
- Browser output is recorded in this verification report; the checked checkout and `dist/` remain buildable at the tested candidate.
