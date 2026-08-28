# ICS Intake Checker — polish 5 handoff

## Completed

- Closed F-5-1 with a declared `intake-size-limit` claim and one tagged browser test.
- Proved exactly 5,000,000 bytes is accepted and checked, while 5,000,001 bytes is rejected with a next step, for both chosen-file and paste intake.
- Removed the unreachable parser-level over-limit warning and kept one authoritative UI byte limit.
- Rechecked every finding from reviews 1–5. Demo isolation, one-click `?demo=1`, first-screen copy, titles, metadata, route focus, status 404, legal links, mobile layout, and all prior claim coverage remain fixed.
- Updated the PWA cache/build marker to v1.3, the catalog description, copy audit, cumulative polish record, and claim inventory.

## Local verification

- `npm test`: 32/32 passed across desktop and 390 × 844 Chromium.
- `npm test -- --grep @claim:intake-size-limit`: 2/2 passed.
- `npm run build`: passed; `dist/index.html` exists.
- Build size: JavaScript 31.66 KB raw / 11.19 KB gzip; CSS 15.58 KB raw / 4.46 KB gzip.
- Local verifier: `.factory/evidence/polish-5-local/verify.json`; correct title, `lang=en`, one H1, main landmark, image alt text, named buttons, and zero console errors.
- Local HTTP: `/`, `/demo`, `/privacy`, and `/terms` return 200; an unknown path returns 404.
- Local screenshots: `.factory/evidence/polish-5-local/screenshot-desktop.png`, `screenshot-mobile.png`, `demo-desktop.png`, and `demo-mobile.png`.

## Run and verify

```sh
npm ci
npm test
npm run build
```

The isolated sample is available at `http://localhost:4173/demo` and `http://localhost:4173/?demo=1` after `npm run preview`.

## Deployment and live verification

Final repair commit, clean-clone claim matrix, deployment identifier, Lighthouse scores, and post-deploy cold evidence are appended after the production deployment.

## Known gaps

None in the product or cumulative review scope. The remaining handoff fields above are release evidence, not product work.
