import FirecrawlApp from '@mendable/firecrawl-js';
import {
  WebExtractorConfig,
  ExtractedPage,
  ExtractPageOptions,
  ExtractWebsiteOptions,
  ExtractionResult,
  FailedExtraction,
  PageMetadata,
} from './types';
import {
  validateUrl,
  normalizeUrl,
  deduplicateUrls,
  filterUrlsByPattern,
  isSameDomain,
} from './utils/url-utils';
import { cleanContent, countWords, detectLanguage } from './utils/content-utils';

/**
 * TermiX Web Extractor SDK
 *
 * A powerful SDK for extracting web content with intelligent URL handling,
 * content cleaning, and comprehensive metadata extraction.
 */
export class WebExtractor {
  private firecrawl: FirecrawlApp;
  private config: Required<WebExtractorConfig>;

  constructor(config: WebExtractorConfig) {
    this.config = {
      baseUrl: config.baseUrl || 'https://api.firecrawl.dev',
      timeout: config.timeout || 30000,
      debug: config.debug || false,
      ...config,
    };

    this.firecrawl = new FirecrawlApp({
      apiKey: this.config.apiKey,
    });

    if (this.config.debug) {
      this.log('WebExtractor initialized');
    }
  }

  /**
   * Extract content from a single page
   */
  async extractPage(
    url: string,
    options: ExtractPageOptions = {}
  ): Promise<ExtractedPage> {
    const {
      onlyMainContent = true,
      format = 'markdown',
      waitFor,
    } = options;

    // Validate URL
    validateUrl(url);
    const normalizedUrl = normalizeUrl(url);

    this.log(`Extracting page: ${normalizedUrl}`);

    try {
      const scrapeOptions: any = {
        formats: [format],
        onlyMainContent,
      };

      if (waitFor) {
        scrapeOptions.waitFor = waitFor;
      }

      const result = await this.firecrawl.scrapeUrl(url, scrapeOptions) as any;

      const content = this.extractContent(result, format);
      const metadata = this.buildMetadata(result, normalizedUrl);

      return {
        title: result.metadata?.title || new URL(url).hostname,
        content: cleanContent(content),
        url: normalizedUrl,
        metadata,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`Failed to extract page: ${errorMessage}`);
      throw new Error(`Failed to extract page ${url}: ${errorMessage}`);
    }
  }

  /**
   * Extract content from entire website (crawl)
   */
  async extractWebsite(
    url: string,
    options: ExtractWebsiteOptions = {}
  ): Promise<ExtractionResult> {
    const {
      maxPages = 10,
      includeSubdomains = false,
      titlePrefix,
      onlyMainContent = true,
      format = 'markdown',
      maxDepth = 3,
      followExternalLinks = false,
      includePatterns,
      excludePatterns,
    } = options;

    // Validate URL
    validateUrl(url);
    const normalizedUrl = normalizeUrl(url);

    this.log(`Starting website extraction: ${normalizedUrl} (max ${maxPages} pages)`);

    const startTime = Date.now();
    const pages: ExtractedPage[] = [];
    const failed: FailedExtraction[] = [];

    try {
      const crawlOptions: any = {
        limit: Math.min(maxPages, 100), // Hard limit
        scrapeOptions: {
          formats: [format],
          onlyMainContent,
        },
        maxDepth,
      };

      // Domain restrictions
      if (!followExternalLinks) {
        crawlOptions.allowExternalLinks = false;
      }

      if (!includeSubdomains) {
        crawlOptions.allowSubdomains = false;
      }

      const crawlResult = await this.firecrawl.crawlUrl(url, crawlOptions) as any;
      const data = crawlResult.data || [];

      this.log(`Crawl completed, processing ${data.length} pages`);

      // Extract URLs and filter
      let urls = data.map((page: any) => page.metadata?.sourceURL || page.url || url);
      urls = deduplicateUrls(urls);

      if (includePatterns || excludePatterns) {
        urls = filterUrlsByPattern(urls, includePatterns, excludePatterns);
      }

      // Process each page
      for (const page of data) {
        try {
          const pageUrl = page.metadata?.sourceURL || url;
          const normalizedPageUrl = normalizeUrl(pageUrl);

          // Check if URL should be included
          if (!urls.includes(pageUrl)) {
            continue;
          }

          const content = this.extractContent(page, format);
          const metadata = this.buildMetadata(page, normalizedPageUrl);

          let title = page.metadata?.title || new URL(pageUrl).pathname;
          if (titlePrefix) {
            title = `${titlePrefix} - ${title}`;
          }

          pages.push({
            title,
            content: cleanContent(content),
            url: normalizedPageUrl,
            metadata,
          });
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          this.log(`Failed to process page: ${errorMessage}`);
          failed.push({
            url: page.url || 'unknown',
            error: errorMessage,
          });
        }
      }

      const duration = Date.now() - startTime;
      const totalWords = pages.reduce((sum, p) => sum + p.metadata.wordCount, 0);

      this.log(`Extraction completed: ${pages.length} pages in ${duration}ms`);

      return {
        pages,
        totalPages: pages.length + failed.length,
        failed,
        stats: {
          duration,
          successRate: (pages.length / (pages.length + failed.length)) * 100,
          totalWords,
          avgWordsPerPage: pages.length > 0 ? totalWords / pages.length : 0,
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.log(`Failed to extract website: ${errorMessage}`);
      throw new Error(`Failed to extract website ${url}: ${errorMessage}`);
    }
  }

  /**
   * Extract content from Firecrawl result
   */
  private extractContent(result: any, format: string): string {
    switch (format) {
      case 'markdown':
        return result.markdown || result.content || '';
      case 'html':
        return result.html || result.content || '';
      case 'text':
        return result.text || result.content || '';
      default:
        return result.markdown || result.content || '';
    }
  }

  /**
   * Build page metadata
   */
  private buildMetadata(page: any, normalizedUrl: string): PageMetadata {
    const content = this.extractContent(page, 'markdown');
    const wordCount = countWords(content);

    return {
      scrapedAt: new Date(),
      sourceUrl: normalizedUrl,
      description: page.metadata?.description || page.excerpt || undefined,
      wordCount,
      language: page.metadata?.language || detectLanguage(content),
      statusCode: page.metadata?.statusCode,
    };
  }

  /**
   * Log debug messages
   */
  private log(message: string): void {
    if (this.config.debug) {
      console.log(`[WebExtractor] ${message}`);
    }
  }

  /**
   * Check if URL is valid without throwing
   */
  static isValidUrl(url: string): boolean {
    try {
      validateUrl(url);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Normalize URL (static helper)
   */
  static normalizeUrl = normalizeUrl;

  /**
   * Validate URL (static helper)
   */
  static validateUrl = validateUrl;
}
