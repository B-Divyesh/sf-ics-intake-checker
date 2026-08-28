# Polish 1 handoff — pending live propagation

## Repair

- Product repair commit: `57e8d824fc14c2a8ff729b672c2aaec53f496671` (`fix demo isolation and review findings`), pushed to `origin/main`.
- Resolves every review finding F-1-1 through F-1-29. The complete mapping is in `.factory/polish-1.md`.
- Demo now has a sticky, explicit disposable-data bar; `?demo=1` canonicalizes to `/demo`; reset is deterministic; Reload sample never touches IndexedDB; Return to my file restores the actual saved record.
- Added Paste ICS text, exact static route rewrites and a true status-404 path, 44 px mobile targets, copy rewrites, and PWA cache version `v1.1.0`.

## Verification

From a clean clone of `57e8d824fc14c2a8ff729b672c2aaec53f496671` at `/tmp/ics-intake-checker-clean-final`:

- `npm ci`: passed, 0 audit vulnerabilities.
- Every `claims.json` command passed independently: `sample-preflight`, `demo-isolation`, `local-only`, `repair-export`, `risk-detection`, `calendar-export`, `paste-intake`, `local-restore`, `offline-reload`, and `no-third-party-runtime` (two projects each: Chromium desktop and 390 × 844 mobile).
- `npm run build`: passed; `dist/index.html` exists. Built JS is 11,260 bytes gzip and CSS is 4,460 bytes gzip.
- `npm test`: passed; all 24 browser tests (12 checks × desktop/mobile). It includes Playwright axe scans of `/`, `/demo`, `/privacy`, and `/terms`, mobile target measurements, keyboard/route focus, status-404 behavior, privacy/network checks, and offline reload.
- `/opt/fleet/lib/verify-url.sh http://127.0.0.1:4173/demo .factory/evidence/verify-local`: passed. Evidence reports no console errors, one H1, one main landmark, `lang=en`, and zero images missing alt text.
- Local route check: `/demo` returns 200 and `/definitely-missing-review-path` returns 404 through the same exact-route/static fallback policy intended for deployment.
- Screenshots: `.factory/evidence/demo-desktop.png`, `.factory/evidence/demo-mobile.png`, `.factory/evidence/verify-local/screenshot-desktop.png`, and `.factory/evidence/verify-local/screenshot-mobile.png`.

## Deployment and live re-check

The static deployment configuration is `npm ci && npm test && npm run build` with `dist/` as its artifact. The repair was pushed to `main` at 2026-08-28 15:37 UTC. At the time of this note, the live origin still serves the prior bundle (`index-DaI6JhVg.js`) and its old HTTP-200 unknown-route behavior, so this handoff is not yet complete. Await propagation, then cold-check `/`, `/?demo=1`, `/demo`, `/privacy`, `/terms`, and an unknown URL before changing this section to complete.
