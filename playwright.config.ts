import { defineConfig, devices } from '@playwright/test';

const externalBaseURL = process.env.PLAYWRIGHT_BASE_URL;

export default defineConfig({
  testDir: './tests',
  timeout: externalBaseURL ? 60_000 : 30_000,
  expect: { timeout: 5_000 },
  fullyParallel: true,
  workers: externalBaseURL ? 1 : undefined,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL: externalBaseURL || 'http://127.0.0.1:4173',
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['Desktop Chrome'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true } }
  ],
  webServer: externalBaseURL ? undefined : {
    command: 'npm run build && npm run test-server',
    port: 4173,
    reuseExistingServer: true,
    timeout: 60_000
  }
});
