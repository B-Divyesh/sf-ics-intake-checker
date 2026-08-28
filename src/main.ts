import './style.css';
import { inspectIcs, repairIcs, SAMPLE_ICS, type Inspection, type RepairOptions, type Severity } from './ics';

type Destination = 'apple' | 'google' | 'outlook';

interface AppState {
  inspection?: Inspection;
  fileName: string;
  demo: boolean;
  destination: Destination;
  repairs: RepairOptions;
  pasteOpen: boolean;
}

const initialRepairs: RepairOptions = { uids: false, stamps: false, alarms: false, people: false, method: false, lineEndings: false };
const state: AppState = { fileName: '', demo: false, destination: 'apple', repairs: { ...initialRepairs }, pasteOpen: false };
const app = document.querySelector<HTMLDivElement>('#app')!;
const live = document.createElement('div');
live.className = 'sr-only';
live.setAttribute('aria-live', 'polite');
document.body.append(live);

function escapeHtml(input: string): string {
  return input.replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' })[char]!);
}

function navLink(path: string, label: string): string {
  return `<a href="${path}" data-route>${label}</a>`;
}

function shell(content: string): string {
  return `${state.demo ? `<aside class="demo-bar" aria-label="Demo mode"><span><strong>Demo</strong> — sample data, nothing is saved</span><span class="demo-actions"><button type="button" data-action="reset-demo">Reset demo</button><button type="button" data-action="start-real">Return to my file</button></span></aside>` : ''}
  <header class="site-header">
    <a class="wordmark" href="/" data-route aria-label="ICS Intake Checker home"><span class="wordmark-mark" aria-hidden="true">IC</span><span>ICS Intake Checker</span></a>
    <nav aria-label="Main navigation">${navLink('/demo', 'Demo')}${navLink('/privacy', 'Privacy')}</nav>
  </header>
  ${content}
  <footer><div><strong>ICS Intake Checker</strong><p>Check and repair an ICS file before calendar import.</p></div><nav aria-label="Footer navigation">${navLink('/privacy', 'Privacy')}${navLink('/terms', 'Terms')}<a href="https://hello-factory.sociobot.in" rel="external">Built by Param Factory</a></nav><p class="build-id">v1.1 · build 2026.08</p><p class="art-credit">Original generated illustration.</p></footer>`;
}

function pageTitle(name: string, description: string): void {
  document.title = name;
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);
  document.querySelector('meta[property="og:title"]')?.setAttribute('content', name);
  document.querySelector('meta[property="og:description"]')?.setAttribute('content', description);
  document.querySelector('meta[name="twitter:title"]')?.setAttribute('content', name);
  document.querySelector('meta[name="twitter:description"]')?.setAttribute('content', description);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href', `https://ics-intake-checker.sociobot.in${location.pathname}`);
}

function dateMarkup(event: Inspection['events'][number]): string {
  if (!event.start) return '<span class="missing">Start time missing</span>';
  const zone = event.start.kind === 'utc' ? 'UTC' : event.start.tzid || (event.start.kind === 'date' ? 'All day' : 'Floating local time');
  return `<time datetime="${escapeHtml(event.start.raw)}">${escapeHtml(event.start.label)}</time><span>${escapeHtml(zone)}</span>`;
}

const severityLabel: Record<Severity, string> = { error: 'Stops export', warning: 'Check this', note: 'Notice', pass: 'Passed' };

