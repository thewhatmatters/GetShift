# Cypress Patterns for Next.js

Comprehensive Cypress patterns for testing Next.js applications.

## Table of Contents

1. [Setup and Configuration](#setup-and-configuration)
2. [Component Testing](#component-testing)
3. [E2E Testing Patterns](#e2e-testing-patterns)
4. [Network Handling](#network-handling)
5. [Custom Commands](#custom-commands)
6. [Testing Next.js Features](#testing-nextjs-features)

## Setup and Configuration

### Installation

```bash
npm install cypress @testing-library/cypress --save-dev
```

### Configuration

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    
    env: {
      apiUrl: 'http://localhost:3000/api',
    },
  },
  
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    viewportWidth: 500,
    viewportHeight: 500,
  },
});
```

### TypeScript Support

```typescript
// cypress/support/e2e.ts
import '@testing-library/cypress/add-commands';

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>;
      getByTestId(testId: string): Chainable<JQuery<HTMLElement>>;
    }
  }
}
```

## Component Testing

### Setup for Next.js

```typescript
// cypress/support/component.ts
import './commands';
import '../../styles/globals.css'; // Import global styles

import { mount } from 'cypress/react18';

declare global {
  namespace Cypress {
    interface Chainable {
      mount: typeof mount;
    }
  }
}

Cypress.Commands.add('mount', mount);
```

### Component Test Examples

```typescript
// components/Button.cy.tsx
import { Button } from './Button';

describe('Button', () => {
  it('renders with text', () => {
    cy.mount(<Button>Click me</Button>);
    cy.contains('Click me').should('be.visible');
  });

  it('handles click events', () => {
    const onClick = cy.stub().as('onClick');
    cy.mount(<Button onClick={onClick}>Click me</Button>);
    
    cy.contains('Click me').click();
    cy.get('@onClick').should('have.been.calledOnce');
  });

  it('can be disabled', () => {
    cy.mount(<Button disabled>Disabled</Button>);
    cy.contains('Disabled').should('be.disabled');
  });

  it('shows loading state', () => {
    cy.mount(<Button loading>Submit</Button>);
    cy.get('[data-testid="spinner"]').should('be.visible');
  });
});
```

### Testing with Providers

```typescript
// cypress/support/component.tsx
import { SessionProvider } from 'next-auth/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const AllProviders = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  
  return (
    <SessionProvider session={null}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </SessionProvider>
  );
};

Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(
    <AllProviders>{component}</AllProviders>,
    options
  );
});
```

## E2E Testing Patterns

### Basic Navigation Test

```typescript
describe('Navigation', () => {
  it('navigates between pages', () => {
    cy.visit('/');
    cy.contains('About').click();
    cy.url().should('include', '/about');
    cy.contains('h1', 'About Us').should('be.visible');
  });
});
```

### Form Testing

```typescript
describe('Contact Form', () => {
  beforeEach(() => {
    cy.visit('/contact');
  });

  it('submits form successfully', () => {
    cy.intercept('POST', '/api/contact', {
      statusCode: 200,
      body: { success: true },
    }).as('submitForm');

    cy.get('[name="name"]').type('John Doe');
    cy.get('[name="email"]').type('john@example.com');
    cy.get('[name="message"]').type('Hello, this is a test message.');
    cy.get('button[type="submit"]').click();

    cy.wait('@submitForm');
    cy.contains('Thank you for your message').should('be.visible');
  });

  it('shows validation errors', () => {
    cy.get('button[type="submit"]').click();
    cy.contains('Name is required').should('be.visible');
    cy.contains('Email is required').should('be.visible');
  });
});
```

### Authentication Flow

```typescript
describe('Authentication', () => {
  it('logs in successfully', () => {
    cy.visit('/login');
    
    cy.get('[name="email"]').type('user@example.com');
    cy.get('[name="password"]').type('password123');
    cy.get('button[type="submit"]').click();
    
    cy.url().should('include', '/dashboard');
    cy.contains('Welcome back').should('be.visible');
  });

  it('shows error for invalid credentials', () => {
    cy.visit('/login');
    
    cy.get('[name="email"]').type('wrong@example.com');
    cy.get('[name="password"]').type('wrongpassword');
    cy.get('button[type="submit"]').click();
    
    cy.contains('Invalid credentials').should('be.visible');
    cy.url().should('include', '/login');
  });
});
```

## Network Handling

### Intercepting API Calls

```typescript
describe('Product List', () => {
  it('displays products from API', () => {
    cy.intercept('GET', '/api/products', {
      fixture: 'products.json',
    }).as('getProducts');

    cy.visit('/products');
    cy.wait('@getProducts');
    
    cy.get('[data-testid="product-card"]').should('have.length', 3);
  });

  it('handles API errors', () => {
    cy.intercept('GET', '/api/products', {
      statusCode: 500,
      body: { error: 'Server error' },
    }).as('getProducts');

    cy.visit('/products');
    cy.wait('@getProducts');
    
    cy.contains('Something went wrong').should('be.visible');
    cy.get('[data-testid="retry-button"]').should('be.visible');
  });
});
```

### Waiting for Requests

```typescript
it('waits for multiple requests', () => {
  cy.intercept('GET', '/api/users').as('getUsers');
  cy.intercept('GET', '/api/posts').as('getPosts');

  cy.visit('/dashboard');

  cy.wait(['@getUsers', '@getPosts']).then((interceptions) => {
    expect(interceptions[0].response?.statusCode).to.equal(200);
    expect(interceptions[1].response?.statusCode).to.equal(200);
  });
});
```

### Modifying Responses

```typescript
it('modifies API response', () => {
  cy.intercept('GET', '/api/user', (req) => {
    req.continue((res) => {
      res.body.name = 'Modified Name';
      res.body.isPremium = true;
    });
  }).as('getUser');

  cy.visit('/profile');
  cy.wait('@getUser');
  
  cy.contains('Modified Name').should('be.visible');
  cy.get('[data-testid="premium-badge"]').should('be.visible');
});
```

## Custom Commands

### Common Commands

```typescript
// cypress/support/commands.ts

