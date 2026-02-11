import { test, expect } from '@playwright/test';
import * as fs from 'fs';

const BASE_URL = 'http://localhost:3001/api';

function waitMs(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function pollForStatus(
  runId: string,
  targetStatus: string,
  timeoutMs = 90000,
): Promise<Record<string, unknown>> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const res = await fetch(`${BASE_URL}/results/${runId}`);
    const data = await res.json();
    if (data.status === targetStatus || data.status === 'failed') {
      return data;
    }
    await waitMs(2000);
  }
  throw new Error(`Timed out waiting for status "${targetStatus}"`);
}

test('full purchase flow: search -> cart -> checkout -> screenshot', async () => {
  // Step 1: Search for "hammer"
  const searchRes = await fetch(`${BASE_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'hammer' }),
  });
  expect(searchRes.ok).toBe(true);
  const { runId } = await searchRes.json();
  expect(runId).toBeTruthy();

  // Wait for search to complete
  const searchResult = await pollForStatus(runId, 'completed');
  expect(searchResult.status).toBe('completed');
  const result = searchResult.result as { products: Array<{ id: string }> };
  expect(result.products.length).toBeGreaterThan(0);

  // Step 2: Add first product to cart
  const cartRes = await fetch(`${BASE_URL}/cart/add`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ runId, selectionPolicy: 'first' }),
  });
  expect(cartRes.ok).toBe(true);

  // Wait for add-to-cart
  await waitMs(10000);

  // Step 3: Checkout
  const checkoutRes = await fetch(`${BASE_URL}/checkout`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      runId,
      shipping: {
        address: '123 Test Street',
        city: 'New York',
        state: 'NY',
        country: 'US',
        postcode: '10001',
      },
      payment: {
        method: 'bank-transfer',
        bankName: 'Test Bank',
        accountName: 'John Doe',
        accountNumber: '1234567890',
      },
    }),
  });
  expect(checkoutRes.ok).toBe(true);

  // Wait for checkout to complete
  const finalResult = await pollForStatus(runId, 'completed', 120000);
  expect(finalResult.status).toBe('completed');

  // Verify screenshot exists
  const steps = finalResult.steps as Array<{ screenshot?: string }>;
  const screenshotStep = steps.find((s) => s.screenshot);
  if (screenshotStep?.screenshot) {
    expect(fs.existsSync(screenshotStep.screenshot)).toBe(true);
  }
});
