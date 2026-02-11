import type { Page } from 'playwright';
import type { ShippingDetails, PaymentDetails, OrderResult } from '@ecommerce-automation/shared';
import { CheckoutPage } from '../pages/checkout.page.js';
import { captureScreenshot } from '../helpers/screenshot.js';
import { withRetry } from '../helpers/retry.js';
import { logger } from '../helpers/logger.js';

export interface CheckoutFlowOptions {
  shipping: ShippingDetails;
  payment: PaymentDetails;
}

export async function checkoutFlow(page: Page, options: CheckoutFlowOptions): Promise<OrderResult> {
  const checkoutPage = new CheckoutPage(page);

  await withRetry(
    async () => {
      await checkoutPage.fillShippingDetails(options.shipping);
    },
    'shipping',
  );

  await withRetry(
    async () => {
      await checkoutPage.selectPaymentMethod(options.payment);
    },
    'payment',
  );

  await withRetry(
    async () => {
      await checkoutPage.confirmOrder();
    },
    'confirm-order',
  );

  // Capture proof screenshot
  const screenshotPath = await captureScreenshot(page, 'order-confirmation');
  logger.info({ screenshotPath }, 'Checkout flow completed');

  return {
    success: true,
    message: 'Payment was successful',
    screenshotPath,
    timestamp: new Date().toISOString(),
  };
}
