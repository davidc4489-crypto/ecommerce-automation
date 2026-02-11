import type { Page } from 'playwright';
import { waitForSelector } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';

const SELECTORS = {
  cartItems: '[data-test="cart-content"]',
  proceed1: '[data-test="proceed-1"]',
  cartQuantity: '[data-test="cart-quantity"]',
  productTitle: '[data-test="product-title"]',
  cartTotal: '[data-test="cart-total"]',
} as const;

export class CartPage {
  constructor(private page: Page) {}

  async waitForLoad(): Promise<void> {
    await waitForSelector(this.page, SELECTORS.proceed1);
  }

  async getItemCount(): Promise<number> {
    const items = this.page.locator(SELECTORS.productTitle);
    return items.count();
  }

  async proceed(): Promise<void> {
    logger.info('Proceeding from cart to checkout');
    await this.page.click(SELECTORS.proceed1);
  }
}
