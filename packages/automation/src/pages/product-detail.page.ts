import type { Page } from 'playwright';
import { waitForSelector, waitForText } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';

const SELECTORS = {
  addToCart: '#btn-add-to-cart',
  productName: '[data-test="product-name"]',
  productPrice: '[data-test="unit-price"]',
  quantity: '[data-test="quantity"]',
  toastMessage: '.toast-body',
} as const;

export class ProductDetailPage {
  constructor(private page: Page) {}

  async waitForLoad(): Promise<void> {
    await waitForSelector(this.page, SELECTORS.addToCart);
  }

  async getProductName(): Promise<string> {
    const el = this.page.locator(SELECTORS.productName);
    return (await el.textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    const el = this.page.locator(SELECTORS.productPrice);
    return (await el.textContent()) ?? '';
  }

  async addToCart(): Promise<void> {
    logger.info('Adding product to cart');
    await this.page.click(SELECTORS.addToCart);
    // Wait for toast confirmation
    await waitForText(this.page, 'Product added to shopping cart.');
    logger.info('Product added to cart successfully');
  }
}
