import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { readFileSync } from 'node:fs';

const cleanIcs = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Fixture//EN\r\nBEGIN:VEVENT\r\nUID:clean-1@example.test\r\nDTSTAMP:20260820T090000Z\r\nSUMMARY:Library orientation\r\nDTSTART:20260907T090000Z\r\nDTEND:20260907T100000Z\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;

const previewIcs = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Fixture//EN\r\nBEGIN:VEVENT\r\nUID:school-pickup@example.test\r\nDTSTAMP:20260820T090000Z\r\nSUMMARY:School pickup\r\nDTSTART:20261012T081500Z\r\nDTEND:20261012T084500Z\r\nEND:VEVENT\r\nBEGIN:VEVENT\r\nUID:team-lunch@example.test\r\nDTSTAMP:20260820T090000Z\r\nSUMMARY:Team lunch\r\nDTSTART:20261013T121500Z\r\nDTEND:20261013T131500Z\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;

function sizedIcs(bytes: number): string {
  // LF keeps the byte count stable when a textarea normalizes pasted newlines.
  const beforePadding = 'BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Size boundary fixture//EN\nX-PADDING:';
  const afterPadding = '\nBEGIN:VEVENT\nUID:size-boundary@example.test\nDTSTAMP:20260820T090000Z\nSUMMARY:Size boundary event\nDTSTART:20260907T090000Z\nDTEND:20260907T100000Z\nEND:VEVENT\nEND:VCALENDAR\n';
  const paddingBytes = bytes - Buffer.byteLength(beforePadding) - Buffer.byteLength(afterPadding);
  if (paddingBytes < 0) throw new Error('Requested fixture is too small');
  const source = `${beforePadding}${'A'.repeat(paddingBytes)}${afterPadding}`;
  expect(Buffer.byteLength(source)).toBe(bytes);
  return source;
}

async function downloadedText(page: Page): Promise<{ name: string; text: string }> {
  const event = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download checked .ics' }).click();
  const download = await event;
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  return { name: download.suggestedFilename(), text: Buffer.concat(chunks).toString('utf8') };
}

async function savedRecord(page: Page): Promise<{ source: string; name: string } | undefined> {
  return page.evaluate(() => new Promise((resolve) => {
    const request = indexedDB.open('ics-intake-checker', 1);
    request.onerror = () => resolve(undefined);
    request.onsuccess = () => {
      const tx = request.result.transaction('files', 'readonly');
      const get = tx.objectStore('files').get('latest');
      get.onsuccess = () => resolve(get.result);
      get.onerror = () => resolve(undefined);
    };
  }));
}

async function seedRealFile(page: Page, name = 'private-real.ics', source = cleanIcs): Promise<void> {
  await page.goto('/');
  await page.locator('#ics-file').setInputFiles({ name, mimeType: 'text/calendar', buffer: Buffer.from(source) });
  await expect(page.getByRole('heading', { name })).toBeVisible();
}

test('landing, metadata, and legal routes have a usable accessible skeleton', async ({ page }) => {
  for (const [path, title] of [['/', 'ICS Intake Checker — Check files before import'], ['/demo', 'Demo — ICS Intake Checker'], ['/privacy', 'Privacy — ICS Intake Checker'], ['/terms', 'Terms — ICS Intake Checker']]) {
    await page.goto(path);
    await expect(page).toHaveTitle(title);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id)).toEqual([]);
  }
});

test('round 6 copy uses direct headings and keeps artwork provenance off visitor pages', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'Import the checked copy yourself' })).toBeVisible();
  await expect(page.getByText('Original generated illustration.')).toHaveCount(0);

  await page.evaluate(() => {
    history.pushState({}, '', '/missing-inside-app');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeFocused();
  await expect(page.getByText('Original generated illustration.')).toHaveCount(0);

  const response = await page.goto('/definitely-missing-review-6');
  expect(response?.status()).toBe(404);
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  await expect(page.getByText('Original generated illustration.')).toHaveCount(0);
});

