# ICS Intake Checker — Polish 4 handoff

## Completed

- Closed F-4-1 with an `event-preview` claim and one tagged two-event upload test. It proves that every uploaded event title and start date appears in **Event preview**.
- Revalidated every finding in `.factory/review-1.md` through `.factory/review-4.md`; all are closed with no regression.
- Updated the catalog description to a verb-first 76-character sentence.
- Preserved the luminous glass inspection-table visual system and static offline-PWA deployment class.

## Repair and deployment

- Repair commit: `be8d1bbc198b2f64d6b28f119c514136836c04eb` (`fix: prove calendar event previews`), pushed to `origin/main`.
- Deployed through `/opt/fleet/lib/deploy-static.sh ics-intake-checker dist`.
- Static Web Apps deployment: `d5a418c9-d553-403f-8a14-11615b3405e2`.
- Live URL: https://ics-intake-checker.sociobot.in

## Verification

- Fresh clone `/tmp/ics-polish4-clean-w1jVXc`: `npm ci`, all 11 `.factory/claims.json` commands run separately, and `npm run build` passed.
- Local: `npm test` passed 30/30 in desktop and 390 px Chromium; `npm run build` passed and produced `dist/index.html` (11.23 KB gzip JS, 4.46 KB gzip CSS).
- Local cold check: `.factory/evidence/polish-4-local/verify.json` reports title, `lang=en`, one H1, main landmark, image alts, named buttons, and zero console errors.
- Live cold check: `.factory/evidence/polish-4-live/verify.json` reports the same with an 819 ms load. Live browser checks then passed seeded demo reset/isolation and five exits, `?demo=1`, event preview, mobile targets/no overflow, route title/metadata/status 404, privacy request origins, offline reload, and Axe with zero serious/critical violations on `/`, `/demo`, `/privacy`, `/terms`, and 404.
- Live Lighthouse mobile: Performance 100, Accessibility 100, Best Practices 100, SEO 100; LCP 1,153 ms and CLS 0. See `.factory/evidence/polish-4-live/lighthouse.json`.

## Known gaps

None.
