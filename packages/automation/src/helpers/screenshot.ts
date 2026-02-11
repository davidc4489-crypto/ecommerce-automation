import type { Page } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

const SCREENSHOT_DIR = process.env.SCREENSHOT_DIR || './screenshots';

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
