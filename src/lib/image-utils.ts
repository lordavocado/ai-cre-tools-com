/**
 * Utility function to handle external image URLs
 * Keeps image fetching cheap and cacheable in production.
 */
export function getImageUrl(imageUrl: string | undefined, fallbackUrl: string = "/ai-cre-tools-logo.jpg"): string {
  if (!imageUrl) {
    return fallbackUrl;
  }

  // If it's already a local image, return as-is
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl;
  }

  // For external URLs, avoid proxying arbitrary hosts (costly + can amplify traffic).
  // If the host isn't in our allowlist, fall back to a stable favicon source.
  if (imageUrl.startsWith('http')) {
    try {
      const hostname = new URL(imageUrl).hostname;

      const proxyAllowlist = new Set([
        'placehold.co',
        'logo.clearbit.com',
        'upload.wikimedia.org',
        'www.google.com',
        't1.gstatic.com',
        'images.unsplash.com',
        'via.placeholder.com',
        'picsum.photos',
      ]);

      if (proxyAllowlist.has(hostname)) {
        return imageUrl;
      }

      return `https://www.google.com/s2/favicons?domain=${hostname}&sz=64`;
    } catch {
      return fallbackUrl;
    }
  }

  // For other external URLs, return as-is (like Google favicons)
  return imageUrl;
}

/**
 * Get favicon URL from website domain
 * Uses Google's favicon service directly (fast + cacheable).
 */
export function getFaviconUrl(website: string): string {
  if (!website) return "/ai-cre-tools-logo.jpg";
  
  try {
    // Clean up the website URL
    let cleanUrl = website;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    
    const domain = new URL(cleanUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "/ai-cre-tools-logo.jpg";
  }
} 