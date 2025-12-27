# Shift

**Your experience is worth more than you think.**

Shift is an AI-powered career matching platform that analyzes your experience and shows you exactly what careers you're already qualified for — plus a 90-day plan to land one.

## Overview

Traditional career assessments tell you what you *might* enjoy. Shift tells you what you're *already qualified for* — based on your actual experience — and gives you a concrete plan to get there. No personality quizzes. No vague suggestions. Just actionable career matches and a personalized roadmap.

## Features

- **AI-Powered Career Matching** - Upload your resume or connect LinkedIn, and our AI identifies career paths that match your existing skills and experience
- **Personalized 90-Day Roadmap** - Get a week-by-week action plan tailored to your target career, including skills to develop, networking strategies, and interview prep
- **Skills Gap Analysis** - Understand exactly what skills you need to develop and which ones you already have that transfer to your new career
- **Resume & LinkedIn Optimization** - Receive specific talking points and optimization tips to position yourself for your target roles
- **Match Confidence Scores** - See percentage-based match scores so you know which opportunities are the strongest fit

## Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Motion](https://motion.dev/) (formerly Framer Motion)
- **Icons**: [@tabler/icons-react](https://tabler.io/icons)
- **UI Components**: Custom components with shadcn/ui patterns
- **TypeScript**: Full type safety throughout

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/thewhatmatters/GetShift.git
   cd GetShift
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
getshift/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   └── page.tsx            # Landing page
├── components/             # React components
│   ├── ui/                 # Base UI components
│   ├── hero.tsx            # Hero section
│   ├── problem.tsx         # Problem/features cards
│   ├── outcomes.tsx        # Outcomes section
│   ├── features.tsx        # Bento grid features
│   ├── pricing.tsx         # Pricing section
│   ├── faqs.tsx            # FAQ accordion
│   ├── cta.tsx             # Call to action
│   ├── navbar.tsx          # Navigation
│   └── footer.tsx          # Footer
├── icons/                  # Custom SVG icons
├── illustrations/          # SVG illustrations
├── lib/                    # Utility functions
└── public/                 # Static assets
```

## Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Who Is Shift For?

Shift is built for professionals who:
- Feel stuck or undervalued in their current role
- Want to pivot to a new industry but don't know where to start
- Have transferable skills but can't articulate them
- Need a concrete action plan, not just career advice
- Want data-driven recommendations based on real market demand

## License

Private - All rights reserved.

---

Built with care by the WhatMatters team.