test('claims inventory gives every declared claim exactly one tagged browser test', () => {
  const claims = JSON.parse(readFileSync('.factory/claims.json', 'utf8')) as Array<{ id: string; test: string }>;
  const source = readFileSync('tests/app.spec.ts', 'utf8');
  expect(new Set(claims.map((claim) => claim.id)).size).toBe(claims.length);
  for (const claim of claims) {
    expect(source.match(new RegExp(`@claim:${claim.id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')) || []).toHaveLength(1);
    expect(claim.test).toContain(`@claim:${claim.id}`);
  }
});

test('@claim:sample-preflight one click opens three sample events with invitation, timezone, repeat, attendee, alarm, link, and duplicate findings', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.locator('.score-strip')).toContainText('3 events');
  await expect(page.getByRole('heading', { name: 'Follow-up appointment' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Vendor onboarding workshop' })).toHaveCount(2);
  for (const text of ['This is an invitation (REQUEST)', 'Event 1 has no timezone', 'Event 1 repeats without an end', 'Event 1 contains 2 attendee addresses', 'Event 1 contains 1 alarm', 'Event 1 contains 1 external link', 'Event 3 looks like a duplicate']) await expect(page.getByText(text)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download checked .ics' })).toBeEnabled();
  await page.goto('/?demo=1');
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByLabel('Demo mode')).toBeVisible();
});

test('@claim:event-preview a chosen calendar file shows every event title and start date in Event preview', async ({ page }) => {
  await page.goto('/');
  await page.locator('#ics-file').setInputFiles({ name: 'two-events.ics', mimeType: 'text/calendar', buffer: Buffer.from(previewIcs) });
  const preview = page.locator('.events-pane');
  await expect(preview.getByRole('heading', { name: 'Event preview' })).toBeVisible();
  for (const [title, start] of [['School pickup', '20261012T081500Z'], ['Team lunch', '20261013T121500Z']]) {
    const card = preview.getByRole('heading', { name: title }).locator('xpath=ancestor::article');
    await expect(card).toBeVisible();
    await expect(card.locator('time')).toHaveAttribute('datetime', start);
    await expect(card.locator('time')).not.toBeEmpty();
  }
});

test('@claim:demo-isolation every demo control and exit keeps a saved real file isolated', async ({ page }) => {
  const original = cleanIcs.replace('clean-1@example.test', 'must-survive@example.test');
  const name = 'must-survive.ics';
  async function seed(): Promise<void> {
    await seedRealFile(page, name, original);
    await expect.poll(() => savedRecord(page)).toEqual({ name, source: original });
  }
  async function confirmRealFileAndForget(): Promise<void> {
    await expect(page.getByRole('heading', { name })).toBeVisible();
    expect(await savedRecord(page)).toEqual({ name, source: original });
    await page.getByRole('button', { name: 'Forget this file' }).click();
    await expect(page.getByRole('heading', { name: 'Open a calendar file here' })).toBeVisible();
    await expect.poll(() => savedRecord(page)).toBeUndefined();
  }

  await seed();
  await page.goto('/demo');
  await page.getByLabel('Calendar app').selectOption('outlook');
  await page.getByLabel('Remove attendee details').check();
  await page.getByText('View raw ICS source').click();
  await page.getByRole('button', { name: 'Reload sample file' }).click();
  await expect(page.getByRole('heading', { name: 'sample-clinic-and-vendor.ics' })).toBeVisible();
  await page.getByRole('button', { name: 'Reset demo' }).click();
  await expect(page.getByLabel('Calendar app')).toHaveValue('apple');
  await expect(page.getByLabel('Remove attendee details')).not.toBeChecked();
  await expect(page.getByText('View raw ICS source')).not.toHaveAttribute('open', '');
  await page.getByRole('button', { name: 'Return to my file' }).click();
  await confirmRealFileAndForget();

  await seed();
  await page.goto('/demo');
  await page.getByRole('link', { name: 'ICS Intake Checker home' }).click();
  await confirmRealFileAndForget();

  await seed();
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await page.goBack();
  await expect(page).toHaveURL(/\/$/);
  await confirmRealFileAndForget();

  await seed();
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await page.getByRole('link', { name: 'ICS Intake Checker home' }).click();
  await confirmRealFileAndForget();

  await seed();
  await page.goto('/demo');
  await page.getByRole('link', { name: 'Terms' }).click();
  await page.getByRole('link', { name: 'ICS Intake Checker home' }).click();
  await confirmRealFileAndForget();
});

test('@claim:local-only event details remain local and embedded links are not opened', async ({ page }) => {
  const foreign: string[] = [];
  await page.goto('/demo');
  const appOrigin = new URL(page.url()).origin;
  page.on('request', (request) => { if (new URL(request.url()).origin !== appOrigin) foreign.push(request.url()); });
  await page.getByText('View raw ICS source').click();
  await expect(page.getByText('https://clinic.example.test/private-visit')).toBeVisible();
  expect(page.url()).toMatch(/\/demo$/);
  expect(foreign).toEqual([]);
});

test('@claim:repair-export selected fixes change only the downloaded copy', async ({ page }) => {
  const original = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nMETHOD:REQUEST\r\nBEGIN:VEVENT\r\nSUMMARY:Private meeting\r\nDTSTART:20260907T090000\r\nDTEND:20260907T100000\r\nATTENDEE:mailto:person@example.test\r\nORGANIZER:mailto:host@example.test\r\nBEGIN:VALARM\r\nACTION:DISPLAY\r\nTRIGGER:-PT1H\r\nEND:VALARM\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;
  await seedRealFile(page, 'private.ics', original);
  const defaultResult = await downloadedText(page);
  expect(defaultResult.text).toMatch(/ATTENDEE|ORGANIZER|BEGIN:VALARM|METHOD:REQUEST/);
  for (const label of ['Remove attendee details', 'Remove every alarm', 'Remove invitation mode', 'Add missing event IDs', 'Add creation stamps']) await page.getByLabel(label).check();
  const result = await downloadedText(page);
  expect(result.name).toBe('private-checked-apple.ics');
  expect(result.text).not.toMatch(/ATTENDEE|ORGANIZER|BEGIN:VALARM|METHOD:REQUEST/);
  expect(result.text).toContain('UID:local-');
  expect(result.text).toMatch(/DTSTAMP:\d{8}T\d{6}Z/);
  expect(result.text).not.toMatch(/(?<!\r)\n/);
  expect(await savedRecord(page)).toEqual({ name: 'private.ics', source: original });
  await page.reload();
  await expect(page.locator('pre')).toContainText(original);
});

test('@claim:calendar-export creates an Apple, Google, and Outlook checked copy', async ({ page }) => {
  for (const destination of ['apple', 'google', 'outlook'] as const) {
    await page.goto('/');
    await page.locator('#ics-file').setInputFiles({ name: 'clean.ics', mimeType: 'text/calendar', buffer: Buffer.from(cleanIcs) });
    await page.getByLabel('Calendar app').selectOption(destination);
    const result = await downloadedText(page);
    expect(result.name).toBe(`clean-checked-${destination}.ics`);
    if (destination === 'outlook') expect(result.text).toContain('METHOD:PUBLISH');
    else expect(result.text).not.toContain('METHOD:PUBLISH');
    expect(result.text).toContain('BEGIN:VEVENT');
    await page.getByRole('button', { name: 'Forget this file' }).click();
    await expect(page.locator('#ics-file')).toBeAttached();
  }
});

test('@claim:risk-detection detects representative malformed calendar-file risks', async ({ page }) => {
  const bad = `BEGIN:VCALENDAR\nVERSION:1.0\nMETHOD:CANCEL\nBEGIN:VEVENT\nUID:same\nSUMMARY:Bad range\nDTSTART;TZID=Not/A_Zone:20261340T100000\nDTEND:20260101T090000\nRRULE:INTERVAL=0\nSTATUS:CANCELLED\nATTENDEE:mailto:person@example.test\nORGANIZER:mailto:host@example.test\nURL:https://example.test/hidden\nBEGIN:VALARM\nACTION:DISPLAY\nTRIGGER:-PT1H\nEND:VALARM\nEND:VEVENT\nBEGIN:VEVENT\nUID:same\nSUMMARY:Bad range\nDTSTART:20261340T100000\nDTEND:20260101T090000\nEND:VEVENT\nEND:VCALENDAR`;
  await page.goto('/');
  await page.locator('#ics-file').setInputFiles({ name: 'problem.ics', mimeType: 'text/calendar', buffer: Buffer.from(bad) });
  for (const text of ['Calendar version 2.0 is missing', 'This file cancels events', 'Event 1 has an invalid start time', 'Event 1 uses an unknown timezone', 'Event 1 has an invalid repeat rule', 'Event 1 is cancelled', 'Event 1 contains 1 attendee address', 'Event 1 contains 1 alarm', 'Event 1 contains 1 external link', 'Event 2 repeats an event ID', 'Event 2 looks like a duplicate']) await expect(page.getByText(text)).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download checked .ics' })).toBeDisabled();
});

test('@claim:paste-intake pasted ICS text uses the same checker and local storage', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: 'Paste ICS text' }).click();
  await page.getByLabel('Paste calendar file text').fill(cleanIcs);
  await page.getByRole('button', { name: 'Check pasted text' }).click();
  await expect(page.getByRole('heading', { name: 'pasted-calendar.ics' })).toBeVisible();
  expect(await savedRecord(page)).toEqual({ name: 'pasted-calendar.ics', source: cleanIcs });
});

test('@claim:intake-size-limit accepts 5,000,000 bytes and rejects 5,000,001 bytes for file and paste intake', async ({ page }) => {
  test.setTimeout(60_000);
  const atLimit = sizedIcs(5_000_000);
  const overLimit = `${atLimit}A`;

  await page.goto('/');
  await page.locator('#ics-file').setInputFiles({ name: 'at-limit.ics', mimeType: 'text/calendar', buffer: Buffer.from(atLimit) });
  await expect(page.getByRole('heading', { name: 'at-limit.ics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Size boundary event' })).toBeVisible();
  await page.getByRole('button', { name: 'Forget this file' }).click();

  await page.locator('#ics-file').setInputFiles({ name: 'over-limit.ics', mimeType: 'text/calendar', buffer: Buffer.from(overLimit) });
  await expect(page.getByText('That file is larger than 5 MB. Choose a smaller calendar file.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open a calendar file here' })).toBeVisible();
  expect(await savedRecord(page)).toBeUndefined();

  await page.getByRole('button', { name: 'Paste ICS text' }).click();
  const pastedText = page.getByLabel('Paste calendar file text');
  await pastedText.evaluate((element, value) => { (element as HTMLTextAreaElement).value = value; }, atLimit);
  await page.getByRole('button', { name: 'Check pasted text' }).click();
  await expect(page.getByRole('heading', { name: 'pasted-calendar.ics' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Size boundary event' })).toBeVisible();
  await page.getByRole('button', { name: 'Forget this file' }).click();

  await page.getByRole('button', { name: 'Paste ICS text' }).click();
  await page.getByLabel('Paste calendar file text').evaluate((element, value) => { (element as HTMLTextAreaElement).value = value; }, overLimit);
  await page.getByRole('button', { name: 'Check pasted text' }).click();
  await expect(page.getByText('That text is larger than 5 MB. Paste a smaller calendar file.')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Open a calendar file here' })).toBeVisible();
  expect(await savedRecord(page)).toBeUndefined();
});

test('@claim:local-restore restores the latest real file after refresh until the user forgets it', async ({ page }) => {
  await seedRealFile(page, 'clean.ics');
  await page.reload();
  await expect(page.getByRole('heading', { name: 'clean.ics' })).toBeVisible();
  await page.getByRole('button', { name: 'Forget this file' }).click();
  await expect(page.getByRole('heading', { name: 'Open a calendar file here' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Open a calendar file here' })).toBeVisible();
});

test('@claim:offline-reload demo reloads without a network after its first visit', async ({ page, context }) => {
  await page.goto('/demo');
  await expect(page.getByText('What to check')).toBeVisible();
  await page.evaluate(async () => {
    await navigator.serviceWorker.ready;
    if (!navigator.serviceWorker.controller) await new Promise<void>((resolve) => navigator.serviceWorker.addEventListener('controllerchange', () => resolve(), { once: true }));
  });
  await expect(page.locator('html')).toHaveAttribute('data-offline-ready', 'true');
  await context.setOffline(true);
  await page.reload();
  await expect(page.getByText('What to check')).toBeVisible();
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
});

test('@claim:no-third-party-runtime all product routes load without third-party runtime requests', async ({ page }) => {
  const foreign: string[] = [];
  const appOrigin = new URL('/', test.info().project.use.baseURL as string).origin;
  page.on('request', (request) => { if (new URL(request.url()).origin !== appOrigin) foreign.push(request.url()); });
  for (const path of ['/', '/demo', '/privacy', '/terms', '/definitely-missing-review-path']) {
    await page.goto(path);
    expect(await page.locator('script[src], link[rel="stylesheet"]').evaluateAll((items) => items.every((item) => new URL((item as HTMLScriptElement | HTMLLinkElement).src || (item as HTMLLinkElement).href, location.href).origin === location.origin))).toBe(true);
  }
  expect(foreign).toEqual([]);
});

test('demo bar stays visible, routes have status semantics, 404 has a shared shell, and mobile targets fit fingers', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/demo');
  for (const position of [0, 700, 2200]) {
    await page.evaluate((y) => window.scrollTo(0, y), position);
    const box = await page.getByLabel('Demo mode').boundingBox();
    expect(box && box.y >= 0 && box.y < 844).toBeTruthy();
  }
  for (const locator of [page.getByRole('button', { name: 'Reset demo' }), page.getByRole('button', { name: 'Return to my file' }), page.getByRole('link', { name: 'ICS Intake Checker home' }), page.getByRole('link', { name: 'Privacy' }).last(), page.getByRole('link', { name: 'Terms' })]) {
    const box = await locator.boundingBox();
    expect(box && box.width >= 44 && box.height >= 44).toBeTruthy();
  }
  const missing = await page.goto('/definitely-missing-review-path');
  expect(missing?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found — ICS Intake Checker');
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible();
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://ics-intake-checker.sociobot.in/404');
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /.+/);
  await expect(page.locator('link[rel="icon"]')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'ICS Intake Checker home' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Privacy' }).last()).toBeVisible();
  await expect(page.getByRole('link', { name: 'Terms' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Return to the checker' })).toBeVisible();
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  const notFoundAxe = await new AxeBuilder({ page }).analyze();
  expect(notFoundAxe.violations.filter((item) => ['serious', 'critical'].includes(item.impact || '')).map((item) => item.id)).toEqual([]);
  const demo = await page.goto('/demo');
  expect(demo?.status()).toBe(200);
  await page.getByRole('link', { name: 'Privacy' }).first().click();
  await expect(page.locator('h1')).toHaveText('Your event details stay on this device');
  await expect(page.locator('h1')).toBeFocused();
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('Inspect a sample calendar file');
  await expect(page.locator('h1')).toBeFocused();
  await page.goForward();
  await expect(page.locator('h1')).toHaveText('Your event details stay on this device');
  await expect(page.locator('h1')).toBeFocused();
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});

test('keyboard focus stays with the action after demo reset, reload, forget, and closing paste', async ({ page }) => {
  await page.goto('/demo');
  const reset = page.getByRole('button', { name: 'Reset demo' });
  await reset.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Reset demo' })).toBeFocused();

  const reload = page.getByRole('button', { name: 'Reload sample file' });
  await reload.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('button', { name: 'Reload sample file' })).toBeFocused();

  await page.goto('/');
  const paste = page.getByRole('button', { name: 'Paste ICS text' });
  await paste.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByLabel('Paste calendar file text')).toBeFocused();
  await page.getByRole('button', { name: 'Paste ICS text' }).press('Enter');
  await expect(page.getByRole('button', { name: 'Paste ICS text' })).toBeFocused();

  await seedRealFile(page, 'focus-real.ics');
  const forget = page.getByRole('button', { name: 'Forget this file' });
  await forget.focus();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('heading', { name: 'Open a calendar file here' })).toBeFocused();
});
