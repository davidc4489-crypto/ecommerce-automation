import { describe, it, expect } from 'vitest';
import { searchQuerySchema, shippingDetailsSchema, paymentDetailsSchema } from '../../packages/shared/src/utils/validators.js';

describe('searchQuerySchema', () => {
  it('validates valid search query', () => {
    const result = searchQuerySchema.safeParse({ query: 'hammer' });
    expect(result.success).toBe(true);
  });

  it('rejects empty query', () => {
    const result = searchQuerySchema.safeParse({ query: '' });
    expect(result.success).toBe(false);
  });

  it('allows optional maxPrice', () => {
    const result = searchQuerySchema.safeParse({ query: 'drill', maxPrice: 50 });
    expect(result.success).toBe(true);
  });

  it('rejects negative maxPrice', () => {
    const result = searchQuerySchema.safeParse({ query: 'drill', maxPrice: -10 });
    expect(result.success).toBe(false);
  });
});

describe('shippingDetailsSchema', () => {
  const valid = {
    address: '123 Main St',
    city: 'New York',
    state: 'NY',
    country: 'US',
    postcode: '10001',
  };

  it('validates complete shipping details', () => {
    const result = shippingDetailsSchema.safeParse(valid);
    expect(result.success).toBe(true);
  });

  it('rejects missing city', () => {
    const { city, ...incomplete } = valid;
    const result = shippingDetailsSchema.safeParse(incomplete);
    expect(result.success).toBe(false);
  });

  it('rejects empty address', () => {
    const result = shippingDetailsSchema.safeParse({ ...valid, address: '' });
    expect(result.success).toBe(false);
  });
});

describe('paymentDetailsSchema', () => {
  it('validates bank-transfer method', () => {
    const result = paymentDetailsSchema.safeParse({ method: 'bank-transfer' });
    expect(result.success).toBe(true);
  });

  it('rejects invalid method', () => {
    const result = paymentDetailsSchema.safeParse({ method: 'bitcoin' });
    expect(result.success).toBe(false);
  });
});
