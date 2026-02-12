import type { Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { fileURLToPath } from 'url';

// Resolve screenshots dir relative to the monorepo root (5 levels up from this file)
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.resolve(__dirname, '..', '..', '..', '..');
const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || path.join(PROJECT_ROOT, 'screenshots');

export async function captureScreenshot(page: Page, name: string): Promise<string> {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `${name}-${timestamp}.png`;
  const filepath = path.join(SCREENSHOT_DIR, filename);

  await page.screenshot({ path: filepath, fullPage: true });
  return filepath;
}

export async function captureErrorScreenshot(page: Page, stepName: string): Promise<string> {
  return captureScreenshot(page, `error-${stepName}`);
}
