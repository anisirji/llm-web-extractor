/**
 * Advanced Usage Examples
 */

import {
  WebExtractor,
  normalizeUrl,
  deduplicateUrls,
  filterUrlsByPattern,
  countWords,
  generateExcerpt
} from '../src';

async function main() {
  const extractor = new WebExtractor({
    apiKey: process.env.FIRECRAWL_API_KEY || 'your-api-key',
    debug: true
  });

  // Example 1: URL Normalization
  console.log('=== Example 1: URL Normalization ===');
  const urls = [
    'https://Example.com/Path?b=2&a=1#section',
    'https://example.com/path/?a=1&b=2',
    'https://example.com/path',
  ];

  const normalized = urls.map(url => normalizeUrl(url));
  console.log('Original URLs:', urls);
  console.log('Normalized:', normalized);

  const unique = deduplicateUrls(urls);
  console.log('Deduplicated:', unique);

  // Example 2: Custom Content Processing
  console.log('\n=== Example 2: Custom Processing ===');
  const result = await extractor.extractWebsite('https://docs.example.com', {
    maxPages: 15
  });

  // Filter by word count
  const substantialPages = result.pages.filter(p => p.metadata.wordCount > 500);
  console.log(`Pages with >500 words: ${substantialPages.length}`);

  // Group by language
  const byLanguage = result.pages.reduce((acc, page) => {
    const lang = page.metadata.language || 'unknown';
    acc[lang] = (acc[lang] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  console.log('Pages by language:', byLanguage);

  // Calculate reading times
  const withReadingTime = result.pages.map(page => ({
    title: page.title,
    url: page.url,
    readingMinutes: Math.ceil(page.metadata.wordCount / 200)
  }));
  console.log('Reading times:', withReadingTime);

  // Example 3: Batch Processing
  console.log('\n=== Example 3: Batch Processing ===');
  const urlsToScrape = [
    'https://example.com/page1',
    'https://example.com/page2',
    'https://example.com/page3'
  ];

  const results = await Promise.allSettled(
    urlsToScrape.map(url => extractor.extractPage(url))
  );

  const successful = results.filter(r => r.status === 'fulfilled');
  const failed = results.filter(r => r.status === 'rejected');

  console.log(`Successful: ${successful.length}, Failed: ${failed.length}`);

  // Example 4: Pattern-based Filtering
  console.log('\n=== Example 4: Pattern Filtering ===');
  const testUrls = [
    'https://example.com/api/users',
    'https://example.com/blog/post-1',
    'https://example.com/api/posts',
    'https://example.com/about'
  ];

  const apiUrls = filterUrlsByPattern(
    testUrls,
    [/\/api\//],
    [/\/users/]
  );
  console.log('API URLs (excluding /users):', apiUrls);

  // Example 5: Generate Excerpts
  console.log('\n=== Example 5: Content Excerpts ===');
  for (const page of result.pages.slice(0, 3)) {
    const excerpt = generateExcerpt(page.content, 20);
    console.log(`\n${page.title}:`);
    console.log(excerpt);
  }
}

main().catch(console.error);
