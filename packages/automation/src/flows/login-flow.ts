import type { Page } from 'playwright';
import { LoginPage } from '../pages/login.page.js';
import { withRetry } from '../helpers/retry.js';
import { logger } from '../helpers/logger.js';

export interface LoginCredentials {
  email: string;
  password: string;
}

const DEFAULT_CREDENTIALS: LoginCredentials = {
  email: process.env.TEST_EMAIL || 'customer@practicesoftwaretesting.com',
  password: process.env.TEST_PASSWORD || 'welcome01',
};

export async function loginFlow(page: Page, credentials?: LoginCredentials): Promise<void> {
  const creds = credentials || DEFAULT_CREDENTIALS;
  const loginPage = new LoginPage(page);

  await withRetry(
    async () => {
      await loginPage.navigate();
      await loginPage.login(creds.email, creds.password);
    },
    'login',
  );

  logger.info('Login flow completed');
}
