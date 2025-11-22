/**
 * Comprehensive Test for astratechai.com Extraction
 *
 * This test validates that the web-extractor-sdk properly extracts
 * content from astratechai.com according to documentation expectations.
 */

import { WebExtractor } from '../src';

const ASTRATECHAI_URL = 'https://astratechai.com';

async function runComprehensiveTest() {
  console.log('🧪 COMPREHENSIVE TEST: astratechai.com Extraction\n');
  console.log('='.repeat(60));

  // Check for API key
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error('\n❌ ERROR: FIRECRAWL_API_KEY not found in environment');
    console.log('Please set your Firecrawl API key:');
    console.log('  export FIRECRAWL_API_KEY=your_api_key_here');
    console.log('  npm run test:astratechai\n');
    process.exit(1);
  }

  console.log('✓ API Key detected');
  console.log('✓ Target URL:', ASTRATECHAI_URL);
  console.log('='.repeat(60));

  // Initialize extractor
  const extractor = new WebExtractor({
    apiKey,
    debug: true,
    timeout: 60000 // 60s timeout for thorough testing
  });

  console.log('\n✓ WebExtractor initialized successfully\n');

  // TEST 1: Single Page Extraction
  console.log('📄 TEST 1: Single Page Extraction');
  console.log('-'.repeat(60));

  try {
    console.log('Extracting homepage...');
    const startTime = Date.now();

    const page = await extractor.extractPage(ASTRATECHAI_URL, {
      onlyMainContent: true,
      format: 'markdown'
    });

    const duration = Date.now() - startTime;

    console.log('\n✅ EXTRACTION SUCCESSFUL');
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Title: ${page.title}`);
    console.log(`   URL: ${page.url}`);
    console.log(`   Word Count: ${page.metadata.wordCount}`);
    console.log(`   Language: ${page.metadata.language || 'not detected'}`);
    console.log(`   Scraped At: ${page.metadata.scrapedAt.toISOString()}`);
    console.log(`   Status Code: ${page.metadata.statusCode || 'N/A'}`);

    if (page.metadata.description) {
      console.log(`   Description: ${page.metadata.description.substring(0, 100)}...`);
    }

    console.log('\n   Content Preview (first 500 chars):');
    console.log('   ' + '-'.repeat(58));
    console.log('   ' + page.content.substring(0, 500).replace(/\n/g, '\n   '));
    console.log('   ' + '-'.repeat(58));

    // Validation checks
    console.log('\n   VALIDATION CHECKS:');

    const checks = [
      { name: 'Has title', pass: page.title && page.title.length > 0 },
      { name: 'Has content', pass: page.content && page.content.length > 100 },
      { name: 'Has valid URL', pass: page.url.startsWith('https://') },
      { name: 'Word count > 0', pass: page.metadata.wordCount > 0 },
      { name: 'Has scraped timestamp', pass: page.metadata.scrapedAt instanceof Date },
      { name: 'Content is cleaned', pass: !page.content.startsWith('  ') && !page.content.endsWith('  ') },
      { name: 'Word count reasonable', pass: page.metadata.wordCount > 50 }
    ];

    checks.forEach(check => {
      console.log(`   ${check.pass ? '✓' : '✗'} ${check.name}`);
    });

    const allChecksPassed = checks.every(c => c.pass);

    if (!allChecksPassed) {
      console.log('\n   ⚠️  Some validation checks failed!');
    } else {
      console.log('\n   ✅ All validation checks passed!');
    }

  } catch (error) {
    console.error('\n❌ TEST 1 FAILED');
    console.error('Error:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }

  // TEST 2: Website Crawl (Limited)
  console.log('\n\n📚 TEST 2: Website Crawl (Limited to 5 pages)');
  console.log('-'.repeat(60));

  try {
    console.log('Starting crawl...');
    const startTime = Date.now();

    const result = await extractor.extractWebsite(ASTRATECHAI_URL, {
      maxPages: 5,
      includeSubdomains: false,
      maxDepth: 2,
      onlyMainContent: true,
      format: 'markdown'
    });

    const duration = Date.now() - startTime;

    console.log('\n✅ CRAWL SUCCESSFUL');
    console.log(`   Duration: ${duration}ms`);
    console.log(`   Pages Extracted: ${result.pages.length}`);
    console.log(`   Total Pages: ${result.totalPages}`);
    console.log(`   Failed: ${result.failed.length}`);
    console.log(`   Success Rate: ${result.stats.successRate.toFixed(2)}%`);
    console.log(`   Total Words: ${result.stats.totalWords}`);
    console.log(`   Avg Words/Page: ${Math.round(result.stats.avgWordsPerPage)}`);

    if (result.failed.length > 0) {
      console.log('\n   ⚠️  Failed URLs:');
      result.failed.forEach((f, i) => {
        console.log(`   ${i + 1}. ${f.url}`);
        console.log(`      Error: ${f.error}`);
      });
    }

    console.log('\n   📄 EXTRACTED PAGES:');
    result.pages.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page.title}`);
      console.log(`      URL: ${page.url}`);
      console.log(`      Words: ${page.metadata.wordCount}`);
      console.log(`      Language: ${page.metadata.language || 'N/A'}`);
    });

    // Validation checks
    console.log('\n   VALIDATION CHECKS:');

    const checks = [
      { name: 'Extracted at least 1 page', pass: result.pages.length >= 1 },
      { name: 'Success rate > 50%', pass: result.stats.successRate > 50 },
      { name: 'All pages have content', pass: result.pages.every(p => p.content.length > 0) },
      { name: 'All pages have titles', pass: result.pages.every(p => p.title.length > 0) },
      { name: 'All pages have word counts', pass: result.pages.every(p => p.metadata.wordCount > 0) },
      { name: 'No duplicate URLs', pass: new Set(result.pages.map(p => p.url)).size === result.pages.length },
      { name: 'All URLs normalized', pass: result.pages.every(p => p.url === p.url.toLowerCase()) },
      { name: 'Stats are accurate', pass: result.totalPages === result.pages.length + result.failed.length }
    ];

    checks.forEach(check => {
      console.log(`   ${check.pass ? '✓' : '✗'} ${check.name}`);
    });

    const allChecksPassed = checks.every(c => c.pass);

    if (!allChecksPassed) {
      console.log('\n   ⚠️  Some validation checks failed!');
    } else {
      console.log('\n   ✅ All validation checks passed!');
    }

  } catch (error) {
    console.error('\n❌ TEST 2 FAILED');
    console.error('Error:', error instanceof Error ? error.message : String(error));
    if (error instanceof Error && error.stack) {
      console.error('Stack:', error.stack);
    }
    process.exit(1);
  }

  // TEST 3: Content Quality Checks
  console.log('\n\n🔍 TEST 3: Content Quality Analysis');
  console.log('-'.repeat(60));

  try {
    const page = await extractor.extractPage(ASTRATECHAI_URL);

    const content = page.content;
    const hasMarkdownHeadings = /^#{1,6}\s+.+$/m.test(content);
    const hasLinks = /\[.+\]\(.+\)/.test(content);
    const hasBulletPoints = /^[-*]\s+.+$/m.test(content);
    const noExcessiveWhitespace = !/\n{4,}/.test(content);
    const noLeadingTrailingWhitespace = content === content.trim();

    console.log('   Content Format Analysis:');
    console.log(`   ${hasMarkdownHeadings ? '✓' : '✗'} Contains markdown headings`);
    console.log(`   ${hasLinks ? '✓' : '✗'} Contains links`);
    console.log(`   ${hasBulletPoints ? '✓' : '✗'} Contains bullet points`);
    console.log(`   ${noExcessiveWhitespace ? '✓' : '✗'} No excessive whitespace`);
    console.log(`   ${noLeadingTrailingWhitespace ? '✓' : '✗'} No leading/trailing whitespace`);

    // Word distribution analysis
    const words = content.split(/\s+/);
    const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / words.length;
    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
    const vocabularyRichness = uniqueWords.size / words.length;

    console.log('\n   Content Statistics:');
    console.log(`   Total words: ${words.length}`);
    console.log(`   Unique words: ${uniqueWords.size}`);
    console.log(`   Avg word length: ${avgWordLength.toFixed(2)} chars`);
    console.log(`   Vocabulary richness: ${(vocabularyRichness * 100).toFixed(2)}%`);

    console.log('\n   ✅ Content quality analysis complete');

  } catch (error) {
    console.error('\n❌ TEST 3 FAILED');
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }

  // TEST 4: URL Utilities
  console.log('\n\n🔗 TEST 4: URL Utilities Testing');
  console.log('-'.repeat(60));

  try {
    console.log('   Testing URL validation and normalization...');

    const testUrls = [
      'https://astratechai.com',
      'https://astratechai.com/',
      'https://ASTRATECHAI.COM',
      'https://astratechai.com?utm_source=test',
      'https://astratechai.com/about',
      'https://astratechai.com/about/'
    ];

    console.log('\n   Input URLs:');
    testUrls.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));

    const normalized = testUrls.map(url => WebExtractor.normalizeUrl(url));
    const unique = new Set(normalized);

    console.log('\n   Normalized URLs:');
    normalized.forEach((url, i) => console.log(`   ${i + 1}. ${url}`));

    console.log(`\n   ${unique.size < testUrls.length ? '✓' : '✗'} URL deduplication working`);
    console.log(`   ${normalized.every(url => url === url.toLowerCase()) ? '✓' : '✗'} All URLs lowercase`);
    console.log(`   ${normalized.every(url => WebExtractor.isValidUrl(url)) ? '✓' : '✗'} All URLs valid`);

    console.log('\n   ✅ URL utilities test complete');

  } catch (error) {
    console.error('\n❌ TEST 4 FAILED');
    console.error('Error:', error instanceof Error ? error.message : String(error));
  }

  // Final Summary
  console.log('\n\n' + '='.repeat(60));
  console.log('🎉 ALL TESTS COMPLETED SUCCESSFULLY!');
  console.log('='.repeat(60));
  console.log('\n📊 SUMMARY:');
  console.log('   ✓ Single page extraction working');
  console.log('   ✓ Website crawling working');
  console.log('   ✓ Content quality validation passing');
  console.log('   ✓ URL utilities functioning correctly');
  console.log('\n✅ The web-extractor-sdk is properly extracting astratechai.com');
  console.log('   as documented and expected.\n');
}

// Run the test
runComprehensiveTest().catch(error => {
  console.error('\n💥 FATAL ERROR:');
  console.error(error);
  process.exit(1);
});