function toolMarkup(): string {
  if (!state.inspection) {
    return `<section class="intake" id="checker" aria-labelledby="checker-title">
      <div class="section-kicker">Check your file privately</div><h2 id="checker-title">Open a calendar file here</h2>
      <label class="drop-zone" for="ics-file"><span class="drop-symbol" aria-hidden="true">↧</span><strong>Drop an .ics file</strong><span>or choose one from this device</span><input id="ics-file" type="file" accept=".ics,text/calendar" /></label>
      <p class="intake-note">The checker reads the file in this browser. It never opens embedded links.</p>
      <button class="paste-toggle" type="button" data-action="toggle-paste" aria-expanded="${state.pasteOpen}" aria-controls="paste-form">Paste ICS text</button>
      ${state.pasteOpen ? `<form id="paste-form" class="paste-form"><label for="ics-text">Paste calendar file text</label><textarea id="ics-text" required spellcheck="false" placeholder="BEGIN:VCALENDAR"></textarea><p>Paste up to 5 MB of ICS text. It is checked in this browser.</p><button class="primary-button" type="submit">Check pasted text</button></form>` : ''}
      <div id="file-error" class="inline-error" aria-live="assertive"></div>
    </section>`;
  }
  const data = state.inspection;
  const count = (severity: Severity) => data.findings.filter((finding) => finding.severity === severity).length;
  const repairKinds = new Set(data.findings.map((finding) => finding.repair).filter(Boolean));
  const repairRows: Array<[keyof RepairOptions, string, string]> = [
    ['uids', 'Add missing event IDs', 'Prevents repaired events from importing twice.'],
    ['stamps', 'Add creation stamps', 'Adds the current UTC time to events without a stamp.'],
    ['alarms', 'Remove every alarm', 'Stops this export from adding notifications.'],
    ['people', 'Remove attendee details', 'Removes attendee and organizer email addresses.'],
    ['method', 'Remove invitation mode', 'Exports event details without a reply request.'],
    ['lineEndings', 'Normalize file lines', 'Uses the line format expected by calendar apps.']
  ];
  return `<section class="workspace" id="checker" aria-labelledby="checker-title">
    <div class="file-ribbon"><div><span class="section-kicker">Inspection complete</span><h2 id="checker-title">${escapeHtml(state.fileName)}</h2></div><button class="quiet-button" type="button" data-action="clear">${state.demo ? 'Reload sample file' : 'Forget this file'}</button></div>
    <div class="score-strip" aria-label="Inspection totals">
      <span><b>${data.events.length}</b> ${data.events.length === 1 ? 'event' : 'events'}</span>
      <span class="score-error"><b>${count('error')}</b> stop ${count('error') === 1 ? 'issue' : 'issues'}</span>
      <span class="score-warning"><b>${count('warning')}</b> ${count('warning') === 1 ? 'warning' : 'warnings'}</span>
      <span><b>${count('note')}</b> ${count('note') === 1 ? 'notice' : 'notices'}</span>
    </div>
    <div class="inspection-grid">
      <div class="findings-pane"><h3>What to check</h3><div class="finding-list">
        ${data.findings.map((finding) => `<article class="finding finding-${finding.severity}"><span class="severity">${severityLabel[finding.severity]}</span><h4>${escapeHtml(finding.title)}</h4><p>${escapeHtml(finding.detail)}</p></article>`).join('')}
      </div></div>
      <div class="events-pane"><h3>Event preview</h3><ol class="event-route">
        ${data.events.map((event) => `<li><article class="event-card"><div class="event-index" aria-hidden="true">${String(event.index + 1).padStart(2, '0')}</div><div><h4>${escapeHtml(event.summary)}</h4><p class="event-date">${dateMarkup(event)}</p>${event.location ? `<p><span class="data-label">Place</span>${escapeHtml(event.location)}</p>` : ''}${event.recurrence ? `<p><span class="data-label">Repeats</span>${escapeHtml(event.recurrence.replace(/;/g, ' · '))}</p>` : ''}<p><span class="data-label">Fingerprint</span><code>${event.fingerprint}</code></p>${event.description ? `<details><summary>Show description</summary><p>${escapeHtml(event.description)}</p></details>` : ''}</div></article></li>`).join('')}
      </ol></div>
    </div>
    <section class="repair-deck" aria-labelledby="repair-title"><div><span class="section-kicker">Optional cleanup</span><h3 id="repair-title">Prepare a safer copy</h3><p>Changes apply only to the downloaded copy. Your original file stays unchanged.</p></div>
      <fieldset><legend class="sr-only">Repairs to apply</legend>${repairRows.filter(([key]) => repairKinds.has(key)).map(([key, label, help]) => `<label class="repair-row"><input type="checkbox" data-repair="${key}" ${state.repairs[key] ? 'checked' : ''}/><span><strong>${label}</strong><small>${help}</small></span></label>`).join('') || '<p>No automatic cleanup applies to this file.</p>'}</fieldset>
    </section>
    <section class="export-deck" aria-labelledby="export-title"><div><span class="section-kicker">Route the copy</span><h3 id="export-title">Export for your calendar</h3></div>
      <label for="destination">Calendar app</label><select id="destination"><option value="apple" ${state.destination === 'apple' ? 'selected' : ''}>Apple Calendar</option><option value="google" ${state.destination === 'google' ? 'selected' : ''}>Google Calendar</option><option value="outlook" ${state.destination === 'outlook' ? 'selected' : ''}>Outlook</option></select>
      <p class="destination-help">${destinationHelp()}</p>
      <button class="primary-button" type="button" data-action="export" ${data.canExport ? '' : 'disabled'}>Download checked .ics</button>
      ${data.canExport ? '<p class="export-status">Ready. Check every warning before import.</p>' : '<p class="export-status blocked">Fix each “Stops export” issue in the source before downloading.</p>'}
    </section>
    <details class="raw-source"><summary>View raw ICS source</summary><pre>${escapeHtml(data.source)}</pre></details>
  </section>`;
}

