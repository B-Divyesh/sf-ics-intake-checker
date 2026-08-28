# ICS Intake Checker

Check and repair an ICS file before calendar import.

ICS Intake Checker is for people who receive calendar files from schools, clinics, conferences, and vendors. It previews events and explains common import risks. Choose fixes for a downloaded copy for Apple Calendar, Google Calendar, or Outlook.

Try the isolated sample at [`/demo`](https://ics-intake-checker.sociobot.in/demo). The sample includes a clinic appointment and duplicate vendor workshops. Demo work does not change your saved real file.

## What it checks

- Calendar structure, event IDs, start and end times
- Floating and unknown timezones
- Repeat rules that are invalid or never end
- Repeated event IDs and events with matching details
- Invitations that request a reply and files that cancel events
- Attendee addresses, organizer addresses, alarms, and external links

The app can add missing IDs and creation stamps. It can remove people, alarms, or invitation mode from the downloaded copy. Event details stay in the browser, and the app does not open embedded links. The latest real file survives refresh until you choose **Forget this file**. The app works offline after the first visit.

## Run locally

Requirements: Node.js 20 or newer and npm.

```sh
npm install
npm run dev
```

Open `http://localhost:4173`. For a one-click populated workspace, open `http://localhost:4173/demo` or `http://localhost:4173/?demo=1`.

## Test and build

```sh
npm test
npm run build
```

`npm test` builds the site and runs claims, accessibility, keyboard, mobile, route, repair, and offline checks in Chromium. `npm run build` creates the static site in `dist/`, with `index.html` at its root.

## Privacy and storage

Parsing and repair run in the browser. Real-mode files use one IndexedDB record named `latest` in the `ics-intake-checker` database. Demo mode uses bundled in-memory data and does not change that record. There are no analytics, remote fonts, or third-party runtime scripts.

Use **Forget this file** or clear site data in your browser to remove the saved record. See [Privacy](https://ics-intake-checker.sociobot.in/privacy) and [Terms](https://ics-intake-checker.sociobot.in/terms).

## Deployment

Deploy `dist/` as a static site. `staticwebapp.config.json` rewrites the four valid application routes and serves a status-404 document for unknown paths. The service worker caches the built application shell for offline use.

## License

MIT. The original generated illustration is documented in [`.factory/design.md`](.factory/design.md).
