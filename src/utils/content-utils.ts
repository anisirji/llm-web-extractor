/**
 * Clean and format content
 */
export function cleanContent(content: string): string {
  if (!content) {
    return '';
  }

  // Remove excessive whitespace
  let cleaned = content.replace(/\n{3,}/g, '\n\n');

  // Remove leading/trailing whitespace
  cleaned = cleaned.trim();

  return cleaned;
}

/**
 * Count words in content
 */
export function countWords(content: string): number {
  if (!content) return 0;
  return content.split(/\s+/).filter((word) => word.length > 0).length;
}

/**
 * Extract text from HTML
 */
export function stripHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Truncate text to specified length
 */
export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(
  content: string,
  maxWords: number = 50
): string {
  const words = content.split(/\s+/).filter((w) => w.length > 0);
  if (words.length <= maxWords) {
    return content;
  }
  return words.slice(0, maxWords).join(' ') + '...';
}

/**
 * Detect language from content (simple heuristic)
 */
export function detectLanguage(content: string): string | undefined {
  // Simple language detection based on common words
  const languagePatterns: Record<string, RegExp[]> = {
    en: [/\bthe\b/i, /\band\b/i, /\bof\b/i, /\bis\b/i],
    es: [/\bel\b/i, /\bla\b/i, /\bde\b/i, /\bque\b/i],
    fr: [/\ble\b/i, /\bla\b/i, /\bde\b/i, /\bet\b/i],
    de: [/\bder\b/i, /\bdie\b/i, /\bdas\b/i, /\bund\b/i],
  };

  const scores: Record<string, number> = {};

  for (const [lang, patterns] of Object.entries(languagePatterns)) {
    scores[lang] = patterns.filter((pattern) => pattern.test(content)).length;
  }

  const detected = Object.entries(scores).sort(([, a], [, b]) => b - a)[0];
  return detected && detected[1] > 0 ? detected[0] : undefined;
}

/**
 * Calculate content similarity (simple Jaccard similarity)
 */
export function calculateSimilarity(content1: string, content2: string): number {
  const words1 = new Set(content1.toLowerCase().split(/\s+/));
  const words2 = new Set(content2.toLowerCase().split(/\s+/));

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}
