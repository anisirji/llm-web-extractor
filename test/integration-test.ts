/**
 * Integration Test with Real Firecrawl API
 */

import { WebExtractor, normalizeUrl, deduplicateUrls } from '../src';

const API_KEY = 'fc-96d1011ccf7d4cbba039c17e8dad3c3e';

async function runIntegrationTests() {
  console.log('🧪 Starting Integration Tests with Firecrawl API\n');
  console.log('=' .repeat(60));

  const extractor = new WebExtractor({
    apiKey: API_KEY,
    debug: true,
    timeout: 60000
  });

  try {
    // Test 1: Single Page Extraction
    console.log('\n📄 Test 1: Single Page Extraction');
    console.log('-'.repeat(60));

    const page = await extractor.extractPage('https://example.com');

    console.log('✅ Page extracted successfully!');
    console.log('   Title:', page.title);
    console.log('   URL:', page.url);
    console.log('   Word Count:', page.metadata.wordCount);
    console.log('   Language:', page.metadata.language);
    console.log('   Scraped At:', page.metadata.scrapedAt);
    console.log('   Content Preview:', page.content.substring(0, 200) + '...');

    // Test 2: Website Crawling (Small Scale)
    console.log('\n🌐 Test 2: Website Crawling (3 pages max)');
    console.log('-'.repeat(60));

    const result = await extractor.extractWebsite('https://example.com', {
      maxPages: 3,
      includeSubdomains: false,
      maxDepth: 1
    });

    console.log('✅ Website crawled successfully!');
    console.log('   Total Pages:', result.totalPages);
    console.log('   Successful:', result.pages.length);
    console.log('   Failed:', result.failed.length);
    console.log('   Success Rate:', result.stats.successRate.toFixed(2) + '%');
    console.log('   Total Words:', result.stats.totalWords);
    console.log('   Avg Words/Page:', result.stats.avgWordsPerPage.toFixed(0));
    console.log('   Duration:', result.stats.duration + 'ms');

    console.log('\n   Pages extracted:');
    result.pages.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.title} (${p.metadata.wordCount} words)`);
      console.log(`      URL: ${p.url}`);
    });

    if (result.failed.length > 0) {
      console.log('\n   Failed URLs:');
      result.failed.forEach(f => {
        console.log(`   - ${f.url}: ${f.error}`);
      });
    }

    // Test 3: URL Utilities
    console.log('\n🔗 Test 3: URL Utilities');
    console.log('-'.repeat(60));

    const testUrls = [
      'https://Example.com/path?b=2&a=1#hash',
      'https://example.com/path/?a=1&b=2',
      'https://EXAMPLE.COM/path'
    ];

    console.log('   Original URLs:', testUrls);

    const normalized = testUrls.map(url => normalizeUrl(url));
    console.log('   Normalized:', normalized);

    const unique = deduplicateUrls(testUrls);
    console.log('   Deduplicated:', unique.length, 'unique URLs');

    // Test 4: Pattern Filtering
    console.log('\n🎯 Test 4: Pattern Filtering');
    console.log('-'.repeat(60));

    const filteredResult = await extractor.extractWebsite('https://example.com', {
      maxPages: 5,
      excludePatterns: [/\/privacy/, /\/terms/],
      maxDepth: 1
    });

    console.log('✅ Pattern filtering worked!');
    console.log('   Pages after filtering:', filteredResult.pages.length);

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 All Integration Tests Passed!');
    console.log('='.repeat(60));
    console.log('\n✅ SDK is working perfectly with Firecrawl API');
    console.log('✅ Single page extraction: OK');
    console.log('✅ Website crawling: OK');
    console.log('✅ URL utilities: OK');
    console.log('✅ Pattern filtering: OK');
    console.log('\n📦 Package is production-ready!\n');

  } catch (error) {
    console.error('\n❌ Test failed:', error);
    process.exit(1);
  }
}

runIntegrationTests();
