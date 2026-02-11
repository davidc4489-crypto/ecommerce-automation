import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  headless: process.env.HEADLESS !== 'false',
  targetUrl: process.env.TARGET_URL || 'https://practicesoftwaretesting.com',
  testEmail: process.env.TEST_EMAIL || 'customer@practicesoftwaretesting.com',
  testPassword: process.env.TEST_PASSWORD || 'welcome01',
  browserTimeout: parseInt(process.env.BROWSER_TIMEOUT || '30000', 10),
  maxRetries: parseInt(process.env.MAX_RETRIES || '3', 10),
  screenshotDir: process.env.SCREENSHOT_DIR || './screenshots',
};
