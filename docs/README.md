# Documentation

> **Complete documentation for @anisirji/web-extractor package**

## 📚 Available Documentation

### [TESTING_GUIDE.md](./TESTING_GUIDE.md)
**Comprehensive guide on testing the web extractor SDK**

Learn how to:
- Set up testing environment
- Create comprehensive tests
- Test any website
- Validate extraction results
- Troubleshoot common issues
- Understand test metrics

**Who should read this:**
- Developers integrating the SDK
- QA engineers testing the package
- Anyone validating extraction quality

---

## Quick Links

- **Main README**: [../README.md](../README.md) - Package overview and API reference
- **Test Results**: [../TEST_RESULTS.md](../TEST_RESULTS.md) - Latest test results for astratechai.com
- **Examples**: [../examples/](../examples/) - Code examples and usage patterns

---

## Getting Started

### Installation

```bash
npm install @anisirji/web-extractor
```

### Basic Usage

```typescript
import { WebExtractor } from '@anisirji/web-extractor';

const extractor = new WebExtractor({
  apiKey: 'your-firecrawl-api-key'
});

// Extract a single page
const page = await extractor.extractPage('https://example.com');
console.log(page.title);
console.log(page.content);

// Extract entire website
const result = await extractor.extractWebsite('https://example.com', {
  maxPages: 10
});
console.log(`Extracted ${result.pages.length} pages`);
```

---

## Documentation Index

### For Developers

