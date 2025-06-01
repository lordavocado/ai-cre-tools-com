export const siteConfig = {
  // Main category/site name - Change this to update across the entire site
  categoryName: "Product Analytics Tools",
  
  // Site metadata
  name: "Product Analytics Tools",
  description: "Find and compare the best product analytics tools and solutions for your product needs.",
  url: "https://productanalyticstools.com", // Replace with your actual domain
  
  // SEO Configuration
  seo: {
    // Primary keywords for the site
    primaryKeywords: [
      'product analytics tools',
      'product analytics software',
      'user behavior analytics',
      'product metrics',
      'user analytics',
      'product data analysis',
    ],
    
    // Secondary/Long-tail keywords
    secondaryKeywords: [
      'customer journey analytics',
      'product tracking tools',
      'user engagement analytics',
      'product performance metrics',
      'free product analytics tools',
      'ai product analytics tools',
      'best product analytics platform',
      'product analytics dashboard',
      'user behavior tracking',
      'product usage analytics',
      'customer analytics tools',
      'digital product analytics',
      'saas analytics tools',
      'mobile app analytics',
      'web analytics for products',
      'product data visualization',
      'user retention analytics',
      'conversion rate optimization tools',
      'product funnel analysis',
      'cohort analysis tools'
    ],
    
    // Open Graph configuration
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'Product Analytics Tools',
      images: {
        default: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Product Analytics Tools - Find and compare the best product analytics solutions'
      }
    },
    
    // Twitter card configuration
    twitter: {
      card: 'summary_large_image',
      site: '@productanalyticstools',
      creator: '@productanalyticstools',
      images: {
        default: '/twitter-image.png',
        width: 1200,
        height: 630,
        alt: 'Product Analytics Tools Directory'
      }
    },
    
    // Structured data configuration
    structuredData: {
      organization: {
        name: 'Product Analytics Tools',
        url: 'https://productanalyticstools.com',
        logo: 'https://productanalyticstools.com/product-analytics-tools-logo.png',
        description: 'The most comprehensive directory of product analytics tools and solutions.',
        sameAs: [
          'https://twitter.com/productanalyticstools',
          'https://linkedin.com/company/productanalyticstools'
        ]
      },
      website: {
        name: 'Product Analytics Tools',
        url: 'https://productanalyticstools.com',
        description: 'Find and compare the best product analytics tools and solutions for your product needs.',
        inLanguage: 'en-US'
      }
    },
    
    // Category-specific SEO templates
    categoryMetaTemplates: {
      title: "{categoryName} Tools - Best {categoryName} Software & Solutions | Product Analytics Tools",
      description: "Discover the best {categoryName} tools and software. Compare features, pricing, and reviews to find the perfect {categoryName} solution for your product analytics needs.",
      keywords: "{categoryName}, {categoryName} tools, {categoryName} software, best {categoryName}, {categoryName} solutions, {categoryName} platforms"
    },
    
    // Tool page SEO templates
    toolMetaTemplates: {
      title: "{toolName} - {toolTagline} | Product Analytics Tools",
      description: "{toolName}: {toolDescription} Compare features, pricing, and user reviews. Find the best product analytics solution for your needs.",
      keywords: "{toolName}, {toolName} review, {toolName} pricing, {toolName} features, {toolName} alternatives"
    }
  },
  
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
    twitter: "@productanalyticstools",
    linkedin: "company/productanalyticstools",
    github: "productanalyticstools",
  },
  
  // Legacy keywords (for backward compatibility)
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
export function interpolateText(text: string, replacements: Record<string, string> = {}): string {
  let result = text.replace(/\{categoryName\}/g, siteConfig.categoryName);
  
  // Apply custom replacements
  Object.entries(replacements).forEach(([key, value]) => {
    const regex = new RegExp(`\\{${key}\\}`, 'g');
    result = result.replace(regex, value);
  });
  
  return result;
}

// SEO helper functions
export function generateCategoryMeta(categoryName: string, categoryDescription?: string) {
  const { categoryMetaTemplates } = siteConfig.seo;
  
  return {
    title: interpolateText(categoryMetaTemplates.title, { categoryName }),
    description: categoryDescription || interpolateText(categoryMetaTemplates.description, { categoryName }),
    keywords: interpolateText(categoryMetaTemplates.keywords, { categoryName }),
  };
}

export function generateToolMeta(toolName: string, toolTagline?: string, toolDescription?: string) {
  const { toolMetaTemplates } = siteConfig.seo;
  
  return {
    title: interpolateText(toolMetaTemplates.title, { 
      toolName, 
      toolTagline: toolTagline || 'Product Analytics Tool' 
    }),
    description: interpolateText(toolMetaTemplates.description, { 
      toolName, 
      toolDescription: toolDescription || `${toolName} is a comprehensive product analytics solution.` 
    }),
    keywords: interpolateText(toolMetaTemplates.keywords, { toolName }),
  };
}

// Get all SEO keywords (primary + secondary)
export function getAllSEOKeywords(): string[] {
  return [
    ...siteConfig.seo.primaryKeywords,
    ...siteConfig.seo.secondaryKeywords
  ];
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