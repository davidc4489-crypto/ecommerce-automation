import type { Page } from 'playwright';
import { normalizeProducts, type RawProductData, type Product } from '@ecommerce-automation/shared';
import { waitForSelector } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';

export async function extractProducts(page: Page): Promise<Product[]> {
  // Wait for actual product content, not skeleton cards
  await waitForSelector(page, '[data-test="product-name"]');

  const rawData: RawProductData[] = await page.$$eval('a.card', (cards) =>
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

  logger.info({ count: rawData.length }, 'Extracted raw products from DOM');
  return normalizeProducts(rawData);
}

export function filterByMaxPrice(products: Product[], maxPrice?: number): Product[] {
  if (maxPrice === undefined) return products;
  return products.filter((p) => p.price <= maxPrice);
}
