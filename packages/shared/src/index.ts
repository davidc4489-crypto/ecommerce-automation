// Models
export type { Product, SearchQuery, SearchResult } from './models/product.js';
export type { CartItem, CartState } from './models/cart.js';
export type { ShippingDetails, PaymentDetails, OrderResult } from './models/checkout.js';
export type { RunStatus, AutomationStep, AutomationRun } from './models/automation.js';

// Policies
export { selectProduct } from './policies/product-selection.js';
export type { SelectionPolicy } from './policies/product-selection.js';

// Utilities
export { parsePrice, buildProductURL, normalizeProduct, normalizeProducts } from './utils/normalizer.js';
export type { RawProductData } from './utils/normalizer.js';
export { calculateLineTotal, calculateSubtotal, calculateCartState } from './utils/cart-calculator.js';

// Validators
export {
  searchQuerySchema,
  shippingDetailsSchema,
  paymentDetailsSchema,
  cartAddSchema,
  checkoutSchema,
} from './utils/validators.js';
export type {
  SearchQueryInput,
  ShippingDetailsInput,
  PaymentDetailsInput,
  CartAddInput,
  CheckoutInput,
} from './utils/validators.js';
