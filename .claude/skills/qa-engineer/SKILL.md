---
name: qa-engineer
description: End-to-end QA engineering for Next.js applications. Use when setting up E2E testing, writing Playwright or Cypress tests, testing API routes, SSR/SSG, authentication flows, or debugging flaky tests. Covers test organization, CI/CD integration, and comprehensive testing strategies for the full Next.js stack (frontend, backend, infrastructure).
---

# QA Engineer - Next.js E2E Testing

Comprehensive guidance for end-to-end testing of Next.js applications using modern automation tools.

## Quick Start

For new Next.js projects, Playwright is recommended:

```bash
npm init playwright@latest
```

Configure for Next.js in `playwright.config.ts`:

```typescript
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

## Test Organization

Structure tests by feature, not by page:

```
e2e/
├── auth/
│   ├── login.spec.ts
│   ├── logout.spec.ts
│   └── signup.spec.ts
├── checkout/
│   ├── cart.spec.ts
│   └── payment.spec.ts
├── fixtures/
│   ├── auth.fixture.ts
│   └── database.fixture.ts
├── utils/
│   └── helpers.ts
└── global-setup.ts
```

## Core Testing Patterns

### Page Object Model

```typescript
// e2e/pages/login.page.ts
import { Page, Locator } from '@playwright/test';

export class LoginPage {
  readonly page: Page;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async goto() {
    await this.page.goto('/login');
  }

  async login(email: string, password: string) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}
```

### Custom Fixtures

```typescript
// e2e/fixtures/auth.fixture.ts
import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

type AuthFixtures = {
  loginPage: LoginPage;
  authenticatedPage: Page;
};

export const test = base.extend<AuthFixtures>({
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await use(loginPage);
  },
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Password').fill('password123');
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/dashboard');
    await use(page);
  },
});

export { expect } from '@playwright/test';
```

## Next.js Specific Testing

### Testing API Routes

```typescript
import { test, expect } from '@playwright/test';

test.describe('API Routes', () => {
  test('GET /api/users returns user list', async ({ request }) => {
    const response = await request.get('/api/users');
    expect(response.ok()).toBeTruthy();
    const data = await response.json();
    expect(Array.isArray(data)).toBe(true);
  });

  test('POST /api/users creates user', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: { name: 'Test User', email: 'test@example.com' }
    });
    expect(response.status()).toBe(201);
  });
});
```

### Testing SSR/SSG Pages

```typescript
test('SSR page loads with correct data', async ({ page }) => {
  await page.goto('/products/123');
  
  // Verify server-rendered content is present immediately
  await expect(page.getByRole('heading', { name: /Product/ })).toBeVisible();
  
  // Check meta tags for SEO
  const metaDescription = await page.locator('meta[name="description"]').getAttribute('content');
  expect(metaDescription).toContain('Product');
});

test('ISR page revalidates correctly', async ({ page, request }) => {
  // First visit caches the page
  await page.goto('/blog/post-1');
  const initialContent = await page.textContent('article');
  
  // Trigger revalidation
  await request.post('/api/revalidate?path=/blog/post-1');
  
  // Verify new content after revalidation
  await page.reload();
  // Assert updated content
});
```

### Testing Middleware

```typescript
test('middleware redirects unauthenticated users', async ({ page }) => {
  await page.goto('/dashboard');
  await expect(page).toHaveURL('/login?callbackUrl=%2Fdashboard');
});

test('middleware allows authenticated users', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/dashboard');
  await expect(authenticatedPage).toHaveURL('/dashboard');
});
```

### Testing with Next.js App Router

```typescript
test.describe('App Router Features', () => {
  test('parallel routes render correctly', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-slot="analytics"]')).toBeVisible();
    await expect(page.locator('[data-slot="activity"]')).toBeVisible();
  });

  test('intercepting routes work for modals', async ({ page }) => {
    await page.goto('/photos');
    await page.getByRole('link', { name: /photo-1/ }).click();
    
    // Modal should appear without full navigation
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveURL('/photos/photo-1');
  });

  test('loading states display correctly', async ({ page }) => {
    await page.goto('/slow-page');
    await expect(page.getByText('Loading...')).toBeVisible();
    await expect(page.getByRole('main')).toBeVisible({ timeout: 10000 });
  });
});
```

## Debugging Flaky Tests

### Identify Flakiness Causes

Common causes: race conditions, network instability, state leakage, animation timing.

### Fixing Strategies

```typescript
// BAD: Arbitrary timeout
await page.waitForTimeout(2000);

// GOOD: Wait for specific condition
await page.waitForLoadState('networkidle');
await expect(page.getByRole('button')).toBeEnabled();

// GOOD: Wait for API response
await page.waitForResponse(resp => 
  resp.url().includes('/api/data') && resp.status() === 200
);
```

### Test Isolation

```typescript
test.beforeEach(async ({ page }) => {
  // Reset database state
  await page.request.post('/api/test/reset');
});

test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== 'passed') {
    await page.screenshot({ path: `screenshots/${testInfo.title}.png` });
  }
});
```

## Framework Selection

| Criteria | Playwright | Cypress |
|----------|------------|---------|
| Multi-browser | ✅ Chrome, Firefox, Safari | ⚠️ Chrome, Firefox, Edge |
| API testing | ✅ Built-in | ⚠️ Plugin required |
| Parallel execution | ✅ Native | ⚠️ Paid feature |
| Network mocking | ✅ Powerful | ✅ Good |
| Best for | Full E2E, API testing | Component + E2E |

**Recommendation**: Playwright for Next.js due to better SSR support and native API testing.

## Resources

- **Playwright patterns**: See [references/playwright.md](references/playwright.md)
- **Cypress patterns**: See [references/cypress.md](references/cypress.md)
- **Next.js testing**: See [references/nextjs-testing.md](references/nextjs-testing.md)
- **CI/CD configs**: See [assets/](assets/) for ready-to-use configuration files
