/**
 * Client-side routing utilities for SEO optimization
 * @fileoverview Client-safe routing utilities that don't require server-side dependencies
 */

import { siteConfig } from '@/config/site';

// Static route slugs that should never conflict with dynamic content
const RESERVED_SLUGS = [
  'about',
  'blog',
  'categories',
  'for',
  'favorites',
  'privacy-policy',
  'terms-of-service',
  'submit-tool',
  'admin',
  'api',
  'guides',
  '_next',
  'sitemap.xml',
  'robots.txt',
  'favicon.ico',
  'og-image.png',
  'twitter-image.png',
  'ai-cre-tools-logo.jpg'
] as const;

// Additional dynamic route patterns to avoid conflicts
const RESERVED_PATTERNS = [
  /^admin\/.*/,
  /^api\/.*/,
  /^_next\/.*/,
  /^blog\/.*/,
  /^categories\/.*/,
  /^for\/.*/,
] as const;

/**
 * Checks if a slug conflicts with reserved routes or patterns (client-safe)
 * @param slug - The slug to validate
 * @returns boolean indicating if the slug is valid (no conflicts)
 */
export function isValidSlug(slug: string): boolean {
  if (!slug || typeof slug !== 'string') return false;
  
  // Check reserved slugs
  if (RESERVED_SLUGS.includes(slug as any)) {
    return false;
  }
  
  // Check reserved patterns
  for (const pattern of RESERVED_PATTERNS) {
    if (pattern.test(slug)) {
      return false;
    }
  }
  
  return true;
}

/**
 * Validates slug format for SEO compliance (client-safe)
 * @param slug - The slug to validate
 * @returns boolean indicating if the slug format is SEO-friendly
 */
export function isValidSlugFormat(slug: string): boolean {
  if (!slug) return false;
  
  // SEO-friendly slug pattern: lowercase letters, numbers, hyphens only
  const validSlugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  
  return validSlugPattern.test(slug);
}

/**
 * Generates a SEO-friendly slug from a title (client-safe)
 * @param title - The title to convert to a slug
 * @param maxLength - Maximum length for the slug (default: 60)
 * @returns SEO-optimized slug
 */
export function generateSEOSlug(title: string, maxLength: number = 60): string {
  return title
    .toLowerCase()
    .trim()
    // Replace special characters and spaces with hyphens
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    // Remove leading/trailing hyphens
    .replace(/^-|-$/g, '')
    // Truncate to max length at word boundary
    .substring(0, maxLength)
    .replace(/-[^-]*$/, ''); // Remove partial word at end
}

/**
 * Normalizes URL by handling trailing slashes consistently (client-safe)
 * @param url - The URL to normalize
 * @param includeTrailingSlash - Whether to include trailing slash (default: false)
 * @returns Normalized URL
 */
export function normalizeURL(url: string, includeTrailingSlash: boolean = false): string {
  if (!url || url === '/') return '/';
  
  // Remove trailing slash
  const normalized = url.replace(/\/+$/, '');
  
  // Add trailing slash if requested and not root
  return includeTrailingSlash && normalized !== '' ? `${normalized}/` : normalized;
}

/**
 * Generates canonical URL with proper normalization (client-safe)
 * @param path - The path to canonicalize
 * @param includeTrailingSlash - Whether to include trailing slash
 * @returns Full canonical URL
 */
export function generateCanonicalURL(path: string = '', includeTrailingSlash: boolean = false): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const normalizedPath = normalizeURL(cleanPath, includeTrailingSlash);
  return `${siteConfig.url}${normalizedPath}`;
}

/**
 * Validates URL structure for SEO compliance (client-safe)
 * @param url - The URL to validate
 * @returns Validation result with issues and suggestions
 */
export function validateURLStructure(url: string): {
  isValid: boolean;
  issues: string[];
  suggestions: string[];
} {
  const issues: string[] = [];
  const suggestions: string[] = [];

  // Check URL length
  if (url.length > 100) {
    issues.push('URL is longer than 100 characters');
    suggestions.push('Consider shortening the URL for better SEO');
  }

  // Check for multiple consecutive slashes
  if (url.includes('//') && !url.startsWith('http')) {
    issues.push('URL contains consecutive slashes');
    suggestions.push('Remove duplicate slashes from URL');
  }

  // Check for uppercase characters
  if (url !== url.toLowerCase()) {
    issues.push('URL contains uppercase characters');
    suggestions.push('Use lowercase characters for better SEO consistency');
  }

  // Check for special characters that should be encoded
  const problematicChars = /[^a-zA-Z0-9\-._~:/?#[\]@!$&'()*+,;=%]/;
  if (problematicChars.test(url)) {
    issues.push('URL contains special characters that should be encoded');
    suggestions.push('Encode special characters or use SEO-friendly alternatives');
  }

  // Check for underscores (hyphens are preferred)
  if (url.includes('_')) {
    issues.push('URL contains underscores');
    suggestions.push('Use hyphens instead of underscores for better SEO');
  }

  return {
    isValid: issues.length === 0,
    issues,
    suggestions
  };
}

/**
 * Simple string similarity calculation using Levenshtein distance (client-safe)
 * @param str1 - First string to compare
 * @param str2 - Second string to compare
 * @returns Similarity score between 0 and 1
 */
export function calculateStringSimilarity(str1: string, str2: string): number {
  if (str1 === str2) return 1;
  if (str1.length === 0 || str2.length === 0) return 0;

  // Calculate Levenshtein distance
  const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

  for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
  for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

  for (let j = 1; j <= str2.length; j++) {
    for (let i = 1; i <= str1.length; i++) {
      const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,     // deletion
        matrix[j - 1][i] + 1,     // insertion
        matrix[j - 1][i - 1] + indicator // substitution
      );
    }
  }

  const distance = matrix[str2.length][str1.length];
  const maxLength = Math.max(str1.length, str2.length);
  
  return 1 - (distance / maxLength);
}

/**
 * Gets all reserved slugs and patterns for external validation (client-safe)
 * @returns Object containing reserved slugs and patterns
 */
export function getReservedRoutes() {
  return {
    slugs: [...RESERVED_SLUGS],
    patterns: RESERVED_PATTERNS.map(pattern => pattern.source)
  };
}

/**
 * Fetches URL suggestions from the API (client-safe)
 * @param requestedPath - The path that was not found
 * @returns Promise resolving to array of suggested URLs
 */
export async function fetchURLSuggestions(requestedPath: string): Promise<Array<{
  url: string;
  title: string;
  type: 'tool' | 'category' | 'static';
  similarity: number;
}>> {
  try {
    const response = await fetch(`/api/suggestions?path=${encodeURIComponent(requestedPath)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch suggestions');
    }
    return await response.json();
  } catch (error) {
    console.warn('Failed to fetch URL suggestions:', error);
    
    // Fallback to static suggestions
    const cleanPath = requestedPath.replace(/^\/+|\/+$/g, '');
    const staticPages = [
      { slug: 'about', title: 'About Us' },
      { slug: 'blog', title: 'Blog' },
      { slug: 'categories', title: 'All Categories' },
      { slug: 'favorites', title: 'Your Favorites' },
      { slug: 'submit-tool', title: 'Submit a Tool' }
    ];

    const suggestions = staticPages
      .map(page => ({
        url: `/${page.slug}`,
        title: page.title,
        type: 'static' as const,
        similarity: calculateStringSimilarity(cleanPath, page.slug)
      }))
      .filter(suggestion => suggestion.similarity > 0.3)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    return suggestions;
  }
}