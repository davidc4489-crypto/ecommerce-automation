import { apiPost } from './client.js';

export interface CheckoutRequest {
  runId: string;
  shipping: {
    address: string;
    city: string;
    state: string;
    country: string;
    postcode: string;
  };
  payment: {
    method: string;
    bankName?: string;
    accountName?: string;
    accountNumber?: string;
  };
}

export interface CheckoutResponse {
  runId: string;
  status: string;
}

export function startCheckout(params: CheckoutRequest): Promise<CheckoutResponse> {
  return apiPost<CheckoutResponse>('/checkout', params);
}
