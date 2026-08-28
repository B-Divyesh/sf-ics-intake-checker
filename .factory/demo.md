# Demo sandbox

- URL: `https://ics-intake-checker.sociobot.in/demo` (local: `http://localhost:4173/demo`)
- Alternate entry: `https://ics-intake-checker.sociobot.in/?demo=1`; it immediately canonicalizes to `/demo`.
- Sample: a three-event calendar file with a clinic appointment and duplicate vendor workshops. It includes invitation mode, attendee and organizer addresses, one alarm, an unbounded repeat, a floating time, a URL, and a missing UID and DTSTAMP.
- Expected result: the inspection deck is already populated. The sample has no stop issues, so export is available after review.
- Reset: **Reset demo** restores the sample source, filename, Apple Calendar destination, unchecked repairs, and collapsed source disclosure.
- Reload: **Reload sample file** replaces only the in-memory sample state.
- Exit: **Return to my file** discards the sample and restores the saved real file, if one exists.
- Storage namespace: demo state is in memory only. It does not read, write, or delete the real `ics-intake-checker/files/latest` IndexedDB record.
- Offline: visit `/demo` once, wait for the app shell to install, then reload it without a network.
