---
name: seo-expert
description: Expert-level SEO guidance covering technical SEO (site audits, crawl errors, Core Web Vitals, schema markup), keyword research and content strategy, analytics interpretation (GA4, Google Search Console), and link building. Use when users need help with website optimization, search rankings, SEO audits, content optimization, keyword targeting, fixing technical SEO issues, or understanding search performance data. Emphasizes user intent and creating valuable, user-focused experiences.
---

# SEO Expert

Expert guidance for search engine optimization, combining technical expertise, data interpretation, and content strategy with a user-first mindset.

## Core Philosophy

**User intent is the foundation of all SEO decisions.** Search engines reward content that genuinely satisfies user needs. Every recommendation should pass the test: "Does this make the experience better for users?"

## Workflow Decision Tree

```
User Request
    │
    ├─► "Site not ranking" / "Traffic dropped"
    │   └─► Start with Technical Audit → Check GSC for issues → Analyze content gaps
    │
    ├─► "Need keywords" / "Content strategy"
    │   └─► Keyword Research → Intent Mapping → Content Planning
    │
    ├─► "Site is slow" / "Core Web Vitals"
    │   └─► Technical SEO → Performance Optimization
    │
    ├─► "Want more backlinks"
    │   └─► Link Building Strategy → Content Assessment → Outreach
    │
    ├─► "Understand my data" / "GSC/GA4 help"
    │   └─► Analytics Interpretation → Actionable Insights
    │
    └─► "Write/optimize content"
        └─► Keyword Research → Intent Analysis → Content Optimization
```

## Technical SEO Fundamentals

### Quick Diagnostic Checklist

Before diving deep, check these critical items:

1. **Indexability**: Is the site indexed? (`site:domain.com` in Google)
2. **Robots.txt**: Not blocking important pages?
3. **XML Sitemap**: Exists and submitted to GSC?
4. **HTTPS**: Secure and no mixed content?
5. **Mobile-friendly**: Passes Google's mobile test?
6. **Core Web Vitals**: LCP < 2.5s, INP < 200ms, CLS < 0.1?

### Common Technical Issues & Solutions

| Issue | Diagnosis | Solution |
|-------|-----------|----------|
| Pages not indexed | GSC Coverage report | Check robots.txt, noindex tags, crawl budget |
| Slow page speed | PageSpeed Insights | Optimize images, defer JS, use CDN |
| Duplicate content | Screaming Frog crawl | Implement canonicals, consolidate pages |
| Crawl errors | GSC Coverage | Fix 404s, redirect chains, server errors |
| Poor mobile UX | Mobile-Friendly Test | Responsive design, tap targets, font sizes |

### Schema Markup Priority

Implement schema based on content type:

- **All sites**: Organization, WebSite, BreadcrumbList
- **Articles/Blog**: Article, BlogPosting, Author
- **Products**: Product, Offer, AggregateRating
- **Local business**: LocalBusiness, OpeningHours
- **Events**: Event with dates, location, offers
- **FAQ pages**: FAQPage (can win rich snippets)
- **How-to content**: HowTo with steps

See [references/technical-seo.md](references/technical-seo.md) for comprehensive audit procedures.

## Keyword Research Framework

### The Intent-First Approach

**Always classify search intent before recommending keywords:**

| Intent Type | User Goal | Content Format | Conversion Potential |
|-------------|-----------|----------------|---------------------|
| Informational | Learn something | Blog, guide, video | Low (nurture) |
| Navigational | Find specific site | Brand pages | Medium |
| Commercial | Research before buying | Comparisons, reviews | High |
| Transactional | Ready to buy/act | Product, signup pages | Highest |

### Keyword Evaluation Criteria

Score keywords on these factors:

1. **Relevance** (1-10): How well does this match what we offer?
2. **Volume**: Monthly searches (context matters—100 searches for B2B enterprise can be valuable)
3. **Difficulty**: Realistic to rank given current authority?
4. **Intent match**: Does our content format match user expectations?
5. **Business value**: Will ranking drive meaningful outcomes?

### Content Gap Analysis Process

1. Identify top 5 competitors ranking for target terms
2. Extract their ranking keywords (Ahrefs, SEMrush, or manual SERP analysis)
3. Find keywords they rank for that you don't
4. Prioritize by: volume × relevance × achievability
5. Map to content calendar

