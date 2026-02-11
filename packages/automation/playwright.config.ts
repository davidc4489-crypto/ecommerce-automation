import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: '../../tests/integration',
  timeout: 120_000,
  retries: 1,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  reporter: [['list'], ['html', { open: 'never' }]],
});
