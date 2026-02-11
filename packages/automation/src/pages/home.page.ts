import type { Page } from 'playwright';
import { waitForSelector } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';
import type { RawProductData } from '@ecommerce-automation/shared';

const SELECTORS = {
  searchQuery: '[data-test="search-query"]',
  searchSubmit: '[data-test="search-submit"]',
  searchReset: '[data-test="search-reset"]',
  productName: '[data-test="product-name"]',
  productCard: 'a.card',
  navCart: '[data-test="nav-cart"]',
} as const;

export class HomePage {
  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    logger.info('Navigating to home page');
    await this.page.goto('https://practicesoftwaretesting.com');
    await waitForSelector(this.page, SELECTORS.productName);
  }

  async search(query: string): Promise<void> {
    logger.info({ query }, 'Searching for products');
    await this.page.fill(SELECTORS.searchQuery, query);
    await this.page.click(SELECTORS.searchSubmit);
    // Wait for results to update after search
    await this.page.waitForLoadState('networkidle');
    await waitForSelector(this.page, SELECTORS.productName);
  }

  async getProductCards(): Promise<RawProductData[]> {
    await waitForSelector(this.page, SELECTORS.productName);

    return this.page.$$eval(SELECTORS.productCard, (cards) =>
      cards.map((card) => {
        const anchor = card as HTMLAnchorElement;
        const titleEl = card.querySelector('[data-test="product-name"]');
        const priceEl = card.querySelector('[data-test="product-price"]');
        const imgEl = card.querySelector('img');
        return {
          id: anchor.dataset.test?.replace('product-', '') ?? '',
          title: titleEl?.textContent?.trim() ?? '',
          price: priceEl?.textContent?.trim() ?? '',
          imgSrc: imgEl?.src ?? '',
          href: anchor.href ?? '',
        };
      }),
    );
  }

  async clickProduct(index: number): Promise<void> {
    const cards = this.page.locator(SELECTORS.productCard);
    const count = await cards.count();
    if (index >= count) {
      throw new Error(`Product index ${index} out of range (${count} products found)`);
    }
    logger.info({ index }, 'Clicking product');
    await cards.nth(index).click();
  }

  async goToCart(): Promise<void> {
    logger.info('Navigating to cart');
    await this.page.click(SELECTORS.navCart);
  }
}
