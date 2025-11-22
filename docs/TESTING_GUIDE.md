# Testing Guide: Web Extractor SDK

> **Complete guide on how to test the @anisirji/web-extractor package for any website**

This document explains the methodology, setup, and process used to create comprehensive tests for the web-extractor-sdk package, specifically demonstrated with astratechai.com.

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Test Architecture](#test-architecture)
4. [Setup Process](#setup-process)
5. [Test Implementation](#test-implementation)
6. [Running Tests](#running-tests)
7. [Understanding Results](#understanding-results)
8. [Creating Tests for Other Websites](#creating-tests-for-other-websites)

---

## Overview

### What We're Testing

The web-extractor-sdk is a wrapper around Firecrawl API that provides:
- Smart URL handling and normalization
- Content extraction from web pages
- Website crawling capabilities
- Content cleaning and processing
- Metadata extraction

### Testing Goals

Our comprehensive test validates:

1. **Single Page Extraction** - Can it extract one page correctly?
2. **Website Crawling** - Can it crawl multiple pages?
3. **Content Quality** - Is the extracted content clean and usable?
4. **URL Utilities** - Do URL normalization and validation work?
5. **Metadata Extraction** - Are metadata fields populated correctly?

---

## Prerequisites

### Required Tools

```bash
# Node.js (v16 or higher)
node --version

# NPM package manager
npm --version

# TypeScript executor (tsx)
npm install -g tsx
```

### Required Credentials

1. **Firecrawl API Key**
   - Sign up at: https://firecrawl.dev
   - Get your API key from the dashboard
   - Keep it secure (don't commit to Git)

### Project Setup

```bash
# Navigate to the package directory
cd packages/web-extractor-sdk

# Install dependencies
npm install

# Verify the package structure
ls -la
```

Expected structure:
```
web-extractor-sdk/
├── src/
│   ├── index.ts              # Main exports
│   ├── web-extractor.ts      # Core WebExtractor class
│   ├── types.ts              # TypeScript interfaces
│   └── utils/
│       ├── url-utils.ts      # URL processing utilities
│       └── content-utils.ts  # Content processing utilities
├── test/
│   ├── test.ts               # Unit tests
│   └── test-astratechai.ts   # Integration test (created)
├── examples/
│   └── basic-usage.ts        # Example usage
├── package.json
├── tsconfig.json
└── README.md
```

---

## Test Architecture

### Test Layers

```
┌─────────────────────────────────────┐
│  Comprehensive Integration Test      │
│  (test-astratechai.ts)              │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       │                │
┌──────▼─────┐   ┌─────▼──────┐
│ WebExtractor│   │ URL Utils  │
│   Class     │   │ Functions  │
└──────┬──────┘   └─────┬──────┘
       │                │
       └────────┬────────┘
                │
        ┌───────▼────────┐
        │ Firecrawl API  │
        │  (External)    │
        └────────────────┘
```

### Test Categories

#### 1. **Functional Tests**
- Does it extract pages?
- Does it crawl websites?
- Does it handle errors?

#### 2. **Quality Tests**
- Is content properly formatted?
- Is content cleaned?
- Are metadata fields accurate?

#### 3. **Utility Tests**
- URL normalization
- URL validation
- Deduplication

#### 4. **Performance Tests**
- Extraction speed
- Success rate
- Resource usage

---

## Setup Process

### Step 1: Environment Configuration

Create a `.env` file (DO NOT commit to Git):

```bash
# Create .env file
touch .env

# Add your API key
echo "FIRECRAWL_API_KEY=fc-your-api-key-here" > .env
```

Create `.gitignore` entry:
```bash
# Add to .gitignore
echo ".env" >> .gitignore
```

### Step 2: Add Test Script to package.json

```json
{
  "scripts": {
    "test:astratechai": "tsx test/test-astratechai.ts"
  }
}
```

For custom websites:
```json
{
  "scripts": {
    "test:website": "tsx test/test-website.ts",
    "test:custom": "tsx test/test-custom.ts"
  }
}
```

### Step 3: Verify Dependencies

Check that all required packages are installed:

```bash
npm list @mendable/firecrawl-js
npm list tsx
npm list typescript
```

If missing, install them:
```bash
npm install @mendable/firecrawl-js
npm install --save-dev tsx typescript @types/node
```

---

## Test Implementation

### Test Structure

```typescript
/**
 * Comprehensive Test Template
 */

import { WebExtractor } from '../src';

async function runComprehensiveTest() {
  // 1. Setup & Validation
  // 2. Test 1: Single Page Extraction
  // 3. Test 2: Website Crawl
  // 4. Test 3: Content Quality
  // 5. Test 4: URL Utilities
  // 6. Summary & Reporting
}

runComprehensiveTest().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
```

### Test 1: Single Page Extraction

**Purpose:** Verify basic extraction functionality

```typescript
async function testSinglePageExtraction(extractor: WebExtractor, url: string) {
  console.log('TEST 1: Single Page Extraction');

  const startTime = Date.now();

  // Extract the page
  const page = await extractor.extractPage(url, {
    onlyMainContent: true,
    format: 'markdown'
  });

  const duration = Date.now() - startTime;

  // Log results
  console.log('Duration:', duration + 'ms');
  console.log('Title:', page.title);
  console.log('Word Count:', page.metadata.wordCount);
  console.log('Language:', page.metadata.language);

  // Run validation checks
  const checks = [
    { name: 'Has title', pass: page.title && page.title.length > 0 },
    { name: 'Has content', pass: page.content && page.content.length > 100 },
    { name: 'Has valid URL', pass: page.url.startsWith('https://') },
    { name: 'Word count > 0', pass: page.metadata.wordCount > 0 },
    { name: 'Has timestamp', pass: page.metadata.scrapedAt instanceof Date },
    { name: 'Content is cleaned', pass: !page.content.startsWith('  ') },
    { name: 'Reasonable word count', pass: page.metadata.wordCount > 50 }
  ];

  checks.forEach(check => {
    console.log(check.pass ? '✓' : '✗', check.name);
  });

  return checks.every(c => c.pass);
}
```

**What to validate:**
- ✅ Page has a title
- ✅ Content is extracted
- ✅ URL is valid and normalized
- ✅ Word count is calculated
- ✅ Timestamp is recorded
- ✅ Content is properly cleaned
- ✅ Metadata fields are populated

### Test 2: Website Crawl

**Purpose:** Verify multi-page crawling functionality

```typescript
async function testWebsiteCrawl(extractor: WebExtractor, url: string) {
  console.log('TEST 2: Website Crawl');

  const startTime = Date.now();

  // Crawl the website
  const result = await extractor.extractWebsite(url, {
    maxPages: 5,              // Limit for testing
    includeSubdomains: false, // Stay on main domain
    maxDepth: 2,              // Don't go too deep
    onlyMainContent: true,
    format: 'markdown'
  });

  const duration = Date.now() - startTime;

  // Log results
  console.log('Duration:', duration + 'ms');
  console.log('Pages Extracted:', result.pages.length);
  console.log('Success Rate:', result.stats.successRate.toFixed(2) + '%');
  console.log('Total Words:', result.stats.totalWords);

  // List all pages
  result.pages.forEach((page, i) => {
    console.log(`${i + 1}. ${page.title}`);
    console.log(`   URL: ${page.url}`);
    console.log(`   Words: ${page.metadata.wordCount}`);
  });

  // Run validation checks
  const checks = [
    { name: 'Extracted >= 1 page', pass: result.pages.length >= 1 },
    { name: 'Success rate > 50%', pass: result.stats.successRate > 50 },
    { name: 'All pages have content', pass: result.pages.every(p => p.content.length > 0) },
    { name: 'All pages have titles', pass: result.pages.every(p => p.title.length > 0) },
    { name: 'All have word counts', pass: result.pages.every(p => p.metadata.wordCount > 0) },
    { name: 'No duplicate URLs', pass: new Set(result.pages.map(p => p.url)).size === result.pages.length },
    { name: 'URLs normalized', pass: result.pages.every(p => p.url === p.url.toLowerCase()) },
    { name: 'Stats accurate', pass: result.totalPages === result.pages.length + result.failed.length }
  ];

  checks.forEach(check => {
    console.log(check.pass ? '✓' : '✗', check.name);
  });

  return checks.every(c => c.pass);
}
```

**What to validate:**
- ✅ At least one page extracted
- ✅ Success rate is reasonable (>50%)
- ✅ All pages have content and titles
- ✅ Word counts are calculated
- ✅ No duplicate URLs
- ✅ URLs are properly normalized
- ✅ Statistics are accurate

### Test 3: Content Quality Analysis

**Purpose:** Verify content formatting and quality

```typescript
async function testContentQuality(extractor: WebExtractor, url: string) {
  console.log('TEST 3: Content Quality Analysis');

  const page = await extractor.extractPage(url);
  const content = page.content;

  // Format checks
  const hasMarkdownHeadings = /^#{1,6}\s+.+$/m.test(content);
  const hasLinks = /\[.+\]\(.+\)/.test(content);
  const hasBulletPoints = /^[-*]\s+.+$/m.test(content);
  const noExcessiveWhitespace = !/\n{4,}/.test(content);
  const noLeadingTrailingSpace = content === content.trim();

  console.log('Content Format Analysis:');
  console.log(hasMarkdownHeadings ? '✓' : '✗', 'Contains markdown headings');
  console.log(hasLinks ? '✓' : '✗', 'Contains links');
  console.log(hasBulletPoints ? '✓' : '✗', 'Contains bullet points');
  console.log(noExcessiveWhitespace ? '✓' : '✗', 'No excessive whitespace');
  console.log(noLeadingTrailingSpace ? '✓' : '✗', 'No leading/trailing whitespace');

  // Statistical analysis
  const words = content.split(/\s+/);
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
  const uniqueWords = new Set(words.map(w => w.toLowerCase()));
  const vocabularyRichness = uniqueWords.size / words.length;

  console.log('\nContent Statistics:');
  console.log('Total words:', words.length);
  console.log('Unique words:', uniqueWords.size);
  console.log('Avg word length:', avgWordLength.toFixed(2), 'chars');
  console.log('Vocabulary richness:', (vocabularyRichness * 100).toFixed(2) + '%');

  return true;
}
```

**What to analyze:**
- ✅ Markdown formatting (headings, links, lists)
- ✅ Whitespace handling
- ✅ Content cleanliness
- ✅ Vocabulary richness
- ✅ Word distribution

### Test 4: URL Utilities

**Purpose:** Verify URL processing functions

```typescript
async function testUrlUtilities() {
  console.log('TEST 4: URL Utilities Testing');

  const testUrls = [
    'https://example.com',
    'https://example.com/',
    'https://EXAMPLE.COM',
    'https://example.com?utm_source=test',
    'https://example.com/about',
    'https://example.com/about/'
  ];

  console.log('Input URLs:');
  testUrls.forEach((url, i) => console.log(`${i + 1}. ${url}`));

  // Normalize all URLs
  const normalized = testUrls.map(url => WebExtractor.normalizeUrl(url));

  console.log('\nNormalized URLs:');
  normalized.forEach((url, i) => console.log(`${i + 1}. ${url}`));

  // Validation checks
  const unique = new Set(normalized);

  const checks = [
    { name: 'Deduplication working', pass: unique.size < testUrls.length },
    { name: 'All lowercase', pass: normalized.every(url => url === url.toLowerCase()) },
    { name: 'All valid', pass: normalized.every(url => WebExtractor.isValidUrl(url)) }
  ];

  checks.forEach(check => {
    console.log(check.pass ? '✓' : '✗', check.name);
  });

  return checks.every(c => c.pass);
}
```

**What to test:**
- ✅ URL normalization
- ✅ Lowercase conversion
- ✅ Trailing slash removal
- ✅ Deduplication
- ✅ Validation

---

## Running Tests

### Method 1: Using NPM Scripts

```bash
# Run the comprehensive test
npm run test:astratechai

# With explicit API key
FIRECRAWL_API_KEY=your_key npm run test:astratechai
```

### Method 2: Direct Execution

```bash
# Using tsx directly
tsx test/test-astratechai.ts

# With environment variable
FIRECRAWL_API_KEY=your_key tsx test/test-astratechai.ts
```

### Method 3: With .env File

```bash
# Create .env file first
echo "FIRECRAWL_API_KEY=your_key" > .env

# Then run normally
npm run test:astratechai
```

### Expected Output

```
🧪 COMPREHENSIVE TEST: astratechai.com Extraction

============================================================
✓ API Key detected
✓ Target URL: https://astratechai.com
============================================================
✓ WebExtractor initialized successfully

📄 TEST 1: Single Page Extraction
------------------------------------------------------------
✅ EXTRACTION SUCCESSFUL
   Duration: 1956ms
   Title: AstraTech
   Word Count: 601
   ...

📚 TEST 2: Website Crawl
------------------------------------------------------------
✅ CRAWL SUCCESSFUL
   Pages Extracted: 5
   Success Rate: 100.00%
   ...

🔍 TEST 3: Content Quality Analysis
------------------------------------------------------------
✅ Content quality analysis complete
   ...

🔗 TEST 4: URL Utilities Testing
------------------------------------------------------------
✅ URL utilities test complete
   ...

============================================================
🎉 ALL TESTS COMPLETED SUCCESSFULLY!
============================================================
```

---

## Understanding Results

### Success Indicators

✅ **All Tests Passed**
- Single page extraction works
- Multi-page crawling works
- Content quality is good
- URL utilities function correctly

### Metrics to Monitor

1. **Duration**
   - Single page: 1-3 seconds (acceptable)
   - Crawl (5 pages): 8-15 seconds (acceptable)
   - Longer times may indicate API throttling or network issues

2. **Success Rate**
   - 100%: Perfect (all pages extracted)
   - 80-99%: Good (some pages failed, check failed array)
   - <80%: Poor (investigate issues)

3. **Word Count**
   - Should be > 50 words for meaningful content
   - 0 words indicates extraction failure
   - Compare with expected content length

4. **Content Quality**
   - Vocabulary richness > 40%: Good variety
   - Proper markdown formatting
   - No excessive whitespace

### Common Issues & Solutions

#### Issue: "FIRECRAWL_API_KEY not found"

```bash
# Solution: Set the environment variable
export FIRECRAWL_API_KEY=your_key_here

# Or create .env file
echo "FIRECRAWL_API_KEY=your_key" > .env
```

#### Issue: "Failed to extract page"

**Possible causes:**
- Invalid API key
- Rate limiting (too many requests)
- Website blocking Firecrawl
- Network connectivity issues

**Solutions:**
```typescript
// Increase timeout
const extractor = new WebExtractor({
  apiKey: process.env.FIRECRAWL_API_KEY,
  timeout: 60000 // Increase to 60 seconds
});

// Add retry logic
async function extractWithRetry(url: string, retries = 3) {
  for (let i = 0; i < retries; i++) {
    try {
      return await extractor.extractPage(url);
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s
    }
  }
}
```

#### Issue: Low word count or empty content

**Possible causes:**
- Page is mostly images/videos
- Content is behind JavaScript rendering
- Content is in non-main sections

**Solutions:**
```typescript
// Try without onlyMainContent
const page = await extractor.extractPage(url, {
  onlyMainContent: false, // Get all content
  waitFor: 2000 // Wait for JS to render
});

// Try different format
const page = await extractor.extractPage(url, {
  format: 'html' // Instead of markdown
});
```

---

## Creating Tests for Other Websites

### Step-by-Step Guide

#### 1. Create Test File

```bash
# Create new test file
touch test/test-yourwebsite.ts
```

#### 2. Copy Template

```typescript
/**
 * Test for yourwebsite.com
 */

import { WebExtractor } from '../src';

const TARGET_URL = 'https://yourwebsite.com';

async function runTest() {
  console.log('🧪 Testing:', TARGET_URL);

  // Initialize
  const extractor = new WebExtractor({
    apiKey: process.env.FIRECRAWL_API_KEY || '',
    debug: true
  });

  // Test single page
  console.log('\n📄 Single Page Test');
  const page = await extractor.extractPage(TARGET_URL);
  console.log('✓ Title:', page.title);
  console.log('✓ Words:', page.metadata.wordCount);

  // Test crawl
  console.log('\n📚 Crawl Test');
  const result = await extractor.extractWebsite(TARGET_URL, {
    maxPages: 3
  });
  console.log('✓ Pages:', result.pages.length);
  console.log('✓ Success:', result.stats.successRate + '%');

  console.log('\n✅ Test complete!');
}

runTest().catch(console.error);
```

#### 3. Customize for Your Website

```typescript
// For documentation sites
const result = await extractor.extractWebsite(TARGET_URL, {
  maxPages: 20,
  includePatterns: [/\/docs\//, /\/api\//],
  excludePatterns: [/\/blog\//],
  maxDepth: 3
});

// For e-commerce sites
const result = await extractor.extractWebsite(TARGET_URL, {
  maxPages: 10,
  includePatterns: [/\/products\//],
  excludePatterns: [/\/cart\//, /\/checkout\//]
});

// For blogs
const result = await extractor.extractWebsite(TARGET_URL, {
  maxPages: 15,
  includePatterns: [/\/posts\//, /\/articles\//],
  titlePrefix: 'Blog'
});
```

#### 4. Add to package.json

```json
{
  "scripts": {
    "test:yourwebsite": "tsx test/test-yourwebsite.ts"
  }
}
```

#### 5. Run Your Test

```bash
npm run test:yourwebsite
```

### Website-Specific Considerations

#### Documentation Sites

```typescript
{
  maxPages: 50,           // Docs usually have many pages
  includePatterns: [
    /\/docs\//,
    /\/api\//,
    /\/guides\//,
    /\/tutorials\//
  ],
  excludePatterns: [
    /\/blog\//,
    /\/changelog\//
  ],
  maxDepth: 4,            // Docs can be deeply nested
  titlePrefix: 'Docs'
}
```

#### E-commerce Sites

```typescript
{
  maxPages: 20,
  includePatterns: [
    /\/products\//,
    /\/category\//
  ],
  excludePatterns: [
    /\/cart\//,
    /\/checkout\//,
    /\/account\//
  ],
  onlyMainContent: true   // Skip navigation/footer
}
```

#### News/Blog Sites

```typescript
{
  maxPages: 30,
  includePatterns: [
    /\/posts?\//,
    /\/articles?\//,
    /\/news\//,
    /\/\d{4}\/\d{2}\//    // Date-based URLs
  ],
  excludePatterns: [
    /\/author\//,
    /\/tag\//,
    /\/category\//
  ]
}
```

#### Portfolio Sites

```typescript
{
  maxPages: 10,           // Usually small
  includeSubdomains: false,
  maxDepth: 2,
  format: 'markdown'
}
```

---

## Best Practices

### 1. **Start Small**

```typescript
// First test: Just one page
const page = await extractor.extractPage(url);

// Then expand: Small crawl
const result = await extractor.extractWebsite(url, { maxPages: 3 });

// Finally: Full crawl
const result = await extractor.extractWebsite(url, { maxPages: 50 });
```

### 2. **Use Debug Mode**

```typescript
const extractor = new WebExtractor({
  apiKey: process.env.FIRECRAWL_API_KEY,
  debug: true  // See detailed logs
});
```

### 3. **Handle Errors Gracefully**

```typescript
try {
  const page = await extractor.extractPage(url);
} catch (error) {
  console.error('Extraction failed:', error.message);
  // Fallback or retry logic
}
```

### 4. **Validate Results**

```typescript
// Always check if extraction was successful
if (page.metadata.wordCount === 0) {
  console.warn('Warning: No content extracted');
}

if (result.stats.successRate < 50) {
  console.warn('Warning: Low success rate');
}
```

### 5. **Monitor Performance**

```typescript
const startTime = Date.now();
const result = await extractor.extractWebsite(url);
const duration = Date.now() - startTime;

console.log(`Extracted ${result.pages.length} pages in ${duration}ms`);
console.log(`Average: ${duration / result.pages.length}ms per page`);
```

### 6. **Document Your Tests**

```typescript
/**
 * Test Configuration for YourSite.com
 *
 * Site Type: Documentation
 * Expected Pages: 20-30
 * Average Word Count: 500-800
 * Success Rate Target: >90%
 *
 * Known Issues:
 * - Blog section excluded (not relevant)
 * - Some PDF links may fail (expected)
 */
```

---

## Troubleshooting

### Debug Checklist

- [ ] API key is valid and set correctly
- [ ] Internet connection is stable
- [ ] Website is accessible (not down)
- [ ] Rate limits not exceeded
- [ ] Dependencies are installed
- [ ] TypeScript is compiled (or using tsx)

### Enable Verbose Logging

```typescript
const extractor = new WebExtractor({
  apiKey: process.env.FIRECRAWL_API_KEY,
  debug: true  // Enables logging
});

// Add custom logging
console.log('Starting test...');
console.time('extraction');

const page = await extractor.extractPage(url);

console.timeEnd('extraction');
console.log('Result:', JSON.stringify(page, null, 2));
```

### Test Individual Components

```typescript
// Test URL utilities only
import { normalizeUrl, validateUrl } from '../src';

console.log(normalizeUrl('https://Example.com/'));
// => https://example.com

console.log(WebExtractor.isValidUrl('https://example.com'));
// => true

// Test content utilities
import { cleanContent, countWords } from '../src';

const content = '  Hello   world  ';
console.log(cleanContent(content));
// => "Hello world"

console.log(countWords('Hello world'));
// => 2
```

---

## Advanced Testing Patterns

### Parallel Testing

```typescript
// Test multiple URLs in parallel
const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

const results = await Promise.all(
  urls.map(url => extractor.extractPage(url))
);

console.log(`Extracted ${results.length} pages`);
```

### Batch Processing

```typescript
// Process URLs in batches to avoid rate limits
async function batchExtract(urls: string[], batchSize = 5) {
  const results = [];

  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(url => extractor.extractPage(url))
    );
    results.push(...batchResults);

    // Wait between batches
    if (i + batchSize < urls.length) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  return results;
}
```

### Custom Assertions

```typescript
function assertPage(page: ExtractedPage) {
  if (!page.title) throw new Error('Missing title');
  if (page.metadata.wordCount < 50) throw new Error('Content too short');
  if (!page.url.startsWith('https://')) throw new Error('Invalid URL');
  return true;
}

// Usage
const page = await extractor.extractPage(url);
assertPage(page);
console.log('✓ Page valid');
```

---

## Conclusion

This testing methodology provides:

✅ **Comprehensive Coverage** - Tests all major features
✅ **Reproducible Results** - Same tests, same results
✅ **Clear Documentation** - Easy to understand and modify
✅ **Extensible Framework** - Easy to add new tests
✅ **Production Ready** - Validates real-world usage

### Next Steps

1. Review the [test/test-astratechai.ts](../test/test-astratechai.ts) file
2. Run the test yourself: `npm run test:astratechai`
3. Create tests for your own websites
4. Share your results in [TEST_RESULTS.md](../TEST_RESULTS.md)

---

## Resources

- **Package Documentation**: [README.md](../README.md)
- **Test Results**: [TEST_RESULTS.md](../TEST_RESULTS.md)
- **Firecrawl API**: https://docs.firecrawl.dev
- **GitHub Issues**: https://github.com/anisirji/llm-web-extractor/issues

---

**Last Updated:** 2025-11-22
**Version:** 1.0.0
**Author:** anisirji
