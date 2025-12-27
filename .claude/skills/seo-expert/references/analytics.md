# Analytics for SEO (GA4 & GSC)

Comprehensive guide for setting up and interpreting Google Analytics 4 and Google Search Console for SEO insights.

## Table of Contents

1. [Google Search Console Setup](#google-search-console-setup)
2. [GSC Reports & Interpretation](#gsc-reports--interpretation)
3. [GA4 Setup for SEO](#ga4-setup-for-seo)
4. [GA4 Reports for SEO](#ga4-reports-for-seo)
5. [Combining GSC & GA4 Data](#combining-gsc--ga4-data)
6. [SEO Reporting Framework](#seo-reporting-framework)

## Google Search Console Setup

### Property Verification

**Verification methods (in order of preference):**

1. **DNS verification** (recommended for domain properties)
   - Add TXT record to DNS
   - Verifies all subdomains and protocols

2. **HTML file upload**
   - Upload verification file to root
   - Simple but only verifies specific URL prefix

3. **HTML tag**
   - Add meta tag to homepage
   - Easy but requires site access

4. **Google Analytics**
   - Auto-verify if GA is set up
   - Uses existing GA tag

### Property Types

**Domain property (recommended):**
- Covers all URLs: http/https, www/non-www, subdomains
- Example: `sc-domain:example.com`

**URL prefix property:**
- Only specific URL prefix
- Example: `https://www.example.com/`

### Essential Setup Tasks

1. **Submit XML sitemap**
   - Go to Sitemaps report
   - Add sitemap URL
   - Monitor for errors

2. **Request indexing** (sparingly)
   - Use URL inspection tool
   - Only for new/updated important pages
   - Don't abuse—has limits

3. **Set international targeting** (if applicable)
   - Legacy International Targeting report
   - Or use hreflang

4. **Link to GA4**
   - Settings > Associations
   - Connect to GA4 property

## GSC Reports & Interpretation

### Performance Report

**Metrics explained:**

| Metric | Definition | Use For |
|--------|------------|---------|
| Clicks | Times users clicked to your site | Actual traffic from search |
| Impressions | Times your URL appeared in results | Visibility/reach |
| CTR | Clicks ÷ Impressions | Title/description effectiveness |
| Position | Average ranking for queries | Ranking performance |

**Key analysis patterns:**

**High impressions, low CTR (< 2%):**
- Title or description not compelling
- Rich results taking attention
- Not matching search intent
- Position too low
- **Action**: Improve title/meta, check intent match

**High position (1-3), low clicks:**
- Snippet not compelling
- Wrong intent match
- Better rich results above
- **Action**: Analyze SERP, improve snippet, consider featured snippet

**Position improving, clicks flat:**
- Impressions should increase first
- May be for low-value queries
- **Action**: Check which queries are improving

**Sudden impression drop:**
- Lost rankings
- Algorithm update impact
- Technical issue (deindexed)
- **Action**: Check Coverage report, compare time periods

### Coverage Report

**Status types:**

| Status | Meaning | Action |
|--------|---------|--------|
| Valid | Indexed and no issues | Monitor |
| Valid with warnings | Indexed but has warnings | Review and fix if possible |
| Excluded | Not indexed | Check reason, fix if needed |
| Error | Problem preventing indexing | Fix immediately |

**Common exclusions:**

| Exclusion Type | Meaning | Typical Action |
|----------------|---------|----------------|
| Crawled not indexed | Google crawled but chose not to index | Improve content quality |
| Discovered not indexed | Known but not crawled | Improve internal linking, submit sitemap |
| Excluded by noindex | Intentionally noindexed | Verify intentional |
| Duplicate without canonical | Google found duplicate | Add canonical tag |
| Alternate page with canonical | Canonical points elsewhere | Verify correct canonical |
| Page with redirect | URL redirects | Expected for redirects |
| Not found (404) | Page doesn't exist | Fix or redirect |

### URL Inspection Tool

**Use for:**
- Check if specific URL is indexed
- See how Googlebot renders page
- Debug indexing issues
- Request indexing for new/updated pages

**Key information:**
- Index status
- Crawl date
- Canonical URL
- Mobile usability
- Rich results
- Rendered HTML

### Links Report

**Internal links:**
- Which pages have most internal links
- Identify orphan pages
- Verify important pages are well-linked

**External links:**
- Top linked pages (valuable pages)
- Top linking sites (backlink profile)
- Top linking text (anchor text distribution)

**Use this data to:**
- Find link building opportunities
- Identify pages worth promoting
- Check for spammy backlinks

### Core Web Vitals Report

**Interpretation:**
- Groups URLs by status: Good, Needs Improvement, Poor
- Shows LCP, INP (replacing FID), CLS
- Based on field data (real users)
- May take time to reflect fixes

**Good thresholds:**
- LCP: < 2.5s
- INP: < 200ms
- CLS: < 0.1

## GA4 Setup for SEO

### Basic Configuration

**1. Create GA4 property**
- Admin > Create Property
- Set data retention to 14 months (maximum)
- Enable Google Signals (if acceptable for privacy)

**2. Install tracking code**
```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXX');
</script>
```

**3. Link Google Search Console**
- Admin > Product links > Search Console links
- Enables combined reporting

**4. Configure conversions**
- Mark important events as conversions
- Example: form_submit, purchase, sign_up

### Enhanced Measurement

**Enable these automatic events:**
- Page views
- Scrolls (90% scroll depth)
- Outbound clicks
- Site search
- Video engagement
- File downloads

### Custom Dimensions for SEO

**Recommended custom dimensions:**
- Author (for blog content)
- Category
- Publish date
- Word count
- Content type

### UTM Parameters

**For tracking campaigns:**
```
https://example.com/page?utm_source=newsletter&utm_medium=email&utm_campaign=summer_sale
```

| Parameter | Required | Purpose |
|-----------|----------|---------|
| utm_source | Yes | Traffic source (google, newsletter) |
| utm_medium | Yes | Marketing medium (organic, cpc, email) |
| utm_campaign | Yes | Campaign name |
| utm_term | No | Paid keyword |
| utm_content | No | Ad variant |

## GA4 Reports for SEO

### Organic Traffic Analysis

**Navigate to:**
Reports > Acquisition > Traffic acquisition

**Filter for organic:**
- Add filter: Session default channel group = Organic Search
- Or: Session source / medium contains "google / organic"

**Key metrics for organic:**
- Sessions
- Engaged sessions
- Engagement rate
- Average engagement time
- Conversions

### Landing Page Performance

**Navigate to:**
Reports > Engagement > Landing page

**Filter for organic, then analyze:**
- Top landing pages by traffic
- Engagement rate per page
- Conversions per page
- Bounce rate (via engagement rate inverse)

**Identify:**
- Top performers to replicate
- Underperformers to optimize
- High-traffic, low-conversion pages

### User Behavior Flow

**Explore:**
Reports > Engagement > Pages and screens

**Understand:**
- Which pages users visit after landing
- Exit pages
- Navigation patterns
- Content consumption depth

### Conversions from Organic

**Navigate to:**
Reports > Engagement > Conversions

**Analyze:**
- Which organic landing pages drive conversions
- Conversion rate by page
- Assisted conversions (organic in path)

### Creating SEO-Focused Explorations

**Custom Exploration template:**

1. Go to Explore > Blank
2. Add dimensions:
   - Landing page + query string
   - Session source/medium
   - Device category
3. Add metrics:
   - Sessions
   - Engaged sessions
   - Engagement rate
   - Conversions
4. Filter: Source/medium = google/organic

## Combining GSC & GA4 Data

### GSC + GA4 Integration Report

**In GA4:**
Reports > Search Console > Queries

**Shows:**
- Queries with GA4 metrics
- Landing pages with both GSC and GA4 data
- Combine ranking data with behavior data

### Manual Analysis Workflow

**For deeper analysis, export and combine:**

1. **Export GSC data:**
   - Performance > Export to Sheets
   - Get: query, page, clicks, impressions, CTR, position

2. **Export GA4 data:**
   - Landing page report > Export
   - Get: page, sessions, engagement rate, conversions

3. **Combine in spreadsheet:**
   - Join on page/URL
   - Create calculated metrics:
     - Conversion rate by query intent
     - Value per click
     - Content quality score

### Key Combined Insights

| GSC Data | GA4 Data | Combined Insight |
|----------|----------|------------------|
| High impressions | Low sessions | Low CTR—improve snippet |
| Good rankings | Low engagement | Content not matching intent |
| Growing clicks | Low conversions | Content attracts but doesn't convert |
| Stable traffic | Declining engagement | Content aging, needs refresh |

## SEO Reporting Framework

### Monthly SEO Report Template

**1. Executive Summary**
- Key wins
- Key challenges
- Top actions taken
- Next priorities

**2. Organic Performance Overview**
| Metric | This Month | Last Month | YoY | Target |
|--------|------------|------------|-----|--------|
| Organic sessions | X | X | +X% | X |
| Organic conversions | X | X | +X% | X |
| Indexed pages | X | X | +X | X |
| Average position | X | X | -X | X |

**3. Top Performing Content**
- Top 10 pages by traffic
- Top 10 pages by conversions
- New content performance

**4. Keyword Rankings**
- Featured snippet wins
- Top 3 positions
- Page 1 rankings
- Notable ranking changes

**5. Technical Health**
- Core Web Vitals status
- Crawl errors
- Index coverage changes

**6. Backlinks**
- New backlinks acquired
- Lost backlinks
- Domain authority trend

**7. Actions Taken**
- Content published
- Technical fixes
- Optimizations made

**8. Next Month Priorities**
- Planned content
- Technical tasks
- Optimization targets

### Stakeholder-Specific Reporting

**For Executives:**
- Focus on business metrics
- Organic revenue/conversions
- ROI of SEO investment
- Competitive position

**For Marketing Team:**
- Traffic trends
- Content performance
- Keyword opportunities
- Campaign integration

**For Development Team:**
- Technical issues
- Core Web Vitals
- Crawl errors
- Implementation requests

### KPI Benchmarks

| Metric | Poor | Average | Good |
|--------|------|---------|------|
| Organic CTR | < 2% | 2-5% | > 5% |
| Bounce rate | > 70% | 50-70% | < 50% |
| Pages/session | < 1.5 | 1.5-3 | > 3 |
| Avg. session duration | < 1m | 1-3m | > 3m |
| Organic conversion rate | < 1% | 1-3% | > 3% |

*Benchmarks vary significantly by industry and site type.*
