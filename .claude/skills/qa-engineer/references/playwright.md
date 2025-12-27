# Playwright Patterns for Next.js

Comprehensive Playwright patterns optimized for Next.js applications.

## Table of Contents

1. [Setup and Configuration](#setup-and-configuration)
2. [Locator Strategies](#locator-strategies)
3. [Authentication Patterns](#authentication-patterns)
4. [Network Mocking](#network-mocking)
5. [Visual Testing](#visual-testing)
6. [Mobile Testing](#mobile-testing)
7. [Accessibility Testing](#accessibility-testing)
8. [Performance Testing](#performance-testing)

## Setup and Configuration

### Full Configuration Template

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
  
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },

  projects: [
    // Desktop browsers
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    
    // Mobile devices
    { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
    { name: 'mobile-safari', use: { ...devices['iPhone 13'] } },
    
    // Branded browsers
    { name: 'edge', use: { ...devices['Desktop Edge'], channel: 'msedge' } },
    { name: 'chrome', use: { ...devices['Desktop Chrome'], channel: 'chrome' } },
  ],

  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

### Environment-Specific Configuration

```typescript
// playwright.config.ts
const getBaseURL = () => {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.BASE_URL) {
    return process.env.BASE_URL;
  }
  return 'http://localhost:3000';
};

export default defineConfig({
  use: {
    baseURL: getBaseURL(),
  },
});
```

## Locator Strategies

### Preferred Locators (in order)

```typescript
// 1. Role-based (best for accessibility)
page.getByRole('button', { name: 'Submit' });
page.getByRole('textbox', { name: 'Email' });
page.getByRole('link', { name: 'Home' });

// 2. Label-based
page.getByLabel('Email address');
page.getByPlaceholder('Enter your email');

// 3. Text-based
page.getByText('Welcome back');
page.getByTitle('Close dialog');

// 4. Test ID (when semantic locators aren't possible)
page.getByTestId('submit-button');

// 5. CSS (last resort)
page.locator('.custom-component');
page.locator('[data-state="open"]');
```

### Chaining and Filtering

```typescript
// Filter by text
page.getByRole('listitem').filter({ hasText: 'Product 1' });

// Filter by child element
page.getByRole('listitem').filter({
  has: page.getByRole('heading', { name: 'Featured' })
});

// Chaining locators
page.getByRole('article')
  .filter({ hasText: 'Next.js' })
  .getByRole('link', { name: 'Read more' });

// nth element
page.getByRole('listitem').nth(2);
page.getByRole('listitem').first();
page.getByRole('listitem').last();
```

## Authentication Patterns

### Session Storage (Recommended)

```typescript
// e2e/auth.setup.ts
import { test as setup, expect } from '@playwright/test';
import path from 'path';

const authFile = path.join(__dirname, '../.auth/user.json');

setup('authenticate', async ({ page }) => {
  await page.goto('/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password123');
  await page.getByRole('button', { name: 'Sign in' }).click();
  
  await page.waitForURL('/dashboard');
  await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible();
  
  await page.context().storageState({ path: authFile });
});
```

```typescript
// playwright.config.ts
export default defineConfig({
  projects: [
    { name: 'setup', testMatch: /.*\.setup\.ts/ },
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        storageState: '.auth/user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
```

### Multiple User Roles

```typescript
// e2e/auth.setup.ts
import { test as setup } from '@playwright/test';

const USERS = {
  admin: { email: 'admin@example.com', password: 'admin123', file: '.auth/admin.json' },
  user: { email: 'user@example.com', password: 'user123', file: '.auth/user.json' },
  guest: { email: 'guest@example.com', password: 'guest123', file: '.auth/guest.json' },
};

for (const [role, credentials] of Object.entries(USERS)) {
  setup(`authenticate as ${role}`, async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(credentials.email);
    await page.getByLabel('Password').fill(credentials.password);
    await page.getByRole('button', { name: 'Sign in' }).click();
    await page.waitForURL('/dashboard');
    await page.context().storageState({ path: credentials.file });
  });
}
```

## Network Mocking

### Route Interception

```typescript
test('handles API errors gracefully', async ({ page }) => {
  await page.route('**/api/users', (route) => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ error: 'Internal server error' }),
    });
  });

  await page.goto('/users');
  await expect(page.getByText('Something went wrong')).toBeVisible();
});
```

### Mock API Responses

```typescript
test('displays user data', async ({ page }) => {
  await page.route('**/api/users/*', async (route) => {
    const json = {
      id: '1',
      name: 'Test User',
      email: 'test@example.com',
    };
    await route.fulfill({ json });
  });

  await page.goto('/users/1');
  await expect(page.getByText('Test User')).toBeVisible();
});
```

### Delay Responses

```typescript
test('shows loading state', async ({ page }) => {
  await page.route('**/api/data', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    await route.fulfill({ json: { data: 'loaded' } });
  });

  await page.goto('/dashboard');
  await expect(page.getByTestId('loading-spinner')).toBeVisible();
  await expect(page.getByText('loaded')).toBeVisible({ timeout: 5000 });
});
```

### Modify Responses

```typescript
test('modifies API response', async ({ page }) => {
  await page.route('**/api/products', async (route) => {
    const response = await route.fetch();
    const json = await response.json();
    
    // Modify the response
    json.products = json.products.map(p => ({
      ...p,
      price: p.price * 0.9, // 10% discount
    }));
    
    await route.fulfill({ json });
  });

  await page.goto('/products');
});
```

## Visual Testing

### Screenshot Comparisons

```typescript
test('homepage matches snapshot', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveScreenshot('homepage.png', {
    maxDiffPixels: 100,
  });
});

test('component matches snapshot', async ({ page }) => {
  await page.goto('/components');
  const card = page.getByTestId('product-card').first();
  await expect(card).toHaveScreenshot('product-card.png');
});
```

### Full Page Screenshots

```typescript
test('full page screenshot', async ({ page }) => {
  await page.goto('/long-page');
  await expect(page).toHaveScreenshot('long-page.png', {
    fullPage: true,
  });
});
```

## Mobile Testing

### Device Emulation

```typescript
test.describe('Mobile', () => {
  test.use({ ...devices['iPhone 13'] });

  test('mobile navigation works', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: 'Menu' }).click();
    await expect(page.getByRole('navigation')).toBeVisible();
  });
});
```

### Touch Events

```typescript
test('swipe gesture', async ({ page }) => {
  await page.goto('/carousel');
  
  const carousel = page.getByTestId('carousel');
  const box = await carousel.boundingBox();
  
  await page.mouse.move(box!.x + box!.width - 20, box!.y + box!.height / 2);
  await page.mouse.down();
  await page.mouse.move(box!.x + 20, box!.y + box!.height / 2, { steps: 10 });
  await page.mouse.up();
  
  await expect(page.getByText('Slide 2')).toBeVisible();
});
```

## Accessibility Testing

### Axe Integration

```typescript
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage has no accessibility violations', async ({ page }) => {
  await page.goto('/');
  
  const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
  expect(accessibilityScanResults.violations).toEqual([]);
});

test('form is accessible', async ({ page }) => {
  await page.goto('/contact');
  
  const accessibilityScanResults = await new AxeBuilder({ page })
    .include('[data-testid="contact-form"]')
    .analyze();
    
  expect(accessibilityScanResults.violations).toEqual([]);
});
```

### Keyboard Navigation

```typescript
test('form is keyboard navigable', async ({ page }) => {
  await page.goto('/login');
  
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Email')).toBeFocused();
  
  await page.keyboard.press('Tab');
  await expect(page.getByLabel('Password')).toBeFocused();
  
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'Sign in' })).toBeFocused();
});
```

## Performance Testing

### Web Vitals

```typescript
test('page loads within performance budget', async ({ page }) => {
  await page.goto('/');
  
  const metrics = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcp = entries.find(e => e.entryType === 'largest-contentful-paint');
        resolve({
          lcp: lcp?.startTime,
        });
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });
  });
  
  expect(metrics.lcp).toBeLessThan(2500); // LCP < 2.5s
});
```

### Network Throttling

```typescript
test.describe('Slow network', () => {
  test.use({
    launchOptions: {
      args: ['--throttle-network=3G'],
    },
  });

  test('page loads on slow network', async ({ page }) => {
    await page.goto('/', { timeout: 60000 });
    await expect(page.getByRole('main')).toBeVisible({ timeout: 30000 });
  });
});
```
