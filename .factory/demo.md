# Demo sandbox

- URL: `https://ics-intake-checker.sociobot.in/demo` (local: `http://localhost:4173/demo`)
- Alternate entry: `/?demo=1`
- Sample: a three-event calendar containing a clinic appointment and duplicated vendor workshop. It includes invitation mode, attendee and organizer addresses, one alarm, an unbounded repeat, a floating time, a URL, and a missing UID and DTSTAMP.
- Expected result: the inspection deck is already populated. The sample has no stop issues, so export is available after review.
- Reset: choose **Reset demo** in the persistent banner.
- Exit: choose **Start for real**. This discards sample state and opens the real file intake.
- Storage namespace: demo state is in memory only. It never opens or writes the real IndexedDB database.
- Offline: visit `/demo` once, wait for the app shell to install, then reload it without a network.
