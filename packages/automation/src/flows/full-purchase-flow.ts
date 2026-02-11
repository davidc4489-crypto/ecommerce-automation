import type { Page } from 'playwright';
import type {
  SearchQuery,
  SearchResult,
  Product,
  ShippingDetails,
  PaymentDetails,
  OrderResult,
  AutomationStep,
  SelectionPolicy,
} from '@ecommerce-automation/shared';
import { loginFlow } from './login-flow.js';
import { searchFlow } from './search-flow.js';
import { cartFlow, proceedToCheckout } from './cart-flow.js';
import { checkoutFlow } from './checkout-flow.js';
import { captureErrorScreenshot } from '../helpers/screenshot.js';
import { logger } from '../helpers/logger.js';

export interface PurchaseFlowOptions {
  query: SearchQuery;
  shipping: ShippingDetails;
  payment: PaymentDetails;
  productId?: string;
  selectionPolicy?: SelectionPolicy;
  onStep?: (step: AutomationStep) => void;
}

export interface PurchaseFlowResult {
  searchResult: SearchResult;
  selectedProduct: Product;
  orderResult: OrderResult;
  steps: AutomationStep[];
}

function createStep(name: string): AutomationStep {
  return { name, status: 'running', startedAt: new Date().toISOString() };
}

function completeStep(step: AutomationStep): AutomationStep {
  const now = new Date().toISOString();
  const durationMs = new Date(now).getTime() - new Date(step.startedAt!).getTime();
  return { ...step, status: 'completed', completedAt: now, durationMs };
}

function failStep(step: AutomationStep, error: string): AutomationStep {
  return { ...step, status: 'failed', completedAt: new Date().toISOString(), error };
}

export async function fullPurchaseFlow(page: Page, options: PurchaseFlowOptions): Promise<PurchaseFlowResult> {
  const steps: AutomationStep[] = [];
  const notify = options.onStep || (() => {});

  const runStep = async <T>(name: string, fn: () => Promise<T>): Promise<T> => {
    const step = createStep(name);
    steps.push(step);
    notify(step);

    try {
      const result = await fn();
      const completed = completeStep(step);
      Object.assign(step, completed);
      notify(completed);
      return result;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const failed = failStep(step, errorMsg);
      Object.assign(step, failed);
      notify(failed);

      try {
        const screenshot = await captureErrorScreenshot(page, name);
        step.screenshot = screenshot;
      } catch {
        // Ignore screenshot errors
      }

      throw err;
    }
  };

  logger.info({ query: options.query.query }, 'Starting full purchase flow');

  // Step 1: Login
  await runStep('login', () => loginFlow(page));

  // Step 2: Search
  const searchResult = await runStep('search', () => searchFlow(page, options.query));

  if (searchResult.products.length === 0) {
    throw new Error(`No products found for query: "${options.query.query}"`);
  }

  // Step 3: Add to cart
  const selectedProduct = await runStep('add-to-cart', () =>
    cartFlow(page, {
      products: searchResult.products,
      productId: options.productId,
      selectionPolicy: options.selectionPolicy,
    }),
  );

  // Step 4: Proceed to checkout
  await runStep('proceed-to-checkout', () => proceedToCheckout(page));

  // Step 5: Checkout
  const orderResult = await runStep('checkout', () =>
    checkoutFlow(page, {
      shipping: options.shipping,
      payment: options.payment,
    }),
  );

  logger.info('Full purchase flow completed successfully');

  return { searchResult, selectedProduct, orderResult, steps };
}