1. **[API Reference](../README.md#api-reference)**
   - WebExtractor class
   - Configuration options
   - Method signatures
   - Return types

2. **[Testing Guide](./TESTING_GUIDE.md)**
   - Setting up tests
   - Writing comprehensive tests
   - Running tests
   - Interpreting results

3. **[Examples](../examples/)**
   - Basic usage examples
   - Advanced patterns
   - Real-world scenarios

### For Users

1. **[Quick Start](../README.md#quick-start)**
   - Installation
   - First extraction
   - Basic configuration

2. **[Use Cases](../README.md#use-cases)**
   - Documentation scraping
   - Knowledge base building
   - Content analysis
   - AI training data collection

3. **[Utilities](../README.md#url-utilities)**
   - URL normalization
   - Content cleaning
   - Helper functions

---

## Key Features

### 🔗 Smart URL Handling
- URL validation and normalization
- Subdomain detection
- Duplicate URL filtering
- Pattern-based filtering

### 🧹 Content Cleaning
- Markdown/HTML/text extraction
- Whitespace normalization
- Word counting
- Language detection

### 📊 Rich Metadata
- Scraping timestamps
- Word counts
- Page descriptions
- Status codes
- Custom metadata support

### 🚀 Easy to Use
- Simple, intuitive API
- TypeScript support
- Promise-based
- Comprehensive error handling

---

## Common Tasks

### Extract Documentation Site

```typescript
const result = await extractor.extractWebsite('https://docs.example.com', {
  maxPages: 50,
  includePatterns: [/\/docs\//, /\/api\//],
  excludePatterns: [/\/blog\//],
  maxDepth: 3
});
```

### Filter by URL Pattern

```typescript
const result = await extractor.extractWebsite('https://example.com', {
  includePatterns: [
    /\/docs\//,
    /\/guides\//
  ],
  excludePatterns: [
    /\/blog\//,
    /\/changelog\//
  ]
});
```

### Extract with Metadata

```typescript
const page = await extractor.extractPage('https://example.com');

console.log({
  title: page.title,
  url: page.url,
  wordCount: page.metadata.wordCount,
  language: page.metadata.language,
  scrapedAt: page.metadata.scrapedAt,
  statusCode: page.metadata.statusCode
});
```

### Normalize URLs

```typescript
import { normalizeUrl, deduplicateUrls } from '@anisirji/web-extractor';

const normalized = normalizeUrl('https://Example.com/path/?b=2&a=1#hash', {
  lowercase: true,
  removeTrailingSlash: true,
  removeFragment: true,
  sortQueryParams: true
});
// => 'https://example.com/path?a=1&b=2'

const unique = deduplicateUrls([
  'https://example.com/page',
  'https://example.com/page/',
  'https://EXAMPLE.COM/page'
]);
// => ['https://example.com/page']
```

---

## Testing

### Run Tests

```bash
# Unit tests
npm test

# Integration test with astratechai.com
npm run test:astratechai

# Basic usage example
npm run test:integration
```

### Create Your Own Test

See [TESTING_GUIDE.md](./TESTING_GUIDE.md) for detailed instructions on creating custom tests for any website.

---

## Architecture

### Package Structure

```
@anisirji/web-extractor/
├── src/
│   ├── index.ts              # Main exports
│   ├── web-extractor.ts      # Core WebExtractor class
│   ├── types.ts              # TypeScript interfaces
│   └── utils/
│       ├── url-utils.ts      # URL processing
│       └── content-utils.ts  # Content processing
├── test/
│   ├── test.ts               # Unit tests
│   └── test-astratechai.ts   # Integration test
├── examples/
│   ├── basic-usage.ts        # Basic examples
│   └── advanced-usage.ts     # Advanced patterns
└── docs/
    ├── README.md             # This file
    └── TESTING_GUIDE.md      # Testing documentation
```

### Data Flow

```
User Request
     ↓
WebExtractor.extractPage(url)
     ↓
URL Validation & Normalization
     ↓
Firecrawl API Call
     ↓
Content Extraction (Markdown/HTML/Text)
     ↓
Content Cleaning
     ↓
Metadata Building
     ↓
Return ExtractedPage
```

### Dependencies

- **@mendable/firecrawl-js**: ^1.0.0 - Firecrawl API client
- **TypeScript**: ^5.0.0 - Type safety
- **tsx**: ^4.7.0 - TypeScript execution

---

## API Quick Reference

### WebExtractor Class

```typescript
class WebExtractor {
  constructor(config: WebExtractorConfig)

  // Instance methods
  extractPage(url: string, options?: ExtractPageOptions): Promise<ExtractedPage>
  extractWebsite(url: string, options?: ExtractWebsiteOptions): Promise<ExtractionResult>

  // Static methods
  static isValidUrl(url: string): boolean
  static normalizeUrl(url: string, options?: NormalizeUrlOptions): string
  static validateUrl(url: string): URL
}
```

### URL Utilities

```typescript
// Validate URL
validateUrl(url: string): URL

// Normalize URL
normalizeUrl(url: string, options?: NormalizeUrlOptions): string

// Deduplicate URLs
deduplicateUrls(urls: string[]): string[]

// Check same domain
isSameDomain(url1: string, url2: string): boolean

// Extract domain
extractDomain(url: string): string

// Filter by pattern
filterUrlsByPattern(
  urls: string[],
  includePatterns?: RegExp[],
  excludePatterns?: RegExp[]
): string[]
```

### Content Utilities

```typescript
// Clean content
cleanContent(content: string): string

// Count words
countWords(text: string): number

// Generate excerpt
generateExcerpt(text: string, maxWords: number): string

// Detect language
detectLanguage(text: string): string
```

---

## Types Reference

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
  [key: string]: any;
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
  duration: number;
  successRate: number;
  totalWords: number;
  avgWordsPerPage: number;
}
```

---

## Best Practices

### 1. Always Validate Results

```typescript
const page = await extractor.extractPage(url);

if (page.metadata.wordCount === 0) {
  console.warn('Warning: No content extracted');
}
```

### 2. Use Appropriate Limits

```typescript
// For documentation sites
const result = await extractor.extractWebsite(url, {
  maxPages: 50,  // Reasonable limit
  maxDepth: 3    // Don't go too deep
});
```

### 3. Handle Errors Gracefully

```typescript
try {
  const page = await extractor.extractPage(url);
} catch (error) {
  console.error('Extraction failed:', error.message);
  // Implement fallback or retry logic
}
```

### 4. Use Pattern Filtering

```typescript
// Only extract relevant pages
const result = await extractor.extractWebsite(url, {
  includePatterns: [/\/docs\//],
  excludePatterns: [/\/blog\//]
});
```

### 5. Monitor Performance

```typescript
console.time('extraction');
const result = await extractor.extractWebsite(url);
console.timeEnd('extraction');

console.log(`Success rate: ${result.stats.successRate}%`);
```

---

## Troubleshooting

### Common Issues

**Issue: "API key not found"**
```bash
export FIRECRAWL_API_KEY=your_key_here
```

**Issue: "Failed to extract page"**
- Check API key validity
- Verify website is accessible
- Check rate limits
- Increase timeout

**Issue: "Empty content"**
- Try `onlyMainContent: false`
- Increase `waitFor` time
- Try different format (html/text)

See [TESTING_GUIDE.md#troubleshooting](./TESTING_GUIDE.md#troubleshooting) for more details.

---

## Support

- 📖 [GitHub Repository](https://github.com/anisirji/llm-web-extractor)
- 🐛 [Report Issues](https://github.com/anisirji/llm-web-extractor/issues)
- 📦 [NPM Package](https://www.npmjs.com/package/@anisirji/web-extractor)
- 📧 Contact: anisirji

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Add tests for new features
4. Update documentation
5. Submit a pull request

---

## License

MIT License - see LICENSE file for details

---

## Changelog

### v1.0.1 (2025-11-22)
- Added comprehensive testing guide
- Added astratechai.com integration test
- Improved documentation structure

### v1.0.0 (Initial Release)
- Core extraction functionality
- URL utilities
- Content processing
- TypeScript support

---

**Built with ❤️ by anisirji**
