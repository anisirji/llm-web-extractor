/**
 * Extracted page data
 */
export interface ExtractedPage {
  /** Page title */
  title: string;
  /** Cleaned markdown content */
  content: string;
  /** Normalized URL */
  url: string;
  /** Page metadata */
  metadata: PageMetadata;
}

/**
 * Page metadata
 */
export interface PageMetadata {
  /** When the page was scraped */
  scrapedAt: Date;
  /** Original source URL */
  sourceUrl: string;
  /** Page description/excerpt */
  description?: string;
  /** Word count */
  wordCount: number;
  /** Page language */
  language?: string;
  /** Status code */
  statusCode?: number;
  /** Additional custom metadata */
  [key: string]: any;
}

/**
 * Extraction options for single page
 */
export interface ExtractPageOptions {
  /** Extract only main content (default: true) */
  onlyMainContent?: boolean;
  /** Output format (default: 'markdown') */
  format?: 'markdown' | 'html' | 'text';
  /** Include screenshots */
  includeScreenshot?: boolean;
  /** Wait time in milliseconds before extraction */
  waitFor?: number;
}

/**
 * Extraction options for entire website
 */
export interface ExtractWebsiteOptions extends ExtractPageOptions {
  /** Maximum pages to scrape (default: 10, max: 100) */
  maxPages?: number;
  /** Include subdomains (default: false) */
  includeSubdomains?: boolean;
  /** Title prefix for all pages */
  titlePrefix?: string;
  /** URL patterns to include (regex) */
  includePatterns?: RegExp[];
  /** URL patterns to exclude (regex) */
  excludePatterns?: RegExp[];
  /** Maximum depth from start URL (default: 3) */
  maxDepth?: number;
  /** Follow external links (default: false) */
  followExternalLinks?: boolean;
}

/**
 * URL normalization options
 */
export interface NormalizeUrlOptions {
  /** Remove trailing slash (default: true) */
  removeTrailingSlash?: boolean;
  /** Remove query parameters (default: false) */
  removeQueryParams?: boolean;
  /** Remove URL fragment/hash (default: true) */
  removeFragment?: boolean;
  /** Convert to lowercase (default: true) */
  lowercase?: boolean;
  /** Sort query parameters (default: true) */
  sortQueryParams?: boolean;
}

/**
 * SDK Configuration
 */
export interface WebExtractorConfig {
  /** Firecrawl API key */
  apiKey: string;
  /** Base URL for Firecrawl API (optional) */
  baseUrl?: string;
  /** Request timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Enable debug logging (default: false) */
  debug?: boolean;
}

/**
 * Extraction result with stats
 */
export interface ExtractionResult {
  /** Successfully extracted pages */
  pages: ExtractedPage[];
  /** Total pages processed */
  totalPages: number;
  /** Failed URLs */
  failed: FailedExtraction[];
  /** Extraction statistics */
  stats: ExtractionStats;
}

/**
 * Failed extraction info
 */
export interface FailedExtraction {
  url: string;
  error: string;
  statusCode?: number;
}

/**
 * Extraction statistics
 */
export interface ExtractionStats {
  /** Total time taken in milliseconds */
  duration: number;
  /** Success rate percentage */
  successRate: number;
  /** Total words extracted */
  totalWords: number;
  /** Average words per page */
  avgWordsPerPage: number;
}
