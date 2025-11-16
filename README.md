# @termix/web-extractor

> Powerful web content extraction SDK with intelligent URL handling, content cleaning, and comprehensive metadata extraction.

## Features

✨ **Smart URL Handling**
- URL validation and normalization
- Subdomain detection
- Duplicate URL filtering
- Pattern-based URL filtering

🧹 **Content Cleaning**
- Automatic markdown/HTML/text extraction
- Whitespace normalization
- Word counting
- Language detection

📊 **Rich Metadata**
- Scraping timestamps
- Word counts
- Page descriptions
- Status codes
- Custom metadata support

🚀 **Easy to Use**
- Simple, intuitive API
- TypeScript support
- Promise-based
- Comprehensive error handling

## Installation

```bash
npm install @termix/web-extractor
```

## Quick Start

### Extract a Single Page

```typescript
import { WebExtractor } from '@termix/web-extractor';

const extractor = new WebExtractor({
  apiKey: 'your-firecrawl-api-key'
});

// Extract single page
const page = await extractor.extractPage('https://example.com');

console.log(page.title);
console.log(page.content);
console.log(page.metadata.wordCount);
```

### Extract Entire Website

```typescript
const result = await extractor.extractWebsite('https://docs.example.com', {
  maxPages: 20,
  includeSubdomains: false,
  titlePrefix: 'Docs',
  maxDepth: 3
});

console.log(`Extracted ${result.pages.length} pages`);
console.log(`Success rate: ${result.stats.successRate}%`);
console.log(`Total words: ${result.stats.totalWords}`);

for (const page of result.pages) {
  console.log(`${page.title} - ${page.url}`);
}
```

## API Reference

### WebExtractor

Main class for web extraction.

#### Constructor

```typescript
new WebExtractor(config: WebExtractorConfig)
```

**Config Options:**
- `apiKey` (required): Your Firecrawl API key
- `baseUrl` (optional): Custom Firecrawl API URL
- `timeout` (optional): Request timeout in ms (default: 30000)
- `debug` (optional): Enable debug logging (default: false)

#### Methods

##### extractPage(url, options?)

Extract content from a single page.

```typescript
await extractor.extractPage('https://example.com', {
  onlyMainContent: true,  // Extract only main content
  format: 'markdown',     // 'markdown' | 'html' | 'text'
  waitFor: 1000          // Wait time before extraction (ms)
});
```

**Returns:** `Promise<ExtractedPage>`

##### extractWebsite(url, options?)

Extract content from entire website (crawl).

```typescript
await extractor.extractWebsite('https://example.com', {
  maxPages: 10,                    // Maximum pages to scrape
  includeSubdomains: false,        // Include subdomains
  titlePrefix: 'My Site',          // Prefix for all titles
  maxDepth: 3,                     // Maximum crawl depth
  followExternalLinks: false,      // Follow external links
  includePatterns: [/\/docs\//],   // URL patterns to include
  excludePatterns: [/\/blog\//],   // URL patterns to exclude
  onlyMainContent: true,           // Extract only main content
  format: 'markdown'               // Output format
});
```

**Returns:** `Promise<ExtractionResult>`

### URL Utilities

Powerful URL manipulation utilities.

```typescript
import {
  normalizeUrl,
  validateUrl,
  deduplicateUrls,
  isSameDomain,
  extractDomain
} from '@termix/web-extractor';

// Normalize URL
const normalized = normalizeUrl('https://Example.com/path/?b=2&a=1#hash', {
  lowercase: true,           // Convert to lowercase
  removeTrailingSlash: true, // Remove trailing slash
  removeFragment: true,      // Remove #hash
  sortQueryParams: true      // Sort query params
});
// => 'https://example.com/path?a=1&b=2'

// Validate URL
const urlObj = validateUrl('https://example.com'); // Returns URL object or throws

// Deduplicate URLs
const unique = deduplicateUrls([
  'https://example.com/page',
  'https://example.com/page/',
  'https://EXAMPLE.COM/page'
]);
// => ['https://example.com/page']

// Check same domain
isSameDomain('https://example.com', 'https://example.com/page'); // true
isSameDomain('https://example.com', 'https://other.com'); // false

// Extract domain
extractDomain('https://blog.example.com/page'); // => 'blog.example.com'
```

