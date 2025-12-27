# CLAUDE.md

This file provides guidance for Claude Code when working on the Shift project.

## Project Overview

Shift is an AI-powered career matching platform that analyzes user experience and shows what careers they're qualified for, plus a 90-day plan to land one. This repo contains the marketing landing page.

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