// Login command
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.session([email, password], () => {
    cy.visit('/login');
    cy.get('[name="email"]').type(email);
    cy.get('[name="password"]').type(password);
    cy.get('button[type="submit"]').click();
    cy.url().should('include', '/dashboard');
  });
});

// API login (faster)
Cypress.Commands.add('loginByApi', (email: string, password: string) => {
  cy.request({
    method: 'POST',
    url: '/api/auth/login',
    body: { email, password },
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
});

// Get by test ID
Cypress.Commands.add('getByTestId', (testId: string) => {
  return cy.get(`[data-testid="${testId}"]`);
});

// Assert toast message
Cypress.Commands.add('assertToast', (message: string) => {
  cy.get('[role="alert"]').should('contain', message);
});
```

### Usage

```typescript
describe('Dashboard', () => {
  beforeEach(() => {
    cy.login('user@example.com', 'password123');
    cy.visit('/dashboard');
  });

  it('displays user data', () => {
    cy.getByTestId('user-name').should('contain', 'John');
  });
});
```

## Testing Next.js Features

### Testing Dynamic Routes

```typescript
describe('Product Page', () => {
  it('loads product by ID', () => {
    cy.intercept('GET', '/api/products/123', {
      fixture: 'product.json',
    }).as('getProduct');

    cy.visit('/products/123');
    cy.wait('@getProduct');
    
    cy.get('h1').should('contain', 'Product Name');
  });

  it('handles 404 for missing products', () => {
    cy.intercept('GET', '/api/products/999', {
      statusCode: 404,
    }).as('getProduct');

    cy.visit('/products/999', { failOnStatusCode: false });
    cy.contains('Product not found').should('be.visible');
  });
});
```

### Testing API Routes

```typescript
describe('API Routes', () => {
  it('creates a new post', () => {
    cy.request({
      method: 'POST',
      url: '/api/posts',
      body: {
        title: 'Test Post',
        content: 'Test content',
      },
      headers: {
        Authorization: 'Bearer test-token',
      },
    }).then((response) => {
      expect(response.status).to.eq(201);
      expect(response.body).to.have.property('id');
    });
  });

  it('returns 401 without auth', () => {
    cy.request({
      method: 'GET',
      url: '/api/protected',
      failOnStatusCode: false,
    }).then((response) => {
      expect(response.status).to.eq(401);
    });
  });
});
```

### Testing SSR Content

```typescript
describe('SSR Page', () => {
  it('renders server-side content', () => {
    cy.visit('/blog/post-1');
    
    // Check that SSR content is immediately visible
    cy.get('article').should('be.visible');
    
    // Verify meta tags
    cy.get('head meta[name="description"]')
      .should('have.attr', 'content')
      .and('not.be.empty');
  });
});
```

### Testing Image Optimization

```typescript
describe('Next/Image', () => {
  it('lazy loads images', () => {
    cy.visit('/gallery');
    
    // First image should be loaded
    cy.get('img').first()
      .should('have.attr', 'src')
      .and('include', '/_next/image');
    
    // Scroll to load more
    cy.scrollTo('bottom');
    
    // Check more images loaded
    cy.get('img[loading="lazy"]').should('have.length.gt', 0);
  });
});
```

### Testing with next-auth

```typescript
describe('Protected Routes', () => {
  it('redirects unauthenticated users', () => {
    cy.visit('/dashboard');
    cy.url().should('include', '/api/auth/signin');
  });

  it('allows authenticated users', () => {
    // Set session cookie
    cy.setCookie('next-auth.session-token', 'mock-session-token');
    
    cy.intercept('GET', '/api/auth/session', {
      user: { name: 'Test User', email: 'test@example.com' },
      expires: new Date(Date.now() + 86400000).toISOString(),
    });

    cy.visit('/dashboard');
    cy.contains('Welcome, Test User').should('be.visible');
  });
});
```

## Best Practices

### Fixtures Organization

```
cypress/
├── fixtures/
│   ├── users/
│   │   ├── admin.json
│   │   └── user.json
│   ├── products/
│   │   ├── list.json
│   │   └── single.json
│   └── errors/
│       ├── 404.json
│       └── 500.json
```

### Test Data Isolation

```typescript
describe('User CRUD', () => {
  let testUserId: string;

  before(() => {
    // Create test data
    cy.request('POST', '/api/test/users', {
      email: 'test@example.com',
    }).then((response) => {
      testUserId = response.body.id;
    });
  });

  after(() => {
    // Clean up
    cy.request('DELETE', `/api/test/users/${testUserId}`);
  });

  it('updates user', () => {
    cy.visit(`/users/${testUserId}/edit`);
    // ... test
  });
});
```
