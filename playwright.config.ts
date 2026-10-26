import { defineConfig } from '@playwright/test';
import 'dotenv/config';

const AUTH_FILE = '.auth/user.json';

export default defineConfig({
  testDir: './tests',
  // The flows share one account and one cart, so they run one at a time, in order.
  fullyParallel: false,
  workers: 1,
  retries: 0,
  // noon is a heavy live site; give each flow room to breathe.
  timeout: 180_000,
  expect: { timeout: 20_000 },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'https://www.noon.com',
    channel: 'chrome',
    headless: process.env.HEADLESS === 'true',
    viewport: { width: 1440, height: 900 },
    locale: 'ar-EG',
    timezoneId: 'Africa/Cairo',
    actionTimeout: 30_000,
    navigationTimeout: 60_000,
    launchOptions: { slowMo: Number(process.env.SLOW_MO ?? 250) },
    screenshot: 'only-on-failure',
    video: process.env.VIDEO === 'off' ? 'off' : 'on',
    // Traces record every typed value, including the password, so they stay off.
    trace: 'off',
  },
  projects: [
    {
      name: 'sign-in',
      testMatch: /01-sign-in\.setup\.ts/,
    },
    {
      name: 'flows',
      testMatch: /\d\d-.*\.spec\.ts/,
      dependencies: ['sign-in'],
      use: { storageState: AUTH_FILE },
    },
  ],
});
