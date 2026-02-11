import type { Page } from 'playwright';
import { normalizeProducts, type RawProductData, type Product } from '@ecommerce-automation/shared';
import { waitForSelector } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';

export async function extractProducts(page: Page): Promise<Product[]> {
  await waitForSelector(page, '.card');

  const rawData: RawProductData[] = await page.$$eval('.card', (cards) =>
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

  logger.info({ count: rawData.length }, 'Extracted raw products from DOM');
  return normalizeProducts(rawData);
}

export function filterByMaxPrice(products: Product[], maxPrice?: number): Product[] {
  if (maxPrice === undefined) return products;
  return products.filter((p) => p.price <= maxPrice);
}
