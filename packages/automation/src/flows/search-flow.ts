import type { Page } from 'playwright';
import type { SearchQuery, Product, SearchResult } from '@ecommerce-automation/shared';
import { HomePage } from '../pages/home.page.js';
import { extractProducts, filterByMaxPrice } from '../extractors/product-extractor.js';
import { withRetry } from '../helpers/retry.js';
import { logger } from '../helpers/logger.js';

export async function searchFlow(page: Page, query: SearchQuery): Promise<SearchResult> {
  const startTime = Date.now();
  const homePage = new HomePage(page);

  const products = await withRetry(
    async () => {
      await homePage.navigate();
      await homePage.search(query.query);
      const extracted = await extractProducts(page);
      return filterByMaxPrice(extracted, query.maxPrice);
    },
    'search',
  );

  const result: SearchResult = {
    products,
    query,
    searchDurationMs: Date.now() - startTime,
    timestamp: new Date().toISOString(),
  };

  logger.info({ productCount: products.length, durationMs: result.searchDurationMs }, 'Search flow completed');
  return result;
}
