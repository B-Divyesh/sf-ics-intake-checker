# ICS Intake Checker — Polish 3 handoff

## Delivered

- Repaired the demo isolation regression on every exit route. Demo state now remains in memory only, and leaving `/demo` restores the saved real record before a real-mode workspace can render.
- Added focus recovery after Back/forward, Reset demo, Reload sample file, Forget this file, and closing Paste ICS text.
- Tightened every reviewed sample, repair, calendar, privacy, copy, external-link, metadata, legal, 404, mobile, and claim issue. Visitor-facing repair language is now consistently **fixes**.
- Updated the PWA cache/start version to 1.2 and deployed the static artifact through the factory static work-order deployment.

## Commit and deployment

- Repair commit: `41a0e7b8156d5f6d8e997f314aa5e8aa6911ff7d` (`fix: close cumulative review findings`)
- Pushed branch: `main` to `origin`
- Deployment: `/opt/fleet/lib/deploy-static.sh ics-intake-checker /work/repo/dist`
- Azure deployment ID: `e3f08816-6436-420d-a38d-cc6436102256`
- Live URL: https://ics-intake-checker.sociobot.in
- Live service worker: `ics-intake-checker-v1.2.0`

## Exact verification evidence

- Clean clone: `/tmp/ics-polish3-clean-RAkL1l` at repair commit `41a0e7b`.
- `npm ci`: passed with 0 vulnerabilities.
- Every declared claim command was run separately and passed in desktop Chromium and the 390 px project:
  `sample-preflight`, `demo-isolation`, `local-only`, `repair-export`, `risk-detection`, `calendar-export`, `paste-intake`, `local-restore`, `offline-reload`, and `no-third-party-runtime`.
- Full clean-clone suite: `npm test` passed **28/28** checks.
- Build: `npm run build` passed; `dist/index.html` exists. Built JS is 11.23 KB gzip and CSS is 4.46 KB gzip.
- Local structural verifier: `.factory/evidence/polish-3-local/verify.json` reports `lang=en`, one title/H1/main, no missing image alts, no unnamed buttons, and no console errors.
- Live structural verifier: `.factory/evidence/polish-3-live/verify.json` reports the same checks with a 659 ms cold load.
- Live Playwright Axe integration found zero serious/critical issues on `/`, `/demo`, `/privacy`, `/terms`, and a real-404 URL.
- Live cold-browser re-check passed root first-screen fit, `/demo`, `?demo=1`, sticky banner positions, reset, all five seeded-file demo exits, keyboard focus, same-origin requests, 404 status/shell, and offline demo reload.
- Screenshots: `.factory/evidence/polish-3-live/landing-mobile.png`, `demo-desktop.png`, `demo-mobile.png`, and `not-found.png`.

## Run locally

```sh
npm ci
npm test
npm run build
npm run preview
```

Open `http://localhost:4173`, or use `/demo` for the isolated sample.

## Known gaps / next steps

None. The product is a local-first static PWA with no backend or paid integration. Future feature work should retain the isolated demo namespace and extend `.factory/claims.json` with an observable tagged test for every new visitor-facing claim.
