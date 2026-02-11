# E-commerce Automation

A web application that wraps Playwright browser automation to perform **Search -> Cart -> Checkout** on [practicesoftwaretesting.com](https://practicesoftwaretesting.com) (Toolshop v5.0).

## Tech Stack

- **Runtime**: Node.js 20+ / TypeScript 5.x
- **Backend**: Express.js
- **Automation**: Playwright
- **Frontend**: React 18 + Vite + Tailwind CSS
- **Unit Tests**: Vitest
- **E2E Tests**: Playwright Test
- **Logging**: pino (structured JSON)
- **Validation**: zod

## Project Structure

```
packages/
  shared/       # Domain models, validators, pure utilities
  automation/   # Playwright page objects, flows, browser manager
  server/       # Express API (routes, services, middleware)
  client/       # React frontend (Vite + Tailwind)
tests/
  unit/         # Vitest unit tests
  integration/  # Playwright integration tests
screenshots/    # Proof screenshots output
```

## Setup

### Prerequisites

- Node.js 20+
- npm 9+

### Install

```bash
npm install
npx playwright install chromium
```

### Environment

Copy `.env.example` to `.env` and adjust if needed:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Server port |
| `HEADLESS` | `true` | Run browser headless |
| `TARGET_URL` | `https://practicesoftwaretesting.com` | Target site |
| `TEST_EMAIL` | `customer@practicesoftwaretesting.com` | Login email |
| `TEST_PASSWORD` | `welcome01` | Login password |
| `BROWSER_TIMEOUT` | `30000` | Default timeout (ms) |
| `SCREENSHOT_DIR` | `./screenshots` | Screenshot output dir |

## Running

### Development

```bash
npm run dev
```

This starts both the API server (port 3001) and the React dev server (port 5173 with proxy to API).

Open http://localhost:5173 in your browser.

### Usage Flow

1. **Search**: Enter a product name (e.g., "hammer") and optional max price
2. **Buy**: Click "Buy" on a product from the results
3. **Checkout**: Fill shipping/payment details and click "Complete Purchase"
4. **Confirmation**: See the order confirmation and proof screenshot

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/search` | Start product search automation |
| `POST` | `/api/cart/add` | Add product to cart |
| `POST` | `/api/checkout` | Complete checkout |
| `GET` | `/api/status/:runId` | SSE stream of progress |
| `GET` | `/api/results/:runId` | Get run results |
| `GET` | `/api/screenshot/:runId` | Get proof screenshot |

## Automation Flow

1. Launch browser (headless/headed via env)
2. Login with test credentials at `/auth/login`
3. Navigate to home, search for products
4. Extract products from DOM via `$$eval('.card', ...)`
5. Apply max price filter (if set)
6. Click selected product -> detail page -> add to cart
7. Navigate to cart -> proceed to checkout
8. Fill shipping details -> select payment -> confirm order
9. Capture full-page proof screenshot

**Robustness**: explicit waits only (no arbitrary sleeps), 30s default timeout, retry with exponential backoff (3 attempts), error screenshots on failure.

## Testing

### Unit Tests

```bash
npm run test:unit
```

Tests cover: price normalization, product selection policies, cart calculations, input validation.

### Integration Tests

```bash
# Start server first
npm run dev:server

# In another terminal
npm run test:integration
```

Runs the full purchase flow via API: search -> cart -> checkout -> verify screenshot.

## Architecture

The project uses **npm workspaces** monorepo with four packages:

- **shared**: Pure TypeScript models and utilities with zero side effects
- **automation**: Playwright Page Object Models + composable flows
- **server**: Express API that orchestrates automation runs with SSE progress
- **client**: React SPA that drives the automation via the API
