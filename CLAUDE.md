# CLAUDE.md

This file provides guidance for Claude Code when working on the Shift project.

## Project Overview

Shift is an AI-powered career matching platform that analyzes user experience and shows what careers they're qualified for, plus a 90-day plan to land one. This repo contains the marketing landing page.

## Custom Skills (IMPORTANT)

**Always reference these skills before starting relevant work:**

### Frontend UI Expert (`.claude/skills/frontend-ui-expert/`)
**Trigger:** Building UI components, reviewing frontend code, fixing UI bugs, improving accessibility, optimizing performance, implementing responsive designs.

**Reference files:**
- `SKILL.md` - Workflow, component selection, implementation standards
- `references/tailwind.md` - Utility organization, responsive design, anti-patterns
- `references/shadcn.md` - Component composition, CVA variants, theming
- `references/aceternity.md` - When to use, performance costs, accessibility
- `references/accessibility.md` - WCAG 2.1 AA/AAA checklist, ARIA patterns
- `references/patterns.md` - Component architecture, layout patterns

### React Email Specialist (`.claude/skills/react-email-specialist/`)
**Trigger:** Creating email templates, email components, integrating email providers (Resend, SendGrid, etc.), troubleshooting email rendering.

**Reference files:**
- `SKILL.md` - Quick start, core components, styling, rendering
- `references/components.md` - Detailed component documentation
- `references/compatibility.md` - Client-specific considerations (Gmail, Outlook, Apple Mail)
- `references/integrations.md` - Provider integration examples
- `references/patterns.md` - Common email template patterns

### QA Engineer (`.claude/skills/qa-engineer/`)
**Trigger:** Setting up E2E testing, writing Playwright or Cypress tests, testing API routes, SSR/SSG pages, authentication flows, debugging flaky tests, CI/CD integration.

**Reference files:**
- `SKILL.md` - Quick start, test organization, core patterns, Next.js-specific testing
- `references/playwright.md` - Playwright patterns and best practices
- `references/cypress.md` - Cypress patterns and configuration
- `references/nextjs-testing.md` - Next.js App Router testing strategies

**Assets:**
- `assets/playwright.config.ts` - Ready-to-use Playwright config
- `assets/cypress.config.ts` - Ready-to-use Cypress config
- `assets/github-actions-e2e.yml` - CI/CD workflow for E2E tests

### SEO Expert (`.claude/skills/seo-expert/`)
**Trigger:** Website optimization, search rankings, SEO audits, content optimization, keyword research, fixing technical SEO issues (Core Web Vitals, schema markup, crawl errors), understanding GSC/GA4 data, link building strategies.

**Reference files:**
- `SKILL.md` - Workflow decision tree, technical SEO fundamentals, keyword research framework, content optimization
- `references/technical-seo.md` - Comprehensive audit procedures, crawl optimization
- `references/keyword-research.md` - Intent mapping, content gap analysis methodology
- `references/analytics.md` - GSC and GA4 setup, interpretation guides
- `references/link-building.md` - Ethical tactics, outreach templates

**Assets:**
- `assets/seo-audit-template.md` - Ready-to-use SEO audit checklist

## Tech Stack

- **Framework**: Next.js 16.1.1 with App Router and Turbopack
- **Styling**: Tailwind CSS v4 (uses `@theme` directive, oklch colors)
- **Animations**: Motion (motion/react) - formerly Framer Motion
- **Icons**: @tabler/icons-react
- **UI Components**: Custom components with shadcn/ui patterns
- **TypeScript**: Strict mode enabled

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Project Structure

```
app/                    # Next.js App Router pages
  layout.tsx            # Root layout with ThemeProvider
  page.tsx              # Landing page (composes all sections)
  globals.css           # Global styles, Tailwind imports, CSS variables

components/             # React components
  ui/                   # Base UI components (button, etc.)
  features/             # Bento grid feature cards with skeletons
  hero.tsx              # Hero section
  problem.tsx           # Problem/value prop cards
  outcomes.tsx          # Outcomes section
  features.tsx          # Bento grid features
  pricing.tsx           # Pricing cards
  faqs.tsx              # FAQ accordion
  cta.tsx               # Call to action
  navbar.tsx            # Navigation
  footer.tsx            # Footer with newsletter

icons/                  # Custom SVG icon components
illustrations/          # SVG illustration components
lib/                    # Utility functions (cn for classnames)
providers/              # React context providers (theme)
reference/              # Template reference (agentforce)
```

## Key Patterns

### Component Structure
- All components use `"use client"` directive when needed
- Components are exported as named exports
- Use `Container` component for consistent max-width and padding
- Use `Heading` and `Subheading` for typography consistency

### Styling Conventions
- Use Tailwind CSS v4 syntax
- Dark mode via `dark:` prefix (uses next-themes)
- Colors use oklch format in CSS variables
- Common pattern: `text-neutral-600 dark:text-neutral-400`
- Animations use motion/react (not framer-motion)

### Import Aliases
- `@/components/*` - Components
- `@/lib/*` - Utilities
- `@/icons` - Custom icons
- `@/illustrations/*` - SVG illustrations

## Reference Template

The `/reference/agentforce` directory contains the original template. When matching styling or implementing new sections, reference these files for the exact patterns and component structure.

## Important Notes

1. **Tailwind v4**: Uses new `@theme` directive instead of `tailwind.config.js`. Theme variables defined in `globals.css`.

2. **Motion library**: Import from `motion/react`, not `framer-motion`:
   ```tsx
   import { motion } from "motion/react";
   ```

3. **Icons**: Use @tabler/icons-react for most icons. Custom icons in `/icons/index.tsx`.

4. **Dark mode**: Fully supported via next-themes. Always include dark variants.

5. **No API routes yet**: Currently a static landing page. Backend/AI integration to be added.
