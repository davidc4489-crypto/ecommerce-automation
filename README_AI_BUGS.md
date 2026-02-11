# AI-Generated Bugs & Issues

This document tracks known issues and bugs encountered in the AI-generated code, along with their fixes.

## Known Issues

### 1. Selector Sensitivity
**Severity**: Medium
**Description**: The Page Object Models rely on `data-test` attributes and CSS selectors from practicesoftwaretesting.com. If the site updates its markup, selectors may break.
**Mitigation**: All selectors are centralized as constants at the top of each page object file for easy updates.

### 2. Race Conditions in Polling
**Severity**: Low
**Description**: The frontend uses `setInterval` polling to check for automation completion. In edge cases, a poll response could arrive after the component unmounts.
**Mitigation**: React state updates after unmount are harmless warnings in React 18. Could be improved with AbortController cleanup.

### 3. Toast Message Text Dependency
**Severity**: Medium
**Description**: The `ProductDetailPage.addToCart()` waits for the exact text "Product added to shopping cart." — if the site changes this message, the flow will time out.
**Mitigation**: Wrap in retry logic with screenshot capture on failure.

### 4. In-Memory Run Store
**Severity**: Low
**Description**: All automation run state is stored in memory. Server restarts lose all run data.
**Mitigation**: Acceptable for a demo/homework application. Production would use Redis or a database.

### 5. Browser Instance Per Run
**Severity**: Low
**Description**: Each automation run launches a separate browser. Concurrent runs could consume significant memory.
**Mitigation**: For the homework use case, sequential usage is expected.

## Bugs Found and Fixed During Development

_No bugs were identified during the initial generation that required fixing._
