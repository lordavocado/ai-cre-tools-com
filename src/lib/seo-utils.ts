import { siteConfig } from '@/config/site';

/**
 * Generate canonical URL for a given path
 */
export function generateCanonicalUrl(path: string = ''): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${siteConfig.url}${cleanPath}`;
}

/**
 * Generate SEO-optimized title with proper truncation
 */
export function generateSEOTitle(title: string, includeBrand: boolean = true): string {
  const maxLength = 60; // Google's recommended max
  const brandSuffix = includeBrand ? ` | ${siteConfig.name}` : '';
  const fullTitle = `${title}${brandSuffix}`;
  
  if (fullTitle.length <= maxLength) {
    return fullTitle;
  }
  
  // Truncate title to fit with brand
  const availableLength = maxLength - brandSuffix.length - 3; // 3 for "..."
  return `${title.substring(0, availableLength)}...${brandSuffix}`;
}

/**
 * Generate SEO-optimized description with proper truncation
 */
export function generateSEODescription(description: string): string {
  const maxLength = 160; // Google's recommended max
  
  if (description.length <= maxLength) {
    return description;
  }
  
  // Find last complete sentence within limit
  const truncated = description.substring(0, maxLength);
  const lastSentence = truncated.lastIndexOf('.');
  
  if (lastSentence > maxLength * 0.7) {
    return description.substring(0, lastSentence + 1);
  }
  
  // If no good sentence break, truncate at word boundary
  const lastSpace = truncated.lastIndexOf(' ');
  return `${description.substring(0, lastSpace)}...`;
}

/**
 * Generate keywords array with deduplication and relevance scoring
 */
export function generateKeywords(
  primary: string[],
  secondary: string[] = [],
  additional: string[] = []
): string[] {
  const allKeywords = [...primary, ...secondary, ...additional];
  
  // Remove duplicates and normalize
  const uniqueKeywords = Array.from(new Set(
    allKeywords.map(keyword => keyword.toLowerCase().trim())
  ));
  
  // Limit to reasonable number for SEO
  return uniqueKeywords.slice(0, 20);
}

/**
 * Generate breadcrumb structured data
 */
export function generateBreadcrumbStructuredData(breadcrumbs: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbs.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generate Article structured data
 */
export function generateArticleStructuredData({
  headline,
  description,
  url,
  datePublished,
  dateModified,
  authorName = siteConfig.name,
  authorUrl = siteConfig.url,
  image,
}: {
  headline: string;
  description: string;
  url: string;
  datePublished: string;
  dateModified?: string;
  authorName?: string;
  authorUrl?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline,
    description,
    url,
    datePublished,
    dateModified: dateModified || datePublished,
    author: {
      "@type": "Organization",
      name: authorName,
      url: authorUrl,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        "@type": "ImageObject",
        url: `${siteConfig.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    image: image ? {
      "@type": "ImageObject",
      url: image,
    } : undefined,
  };
}

/**
 * Generate Product/Software structured data
 */
export function generateSoftwareStructuredData({
  name,
  description,
  url,
  image,
  category = "BusinessApplication",
  operatingSystem = "Web-based",
  pricing,
  rating,
  reviewCount,
}: {
  name: string;
  description: string;
  url: string;
  image?: string;
  category?: string;
  operatingSystem?: string;
  pricing?: string;
  rating?: number;
  reviewCount?: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    image,
    applicationCategory: category,
    operatingSystem,
    offers: pricing ? {
      "@type": "Offer",
      description: pricing,
      seller: {
        "@type": "Organization",
        name,
      },
    } : undefined,
    aggregateRating: rating && reviewCount && reviewCount > 0 ? {
      "@type": "AggregateRating",
      ratingValue: rating,
      reviewCount,
      bestRating: 5,
      worstRating: 1,
    } : undefined,
  };
}

/**
 * Generate Open Graph image URL with fallback
 */
export function generateOGImageUrl(customImage?: string, title?: string): string {
  if (customImage) {
    // If it's already a full URL, return as is
    if (customImage.startsWith('http')) {
      return customImage;
    }
    // If it's a relative path, make it absolute
    return `${siteConfig.url}${customImage.startsWith('/') ? '' : '/'}${customImage}`;
  }
  
  // Use dynamic OG image generation if title is provided
  if (title) {
    const encodedTitle = encodeURIComponent(title);
    return `${siteConfig.url}/api/og?title=${encodedTitle}`;
  }
  
  // Fallback to default
  return `${siteConfig.url}${siteConfig.seo.openGraph.images.default}`;
}

/**
 * Clean and optimize HTML content for meta descriptions
 */
export function extractMetaDescription(htmlContent: string): string {
  // Remove HTML tags
  const textContent = htmlContent.replace(/<[^>]*>/g, ' ');
  
  // Clean up whitespace
  const cleanedContent = textContent
    .replace(/\s+/g, ' ')
    .trim();
  
  return generateSEODescription(cleanedContent);
}

/**
 * Generate JSON-LD script tag for structured data
 */
export function generateStructuredDataScript(data: object): string {
  return `<script type="application/ld+json">${JSON.stringify(data)}</script>`;
}

/**
 * Validate and sanitize SEO inputs
 */
export function sanitizeSEOInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML
    .trim()
    .replace(/\s+/g, ' '); // Normalize whitespace
}

/**
 * Generate hreflang attributes for international SEO
 */
export function generateHreflangUrls(currentPath: string, languages: string[] = ['en']): Array<{ lang: string; url: string }> {
  return languages.map(lang => ({
    lang,
    url: `${siteConfig.url}${lang !== 'en' ? `/${lang}` : ''}${currentPath}`,
  }));
}

/**
 * Calculate estimated reading time for content
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

/**
 * Generate meta robots content based on page type and settings
 */
export function generateRobotsContent({
  index = true,
  follow = true,
  archive = true,
  snippet = true,
  imagePreview = true,
  videoPreview = true,
}: {
  index?: boolean;
  follow?: boolean;
  archive?: boolean;
  snippet?: boolean;
  imagePreview?: boolean;
  videoPreview?: boolean;
} = {}): string {
  const directives: string[] = [];
  
  directives.push(index ? 'index' : 'noindex');
  directives.push(follow ? 'follow' : 'nofollow');
  
  if (!archive) directives.push('noarchive');
  if (!snippet) directives.push('nosnippet');
  if (!imagePreview) directives.push('noimageindex');
  if (!videoPreview) directives.push('novideoindex');
  
  return directives.join(', ');
}
