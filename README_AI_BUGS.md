# AI-Generated Bugs & Issues

This document lists the bugs found in AI-generated code and the fixes applied.

## Bugs Found and Fixed

### Bug 1: Selector `.card a` Matches Nothing
- **File**: `packages/automation/src/pages/home.page.ts`
- **Severity**: Critical
- **Symptom**: Clicking on a product times out after 30s ("waiting for locator('.card a').filter({ hasText: '...' })")
- **Cause**: On practicesoftwaretesting.com, `<a class="card">` is the root element. The selector `.card a` looks for an `<a>` child of a `.card`, which does not exist.
- **Fix**: Selector changed to `a.card`, direct navigation by product URL instead of clicking by title.

### Bug 2: `waitForSelector('.card')` Triggers Too Early
- **File**: `packages/automation/src/pages/home.page.ts`
- **Severity**: High
- **Symptom**: Product extraction returns empty data because skeleton cards are detected before real data loads.
- **Cause**: `.card` matches the Angular framework's loading skeleton cards.
- **Fix**: Wait on `[data-test="product-name"]` which only appears with real data.

### Bug 3: Product Images Not Displayed
- **File**: `packages/automation/src/extractors/product-extractor.ts`
- **Severity**: Medium
- **Symptom**: Product cards display without images.
- **Cause**: `getAttribute('src')` returns the relative path (`/assets/img/...`), unusable from the frontend.
- **Fix**: Used `imgEl.src` (absolute URL resolved by the browser).

### Bug 4: Invalid Product URLs (`unknown-N`)
- **File**: `packages/automation/src/extractors/product-extractor.ts`
- **Severity**: Critical
- **Symptom**: Navigation to `/product/unknown-1` => 404 page => timeout.
- **Cause**: `card.querySelector('a')` returns `null` because the card itself is an `<a>`. The href was empty, fallback ID `unknown-N`.
- **Fix**: Cast to `HTMLAnchorElement`, direct reading of `anchor.href` and `anchor.dataset.test`.

### Bug 5: Out-of-Stock Products Block Add-to-Cart
- **File**: `packages/automation/src/pages/product-detail.page.ts`
- **Severity**: High
- **Symptom**: Adding "Long Nose Pliers" to cart loads indefinitely (30s timeout x 3 retries).
- **Cause**: The `#btn-add-to-cart` button is `disabled` for out-of-stock products. `page.click()` waits for the element to be "enabled", which never happens.
- **Fix**: Added `isAddToCartEnabled()` check with 5s timeout. Clear "Product is out of stock" error if disabled.

### Bug 6: Incorrect Checkout Selectors
- **File**: `packages/automation/src/pages/checkout.page.ts`
- **Severity**: Critical
- **Symptom**: Checkout times out on "waiting for [data-test='address'] to be visible".
- **Cause**: The site uses `[data-test="street"]` and `[data-test="postal_code"]`, not `address` and `postcode`. The proceed button sequence was also incorrect.
- **Fix**: Debugged real DOM, fixed all selectors and sequence (proceed-2 = skip sign-in, proceed-3 = after address, finish = after payment).

### Bug 7: Expired Session During Checkout
- **File**: `packages/server/src/services/purchase.service.ts`
- **Severity**: High
- **Symptom**: Checkout fails if the user waits between adding to cart and checking out. `proceed-2` is never visible.
- **Cause**: The session on practicesoftwaretesting.com expires. The browser is reused but authentication is no longer valid.
- **Fix**: Added automatic `loginFlow(page)` before each checkout.

### Bug 8: No Cart Persistence
- **Files**: `packages/server/src/stores/cart-store.ts` (new), `packages/client/src/pages/CartPage.tsx`
- **Severity**: High
- **Symptom**: Products added to cart disappear when navigating back to search.
- **Cause**: The cart was stored only in React state (`location.state`), lost on each navigation.
- **Fix**: Created a server-side `cartStore` with `GET /api/cart` endpoint. CartPage loads items from the server.

### Bug 9: Screenshot Saved in Wrong Location
- **File**: `packages/automation/src/helpers/screenshot.ts`
- **Severity**: Low
- **Symptom**: The `screenshots/` folder at the project root remains empty after a successful checkout.
- **Cause**: The relative path `./screenshots` is resolved relative to the server CWD (`packages/server/`), not the project root.
- **Fix**: Resolved absolute path via `import.meta.url` to the monorepo root.

## Known Remaining Issues

### 1. In-Memory Store
The `runStore` and `cartStore` are in-memory. A server restart loses all data. Acceptable for a demo project.

### 2. One Browser Per Search
Each search launches a new Playwright browser. Concurrent searches consume significant memory.

### 3. Toast Text Dependency
`addToCart()` waits for the exact text "Product added to shopping cart." — if the site changes this message, the flow will fail (with retry and error capture).
