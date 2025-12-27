// Cypress configuration for Next.js projects
// Copy to cypress.config.ts in your project root

import { defineConfig } from 'cypress';

export default defineConfig({
  // E2E Testing Configuration
  e2e: {
    baseUrl: 'http://localhost:3000',
    
    // Viewport settings
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Timeouts
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 30000,
    pageLoadTimeout: 60000,
    
    // Retry configuration
    retries: {
      runMode: 2,
      openMode: 0,
    },
    
    // Video and screenshots
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    
    // Test files
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    
    // Fixtures
    fixturesFolder: 'cypress/fixtures',
    
    // Environment variables
    env: {
      apiUrl: 'http://localhost:3000/api',
      coverage: false,
    },
    
    // Setup node events
    setupNodeEvents(on, config) {
      // Code coverage plugin
      // require('@cypress/code-coverage/task')(on, config);
      
      // Task for database operations
      on('task', {
        async resetDatabase() {
          // Add database reset logic here
          // const { PrismaClient } = require('@prisma/client');
          // const prisma = new PrismaClient();
          // await prisma.user.deleteMany();
          return null;
        },
        
        async seedDatabase() {
          // Add database seeding logic here
          return null;
        },
        
        log(message) {
          console.log(message);
          return null;
        },
      });
      
      return config;
    },
    
    // Experimental features
    experimentalRunAllSpecs: true,
  },

  // Component Testing Configuration
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    
    // Viewport for components
    viewportWidth: 500,
    viewportHeight: 500,
    
    // Component test files
    specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
    
    // Indexing
    indexHtmlFile: 'cypress/support/component-index.html',
  },

  // Browser settings
  chromeWebSecurity: false,
  
  // Project settings
  projectId: 'your-project-id', // Get from Cypress Dashboard
});
