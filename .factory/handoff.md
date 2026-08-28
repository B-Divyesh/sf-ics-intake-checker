# ICS Intake Checker — Review 4 handoff

## Completed

- Performed a non-modifying adversarial review of the live product and current source.
- Wrote `.factory/review-4.md` with the full first-read, copy, demo, claims, history, structure, accessibility, and missed-leverage review.
- Committed only review documentation; product code was not changed.

## Verification

- Fresh 390 px and desktop live contexts confirmed the headline, audience, and **Try it with sample data** action before scrolling.
- Live demo was populated in one click; its persistent banner, reset, reload, export, same-origin request behavior, and every seeded-real-file exit path were checked.
- Fresh clone `/tmp/ics-review4-clean-t7HDU1`: `npm ci`, every command listed in `.factory/claims.json`, `npm test` (28/28), and `npm run build` passed.
- Live route/metadata/link checks and Axe scans found no serious or critical accessibility issues on all product routes plus a real 404.

## Known gap

Review verdict is **FAIL** with one minor finding: README promises “It previews events” but no matching `claims.json` entry and one tagged observable test exist. Add an `event-preview` claim/test, or remove that promise. See `.factory/review-4.md`.