function destinationHelp(): string {
  if (state.destination === 'outlook') return 'Adds publishing mode when the file has no invitation mode.';
  if (state.destination === 'google') return 'Keeps standard timezone and repeat fields for Google Calendar import.';
  return 'Keeps standard timezone blocks for Apple Calendar import.';
}

function landing(): string {
  pageTitle('ICS Intake Checker — Check calendar files safely', 'Preview, check, repair, and export an ICS calendar file before you import it. Your event details stay in your browser.');
  return shell(`<main id="main">
    <section class="hero" aria-labelledby="page-title"><div class="hero-copy"><span class="eyebrow">Check a calendar file</span><h1 id="page-title" tabindex="-1">Check an ICS file before calendar import</h1><p class="lede">For people who receive calendar files and want to check risks before importing them.</p><div class="hero-action"><a class="primary-button" href="/demo" data-route>Try it with sample data</a><span>See timezones, repeats, people, alarms, links, and duplicate risks.</span></div><ul class="plain-facts"><li>Event details stay in this browser.</li><li>Works offline after the first visit.</li><li>Changes apply only to a downloaded copy.</li></ul></div>
      <figure class="hero-art"><picture><source srcset="/assets/inspection-landscape.webp" type="image/webp"/><img src="/assets/inspection-landscape.jpg" width="768" height="512" alt="A glass calendar file passes over a lit inspection table before import." fetchpriority="high" decoding="async"/></picture><figcaption>Inspect the file. Download only a copy you trust.</figcaption></figure>
    </section>
    ${toolMarkup()}
    <section class="how" aria-labelledby="how-title"><div><span class="section-kicker">Three steps</span><h2 id="how-title">How the checker works</h2></div><ol><li><b>1</b><h3>Open the file</h3><p>Drop a calendar file, choose one, or paste its text.</p></li><li><b>2</b><h3>Read each finding</h3><p>Check times, repeats, people, alarms, links, and duplicates.</p></li><li><b>3</b><h3>Export a copy</h3><p>Apply optional cleanup and download for your calendar app.</p></li></ol></section>
    <section class="boundaries" aria-labelledby="boundaries-title"><div><span class="section-kicker">What the checker cannot do</span><h2 id="boundaries-title">You choose what happens next</h2></div><div><p>The checker prepares a checked copy. You decide whether to import it.</p><p>It shows embedded links as text. It does not open them.</p></div></section>
  </main>`);
}

function demoPage(): string {
  pageTitle('Demo — ICS Intake Checker', 'Try ICS Intake Checker with a sample clinic and vendor calendar file.');
  return shell(`<main id="main"><section class="demo-heading"><span class="eyebrow">Sample inspection</span><h1 id="page-title" tabindex="-1">Inspect a sample calendar file</h1><p>The sample contains invitation details, attendee addresses, an alarm, a repeat rule, and a floating time.</p></section>${toolMarkup()}</main>`);
}

function infoPage(kind: 'privacy' | 'terms'): string {
  const privacy = kind === 'privacy';
  const heading = privacy ? 'Your event details stay on this device' : 'Use checked copies with care';
  pageTitle(`${privacy ? 'Privacy' : 'Terms'} — ICS Intake Checker`, privacy ? 'How ICS Intake Checker handles calendar files and saved local data.' : 'Terms for using ICS Intake Checker.');
  const body = privacy ? `<p>ICS Intake Checker processes calendar files inside your browser. It does not upload event details or contact links found in a file.</p><h2>Data stored on this device</h2><p>The app saves your latest opened file in browser storage so a refresh does not erase your work. Choose “Forget this file” to remove it. Demo data stays in a separate in-memory workspace.</p><h2>Network requests</h2><p>The installed app may request its own files and check for an updated app shell. It uses no analytics, advertising, third-party scripts, or remote fonts.</p><h2>Your choices</h2><p>You can clear this site's storage in browser settings. Downloaded calendar copies remain wherever you save them.</p>` : `<p>This utility explains common ICS risks and creates a checked copy. You decide whether to import any file.</p><h2>Your next step</h2><p>The checker prepares a download. You import it yourself in your calendar app.</p><h2>Your responsibility</h2><p>Review event times, repeats, people, alarms, and calendar app before import. Keep the original file until you confirm the result.</p><h2>Warranty</h2><p>The software is provided under the MIT License without warranty. Do not use it as the only record for medical, legal, or emergency schedules.</p>`;
  return shell(`<main id="main" class="legal"><span class="eyebrow">${privacy ? 'Privacy' : 'Terms'}</span><h1 id="page-title" tabindex="-1">${heading}</h1><p class="updated">Effective 28 August 2026</p>${body}</main>`);
}

