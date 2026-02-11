import { chromium, type Browser, type BrowserContext, type Page } from 'playwright';
import { logger } from './helpers/logger.js';

export interface BrowserOptions {
  headless?: boolean;
  timeout?: number;
}

export class BrowserManager {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  async launch(options: BrowserOptions = {}): Promise<Page> {
    const headless = options.headless ?? (process.env.HEADLESS !== 'false');
    const timeout = options.timeout ?? parseInt(process.env.BROWSER_TIMEOUT || '30000', 10);

    logger.info({ headless, timeout }, 'Launching browser');

    this.browser = await chromium.launch({ headless });
    this.context = await this.browser.newContext({
      viewport: { width: 1280, height: 720 },
    });
    this.context.setDefaultTimeout(timeout);
    this.page = await this.context.newPage();

    return this.page;
  }

  getPage(): Page {
    if (!this.page) {
      throw new Error('Browser not launched. Call launch() first.');
    }
    return this.page;
  }

  async close(): Promise<void> {
    logger.info('Closing browser');
    if (this.context) {
      await this.context.close();
      this.context = null;
    }
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
    this.page = null;
  }
}
