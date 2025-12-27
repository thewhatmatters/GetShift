# Next.js Testing Patterns

Comprehensive testing patterns specific to Next.js applications, covering App Router, Pages Router, and all Next.js features.

## Table of Contents

1. [App Router Testing](#app-router-testing)
2. [Pages Router Testing](#pages-router-testing)
3. [API Routes Testing](#api-routes-testing)
4. [Middleware Testing](#middleware-testing)
5. [Server Components Testing](#server-components-testing)
6. [Authentication Testing](#authentication-testing)
7. [Database Testing](#database-testing)
8. [Environment Setup](#environment-setup)

## App Router Testing

### Testing Layouts

```typescript
import { test, expect } from '@playwright/test';

test.describe('Root Layout', () => {
  test('applies layout to all pages', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    
    await page.goto('/about');
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });

  test('nested layout adds sidebar on dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
    
    await page.goto('/dashboard/settings');
    await expect(page.locator('[data-testid="sidebar"]')).toBeVisible();
  });
});
```

### Testing Loading States

```typescript
test('shows loading UI during navigation', async ({ page }) => {
  // Slow down the API response
  await page.route('**/api/data', async (route) => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    await route.fulfill({ json: { data: 'loaded' } });
  });

  await page.goto('/');
  await page.click('a[href="/slow-page"]');
  
  // loading.tsx should show
  await expect(page.getByTestId('loading-skeleton')).toBeVisible();
  
  // Wait for content
  await expect(page.getByTestId('page-content')).toBeVisible({ timeout: 5000 });
  await expect(page.getByTestId('loading-skeleton')).not.toBeVisible();
});
```

### Testing Error Boundaries

```typescript
test('error boundary catches errors', async ({ page }) => {
  await page.route('**/api/data', (route) => {
    route.fulfill({ status: 500 });
  });

  await page.goto('/data-page');
  
  // error.tsx should render
  await expect(page.getByRole('heading', { name: /something went wrong/i })).toBeVisible();
  await expect(page.getByRole('button', { name: /try again/i })).toBeVisible();
  
  // Test recovery
  await page.route('**/api/data', (route) => {
    route.fulfill({ json: { data: 'success' } });
  });
  
  await page.click('button:has-text("Try again")');
  await expect(page.getByText('success')).toBeVisible();
});
```

### Testing Parallel Routes

```typescript
test.describe('Dashboard Parallel Routes', () => {
  test('renders analytics and team slots simultaneously', async ({ page }) => {
    await page.goto('/dashboard');
    
    // Both parallel route slots should render
    await expect(page.locator('[data-slot="analytics"]')).toBeVisible();
    await expect(page.locator('[data-slot="team"]')).toBeVisible();
  });

  test('slots load independently', async ({ page }) => {
    // Slow down one API
    await page.route('**/api/analytics', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await route.fulfill({ json: { views: 1000 } });
    });

    await page.goto('/dashboard');
    
    // Team slot should load first
    await expect(page.locator('[data-slot="team"]')).toBeVisible();
    // Analytics should show loading
    await expect(page.locator('[data-slot="analytics"] [data-testid="loading"]')).toBeVisible();
    // Eventually analytics loads
    await expect(page.getByText('1000 views')).toBeVisible({ timeout: 5000 });
  });
});
```

### Testing Intercepting Routes

```typescript
test.describe('Photo Gallery Modal', () => {
  test('clicking photo opens modal without full navigation', async ({ page }) => {
    await page.goto('/photos');
    
    const initialLoadId = await page.evaluate(() => window.performance.now());
    
    await page.click('[data-testid="photo-1"]');
    
    // Modal appears
    await expect(page.getByRole('dialog')).toBeVisible();
    await expect(page).toHaveURL('/photos/1');
    
    // Page didn't fully reload
    const afterClickId = await page.evaluate(() => window.performance.now());
    expect(afterClickId - initialLoadId).toBeLessThan(1000);
  });

  test('direct navigation shows full page', async ({ page }) => {
    await page.goto('/photos/1');
    
    // Should show full page, not modal
    await expect(page.getByRole('dialog')).not.toBeVisible();
    await expect(page.getByTestId('full-photo-page')).toBeVisible();
  });
});
```

## Pages Router Testing

### Testing getServerSideProps

```typescript
test('SSR page receives props', async ({ page }) => {
  await page.goto('/products/123');
  
  // Content should be visible immediately (SSR)
  await expect(page.getByRole('heading', { name: /product/i })).toBeVisible();
  
  // Check page source for SSR verification
  const content = await page.content();
  expect(content).toContain('Product 123');
});
```

### Testing getStaticProps with ISR

```typescript
test.describe('ISR Page', () => {
  test('serves cached content', async ({ page }) => {
    await page.goto('/blog/post-1');
    const content1 = await page.textContent('article');
    
    await page.goto('/blog/post-1');
    const content2 = await page.textContent('article');
    
    expect(content1).toBe(content2);
  });

  test('revalidates on demand', async ({ page, request }) => {
    // Trigger revalidation
    await request.post('/api/revalidate', {
      data: { path: '/blog/post-1' },
    });
    
    await page.goto('/blog/post-1');
    // Content should be fresh
  });
});
```

## API Routes Testing

### Testing REST Endpoints

```typescript
import { test, expect } from '@playwright/test';

test.describe('Users API', () => {
  test('GET /api/users returns list', async ({ request }) => {
    const response = await request.get('/api/users');
    
    expect(response.ok()).toBeTruthy();
    expect(response.headers()['content-type']).toContain('application/json');
    
    const data = await response.json();
    expect(Array.isArray(data.users)).toBe(true);
  });

  test('POST /api/users creates user', async ({ request }) => {
    const response = await request.post('/api/users', {
      data: {
        name: 'Test User',
        email: 'test@example.com',
      },
    });
    
    expect(response.status()).toBe(201);
    
    const user = await response.json();
    expect(user).toHaveProperty('id');
    expect(user.name).toBe('Test User');
  });

  test('PUT /api/users/:id updates user', async ({ request }) => {
    const response = await request.put('/api/users/1', {
      data: { name: 'Updated Name' },
    });
    
    expect(response.ok()).toBeTruthy();
    
    const user = await response.json();
    expect(user.name).toBe('Updated Name');
  });

  test('DELETE /api/users/:id removes user', async ({ request }) => {
    const response = await request.delete('/api/users/1');
    expect(response.status()).toBe(204);
  });
});
```

### Testing Route Handlers (App Router)

```typescript
test.describe('App Router API', () => {
  test('handles query parameters', async ({ request }) => {
    const response = await request.get('/api/search?q=test&page=2');
    
    expect(response.ok()).toBeTruthy();
    
    const data = await response.json();
    expect(data.query).toBe('test');
    expect(data.page).toBe(2);
  });

  test('handles dynamic segments', async ({ request }) => {
    const response = await request.get('/api/posts/123/comments');
    
    const data = await response.json();
    expect(data.postId).toBe('123');
  });

  test('validates request body', async ({ request }) => {
    const response = await request.post('/api/posts', {
      data: { title: '' }, // Invalid: empty title
    });
    
    expect(response.status()).toBe(400);
    
    const error = await response.json();
    expect(error.errors).toContainEqual(
      expect.objectContaining({ field: 'title' })
    );
  });
});
```

### Testing File Uploads

```typescript
test('uploads file successfully', async ({ request }) => {
  const buffer = Buffer.from('test file content');
  
  const response = await request.post('/api/upload', {
    multipart: {
      file: {
        name: 'test.txt',
        mimeType: 'text/plain',
        buffer,
      },
      description: 'Test file',
    },
  });
  
  expect(response.status()).toBe(201);
  
  const data = await response.json();
  expect(data.url).toContain('/uploads/');
});
```

## Middleware Testing

### Testing Redirects

```typescript
test.describe('Auth Middleware', () => {
  test('redirects unauthenticated users from protected routes', async ({ page }) => {
    await page.goto('/dashboard');
    
    await expect(page).toHaveURL(/\/login/);
    expect(new URL(page.url()).searchParams.get('callbackUrl')).toBe('/dashboard');
  });

  test('allows authenticated users', async ({ page, context }) => {
    // Set auth cookie
    await context.addCookies([{
      name: 'session',
      value: 'valid-session-token',
      domain: 'localhost',
      path: '/',
    }]);
    
    await page.goto('/dashboard');
    await expect(page).toHaveURL('/dashboard');
  });
});
```

### Testing Geolocation Middleware

```typescript
test('redirects based on country', async ({ page }) => {
  // Simulate request from Germany
  await page.route('**/*', (route) => {
    route.continue({
      headers: {
        ...route.request().headers(),
        'x-vercel-ip-country': 'DE',
      },
    });
  });

  await page.goto('/');
  await expect(page).toHaveURL('/de');
});
```

### Testing Rate Limiting

```typescript
test('rate limiting blocks excessive requests', async ({ request }) => {
  const responses = [];
  
  // Make many requests quickly
  for (let i = 0; i < 15; i++) {
    const response = await request.get('/api/limited');
    responses.push(response.status());
  }
  
  // Some should be rate limited
  expect(responses).toContain(429);
});
```

## Server Components Testing

### Testing Server Component Data Fetching

```typescript
test('server component renders with data', async ({ page }) => {
  await page.goto('/products');
  
  // Server component should render immediately with data
  await expect(page.getByTestId('product-list')).toBeVisible();
  
  // Verify no loading flash (content was SSR'd)
  const loadingVisible = await page.getByTestId('loading').isVisible().catch(() => false);
  expect(loadingVisible).toBe(false);
});
```

### Testing Streaming

```typescript
test('streaming renders progressively', async ({ page }) => {
  await page.goto('/streaming-page');
  
  // First chunk appears quickly
  await expect(page.getByTestId('header')).toBeVisible({ timeout: 1000 });
  
  // Slower content streams in
  await expect(page.getByTestId('slow-content')).toBeVisible({ timeout: 5000 });
});
```

## Authentication Testing

### Testing NextAuth.js

```typescript
// e2e/fixtures/auth.ts
import { test as base } from '@playwright/test';

export const test = base.extend({
  authenticatedPage: async ({ page, context }, use) => {
    // Set session cookie
    await context.addCookies([{
      name: 'next-auth.session-token',
      value: 'test-session-token',
      domain: 'localhost',
      path: '/',
      httpOnly: true,
      secure: false,
      sameSite: 'Lax',
    }]);

    // Mock session endpoint
    await page.route('**/api/auth/session', (route) => {
      route.fulfill({
        json: {
          user: {
            id: '1',
            name: 'Test User',
            email: 'test@example.com',
          },
          expires: new Date(Date.now() + 86400000).toISOString(),
        },
      });
    });

    await use(page);
  },
});
```

### Testing OAuth Flows

```typescript
test('OAuth login redirects to provider', async ({ page }) => {
  await page.goto('/login');
  await page.click('button:has-text("Sign in with Google")');
  
  // Should redirect to Google (or mock)
  await expect(page).toHaveURL(/accounts\.google\.com|\/api\/auth\/signin\/google/);
});
```

## Database Testing

### Test Database Setup

```typescript
// e2e/global-setup.ts
import { chromium, FullConfig } from '@playwright/test';
import { execSync } from 'child_process';

async function globalSetup(config: FullConfig) {
  // Reset test database
  execSync('npm run db:reset:test', { stdio: 'inherit' });
  
  // Seed test data
  execSync('npm run db:seed:test', { stdio: 'inherit' });
}

export default globalSetup;
```

### API for Test Data

```typescript
// pages/api/test/reset.ts (only in test environment)
import { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '@/lib/prisma';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (process.env.NODE_ENV !== 'test') {
    return res.status(403).json({ error: 'Only available in test environment' });
  }

  await prisma.user.deleteMany();
  await prisma.post.deleteMany();
  
  // Reseed
  await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });

  res.status(200).json({ success: true });
}
```

## Environment Setup

### Test Environment Variables

```bash
# .env.test
DATABASE_URL="postgresql://localhost:5432/myapp_test"
NEXTAUTH_SECRET="test-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### Next.js Test Config

```javascript
// next.config.js
module.exports = {
  // Disable telemetry during tests
  experimental: {
    testMode: process.env.NODE_ENV === 'test',
  },
};
```

### Docker Compose for Testing

```yaml
# docker-compose.test.yml
version: '3.8'
services:
  db:
    image: postgres:15
    environment:
      POSTGRES_DB: myapp_test
      POSTGRES_USER: test
      POSTGRES_PASSWORD: test
    ports:
      - "5433:5432"
    tmpfs:
      - /var/lib/postgresql/data

  app:
    build: .
    environment:
      DATABASE_URL: postgresql://test:test@db:5432/myapp_test
      NODE_ENV: test
    depends_on:
      - db
    ports:
      - "3001:3000"
```
