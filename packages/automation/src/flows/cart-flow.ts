import type { Page } from 'playwright';
import type { Product, SelectionPolicy } from '@ecommerce-automation/shared';
import { selectProduct } from '@ecommerce-automation/shared';
import { HomePage } from '../pages/home.page.js';
import { ProductDetailPage } from '../pages/product-detail.page.js';
import { CartPage } from '../pages/cart.page.js';
import { withRetry } from '../helpers/retry.js';
import { logger } from '../helpers/logger.js';

export interface CartFlowOptions {
  products: Product[];
  productId?: string;
  selectionPolicy?: SelectionPolicy;
}

export async function cartFlow(page: Page, options: CartFlowOptions): Promise<Product> {
  const { products, productId, selectionPolicy = 'first' } = options;

  // Select which product to add
  let selectedProduct: Product;
  if (productId) {
    const found = products.find((p) => p.id === productId);
    if (!found) throw new Error(`Product with id "${productId}" not found in results`);
    selectedProduct = found;
  } else {
    selectedProduct = selectProduct(products, selectionPolicy);
  }

  logger.info({ product: selectedProduct.title, price: selectedProduct.price }, 'Selected product for cart');

  await withRetry(
    async () => {
      // Navigate directly to the product detail page
      logger.info({ url: selectedProduct.productURL }, 'Navigating to product page');
      await page.goto(selectedProduct.productURL);

      // Add to cart
      const detailPage = new ProductDetailPage(page);
      await detailPage.waitForLoad();
      await detailPage.addToCart();
    },
    'add-to-cart',
  );

  logger.info('Cart flow completed');
  return selectedProduct;
}

export async function proceedToCheckout(page: Page): Promise<void> {
  const homePage = new HomePage(page);
  await homePage.goToCart();

  const cartPage = new CartPage(page);
  await cartPage.waitForLoad();
  await cartPage.proceed();

  logger.info('Proceeded to checkout from cart');
}
