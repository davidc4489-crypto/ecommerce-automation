import type { Page } from 'playwright';
import { waitForSelector, waitForText } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';
import type { ShippingDetails, PaymentDetails } from '@ecommerce-automation/shared';

const SELECTORS = {
  // Sign-in step (step 1 - handled by login flow)
  // Address step (step 2)
  address: '[data-test="address"]',
  city: '[data-test="city"]',
  state: '[data-test="state"]',
  country: '[data-test="country"]',
  postcode: '[data-test="postcode"]',
  proceed2: '[data-test="proceed-2"]',
  // Payment step (step 3)
  paymentMethod: '[data-test="payment-method"]',
  proceed3: '[data-test="proceed-3"]',
  // Bank Transfer fields
  bankName: '[data-test="bank_name"]',
  accountName: '[data-test="account_name"]',
  accountNumber: '[data-test="account_number"]',
  // Confirmation step
  finish: '[data-test="finish"]',
  successMessage: '#order-confirmation',
} as const;

export class CheckoutPage {
  constructor(private page: Page) {}

  async fillShippingDetails(shipping: ShippingDetails): Promise<void> {
    logger.info('Filling shipping details');
    await waitForSelector(this.page, SELECTORS.address);

    await this.page.fill(SELECTORS.address, shipping.address);
    await this.page.fill(SELECTORS.city, shipping.city);
    await this.page.fill(SELECTORS.state, shipping.state);
    await this.page.fill(SELECTORS.country, shipping.country);
    await this.page.fill(SELECTORS.postcode, shipping.postcode);

    await this.page.click(SELECTORS.proceed2);
    logger.info('Shipping details submitted');
  }

  async selectPaymentMethod(payment: PaymentDetails): Promise<void> {
    logger.info({ method: payment.method }, 'Selecting payment method');
    await waitForSelector(this.page, SELECTORS.paymentMethod);

    await this.page.selectOption(SELECTORS.paymentMethod, payment.method);

    // Fill payment-specific fields
    if (payment.method === 'bank-transfer') {
      await waitForSelector(this.page, SELECTORS.bankName);
      await this.page.fill(SELECTORS.bankName, payment.bankName || 'Test Bank');
      await this.page.fill(SELECTORS.accountName, payment.accountName || 'Test Account');
      await this.page.fill(SELECTORS.accountNumber, payment.accountNumber || '1234567890');
    }

    await this.page.click(SELECTORS.proceed3);
    logger.info('Payment method selected');
  }

  async confirmOrder(): Promise<void> {
    logger.info('Confirming order');
    await waitForSelector(this.page, SELECTORS.finish);
    await this.page.click(SELECTORS.finish);

    // Wait for success
    await waitForText(this.page, 'Payment was successful');
    logger.info('Order confirmed successfully');
  }
}
