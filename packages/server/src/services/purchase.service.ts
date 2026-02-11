import type { ShippingDetails, PaymentDetails, SelectionPolicy, SearchResult } from '@ecommerce-automation/shared';
import { cartFlow, proceedToCheckout, checkoutFlow } from '@ecommerce-automation/automation';
import { getBrowserForRun, closeBrowserForRun } from './automation.service.js';
import { runStore } from '../stores/run-store.js';
import pino from 'pino';

const logger = pino({ name: 'purchase-service' });

export async function addToCart(
  runId: string,
  productId?: string,
  selectionPolicy: SelectionPolicy = 'first',
): Promise<void> {
  const manager = await getBrowserForRun(runId);

  try {
    const run = runStore.getRun(runId);
    const searchResult = run?.result as SearchResult | undefined;
    if (!searchResult?.products?.length) {
      throw new Error('No search results available. Run search first.');
    }

    const page = manager.getPage();
    runStore.addStep(runId, { name: 'add-to-cart', status: 'running', startedAt: new Date().toISOString() });

    await cartFlow(page, {
      products: searchResult.products,
      productId,
      selectionPolicy,
    });

    runStore.addStep(runId, { name: 'add-to-cart', status: 'completed', completedAt: new Date().toISOString() });
    logger.info({ runId }, 'Product added to cart');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ runId, error: message }, 'Add to cart failed');
    runStore.addStep(runId, { name: 'add-to-cart', status: 'failed', error: message });
    runStore.setError(runId, message);
  }
}

export async function checkout(
  runId: string,
  shipping: ShippingDetails,
  payment: PaymentDetails,
): Promise<void> {
  const manager = await getBrowserForRun(runId);

  try {
    const page = manager.getPage();

    // Proceed from cart to checkout
    runStore.addStep(runId, { name: 'proceed-to-checkout', status: 'running', startedAt: new Date().toISOString() });
    await proceedToCheckout(page);
    runStore.addStep(runId, { name: 'proceed-to-checkout', status: 'completed', completedAt: new Date().toISOString() });

    // Checkout
    runStore.updateStatus(runId, 'running');
    runStore.addStep(runId, { name: 'checkout', status: 'running', startedAt: new Date().toISOString() });

    const orderResult = await checkoutFlow(page, { shipping, payment });

    runStore.addStep(runId, { name: 'checkout', status: 'completed', completedAt: new Date().toISOString(), screenshot: orderResult.screenshotPath });
    runStore.setResult(runId, { ...runStore.getRun(runId)?.result as object, orderResult });
    runStore.updateStatus(runId, 'completed');

    logger.info({ runId, screenshot: orderResult.screenshotPath }, 'Checkout completed');
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    logger.error({ runId, error: message }, 'Checkout failed');
    runStore.addStep(runId, { name: 'checkout', status: 'failed', error: message });
    runStore.setError(runId, message);
  } finally {
    await closeBrowserForRun(runId);
  }
}
