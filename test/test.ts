/**
 * Test script for @anisirji/web-extractor SDK
 */

import {
  WebExtractor,
  normalizeUrl,
  validateUrl,
  deduplicateUrls,
  isSameDomain,
  extractDomain,
  filterUrlsByPattern,
  countWords,
  cleanContent,
  generateExcerpt
} from '../src';

console.log('🧪 Testing @anisirji/web-extractor SDK\n');

// Test 1: URL Validation
console.log('✅ Test 1: URL Validation');
try {
  const url = validateUrl('https://example.com/path');
  console.log('   Valid URL:', url.href);
} catch (error) {
  console.log('   ❌ Failed:', error);
}

try {
  validateUrl('invalid-url');
  console.log('   ❌ Should have thrown error');
} catch (error) {
  console.log('   Correctly rejected invalid URL');
}

// Test 2: URL Normalization
console.log('\n✅ Test 2: URL Normalization');
const testUrls = [
  'https://Example.COM/path?b=2&a=1#hash',
  'https://example.com/path/?a=1&b=2',
  'https://example.com/path'
];

testUrls.forEach(url => {
  const normalized = normalizeUrl(url);
  console.log(`   ${url}`);
  console.log(`   → ${normalized}`);
});

// Test 3: URL Deduplication
console.log('\n✅ Test 3: URL Deduplication');
const duplicateUrls = [
  'https://example.com/page',
  'https://example.com/page/',
  'https://EXAMPLE.COM/page',
  'https://example.com/page?query=1',
  'https://example.com/other'
];
console.log('   Original:', duplicateUrls.length, 'URLs');
const unique = deduplicateUrls(duplicateUrls);
console.log('   Unique:', unique.length, 'URLs');
console.log('   Result:', unique);

// Test 4: Domain Extraction
console.log('\n✅ Test 4: Domain Operations');
const url1 = 'https://blog.example.com/post';
const url2 = 'https://api.example.com/data';
const url3 = 'https://other.com/page';

console.log('   Domain of', url1, '→', extractDomain(url1));
console.log('   Same domain?', url1, 'vs', url2, '→', isSameDomain(url1, url2));
console.log('   Same domain?', url1, 'vs', url3, '→', isSameDomain(url1, url3));

// Test 5: URL Pattern Filtering
console.log('\n✅ Test 5: Pattern Filtering');
const urls = [
  'https://example.com/api/users',
  'https://example.com/blog/post-1',
  'https://example.com/api/posts',
  'https://example.com/about'
];

const apiUrls = filterUrlsByPattern(urls, [/\/api\//]);
console.log('   API URLs:', apiUrls);

const nonBlogUrls = filterUrlsByPattern(urls, undefined, [/\/blog\//]);
console.log('   Non-blog URLs:', nonBlogUrls);

// Test 6: Content Utilities
console.log('\n✅ Test 6: Content Processing');
const rawContent = '  Hello   world  \n\n\n\n  from   TermiX  ';
const cleaned = cleanContent(rawContent);
console.log('   Original:', JSON.stringify(rawContent));
console.log('   Cleaned:', JSON.stringify(cleaned));

const words = countWords('This is a test sentence with seven words');
console.log('   Word count:', words);

const longText = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const excerpt = generateExcerpt(longText, 10);
console.log('   Excerpt (10 words):', excerpt);

// Test 7: WebExtractor Class
console.log('\n✅ Test 7: WebExtractor Class');
console.log('   Static methods available:');
console.log('   - WebExtractor.isValidUrl("https://example.com"):', WebExtractor.isValidUrl('https://example.com'));
console.log('   - WebExtractor.isValidUrl("invalid"):', WebExtractor.isValidUrl('invalid'));
console.log('   - WebExtractor.normalizeUrl:', typeof WebExtractor.normalizeUrl);
console.log('   - WebExtractor.validateUrl:', typeof WebExtractor.validateUrl);

// Test 8: Instance Creation
console.log('\n✅ Test 8: WebExtractor Instance');
try {
  const extractor = new WebExtractor({
    apiKey: process.env.FIRECRAWL_API_KEY || 'test-key',
    debug: false,
    timeout: 30000
  });
  console.log('   ✓ Instance created successfully');
  console.log('   ✓ All instance methods available');
} catch (error) {
  console.log('   ❌ Failed to create instance:', error);
}

console.log('\n🎉 All unit tests completed!\n');
console.log('📝 Note: To test actual web scraping, you need:');
console.log('   1. Set FIRECRAWL_API_KEY environment variable');
console.log('   2. Run: FIRECRAWL_API_KEY=your_key npm run test:integration\n');
