import type { Product } from '../models/product.js';

export type SelectionPolicy = 'cheapest' | 'first';

export function selectProduct(products: Product[], policy: SelectionPolicy = 'first'): Product {
  if (products.length === 0) {
    throw new Error('No products available for selection');
  }

  switch (policy) {
    case 'cheapest': {
      let cheapest = products[0];
      for (const product of products) {
        if (product.price < cheapest.price) {
          cheapest = product;
        }
      }
      return cheapest;
    }
    case 'first':
    default:
      return products[0];
  }
}
