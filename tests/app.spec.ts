import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const cleanIcs = `BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//Fixture//EN\r\nBEGIN:VEVENT\r\nUID:clean-1@example.test\r\nDTSTAMP:20260820T090000Z\r\nSUMMARY:Library orientation\r\nDTSTART:20260907T090000Z\r\nDTEND:20260907T100000Z\r\nEND:VEVENT\r\nEND:VCALENDAR\r\n`;

test('landing has the required structure and no serious accessibility issues', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/ICS Intake Checker/);
  await expect(page.locator('h1')).toHaveCount(1);
  await expect(page.locator('main')).toHaveCount(1);
  await expect(page.getByRole('link', { name: 'Try it with sample data' })).toBeVisible();
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations.filter((item) => ['serious', 'critical'].includes(item.impact || ''))).toEqual([]);
});

test('@claim:sample-preflight sample exposes useful risks in one click', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Try it with sample data' }).click();
  await expect(page).toHaveURL(/\/demo$/);
  await expect(page.getByText('Demo — sample data, nothing is saved')).toBeVisible();
  await expect(page.getByText('Event 1 has no timezone')).toBeVisible();
  await expect(page.getByText('Event 1 contains 2 attendee addresses')).toBeVisible();
  await expect(page.getByText('Event 3 looks like a duplicate')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Download checked .ics' })).toBeEnabled();
});

test('@claim:local-only demo flow makes no cross-origin requests', async ({ page }) => {
  const foreign: string[] = [];
  page.on('request', (request) => {
    const url = new URL(request.url());
    if (url.origin !== 'http://127.0.0.1:4173') foreign.push(request.url());
  });
  await page.goto('/demo');
  await expect(page.getByText('What to check')).toBeVisible();
  await page.getByText('View raw ICS source').click();
  expect(foreign).toEqual([]);
});

test('@claim:repair-export removes selected private fields from a downloaded copy', async ({ page }) => {
  await page.goto('/demo');
  await page.getByLabel('Remove attendee details').check();
  await page.getByLabel('Remove every alarm').check();
  await page.getByLabel('Remove invitation mode').check();
  await page.getByLabel('Add missing event IDs').check();
  await page.getByLabel('Add creation stamps').check();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download checked .ics' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('sample-clinic-and-vendor-checked-apple.ics');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  const text = Buffer.concat(chunks).toString('utf8');
  expect(text).toContain('BEGIN:VCALENDAR\r\n');
  expect(text).not.toMatch(/ATTENDEE|ORGANIZER|BEGIN:VALARM|METHOD:REQUEST/);
  expect(text).toContain('UID:local-');
  expect(text).toContain('DTSTAMP:');
});

test('@claim:calendar-export creates a calendar-specific ICS download', async ({ page }) => {
  await page.goto('/');
  await page.locator('#ics-file').setInputFiles({ name: 'clean.ics', mimeType: 'text/calendar', buffer: Buffer.from(cleanIcs) });
  await page.getByLabel('Calendar app').selectOption('outlook');
  await expect(page.getByText('Adds publishing mode when the file has no invitation mode.')).toBeVisible();
  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download checked .ics' }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe('clean-checked-outlook.ics');
  const stream = await download.createReadStream();
  const chunks: Buffer[] = [];
  for await (const chunk of stream) chunks.push(Buffer.from(chunk));
  expect(Buffer.concat(chunks).toString('utf8')).toContain('METHOD:PUBLISH');
});

test('@claim:local-restore restores the latest real file after refresh and can forget it', async ({ page }) => {
  await page.goto('/');
  await page.locator('#ics-file').setInputFiles({ name: 'clean.ics', mimeType: 'text/calendar', buffer: Buffer.from(cleanIcs) });
  await expect(page.getByRole('heading', { name: 'clean.ics' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'clean.ics' })).toBeVisible();
  await page.getByRole('button', { name: 'Forget this file' }).click();
  await page.reload();
  await expect(page.getByRole('heading', { name: 'Open a calendar file here' })).toBeVisible();
});

test('@claim:offline-reload demo reloads without a network after first visit', async ({ page, context }) => {
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

test('@claim:risk-detection detects representative malformed file risks', async ({ page }) => {
  const bad = `BEGIN:VCALENDAR\nVERSION:1.0\nMETHOD:CANCEL\nBEGIN:VEVENT\nUID:same\nSUMMARY:Bad range\nDTSTART:20261340T100000\nDTEND:20260101T090000\nRRULE:INTERVAL=0\nSTATUS:CANCELLED\nURL:https://example.test/hidden\nEND:VEVENT\nBEGIN:VEVENT\nUID:same\nSUMMARY:Bad range\nDTSTART:20261340T100000\nDTEND:20260101T090000\nEND:VEVENT\nEND:VCALENDAR`;
  await page.goto('/');
  await page.locator('#ics-file').setInputFiles({ name: 'problem.ics', mimeType: 'text/calendar', buffer: Buffer.from(bad) });
  for (const text of ['Calendar version 2.0 is missing', 'This file cancels events', 'Event 1 has an invalid start time', 'Event 1 has an invalid repeat rule', 'Event 1 is cancelled', 'Event 1 contains 1 external link', 'Event 2 repeats an event ID', 'Event 2 looks like a duplicate']) {
    await expect(page.getByText(text)).toBeVisible();
  }
  await expect(page.getByRole('button', { name: 'Download checked .ics' })).toBeDisabled();
  await page.goto('/demo');
  for (const text of ['Event 1 has no timezone', 'Event 1 repeats without an end', 'Event 1 contains 2 attendee addresses', 'Event 1 will add 1 alarm', 'Event 3 looks like a duplicate']) {
    await expect(page.getByText(text)).toBeVisible();
  }
});

test('privacy, terms, history, keyboard, and mobile layout work', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/privacy');
  await expect(page.locator('h1')).toHaveText('Your event details stay on this device');
  await page.getByRole('link', { name: 'Terms' }).click();
  await expect(page.locator('h1')).toHaveText('Use checked copies with care');
  await page.goBack();
  await expect(page.locator('h1')).toHaveText('Your event details stay on this device');
  await page.goto('/');
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to main content' })).toBeFocused();
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth)).toBe(true);
});