function notFound(): string {
  pageTitle('Page not found — ICS Intake Checker', 'Return to ICS Intake Checker.');
  return shell(`<main id="main" class="not-found"><div class="lost-file" aria-hidden="true">404</div><h1 id="page-title" tabindex="-1">This calendar file took a wrong turn</h1><p>The page does not exist. Your open file has not moved.</p><a class="primary-button" href="/" data-route>Return to the checker</a></main>`);
}

async function db(action: 'get' | 'set' | 'clear', value?: { source: string; name: string }): Promise<{ source: string; name: string } | undefined> {
  return new Promise((resolve) => {
    const request = indexedDB.open('ics-intake-checker', 1);
    request.onupgradeneeded = () => request.result.createObjectStore('files');
    request.onerror = () => resolve(undefined);
    request.onsuccess = () => {
      const database = request.result;
      const tx = database.transaction('files', action === 'get' ? 'readonly' : 'readwrite');
      const store = tx.objectStore('files');
      const op = action === 'get' ? store.get('latest') : action === 'set' ? store.put(value, 'latest') : store.delete('latest');
      op.onsuccess = () => resolve(action === 'get' ? op.result : undefined);
      op.onerror = () => resolve(undefined);
    };
  });
}

function render(focus = false): void {
  const path = window.location.pathname.replace(/\/$/, '') || '/';
  state.demo = path === '/demo';
  app.innerHTML = path === '/' ? landing() : path === '/demo' ? demoPage() : path === '/privacy' ? infoPage('privacy') : path === '/terms' ? infoPage('terms') : notFound();
  bind();
  if (focus) {
    const title = document.querySelector<HTMLElement>('h1');
    title?.focus();
    live.textContent = title?.textContent || 'Page changed';
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }
}

function parseSource(source: string, name: string, persist = true): void {
  state.inspection = inspectIcs(source);
  state.fileName = name;
  state.repairs = { ...initialRepairs };
  state.pasteOpen = false;
  if (persist && !state.demo) void db('set', { source, name });
  render();
  document.querySelector('#checker')?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  live.textContent = `Inspection finished. ${state.inspection.events.length} events and ${state.inspection.findings.length} findings.`;
}

async function readFile(file?: File): Promise<void> {
  const error = document.querySelector('#file-error');
  if (!file) return;
  if (!file.name.toLowerCase().endsWith('.ics') && file.type !== 'text/calendar') { if (error) error.textContent = 'That file is not an ICS calendar. Choose a file ending in .ics.'; return; }
  if (file.size > 5_000_000) { if (error) error.textContent = 'That file is larger than 5 MB. Choose a smaller calendar file.'; return; }
  try { parseSource(await file.text(), file.name); }
  catch { if (error) error.textContent = 'The file could not be read. Save it again as plain-text ICS, then retry.'; }
}

function readPastedSource(source: string): void {
  const error = document.querySelector('#file-error');
  if (!source.trim()) { if (error) error.textContent = 'Paste ICS calendar text, then choose Check pasted text.'; return; }
  if (new Blob([source]).size > 5_000_000) { if (error) error.textContent = 'That text is larger than 5 MB. Paste a smaller calendar file.'; return; }
  parseSource(source, 'pasted-calendar.ics');
}

function loadDemo(): void {
  state.demo = true;
  state.destination = 'apple';
  state.pasteOpen = false;
  parseSource(SAMPLE_ICS, 'sample-clinic-and-vendor.ics', false);
}

async function returnToRealFile(): Promise<void> {
  state.demo = false;
  state.destination = 'apple';
  state.repairs = { ...initialRepairs };
  state.pasteOpen = false;
  state.inspection = undefined;
  state.fileName = '';
  history.pushState({}, '', '/');
  const saved = await db('get');
  if (saved) { state.inspection = inspectIcs(saved.source); state.fileName = saved.name; }
  render(true);
  live.textContent = saved ? 'Returned to your saved file.' : 'Returned to your file workspace.';
}

