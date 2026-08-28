# ICS Intake Checker — visual thesis

## Direction

**Luminous glass data landscape.** An unfamiliar calendar attachment should feel like a specimen placed on a safe inspection table: visible, bounded, and understood before it crosses into a calendar. The interface uses a deep ink field, translucent panes, hairline grid marks, and a cyan “safe path” through warm amber warning signals. It must look like a purpose-built preflight instrument, not a calendar app or a generic dashboard.

## Tokens

- `--ink-950: #071014` — page background and installed-app splash.
- `--ink-900: #0b171c` — raised work surface.
- `--glass: rgba(18, 40, 47, .78)` — inspection panes.
- `--line: #34505a` — pane edges and controls (3:1 minimum against surfaces).
- `--text: #f2f8f7` — primary copy (17.4:1 on ink).
- `--muted: #aec4c7` — secondary copy (9.7:1 on ink).
- `--cyan: #59e2dc` and `--cyan-ink: #05201f` — primary action and focus.
- `--amber: #ffc867` and `--amber-ink: #291a00` — repairable warnings.
- `--coral: #ff8e80` — errors and destructive edges.
- `--green: #8ae6ae` — checks that passed.

The product is intentionally single-mode. Painting the dark inspection field explicitly gives luminous data layers their meaning and avoids a light-mode treatment that would weaken the glass-instrument thesis.

## Type and spacing

Headings use the local/system geometric stack `Avenir Next, Avenir, Trebuchet MS, sans-serif`. Body copy uses `Inter, ui-sans-serif, system-ui, sans-serif`; no font files or third-party requests are needed. Dates, counts, and raw ICS use `IBM Plex Mono, SFMono-Regular, Consolas, monospace` with tabular figures.

Spacing follows an 8 px base with 4 px for tight inline gaps. Page sections use 64–96 px vertical intervals, controls are at least 44 px high, and reading lines stay below 70 characters. Asymmetric two-column compositions let the inspection deck occupy more room than supporting copy.

## Shape, depth, and interaction

Panels use clipped top-right corners and faint internal highlights, like glass sheets on an illuminated map table. Event blocks are connected by a thin cyan route line. Warnings use amber edge bars plus icons and words; color never carries status alone. Buttons are compact instrument tabs, while links remain underlined.

Drop, paste, or file selection feeds the same parser. A loaded file moves the page from an intake aperture to a three-part inspection deck: summary, findings, and event itinerary. Choosing a repair immediately updates the preview and export payload. Raw source is behind an explicit disclosure.

## Motion

On parse, event panes rise 8 px and fade over 220 ms in file order. The route line draws once over 420 ms to show data moving from attachment to safe export. Hover uses only short border and background transitions. Under `prefers-reduced-motion: reduce`, all movement and line drawing become instant opacity changes; nothing loops.

## Original asset plan and provenance

The hero illustration is a generated abstract still life: a translucent calendar file floating above a dark inspection table, with cyan data paths and one amber anomaly. It explains “inspect before import” without showing a fake product screen. No people, brands, interface text, logos, or external assets.

Prompt: “Editorial product illustration, wide landscape. A single translucent glass calendar file specimen hovering over a deep midnight technical inspection table, luminous cyan timetable lines passing safely through the glass, one small amber warning prism diverted to the side, etched grid and tiny abstract data marks, restrained volumetric light, crisp optical glass, dark teal and graphite palette, calm forensic precision, generous negative space on left, isometric three-quarter lens, premium but practical, no people, no readable text, no letters, no numbers, no logo, no watermark, no brand, no gradients used as empty decoration.”

Generated with the factory image model (`factory-image`) on 2026-08-28. The selected original and prompt sidecar live under `assets/src/`. Shipping derivatives are optimized WebP/PNG files under `public/assets/`. Generated imagery is original to this product.
