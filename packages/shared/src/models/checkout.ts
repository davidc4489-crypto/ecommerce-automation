export interface ShippingDetails {
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
}

export interface PaymentDetails {
  method: 'bank-transfer' | 'cash-on-delivery' | 'credit-card' | 'buy-now-pay-later' | 'gift-card';
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
}

export interface OrderResult {
  success: boolean;
  message: string;
  screenshotPath?: string;
  timestamp: string;
}
