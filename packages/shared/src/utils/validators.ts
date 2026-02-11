import { z } from 'zod';

export const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required').max(200, 'Search query too long'),
  maxPrice: z.number().positive('Max price must be positive').optional(),
  category: z.string().optional(),
});

export const shippingDetailsSchema = z.object({
  address: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  country: z.string().min(1, 'Country is required'),
  postcode: z.string().min(1, 'Postcode is required'),
});

export const paymentDetailsSchema = z.object({
  method: z.enum(['bank-transfer', 'cash-on-delivery', 'credit-card', 'buy-now-pay-later', 'gift-card']),
  bankName: z.string().optional(),
  accountName: z.string().optional(),
  accountNumber: z.string().optional(),
});

export const cartAddSchema = z.object({
  runId: z.string().min(1, 'Run ID is required'),
  productId: z.string().optional(),
  selectionPolicy: z.enum(['cheapest', 'first']).default('first'),
});

export const checkoutSchema = z.object({
  runId: z.string().min(1, 'Run ID is required'),
  shipping: shippingDetailsSchema,
  payment: paymentDetailsSchema,
});

export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type ShippingDetailsInput = z.infer<typeof shippingDetailsSchema>;
export type PaymentDetailsInput = z.infer<typeof paymentDetailsSchema>;
export type CartAddInput = z.infer<typeof cartAddSchema>;
export type CheckoutInput = z.infer<typeof checkoutSchema>;
