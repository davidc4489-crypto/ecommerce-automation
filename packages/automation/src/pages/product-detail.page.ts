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
    await waitForSelector(this.page, SELECTORS.productName);
  }

  async getProductName(): Promise<string> {
    const el = this.page.locator(SELECTORS.productName);
    return (await el.textContent()) ?? '';
  }

  async getProductPrice(): Promise<string> {
    const el = this.page.locator(SELECTORS.productPrice);
    return (await el.textContent()) ?? '';
  }

  async isAddToCartEnabled(): Promise<boolean> {
    const btn = this.page.locator(SELECTORS.addToCart);
    return btn.isEnabled({ timeout: 5000 }).catch(() => false);
  }

  async addToCart(): Promise<void> {
    logger.info('Adding product to cart');
    const enabled = await this.isAddToCartEnabled();
    if (!enabled) {
      throw new Error('Product is out of stock (add-to-cart button is disabled)');
    }
    await this.page.click(SELECTORS.addToCart);
    // Wait for toast confirmation
    await waitForText(this.page, 'Product added to shopping cart.');
    logger.info('Product added to cart successfully');
  }
}
