import { describe, it, expect } from 'vitest';
import { parsePrice, buildProductURL, normalizeProduct } from '../../packages/shared/src/utils/normalizer.js';

describe('parsePrice', () => {
  it('parses dollar amount "$14.15" to 14.15', () => {
    expect(parsePrice('$14.15')).toBe(14.15);
  });

  it('parses plain number "9.99"', () => {
    expect(parsePrice('9.99')).toBe(9.99);
  });

  it('parses price with currency symbol "€29.00"', () => {
    expect(parsePrice('€29.00')).toBe(29);
  });

  it('returns 0 for non-numeric string', () => {
    expect(parsePrice('abc')).toBe(0);
  });

  it('returns 0 for empty string', () => {
    expect(parsePrice('')).toBe(0);
  });

  it('handles price with extra whitespace', () => {
    expect(parsePrice(' $12.50 ')).toBe(12.5);
  });
});

describe('buildProductURL', () => {
  it('builds URL from slug', () => {
    expect(buildProductURL('hammer-123')).toBe('https://practicesoftwaretesting.com/product/hammer-123');
  });

  it('returns full URL if already absolute', () => {
    expect(buildProductURL('https://example.com/product/1')).toBe('https://example.com/product/1');
  });
});

describe('normalizeProduct', () => {
  it('normalizes raw product data', () => {
    const raw = {
      id: 'p1',
      title: '  Claw Hammer  ',
      price: '$12.99',
      href: '/product/p1',
      imgSrc: 'https://example.com/img.jpg',
    };
    const product = normalizeProduct(raw, 0);
    expect(product.id).toBe('p1');
    expect(product.title).toBe('Claw Hammer');
    expect(product.price).toBe(12.99);
    expect(product.currency).toBe('USD');
    expect(product.source).toBe('practicesoftwaretesting.com');
  });

  it('uses fallback values for missing fields', () => {
    const product = normalizeProduct({}, 5);
    expect(product.id).toBe('product-5');
    expect(product.title).toBe('Unknown Product');
    expect(product.price).toBe(0);
  });
});
