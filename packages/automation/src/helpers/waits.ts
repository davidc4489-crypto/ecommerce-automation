import type { Page } from 'playwright';

const DEFAULT_TIMEOUT = 30_000;

export async function waitForSelector(page: Page, selector: string, timeout = DEFAULT_TIMEOUT): Promise<void> {
  await page.waitForSelector(selector, { state: 'visible', timeout });
}

export async function waitForNavigation(page: Page, url: string | RegExp, timeout = DEFAULT_TIMEOUT): Promise<void> {
  await page.waitForURL(url, { timeout });
}

export async function waitForNetworkIdle(page: Page, timeout = DEFAULT_TIMEOUT): Promise<void> {
  await page.waitForLoadState('networkidle', { timeout });
}

export async function waitForText(page: Page, text: string, timeout = DEFAULT_TIMEOUT): Promise<void> {
  await page.getByText(text).waitFor({ state: 'visible', timeout });
}
