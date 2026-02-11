import { describe, it, expect } from 'vitest';
import { calculateLineTotal, calculateSubtotal, calculateCartState } from '../../packages/shared/src/utils/cart-calculator.js';
import type { CartItem } from '../../packages/shared/src/models/cart.js';

const makeItem = (price: number, quantity: number): CartItem => ({
  product: { id: '1', title: 'Test', price, currency: 'USD', productURL: '/p/1', source: 'test' },
  quantity,
});

describe('calculateLineTotal', () => {
  it('calculates price * quantity', () => {
    expect(calculateLineTotal(makeItem(10, 3))).toBe(30);
  });

  it('handles decimal prices correctly', () => {
    expect(calculateLineTotal(makeItem(14.15, 2))).toBe(28.30);
  });

  it('handles floating point precision', () => {
    expect(calculateLineTotal(makeItem(0.1, 3))).toBe(0.3);
  });
});

describe('calculateSubtotal', () => {
  it('sums all line totals', () => {
    const items = [makeItem(10, 2), makeItem(5, 3)];
    expect(calculateSubtotal(items)).toBe(35);
  });

  it('returns 0 for empty cart', () => {
    expect(calculateSubtotal([])).toBe(0);
  });
});

describe('calculateCartState', () => {
  it('returns full cart state', () => {
    const items = [makeItem(10, 2), makeItem(5, 1)];
    const state = calculateCartState(items);
    expect(state.subtotal).toBe(25);
    expect(state.itemCount).toBe(3);
    expect(state.items).toHaveLength(2);
  });
});
