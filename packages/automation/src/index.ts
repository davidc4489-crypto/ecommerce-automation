export { BrowserManager } from './browser-manager.js';
export type { BrowserOptions } from './browser-manager.js';

// Page Objects
export { LoginPage } from './pages/login.page.js';
export { HomePage } from './pages/home.page.js';
export { ProductDetailPage } from './pages/product-detail.page.js';
export { CartPage } from './pages/cart.page.js';
export { CheckoutPage } from './pages/checkout.page.js';

// Extractors
export { extractProducts, filterByMaxPrice } from './extractors/product-extractor.js';

// Flows
export { loginFlow } from './flows/login-flow.js';
export { searchFlow } from './flows/search-flow.js';
export { cartFlow, proceedToCheckout } from './flows/cart-flow.js';
export { checkoutFlow } from './flows/checkout-flow.js';
export { fullPurchaseFlow } from './flows/full-purchase-flow.js';
export type { PurchaseFlowOptions, PurchaseFlowResult } from './flows/full-purchase-flow.js';

// Helpers
export { withRetry } from './helpers/retry.js';
export { captureScreenshot, captureErrorScreenshot } from './helpers/screenshot.js';
export { logger } from './helpers/logger.js';