function download(): void {
  if (!state.inspection?.canExport) return;
  const contents = repairIcs(state.inspection, state.repairs, state.destination);
  const blob = new Blob([contents], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${state.fileName.replace(/\.ics$/i, '') || 'calendar'}-checked-${state.destination}.ics`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  live.textContent = 'Checked ICS copy downloaded.';
}

function bind(): void {
  document.querySelectorAll<HTMLAnchorElement>('[data-route]').forEach((link) => link.addEventListener('click', (event) => { event.preventDefault(); history.pushState({}, '', link.pathname); if (link.pathname === '/demo') loadDemo(); else render(true); }));
  document.querySelector<HTMLInputElement>('#ics-file')?.addEventListener('change', (event) => void readFile((event.target as HTMLInputElement).files?.[0]));
  const drop = document.querySelector<HTMLElement>('.drop-zone');
  drop?.addEventListener('dragover', (event) => { event.preventDefault(); drop.classList.add('is-dragging'); });
  drop?.addEventListener('dragleave', () => drop.classList.remove('is-dragging'));
  drop?.addEventListener('drop', (event) => { event.preventDefault(); drop.classList.remove('is-dragging'); void readFile(event.dataTransfer?.files[0]); });
  document.querySelector('[data-action="clear"]')?.addEventListener('click', () => {
    if (state.demo) { loadDemo(); live.textContent = 'The sample file was reloaded.'; return; }
    state.inspection = undefined; state.fileName = ''; void db('clear'); render(); live.textContent = 'The saved file was forgotten.';
  });
  document.querySelector('[data-action="export"]')?.addEventListener('click', download);
  document.querySelector('[data-action="reset-demo"]')?.addEventListener('click', () => { loadDemo(); live.textContent = 'The sample was reset.'; });
  document.querySelector('[data-action="start-real"]')?.addEventListener('click', () => void returnToRealFile());
  document.querySelector('[data-action="toggle-paste"]')?.addEventListener('click', () => { state.pasteOpen = !state.pasteOpen; render(); document.querySelector<HTMLTextAreaElement>('#ics-text')?.focus(); });
  document.querySelector<HTMLFormElement>('#paste-form')?.addEventListener('submit', (event) => { event.preventDefault(); readPastedSource(document.querySelector<HTMLTextAreaElement>('#ics-text')?.value || ''); });
  document.querySelector<HTMLSelectElement>('#destination')?.addEventListener('change', (event) => { state.destination = (event.target as HTMLSelectElement).value as Destination; render(); document.querySelector<HTMLSelectElement>('#destination')?.focus(); });
  document.querySelectorAll<HTMLInputElement>('[data-repair]').forEach((input) => input.addEventListener('change', () => { state.repairs[input.dataset.repair as keyof RepairOptions] = input.checked; }));
}

window.addEventListener('popstate', () => {
  if (window.location.pathname === '/demo') loadDemo();
  else render(true);
});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then((registration) => {
    void navigator.serviceWorker.ready.then((readyRegistration) => {
      const worker = readyRegistration.active;
      if (!worker) return;
      const urls = [...document.querySelectorAll<HTMLScriptElement | HTMLLinkElement>('script[src], link[rel="stylesheet"]')]
        .map((element) => element instanceof HTMLScriptElement ? element.src : element.href)
        .filter((url) => new URL(url).origin === location.origin);
      const channel = new MessageChannel();
      channel.port1.onmessage = () => { document.documentElement.dataset.offlineReady = 'true'; };
      worker.postMessage({ type: 'CACHE_URLS', urls }, [channel.port2]);
    });
    registration.addEventListener('updatefound', () => {
      const worker = registration.installing;
      worker?.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
          live.textContent = 'An app update is ready. Reload to use it.';
          const toast = document.createElement('div');
          toast.className = 'update-toast';
          toast.setAttribute('role', 'status');
          toast.innerHTML = '<span>An app update is ready.</span><button type="button">Reload app</button>';
          toast.querySelector('button')?.addEventListener('click', () => location.reload());
          document.body.append(toast);
        }
      });
    });
  }).catch(() => { /* The app still works without installation support. */ });
}

async function start(): Promise<void> {
  if (window.location.pathname === '/demo' || new URLSearchParams(location.search).get('demo') === '1') {
    if (location.pathname !== '/demo') history.replaceState({}, '', '/demo');
    loadDemo();
    return;
  }
  if (window.location.pathname === '/') {
    const saved = await db('get');
    if (saved) { state.inspection = inspectIcs(saved.source); state.fileName = saved.name; }
  }
  render();
}

void start();