### Content Utilities

Content processing utilities.

```typescript
import {
  cleanContent,
  countWords,
  generateExcerpt,
  detectLanguage
} from '@termix/web-extractor';

// Clean content
const cleaned = cleanContent('  text\n\n\n\nmore text  ');
// => 'text\n\nmore text'

// Count words
countWords('Hello world from TermiX'); // => 4

// Generate excerpt
generateExcerpt('Very long content here...', 10);
// => 'Very long content here (first 10 words)...'

// Detect language
detectLanguage('This is an English text'); // => 'en'
```

## Advanced Examples

### Filter URLs by Pattern

```typescript
const result = await extractor.extractWebsite('https://docs.example.com', {
  maxPages: 50,
  // Only include documentation pages
  includePatterns: [
    /\/docs\//,
    /\/api\//,
    /\/guides\//
  ],
  // Exclude blog and changelog
  excludePatterns: [
    /\/blog\//,
    /\/changelog\//
  ]
});
```

### Custom Processing Pipeline

```typescript
const result = await extractor.extractWebsite('https://example.com', {
  maxPages: 30
});

// Filter by word count
const substantialPages = result.pages.filter(
  page => page.metadata.wordCount > 500
);

// Group by language
const byLanguage = result.pages.reduce((acc, page) => {
  const lang = page.metadata.language || 'unknown';
  acc[lang] = acc[lang] || [];
  acc[lang].push(page);
  return acc;
}, {});

// Calculate reading time
const withReadingTime = result.pages.map(page => ({
  ...page,
  readingTimeMinutes: Math.ceil(page.metadata.wordCount / 200)
}));
```

### Batch Processing with Error Handling

```typescript
const urls = [
  'https://example.com/page1',
  'https://example.com/page2',
  'https://example.com/page3'
];

const results = await Promise.allSettled(
  urls.map(url => extractor.extractPage(url))
);

const successful = results
  .filter(r => r.status === 'fulfilled')
  .map(r => r.value);

const failed = results
  .filter(r => r.status === 'rejected')
  .map((r, i) => ({ url: urls[i], error: r.reason }));

console.log(`Success: ${successful.length}, Failed: ${failed.length}`);
```

## Types

### ExtractedPage

```typescript
interface ExtractedPage {
  title: string;
  content: string;
  url: string;
  metadata: PageMetadata;
}
```

### PageMetadata

```typescript
interface PageMetadata {
  scrapedAt: Date;
  sourceUrl: string;
  description?: string;
  wordCount: number;
  language?: string;
  statusCode?: number;
  [key: string]: any;  // Custom metadata
}
```

### ExtractionResult

```typescript
interface ExtractionResult {
  pages: ExtractedPage[];
  totalPages: number;
  failed: FailedExtraction[];
  stats: ExtractionStats;
}
```

### ExtractionStats

```typescript
interface ExtractionStats {
  duration: number;           // Total time in ms
  successRate: number;        // Success rate %
  totalWords: number;         // Total words extracted
  avgWordsPerPage: number;    // Average words per page
}
```

## Use Cases

- 📚 **Documentation Scraping**: Extract and index documentation sites
- 🧠 **Knowledge Base Building**: Build AI knowledge bases from websites
- 🔍 **Content Analysis**: Analyze website content and structure
- 📊 **SEO Analysis**: Extract metadata for SEO analysis
- 🤖 **AI Training Data**: Collect training data for AI models
- 📝 **Content Migration**: Migrate content from old to new sites

## Requirements

- Node.js >= 16
- Firecrawl API key ([Get one here](https://firecrawl.dev))

## License

MIT

## Support

- 📖 [Documentation](https://docs.termix.ai)
- 🐛 [Report Issues](https://github.com/termix/web-extractor/issues)
- 💬 [Discord Community](https://discord.gg/termix)

---

Built with ❤️ by the TermiX Team
