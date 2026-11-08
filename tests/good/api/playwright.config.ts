import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const apiBaseUrl = process.env.API_BASE_URL ?? 'http://127.0.0.1:3000';
const startApi = process.env.API_EXTERNAL !== '1';

export default defineConfig({
  testDir: '.',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: path.join(rootDir, 'playwright-report/good-api'),
        open: 'never',
      },
    ],
  ],
  outputDir: path.join(rootDir, 'test-results/good-api'),
  globalSetup: path.join(rootDir, 'tests/good/support/global-setup.ts'),
  use: {
    baseURL: apiBaseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
  },
  webServer: startApi
    ? {
        command: 'pnpm --filter @products/api run dev',
        cwd: rootDir,
        url: `${apiBaseUrl}/health`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      }
    : undefined,
});
