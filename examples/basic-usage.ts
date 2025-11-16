/**
 * Basic Usage Examples
 */

import { WebExtractor } from '../src';

async function main() {
  // Initialize the extractor
  const extractor = new WebExtractor({
    apiKey: process.env.FIRECRAWL_API_KEY || 'your-api-key',
    debug: true
  });

  // Example 1: Extract a single page
  console.log('=== Example 1: Single Page Extraction ===');
  const page = await extractor.extractPage('https://example.com');
  console.log('Title:', page.title);
  console.log('Word Count:', page.metadata.wordCount);
  console.log('Language:', page.metadata.language);
  console.log('Content Preview:', page.content.substring(0, 200) + '...');

  // Example 2: Extract website with custom options
  console.log('\n=== Example 2: Website Crawl ===');
  const result = await extractor.extractWebsite('https://docs.example.com', {
    maxPages: 10,
    titlePrefix: 'Documentation',
    includeSubdomains: false,
    maxDepth: 2
  });

  console.log('Total pages extracted:', result.pages.length);
  console.log('Success rate:', result.stats.successRate.toFixed(2) + '%');
  console.log('Total words:', result.stats.totalWords);
  console.log('Duration:', result.stats.duration + 'ms');

  // List all extracted pages
  result.pages.forEach((page, index) => {
    console.log(`${index + 1}. ${page.title} (${page.metadata.wordCount} words)`);
  });

  // Example 3: Filter by patterns
  console.log('\n=== Example 3: Pattern Filtering ===');
  const filtered = await extractor.extractWebsite('https://docs.example.com', {
    maxPages: 20,
    includePatterns: [/\/api\//, /\/guides\//],
    excludePatterns: [/\/changelog\//]
  });

  console.log('Filtered pages:', filtered.pages.length);
}

main().catch(console.error);
