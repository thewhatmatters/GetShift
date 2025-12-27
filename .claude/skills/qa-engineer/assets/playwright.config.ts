// Playwright configuration for Next.js projects
// Copy to playwright.config.ts in your project root

import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Read environment variables
const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  // Test directory
  testDir: './e2e',
  
  // Test file pattern
  testMatch: '**/*.spec.ts',
  
  // Run tests in parallel
  fullyParallel: true,
  
  // Fail the build on CI if test.only is left in the source code
  forbidOnly: !!process.env.CI,
  
  // Retry failed tests
  retries: process.env.CI ? 2 : 0,
  
  // Limit parallel workers on CI
  workers: process.env.CI ? 1 : undefined,
  
  // Reporter configuration
  reporter: [
    ['html', { outputFolder: 'playwright-report' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
    ['list'],
  ],
  
  // Timeout settings
  timeout: 30000,
  expect: {
    timeout: 5000,
  },

  // Shared settings for all projects
  use: {
    // Base URL for navigation
    baseURL,
    
    // Collect trace on first retry
    trace: 'on-first-retry',
    
    // Screenshot on failure
    screenshot: 'only-on-failure',
    
    // Video on retry
    video: 'on-first-retry',
    
    // Viewport size
    viewport: { width: 1280, height: 720 },
    
    // Locale and timezone
    locale: 'en-US',
    timezoneId: 'America/New_York',
    
    // Action timeout
    actionTimeout: 10000,
    
    // Navigation timeout
    navigationTimeout: 30000,
  },

  // Configure projects for different browsers and devices
  projects: [
    // Setup project for authentication
    {
      name: 'setup',
      testMatch: /.*\.setup\.ts/,
    },
    
    // Desktop browsers
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        storageState: path.join(__dirname, '.auth/user.json'),
      },
      dependencies: ['setup'],
    },
    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        storageState: path.join(__dirname, '.auth/user.json'),
      },
      dependencies: ['setup'],
    },
    {
      name: 'webkit',
      use: { 
        ...devices['Desktop Safari'],
        storageState: path.join(__dirname, '.auth/user.json'),
      },
      dependencies: ['setup'],
    },

    // Mobile devices
    {
      name: 'mobile-chrome',
      use: { 
        ...devices['Pixel 5'],
        storageState: path.join(__dirname, '.auth/user.json'),
      },
      dependencies: ['setup'],
    },
    {
      name: 'mobile-safari',
      use: { 
        ...devices['iPhone 13'],
        storageState: path.join(__dirname, '.auth/user.json'),
      },
      dependencies: ['setup'],
    },

    // Tablet
    {
      name: 'tablet',
      use: { 
        ...devices['iPad Pro 11'],
        storageState: path.join(__dirname, '.auth/user.json'),
      },
      dependencies: ['setup'],
    },
  ],

  // Web server configuration
  webServer: {
    command: process.env.CI ? 'npm run start' : 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
    stdout: 'pipe',
    stderr: 'pipe',
  },

  // Output directory for test artifacts
  outputDir: 'test-results/',
});
