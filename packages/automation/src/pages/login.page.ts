import type { Page } from 'playwright';
import { waitForSelector } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';

const SELECTORS = {
  email: '[data-test="email"]',
  password: '[data-test="password"]',
  loginSubmit: '[data-test="login-submit"]',
  loginError: '[data-test="login-error"]',
} as const;

export class LoginPage {
  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    logger.info('Navigating to login page');
    await this.page.goto('https://practicesoftwaretesting.com/auth/login');
    await waitForSelector(this.page, SELECTORS.email);
  }

  async login(email: string, password: string): Promise<void> {
    logger.info({ email }, 'Logging in');
    await this.page.fill(SELECTORS.email, email);
    await this.page.fill(SELECTORS.password, password);
    await this.page.click(SELECTORS.loginSubmit);

    // Wait for navigation away from login page
    await this.page.waitForURL('**/account', { timeout: 15000 });
    logger.info('Login successful');
  }
}
