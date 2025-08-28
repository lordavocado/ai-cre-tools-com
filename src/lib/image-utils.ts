/**
 * Utility function to handle external image URLs
 * Routes external URLs through our proxy to avoid CORS issues
 */
export function getImageUrl(imageUrl: string | undefined, fallbackUrl: string = "/ai-cre-tools-logo.png"): string {
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
 * Uses our image proxy to handle Google's favicon service
 */
export function getFaviconUrl(website: string): string {
  if (!website) return "/ai-cre-tools-logo.png";
  
  try {
    // Clean up the website URL
    let cleanUrl = website;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    
    const domain = new URL(cleanUrl).hostname;
    // Use our image proxy to prevent direct calls to Google's service
    return `/api/image-proxy?url=${encodeURIComponent(`https://www.google.com/s2/favicons?domain=${domain}&sz=64`)}`;
  } catch {
    return "/ai-cre-tools-logo.png";
  }
} 