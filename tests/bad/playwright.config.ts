import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from '@playwright/test';

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
const webBaseUrl = process.env.E2E_BASE_URL ?? 'http://127.0.0.1:5173';
const useExternalApplication = Boolean(process.env.E2E_BASE_URL);

export default defineConfig({
  testDir: '.',
  fullyParallel: false,
  workers: 1,
  forbidOnly: Boolean(process.env.CI),
  retries: 0,
  reporter: [
    ['list'],
    [
      'html',
      {
        outputFolder: path.join(rootDir, 'playwright-report/bad'),
        open: 'never',
      },
    ],
  ],
  outputDir: path.join(rootDir, 'test-results/bad'),
  use: {
    baseURL: webBaseUrl,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  webServer: useExternalApplication
    ? undefined
    : [
        {
          command: 'pnpm --filter @products/api run dev',
          cwd: rootDir,
          url: 'http://127.0.0.1:3000/health',
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
        {
          command: 'pnpm --filter @products/web run dev',
          cwd: rootDir,
          url: webBaseUrl,
          reuseExistingServer: !process.env.CI,
          timeout: 120_000,
        },
      ],
});
