/**
 * Utility function to handle external image URLs
 * Routes external URLs through our proxy to avoid CORS issues
 */
export function getImageUrl(imageUrl: string | undefined, fallbackUrl: string = "/product-analytics-tools-logo.png"): string {
  if (!imageUrl) {
    return fallbackUrl;
  }

  // If it's already a local image, return as-is
  if (imageUrl.startsWith('/') || imageUrl.startsWith('./')) {
    return imageUrl;
  }

  // If it's an external URL that might have CORS issues, use our proxy
  if (imageUrl.startsWith('http')) {
    // Check if it's a known problematic domain
    const problematicDomains = [
      'brandfetch.com',
      'seeklogo.com',
      'companieslogo.com',
      'images.g2crowd.com',
      'statcounter.com',
      'prismreplay.com',
      'optimizely.com',
      // Add more domains that commonly have CORS issues
      'github.com',
      'gitlab.com',
      'bitbucket.org',
      'atlassian.com',
      'salesforce.com',
      'hubspot.com',
      'intercom.com',
      'zendesk.com',
      'slack.com',
      'discord.com',
      'notion.so',
      'airtable.com',
      'zapier.com',
      'calendly.com',
      'typeform.com'
    ];

    const isProblematic = problematicDomains.some(domain => imageUrl.includes(domain));
    
    if (isProblematic) {
      // Use our proxy
      return `/api/image-proxy?url=${encodeURIComponent(imageUrl)}`;
    }
  }

  // For other external URLs, return as-is (like Google favicons)
  return imageUrl;
}

/**
 * Get favicon URL from website domain
 * Uses Google's favicon service directly (reliable and fast)
 */
export function getFaviconUrl(website: string): string {
  if (!website) return "/product-analytics-tools-logo.png";
  
  try {
    // Clean up the website URL
    let cleanUrl = website;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    
    const domain = new URL(cleanUrl).hostname;
    // Use Google's favicon service directly - it's reliable and doesn't have CORS issues
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "/product-analytics-tools-logo.png";
  }
} 