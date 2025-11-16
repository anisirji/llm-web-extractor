import { NormalizeUrlOptions } from '../types';

/**
 * Validate and parse URL
 */
export function validateUrl(url: string): URL {
  try {
    const urlObj = new URL(url);
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      throw new Error('Only HTTP and HTTPS protocols are supported');
    }
    return urlObj;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Invalid URL: ${url} - ${errorMessage}`);
  }
}

/**
 * Normalize URL for consistent comparison and storage
 */
export function normalizeUrl(
  url: string,
  options: NormalizeUrlOptions = {}
): string {
  const {
    removeTrailingSlash = true,
    removeQueryParams = false,
    removeFragment = true,
    lowercase = true,
    sortQueryParams = true,
  } = options;

  const urlObj = validateUrl(url);

  // Lowercase hostname
  if (lowercase) {
    urlObj.hostname = urlObj.hostname.toLowerCase();
  }

  // Remove fragment
  if (removeFragment) {
    urlObj.hash = '';
  }

  // Remove query params
  if (removeQueryParams) {
    urlObj.search = '';
  } else if (sortQueryParams && urlObj.search) {
    // Sort query parameters
    const params = new URLSearchParams(urlObj.search);
    const sorted = new URLSearchParams(
      Array.from(params.entries()).sort(([a], [b]) => a.localeCompare(b))
    );
    urlObj.search = sorted.toString();
  }

  let normalized = urlObj.toString();

  // Remove trailing slash
  if (removeTrailingSlash && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
}

/**
 * Extract domain from URL
 */
export function extractDomain(url: string): string {
  const urlObj = validateUrl(url);
  return urlObj.hostname;
}

/**
 * Extract root domain (without subdomain)
 */
export function extractRootDomain(url: string): string {
  const domain = extractDomain(url);
  const parts = domain.split('.');

  // Handle cases like example.co.uk
  if (parts.length >= 2) {
    return parts.slice(-2).join('.');
  }

  return domain;
}

/**
 * Check if URL belongs to same domain
 */
export function isSameDomain(url1: string, url2: string): boolean {
  try {
    return extractDomain(url1) === extractDomain(url2);
  } catch {
    return false;
  }
}

/**
 * Check if URL belongs to same root domain
 */
export function isSameRootDomain(url1: string, url2: string): boolean {
  try {
    return extractRootDomain(url1) === extractRootDomain(url2);
  } catch {
    return false;
  }
}

/**
 * Check if URL is a subdomain of another URL
 */
export function isSubdomain(url: string, parentUrl: string): boolean {
  try {
    const domain = extractDomain(url);
    const parentDomain = extractDomain(parentUrl);
    return domain !== parentDomain && domain.endsWith(`.${parentDomain}`);
  } catch {
    return false;
  }
}

/**
 * Deduplicate URLs (removes duplicates after normalization)
 */
export function deduplicateUrls(
  urls: string[],
  options?: NormalizeUrlOptions
): string[] {
  const seen = new Set<string>();
  const unique: string[] = [];

  for (const url of urls) {
    try {
      const normalized = normalizeUrl(url, options);
      if (!seen.has(normalized)) {
        seen.add(normalized);
        unique.push(url); // Keep original URL
      }
    } catch {
      // Skip invalid URLs
      continue;
    }
  }

  return unique;
}

/**
 * Filter URLs by patterns
 */
export function filterUrlsByPattern(
  urls: string[],
  includePatterns?: RegExp[],
  excludePatterns?: RegExp[]
): string[] {
  return urls.filter((url) => {
    // Check exclude patterns first
    if (excludePatterns?.some((pattern) => pattern.test(url))) {
      return false;
    }

    // Check include patterns
    if (includePatterns?.length) {
      return includePatterns.some((pattern) => pattern.test(url));
    }

    return true;
  });
}

/**
 * Get URL depth (number of path segments)
 */
export function getUrlDepth(url: string): number {
  const urlObj = validateUrl(url);
  const pathSegments = urlObj.pathname.split('/').filter((s) => s.length > 0);
  return pathSegments.length;
}

/**
 * Build absolute URL from relative path
 */
export function buildAbsoluteUrl(baseUrl: string, relativePath: string): string {
  const base = validateUrl(baseUrl);
  return new URL(relativePath, base).toString();
}