See [references/keyword-research.md](references/keyword-research.md) for detailed methodology.

## Analytics Interpretation

### Google Search Console: Key Reports

**Performance Report** — Primary metrics:
- **Clicks**: Actual traffic from search
- **Impressions**: How often you appeared
- **CTR**: Clicks ÷ Impressions (benchmark: 2-5% average)
- **Position**: Average ranking (lower is better)

**Critical Analysis Patterns:**
- High impressions, low CTR → Title/description need improvement
- High position, low clicks → Snippet not compelling or wrong intent
- Declining impressions → Content freshness or competition issue
- Position fluctuation → Algorithm sensitivity or thin content

**Coverage Report** — Monitor for:
- Excluded pages (why?)
- Crawl anomalies
- Index coverage drops

### GA4: SEO-Relevant Metrics

Focus on these for organic traffic:
- **Engagement rate** (inverse of bounce rate)
- **Average engagement time**
- **Conversions from organic**
- **Landing page performance**
- **User flow through site**

See [references/analytics.md](references/analytics.md) for setup and interpretation guides.

## Link Building Strategy

### Quality Assessment Framework

**Evaluate link opportunities on:**

1. **Relevance**: Topically related to your site?
2. **Authority**: Domain has genuine traffic/authority?
3. **Trust**: Editorial standards, not link farm?
4. **Traffic potential**: Could send actual visitors?
5. **Link placement**: Contextual in content vs. footer/sidebar?

### Ethical Link Building Tactics

**Recommended approaches:**
- Create linkable assets (original research, tools, comprehensive guides)
- Digital PR and newsjacking
- Guest posting on relevant, quality sites
- Broken link building
- Resource page outreach
- HARO/journalist queries
- Industry partnerships

**Avoid:**
- Paid links (violates guidelines)
- PBNs (private blog networks)
- Excessive reciprocal linking
- Low-quality directory spam
- Comment spam

See [references/link-building.md](references/link-building.md) for outreach templates and detailed tactics.

## Content Optimization

### On-Page SEO Checklist

```
□ Primary keyword in title (front-loaded if natural)
□ Compelling meta description with CTA (150-160 chars)
□ H1 contains primary keyword
□ H2s cover subtopics/related keywords
□ First 100 words include primary keyword
□ Images have descriptive alt text
□ Internal links to related content
□ External links to authoritative sources
□ URL is short, descriptive, includes keyword
□ Content comprehensively covers topic
□ Satisfies search intent completely
```

### E-E-A-T Considerations

For YMYL (Your Money Your Life) topics especially:

- **Experience**: Demonstrate first-hand experience
- **Expertise**: Show credentials, depth of knowledge
- **Authoritativeness**: Build reputation, earn mentions
- **Trustworthiness**: Accurate, cited, transparent

### Content Quality Questions

Before publishing, ask:
1. Would I trust this information for an important decision?
2. Is this substantially better than what currently ranks?
3. Does this fully satisfy what the searcher wants?
4. Would an expert in this field approve of this?
5. Does this add unique value vs. competitors?

## Critical Thinking in SEO

### Avoid Common Pitfalls

**Don't blindly follow "best practices":**
- Test assumptions with data
- Consider context (what works for one site may not work for another)
- Question correlation vs. causation in case studies
- Algorithm updates affect sites differently

**Red flags in SEO advice:**
- Guaranteed rankings
- Secret techniques
- Obsession with single metrics
- Ignoring user experience
- Black hat shortcuts

### Problem-Solving Framework

When diagnosing SEO issues:

1. **Observe**: What does the data actually show?
2. **Hypothesize**: What could cause this pattern?
3. **Test**: Can we isolate the variable?
4. **Measure**: What changed after intervention?
5. **Iterate**: Refine based on results

## Resources

- **Technical SEO**: See [references/technical-seo.md](references/technical-seo.md)
- **Keyword Research**: See [references/keyword-research.md](references/keyword-research.md)
- **Analytics**: See [references/analytics.md](references/analytics.md)
- **Link Building**: See [references/link-building.md](references/link-building.md)
- **Audit Template**: See [assets/seo-audit-template.md](assets/seo-audit-template.md)
