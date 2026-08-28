# ICS Intake Checker

Check and repair an ICS file before calendar import.

ICS Intake Checker is for people who receive event files from schools, clinics, conferences, and vendors. It previews the events, explains common import risks, offers reversible cleanup, and exports a checked copy for Apple Calendar, Google Calendar, or Outlook.

Try the isolated sample at [`/demo`](https://ics-intake-checker.sociobot.in/demo). The sample includes a clinic appointment and a duplicated vendor workshop. Demo work is not saved.

## What it checks

- Calendar structure, event IDs, start and end times
- Floating and unknown timezones
- Repeat rules that are invalid or never end
- Duplicate event IDs and matching event fingerprints
- Invitation and cancellation modes
- Attendee addresses, organizer addresses, alarms, and external links

The app can add missing IDs and creation stamps. It can also remove people, alarms, or invitation mode from the downloaded copy. Event details stay in the browser, and the app does not open embedded links. The latest real file survives refresh until you choose **Forget this file**. The app works offline after the first visit.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

Open `http://localhost:4173`. For a one-click populated workspace, open `http://localhost:4173/demo`.

## Test and build

```sh
npm test
npm run build
```

`npm test` starts the production preview and runs claim, accessibility, keyboard, mobile, repair, and offline checks in Chromium. `npm run build` creates the static site in `dist/`, with `index.html` at its root.

## Privacy and storage

Parsing and repair run in the browser. Real-mode files use one IndexedDB record named `latest` in the `ics-intake-checker` database. Demo mode uses bundled in-memory data and never reads or writes that record. There are no accounts, analytics, remote fonts, or third-party runtime scripts.

Use **Forget this file** or clear site data in your browser to remove the saved record. See [Privacy](https://ics-intake-checker.sociobot.in/privacy) and [Terms](https://ics-intake-checker.sociobot.in/terms).

## Deployment

Deploy the contents of `dist/` as a static site. `staticwebapp.config.json` supplies SPA routing, security headers, asset caching, and the 404 rewrite. The service worker caches the built application shell for offline use.

## License

MIT. The original generated illustration is documented in [`.factory/design.md`](.factory/design.md).
