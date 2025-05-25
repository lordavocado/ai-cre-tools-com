export const siteConfig = {
  // Main category/site name - Change this to update across the entire site
  categoryName: "Product Analytics Tools",
  
  // Site metadata
  name: "Sheet2Site Pro",
  description: "Create powerful, SEO-friendly directories using Google Sheets as your database. Easy to set up, highly customizable.",
  url: "https://yourdomain.com", // Replace with your actual domain
  
  // Hero section content
  hero: {
    title: "Find and compare the best {categoryName}",
    subtitle: "Sheet2Site Pro is the ultimate boilerplate to create stunning, SEO-optimized directories using the simplicity of Google Sheets as your database. Launch your site in minutes.",
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
    'directory builder', 
    'google sheets', 
    'seo optimized directory', 
    'nextjs directory', 
    'nocode directory',
    'product analytics',
    'analytics tools'
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