import { describe, it, expect } from 'vitest';
import { selectProduct } from '../../packages/shared/src/policies/product-selection.js';
import type { Product } from '../../packages/shared/src/models/product.js';

const products: Product[] = [
  { id: '1', title: 'Hammer', price: 15.99, currency: 'USD', productURL: '/p/1', source: 'test' },
  { id: '2', title: 'Pliers', price: 8.50, currency: 'USD', productURL: '/p/2', source: 'test' },
  { id: '3', title: 'Saw', price: 22.00, currency: 'USD', productURL: '/p/3', source: 'test' },
];

describe('selectProduct', () => {
  it('selects first product with "first" policy', () => {
    const result = selectProduct(products, 'first');
    expect(result.id).toBe('1');
  });

  it('selects cheapest product with "cheapest" policy', () => {
    const result = selectProduct(products, 'cheapest');
    expect(result.id).toBe('2');
    expect(result.price).toBe(8.50);
  });

  it('defaults to first policy', () => {
    const result = selectProduct(products);
    expect(result.id).toBe('1');
  });

  it('throws on empty array', () => {
    expect(() => selectProduct([])).toThrow('No products available for selection');
  });

  it('returns single product for single-element array', () => {
    const result = selectProduct([products[1]], 'cheapest');
    expect(result.id).toBe('2');
  });
});
