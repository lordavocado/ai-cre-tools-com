export const siteConfig = {
  // Main category/site name - Change this to update across the entire site
  categoryName: "Product Analytics Tools",
  
  // Site metadata
  name: "Product Analytics Tools",
  description: "Find and compare the best product analytics tools and solutions for your product needs.",
  url: "https://productanalyticstools.com", // Replace with your actual domain
  
  // Hero section content
  hero: {
    title: "Find and compare the best {categoryName}",
    subtitle: "Product Analytics Tools is the best place to find and compare the best product analytics solutions that fits your needs.",
  },
  
  // Footer content
  footer: {
    description: "Discover and compare the best {categoryName} to make data-driven decisions and optimize your product's performance.",
    copyright: "{categoryName}. All rights reserved.",
  },
  
  // Navigation
  nav: {
    items: [
      { href: '/', label: 'Home' },
      { href: '/categories', label: 'Categories' },
      { href: '/guides', label: 'Guides' },
      { href: '/about', label: 'About' },
      { href: '/compare', label: 'Compare Tools' },
    ]
  },
  
  // Social links (optional)
  social: {
    twitter: "@yourtwitterhandle",
    linkedin: "company/yourcompany",
    github: "yourgithub",
  },
  
  // SEO keywords
  keywords: [
    'product analytics tools',
    'product analytics software',
    'user behavior analytics',
    'product metrics',
    'user analytics',
    'product data analysis',
    'customer journey analytics',
    'product tracking tools',
    'user engagement analytics',
    'product performance metrics',
    'free product analytics tools',
    'ai product analytics tools'
  ],
} as const;

// Helper function to replace placeholders with actual values
export function interpolateText(text: string): string {
  return text.replace(/\{categoryName\}/g, siteConfig.categoryName);
}

// Computed values
export const computedSiteConfig = {
  ...siteConfig,
  hero: {
    title: interpolateText(siteConfig.hero.title),
    subtitle: siteConfig.hero.subtitle,
  },
  footer: {
    description: interpolateText(siteConfig.footer.description),
    copyright: interpolateText(siteConfig.footer.copyright),
  },
}; 