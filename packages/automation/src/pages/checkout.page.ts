import type { Page } from 'playwright';
import { waitForSelector, waitForText } from '../helpers/waits.js';
import { logger } from '../helpers/logger.js';
import type { ShippingDetails, PaymentDetails } from '@ecommerce-automation/shared';

const SELECTORS = {
  // Step 2: Sign-in (auto-completed for logged-in users)
  proceed2: '[data-test="proceed-2"]',
  // Step 3: Billing Address
  street: '[data-test="street"]',
  city: '[data-test="city"]',
  state: '[data-test="state"]',
  country: '[data-test="country"]',
  postalCode: '[data-test="postal_code"]',
  proceed3: '[data-test="proceed-3"]',
  // Step 4: Payment
  paymentMethod: '[data-test="payment-method"]',
  // Bank Transfer fields
  bankName: '[data-test="bank_name"]',
  accountName: '[data-test="account_name"]',
  accountNumber: '[data-test="account_number"]',
  // Confirmation
  finish: '[data-test="finish"]',
} as const;

export class CheckoutPage {
  constructor(private page: Page) {}

  async skipSignIn(): Promise<void> {
    logger.info('Skipping sign-in step (already logged in)');
    await waitForSelector(this.page, SELECTORS.proceed2);
    await this.page.click(SELECTORS.proceed2);
    logger.info('Sign-in step skipped');
  }

  async fillShippingDetails(shipping: ShippingDetails): Promise<void> {
    logger.info('Filling billing address');
    await waitForSelector(this.page, SELECTORS.street);

    await this.page.fill(SELECTORS.street, shipping.address);
    await this.page.fill(SELECTORS.city, shipping.city);
    await this.page.fill(SELECTORS.state, shipping.state);
    await this.page.fill(SELECTORS.country, shipping.country);
    await this.page.fill(SELECTORS.postalCode, shipping.postcode);

    await this.page.click(SELECTORS.proceed3);
    logger.info('Billing address submitted');
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

    await this.page.click(SELECTORS.finish);
    logger.info('Payment submitted');
  }

  async waitForConfirmation(): Promise<void> {
    logger.info('Waiting for order confirmation');
    await waitForText(this.page, 'Payment was successful');
    logger.info('Order confirmed successfully');
  }
}
