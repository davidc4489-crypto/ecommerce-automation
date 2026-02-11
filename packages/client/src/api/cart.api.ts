import { apiPost } from './client.js';

export interface CartAddRequest {
  runId: string;
  productId?: string;
  selectionPolicy?: 'cheapest' | 'first';
}

export interface CartAddResponse {
  runId: string;
  status: string;
}

export function addToCart(params: CartAddRequest): Promise<CartAddResponse> {
  return apiPost<CartAddResponse>('/cart/add', params);
}
