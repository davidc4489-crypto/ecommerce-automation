# AI Usage Documentation

## 1. AI Tools Used

- **Claude Code (Anthropic, Claude Opus 4.6)**: Primary AI assistant used via the Claude Code CLI for code generation, debugging, and documentation.
- **Playwright**: Browser automation tool (non-AI) used to interact with the target site.

## 2. Prompts As Written

### Prompt 1: Initial Plan
> "Implement the following plan: Build a web app that wraps Playwright browser automation to perform Search -> Cart -> Checkout on practicesoftwaretesting.com. The app is a homework assignment graded on: automation quality (35%), flow correctness (25%), architecture (20%), tests (10%), and documentation (10%). [followed by detailed plan with structure, tech stack, and implementation steps]"

### Prompt 2: Image Display Fix
> "Quand je fais une recherche, les produits correspondant s'affichent, mais pas leur image. Le site practicesoftwaretesting ne permet pas l'affichage ou il y a un bug ?"

### Prompt 3: Add-to-Cart Flow Fix
> "Il bloque encore quand je clique sur Buy. OK, mais apres avoir clique sur buy, je veux que le produit se rajoute a la cart, ce n'est pas le cas pour le moment."

### Prompt 4: Out-of-Stock + Cart Persistence
> "Ca fonctionne pour plusieurs produits mais par exemple pour le Long Nose Pliers le add to cart charge infiniment. De plus il n'y a pas de persistance, si je retourne dans la recherche pour rajouter un produit, le contenu de la cart a disparu."

### Prompt 5: Infinite Checkout Loop
> "Quand je clique sur complete purchase, le running checkout tourne infiniment."

## 3. Incorrect AI Recommendations and Applied Fixes

### Error 1: Unstable CSS Selectors (`.card a` instead of `a.card`)
- **Problem**: The AI generated the selector `.card a` with `hasText` to click on products. On practicesoftwaretesting.com, the `<a>` element IS the `.card` itself (not a child), so the selector never found a match, causing a 30s timeout.
- **Fix**: Analyzed the real DOM with a debug script (`page.$$eval`). Replaced with `a.card` and extracted `href` and `data-test` directly from the anchor element.

### Error 2: Incorrect Checkout Selectors (`address` instead of `street`)
- **Problem**: The AI assumed the checkout form fields used `[data-test="address"]` and `[data-test="postcode"]`. In reality, the site uses `[data-test="street"]` and `[data-test="postal_code"]`.
- **Impact**: Checkout failed systematically with a timeout on the address field.
- **Fix**: Debug script to list all `[data-test]` attributes in the form. Fixed all selectors and the step sequence (proceed-2 = skip sign-in, proceed-3 = after address, finish = after payment).

### Error 3: Waiting on `.card` Matching Skeleton Cards
- **Problem**: `waitForSelector('.card')` triggered immediately because the site displays skeleton loading cards with the same `.card` class before real product data loads.
- **Fix**: Replaced with `waitForSelector('[data-test="product-name"]')` which only appears when real data is loaded.

### Error 4: No Handling of Out-of-Stock Products
- **Problem**: The AI did not anticipate that some products have the `#btn-add-to-cart` button disabled. Playwright waited indefinitely for the button to become clickable.
- **Fix**: Added an `isAddToCartEnabled()` check with a 5s timeout. If the button is disabled, a clear "Product is out of stock" error is returned instead of a 30s timeout.

### Error 5: Product URLs `unknown-N`
- **Problem**: The extractor used `card.querySelector('a')` to get the product link, but on this site the card IS the `<a>` element. The selector returned `null`, generating invalid URLs like `/product/unknown-1`.
- **Fix**: Cast the card element to `HTMLAnchorElement` and used `anchor.href` and `anchor.dataset.test` directly to extract the ID and URL.

### Error 6: Images Not Displayed (`getAttribute('src')` vs `imgEl.src`)
- **Problem**: `getAttribute('src')` returns the relative path as written in the HTML (e.g., `/assets/img/product.avif`). This path is unusable by the frontend running on a different domain.
- **Fix**: Used `imgEl.src` (DOM property) which returns the absolute URL resolved by the browser.

### Error 7: Unhandled Session Expiry
- **Problem**: The checkout reused the browser from the search. After a delay (e.g., 30 min), the session on practicesoftwaretesting.com expired. The `proceed-2` button never appeared because the site required re-authentication.
- **Fix**: Added an automatic `loginFlow(page)` before each checkout to ensure a fresh session.

## 4. Secret Leak Prevention

### Implemented Measures:

1. **Environment Variables**: Site credentials (`TEST_EMAIL`, `TEST_PASSWORD`) are configured via `.env` and never hardcoded in source code. Default values are those of the public test account on practicesoftwaretesting.com.

2. **`.gitignore`**: The `.env` file and all `.env.*` files are excluded from version control:
   ```
   .env
   .env.*
   !.env.example
   ```

3. **`.env.example`**: A template file is provided with placeholders, without sensitive values:
   ```
   TEST_EMAIL=customer@practicesoftwaretesting.com
   TEST_PASSWORD=welcome01
   HEADLESS=true
   ```
   Note: these credentials are public (provided by the test site).

4. **Input Validation**: All user inputs are validated by Zod schemas before processing, preventing malicious data injection.

5. **No Tokens/API Keys**: The application uses no external API keys. Authentication is done solely through the login form on the target site within the Playwright browser.
