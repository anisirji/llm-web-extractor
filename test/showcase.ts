/**
 * Showcase all SDK features
 */

import { WebExtractor } from '../src';

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                                                               ║
║          @anisirji/web-extractor SDK - Feature Showcase       ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
`);

async function showcase() {
  console.log('📦 SDK Features:\n');

  console.log('1️⃣  URL Validation & Normalization');
  console.log('   ✓ Validate URLs');
  console.log('   ✓ Normalize URLs (lowercase, sort params, etc.)');
  console.log('   ✓ Deduplicate URL lists');
  console.log('   ✓ Extract domains and subdomains');

  console.log('\n2️⃣  Content Processing');
  console.log('   ✓ Clean whitespace and formatting');
  console.log('   ✓ Count words');
  console.log('   ✓ Generate excerpts');
  console.log('   ✓ Detect language');

  console.log('\n3️⃣  Web Scraping (requires Firecrawl API key)');
  console.log('   ✓ Extract single pages');
  console.log('   ✓ Crawl entire websites');
  console.log('   ✓ Filter by URL patterns');
  console.log('   ✓ Limit crawl depth and page count');
  console.log('   ✓ Include/exclude subdomains');

  console.log('\n4️⃣  Rich Metadata');
  console.log('   ✓ Page titles and descriptions');
  console.log('   ✓ Word counts');
  console.log('   ✓ Language detection');
  console.log('   ✓ Scraping timestamps');
  console.log('   ✓ Custom metadata support');

  console.log('\n5️⃣  Error Handling');
  console.log('   ✓ Comprehensive error messages');
  console.log('   ✓ Failed page tracking');
  console.log('   ✓ Success rate statistics');

  console.log('\n6️⃣  TypeScript Support');
  console.log('   ✓ Full type definitions');
  console.log('   ✓ IntelliSense support');
  console.log('   ✓ Type-safe API');

  console.log('\n\n📚 Usage Examples:\n');

  console.log(`
// Initialize
import { WebExtractor } from '@anisirji/web-extractor';

const extractor = new WebExtractor({
  apiKey: 'your-firecrawl-key',
  debug: true
});

// Extract single page
const page = await extractor.extractPage('https://example.com');
console.log(page.title, page.metadata.wordCount);

// Crawl website
const result = await extractor.extractWebsite('https://docs.example.com', {
  maxPages: 20,
  includePatterns: [/\\/api\\//],
  excludePatterns: [/\\/blog\\//],
  maxDepth: 3
});

// URL utilities
import { normalizeUrl, deduplicateUrls } from '@anisirji/web-extractor';

const normalized = normalizeUrl('https://Example.com/Path?b=2&a=1');
// => 'https://example.com/path?a=1&b=2'

const unique = deduplicateUrls(urlList);
// => Only unique URLs
  `);

  console.log('\n\n📊 Package Stats:\n');
  console.log('   Size: ~50KB (minified)');
  console.log('   Dependencies: 1 (firecrawl-js)');
  console.log('   TypeScript: ✓');
  console.log('   Node.js: >= 16');

  console.log('\n\n🚀 Ready to publish to NPM!\n');
  console.log('   Run: npm publish --access public\n');
}

showcase();
