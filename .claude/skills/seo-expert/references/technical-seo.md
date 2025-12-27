# Technical SEO Reference

Comprehensive guide for technical SEO audits, diagnostics, and optimization.

## Table of Contents

1. [Site Audit Process](#site-audit-process)
2. [Crawlability & Indexability](#crawlability--indexability)
3. [Core Web Vitals](#core-web-vitals)
4. [Mobile Optimization](#mobile-optimization)
5. [Site Architecture](#site-architecture)
6. [Schema Markup](#schema-markup)
7. [International SEO](#international-seo)

## Site Audit Process

### Phase 1: Crawl Analysis

**Tools**: Screaming Frog, Sitebulb, or cloud crawlers

**Extract and analyze:**
```
- Total pages crawled vs. expected
- Response codes (200, 301, 302, 404, 500)
- Page titles and meta descriptions
- H1 tags
- Canonical tags
- Hreflang tags
- Structured data
- Internal linking structure
- Page depth
- Word count
- Load time
```

### Phase 2: Google Search Console Audit

**Coverage Report Analysis:**
- Valid pages: Are key pages indexed?
- Excluded pages: Why? (noindex, canonicals, crawled not indexed)
- Errors: 404s, server errors, redirect issues

**Performance Analysis:**
- Identify top-performing pages
- Find declining pages (compare periods)
- Spot cannibalization (multiple pages ranking for same query)

### Phase 3: PageSpeed Analysis

**For each template type, test:**
- Homepage
- Category/listing pages
- Product/article pages
- Landing pages

**Document:**
- LCP score and element
- INP/FID issues
- CLS problems
- Opportunities for improvement

### Phase 4: Content Quality Assessment

**Evaluate:**
- Thin content pages (< 300 words without good reason)
- Duplicate/near-duplicate content
- Outdated information
- Missing E-E-A-T signals
- Keyword cannibalization

## Crawlability & Indexability

### Robots.txt Best Practices

```robots
# Example robots.txt
User-agent: *
Allow: /

# Block admin/private areas
Disallow: /admin/
Disallow: /private/
Disallow: /cart/
Disallow: /checkout/

# Block URL parameters that create duplicates
Disallow: /*?sort=
Disallow: /*?filter=

# Allow CSS/JS for rendering
Allow: /*.css$
Allow: /*.js$

# Sitemap location
Sitemap: https://example.com/sitemap.xml
```

**Common Mistakes:**
- Blocking CSS/JS (breaks rendering)
- Blocking entire site during development (and forgetting)
- Not blocking faceted navigation parameters
- Blocking important pages accidentally

### XML Sitemap Optimization

**Requirements:**
- Max 50,000 URLs per sitemap
- Max 50MB uncompressed per sitemap
- Use sitemap index for large sites
- Include only canonical, indexable pages
- Update `<lastmod>` only when content changes

**Sitemap structure for large sites:**
```xml
<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>https://example.com/sitemap-pages.xml</loc>
    <lastmod>2024-01-15</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-posts.xml</loc>
    <lastmod>2024-01-20</lastmod>
  </sitemap>
  <sitemap>
    <loc>https://example.com/sitemap-products.xml</loc>
    <lastmod>2024-01-18</lastmod>
  </sitemap>
</sitemapindex>
```

### Canonical Tags

**When to use:**
- Duplicate content across URLs (parameters, trailing slashes)
- Cross-domain syndicated content
- Mobile/desktop URL variations
- HTTP/HTTPS or www/non-www variations

**Rules:**
- Self-referencing canonicals on all pages (best practice)
- Point to absolute URLs
- Canonical should be indexable (not noindexed, not 404)
- Don't canonical to different content

### Index Management

**Noindex usage:**
- Thank you/confirmation pages
- Internal search results
- Paginated pages beyond page 1 (sometimes)
- User-generated low-quality pages
- Staging/test pages

**Never noindex:**
- Pages you want to rank
- Pages with valuable backlinks (use redirect instead)

## Core Web Vitals

### Largest Contentful Paint (LCP)

**Target**: < 2.5 seconds

**Common LCP elements:**
- Hero images
- Heading text
- Video poster images

**Optimization strategies:**

1. **Preload critical resources**
```html
<link rel="preload" as="image" href="hero.webp">
```

2. **Optimize images**
   - Use modern formats (WebP, AVIF)
   - Implement responsive images
   - Lazy load below-fold images

3. **Minimize render-blocking resources**
   - Inline critical CSS
   - Defer non-critical JS
   - Use font-display: swap

4. **Use CDN for static assets**

5. **Server response time < 200ms**
   - Enable caching
   - Optimize database queries
   - Use edge computing

### Interaction to Next Paint (INP)

**Target**: < 200 milliseconds

**Optimization strategies:**

1. **Break up long tasks**
```javascript
// Instead of one long task
function processData(items) {
  items.forEach(item => heavyOperation(item));
}

// Use chunking
async function processDataChunked(items) {
  for (const item of items) {
    heavyOperation(item);
    await new Promise(r => setTimeout(r, 0)); // Yield to main thread
  }
}
```

2. **Minimize main thread work**
   - Reduce JavaScript execution time
   - Use web workers for heavy computation

3. **Reduce input delay**
   - Remove unnecessary third-party scripts
   - Use passive event listeners

### Cumulative Layout Shift (CLS)

**Target**: < 0.1

**Common causes and fixes:**

1. **Images without dimensions**
```html
<!-- Bad -->
<img src="photo.jpg">

<!-- Good -->
<img src="photo.jpg" width="800" height="600">
```

2. **Ads and embeds**
   - Reserve space with aspect-ratio or min-height
   - Use placeholder containers

3. **Web fonts causing FOIT/FOUT**
```css
@font-face {
  font-family: 'Custom';
  font-display: swap; /* or optional */
  src: url('custom.woff2') format('woff2');
}
```

4. **Dynamically injected content**
   - Reserve space for dynamic elements
   - Use CSS transforms instead of layout-changing properties

## Mobile Optimization

### Mobile-First Indexing

Google primarily uses mobile version for indexing. Ensure:

- Same content on mobile and desktop
- Same structured data
- Same meta tags
- Same internal links
- Images accessible and crawlable on mobile

### Mobile UX Factors

**Tap targets:**
- Minimum 48x48 CSS pixels
- Adequate spacing between targets (8px minimum)

**Font sizes:**
- Base font: 16px minimum
- Line height: 1.5 minimum

**Viewport configuration:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1">
```

### Mobile Page Speed

Additional mobile considerations:
- Test on real devices, not just emulators
- Consider slow 3G connections
- Minimize initial payloads
- Use responsive images with srcset

## Site Architecture

### URL Structure

**Best practices:**
- Short, descriptive URLs
- Use hyphens, not underscores
- Lowercase only
- Include target keyword naturally
- Logical hierarchy reflecting site structure

**Examples:**
```
Good: /category/product-name
Bad:  /p?id=12345&cat=67
Bad:  /category/sub/sub/sub/product
```

### Internal Linking Strategy

**Principles:**
- Every page should be reachable within 3 clicks from homepage
- Use descriptive anchor text (avoid "click here")
- Link to important pages more frequently
- Create topic clusters with pillar + supporting content

**Topic cluster model:**
```
                    [Pillar Page]
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   [Cluster 1]     [Cluster 2]     [Cluster 3]
         │               │               │
    ┌────┴────┐     ┌────┴────┐     ┌────┴────┐
    ▼         ▼     ▼         ▼     ▼         ▼
[Support] [Support] [Support] [Support] [Support] [Support]
```

### Breadcrumb Implementation

```html
<nav aria-label="Breadcrumb">
  <ol itemscope itemtype="https://schema.org/BreadcrumbList">
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/"><span itemprop="name">Home</span></a>
      <meta itemprop="position" content="1" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <a itemprop="item" href="/category"><span itemprop="name">Category</span></a>
      <meta itemprop="position" content="2" />
    </li>
    <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem">
      <span itemprop="name">Current Page</span>
      <meta itemprop="position" content="3" />
    </li>
  </ol>
</nav>
```

## Schema Markup

### Testing and Validation

- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org Validator: https://validator.schema.org/

### Common Schema Examples

**Organization:**
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Company Name",
  "url": "https://example.com",
  "logo": "https://example.com/logo.png",
  "sameAs": [
    "https://facebook.com/company",
    "https://twitter.com/company",
    "https://linkedin.com/company/company"
  ]
}
```

**Article:**
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Article Title",
  "image": "https://example.com/image.jpg",
  "author": {
    "@type": "Person",
    "name": "Author Name",
    "url": "https://example.com/author"
  },
  "publisher": {
    "@type": "Organization",
    "name": "Publisher",
    "logo": {
      "@type": "ImageObject",
      "url": "https://example.com/logo.png"
    }
  },
  "datePublished": "2024-01-15",
  "dateModified": "2024-01-20"
}
```

**FAQ:**
```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is SEO?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "SEO stands for Search Engine Optimization..."
      }
    }
  ]
}
```

**Product:**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Product Name",
  "image": "https://example.com/product.jpg",
  "description": "Product description",
  "brand": {
    "@type": "Brand",
    "name": "Brand Name"
  },
  "offers": {
    "@type": "Offer",
    "price": "99.99",
    "priceCurrency": "USD",
    "availability": "https://schema.org/InStock"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.5",
    "reviewCount": "123"
  }
}
```

## International SEO

### Hreflang Implementation

**HTML link elements:**
```html
<link rel="alternate" hreflang="en-us" href="https://example.com/page" />
<link rel="alternate" hreflang="en-gb" href="https://example.co.uk/page" />
<link rel="alternate" hreflang="de" href="https://example.de/seite" />
<link rel="alternate" hreflang="x-default" href="https://example.com/page" />
```

**Rules:**
- Include self-referencing hreflang
- Hreflang must be reciprocal (A→B and B→A)
- Use correct language-region codes
- x-default for fallback/language selector pages

### URL Structures for International

**Options:**
1. ccTLDs: example.de, example.fr (strongest geo signal, highest cost)
2. Subdirectories: example.com/de/, example.com/fr/ (recommended balance)
3. Subdomains: de.example.com (less recommended, harder to manage)
4. Parameters: example.com?lang=de (not recommended)

### International Content Strategy

- Don't just translate—localize
- Research local search behavior
- Consider local competitors
- Adapt to cultural differences
- Local backlinks matter
