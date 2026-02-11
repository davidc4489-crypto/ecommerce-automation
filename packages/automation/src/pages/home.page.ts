import type { Page } from 'playwright';
import { waitForSelector } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';
import type { RawProductData } from '@ecommerce-automation/shared';

const SELECTORS = {
  searchQuery: '[data-test="search-query"]',
  searchSubmit: '[data-test="search-submit"]',
  searchReset: '[data-test="search-reset"]',
  productCard: '.card',
  navCart: '[data-test="nav-cart"]',
} as const;

export class HomePage {
  constructor(private page: Page) {}

  async navigate(): Promise<void> {
    logger.info('Navigating to home page');
    await this.page.goto('https://practicesoftwaretesting.com');
    await waitForSelector(this.page, SELECTORS.productCard);
  }

  async search(query: string): Promise<void> {
    logger.info({ query }, 'Searching for products');
    await this.page.fill(SELECTORS.searchQuery, query);
    await this.page.click(SELECTORS.searchSubmit);
    // Wait for results to update
    await this.page.waitForTimeout(1000);
    await this.page.waitForLoadState('networkidle');
  }

  async getProductCards(): Promise<RawProductData[]> {
    await waitForSelector(this.page, SELECTORS.productCard);

    return this.page.$$eval(SELECTORS.productCard, (cards) =>
      cards.map((card) => {
        const titleEl = card.querySelector('.card-title, h5');
        const priceEl = card.querySelector('[data-test="product-price"], .card-text');
        const imgEl = card.querySelector('img');
        const linkEl = card.querySelector('a');
        return {
          title: titleEl?.textContent?.trim() ?? '',
          price: priceEl?.textContent?.trim() ?? '',
          imgSrc: imgEl?.getAttribute('src') ?? '',
          href: linkEl?.getAttribute('href') ?? '',
        };
      }),
    );
  }

  async clickProduct(index: number): Promise<void> {
    const cards = this.page.locator(`${SELECTORS.productCard} a`);
    const count = await cards.count();
    if (index >= count) {
      throw new Error(`Product index ${index} out of range (${count} products found)`);
    }
    logger.info({ index }, 'Clicking product');
    await cards.nth(index).click();
  }

  async clickProductByTitle(title: string): Promise<void> {
    logger.info({ title }, 'Clicking product by title');
    await this.page.locator(`${SELECTORS.productCard} a`).filter({ hasText: title }).first().click();
  }

  async goToCart(): Promise<void> {
    logger.info('Navigating to cart');
    await this.page.click(SELECTORS.navCart);
  }
}
