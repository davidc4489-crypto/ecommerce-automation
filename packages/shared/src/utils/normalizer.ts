import type { Product } from '../models/product.js';

const BASE_URL = 'https://practicesoftwaretesting.com';

export function parsePrice(raw: string): number {
  const cleaned = raw.replace(/[^0-9.]/g, '');
  const parsed = parseFloat(cleaned);
  if (isNaN(parsed)) {
    return 0;
  }
  return Math.round(parsed * 100) / 100;
}

export function buildProductURL(idOrSlug: string): string {
  if (idOrSlug.startsWith('http')) {
    return idOrSlug;
  }
  return `${BASE_URL}/product/${idOrSlug}`;
}

export interface RawProductData {
  id?: string;
  title?: string;
  price?: string;
  imgSrc?: string;
  href?: string;
}

export function normalizeProduct(raw: RawProductData, index: number): Product {
  return {
    id: raw.id || raw.href?.split('/').pop() || `product-${index}`,
    title: raw.title?.trim() || 'Unknown Product',
    price: raw.price ? parsePrice(raw.price) : 0,
    currency: 'USD',
    productURL: raw.href ? buildProductURL(raw.href) : buildProductURL(`unknown-${index}`),
    imageURL: raw.imgSrc,
    source: 'practicesoftwaretesting.com',
  };
}

export function normalizeProducts(rawProducts: RawProductData[]): Product[] {
  return rawProducts.map((raw, i) => normalizeProduct(raw, i));
}
