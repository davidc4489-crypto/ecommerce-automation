import type { CartItem, CartState } from '../models/cart.js';

export function calculateLineTotal(item: CartItem): number {
  return Math.round(item.product.price * item.quantity * 100) / 100;
}

export function calculateSubtotal(items: CartItem[]): number {
  const total = items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
  return Math.round(total * 100) / 100;
}

export function calculateCartState(items: CartItem[]): CartState {
  return {
    items,
    subtotal: calculateSubtotal(items),
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };
}
