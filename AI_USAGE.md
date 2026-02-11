# AI Usage Documentation

## Tools Used

- **Claude (Anthropic)**: Used as the primary AI coding assistant for generating the entire project structure, source code, tests, and documentation.

## How AI Was Used

### Architecture & Planning
- Designed the monorepo structure with npm workspaces
- Planned the separation of concerns across shared/automation/server/client packages
- Designed the API contract (REST + SSE for real-time updates)

### Code Generation
- **Shared package**: TypeScript interfaces, Zod validation schemas, pure utility functions (normalizer, cart calculator, product selection policies)
- **Automation package**: Playwright Page Object Models, composable flows (login, search, cart, checkout), browser lifecycle management, retry/wait helpers
- **Server package**: Express routes, middleware (request-id, error handling, validation), services, in-memory run store with SSE support
- **Client package**: React components (SearchForm, ProductList, StepTracker, CheckoutForm, ScreenshotViewer), pages with routing, API client layer, SSE hook

### Testing
- Unit tests for all shared utilities (Vitest)
- Integration test for the full purchase flow (Playwright Test)

### Documentation
- README.md with setup, usage, and architecture documentation
- This AI_USAGE.md file

## Verification Process

All AI-generated code was reviewed for:
- TypeScript type safety (strict mode)
- Proper error handling and validation
- Automation robustness (explicit waits, retry logic, no arbitrary sleeps)
- Security (input validation via Zod, no hardcoded secrets in code)
