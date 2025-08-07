export const siteConfig = {
  // Main category/site name - Change this to update across the entire site
  categoryName: "AI CRE Tools",

  // Site metadata
  name: "AI CRE Tools",
  description: "The leading directory for Commercial Real Estate AI tools. Find, compare, and choose the best AI solutions for your CRE needs.",
  url: "https://aicretools.com",

  // SEO Configuration
  seo: {
    // Primary keywords for the site
    primaryKeywords: [
      'commercial real estate ai tools',
      'cre ai software',
      'ai for real estate',
      'real estate technology',
      'proptech ai',
      'commercial real estate analytics',
    ],

    // Secondary/Long-tail keywords
    secondaryKeywords: [
      'ai in property management',
      'real estate investment analysis tools',
      'ai for property valuation',
      'commercial real estate market analysis',
      'cre automation software',
      'best cre ai tools',
      'ai leasing tools',
      'property data analytics',
      'real estate deal sourcing ai',
      'ai for construction management',
      'smart buildings technology',
      'iot in real estate',
      'cre portfolio management software',
      'ai underwriting tools',
      'real estate predictive analytics',
    ],

    // Open Graph configuration
    openGraph: {
      type: 'website',
      locale: 'en_US',
      siteName: 'AI CRE Tools',
      images: {
        default: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'AI CRE Tools - The Directory for Commercial Real Estate AI'
      }
    },

    // Twitter card configuration
    twitter: {
      card: 'summary_large_image',
      site: '@aicretools',
      creator: '@aicretools',
      images: {
        default: '/twitter-image.png',
        width: 1200,
        height: 630,
        alt: 'AI CRE Tools Directory'
      }
    },

    // Structured data configuration
    structuredData: {
      organization: {
        name: 'AI CRE Tools',
        url: 'https://aicretools.com',
        logo: 'https://aicretools.com/product-analytics-tools-logo.png', // TODO: Update logo
        description: 'The most comprehensive directory of Commercial Real Estate AI tools and solutions.',
        sameAs: [
          'https://twitter.com/aicretools',
          'https://linkedin.com/company/aicretools'
        ]
      },
      website: {
        name: 'AI CRE Tools',
        url: 'https://aicretools.com',
        description: 'Find and compare the best Commercial Real Estate AI tools and solutions.',
        inLanguage: 'en-US'
      }
    },

    // Category-specific SEO templates
    categoryMetaTemplates: {
      title: "{categoryName} - Best AI Software & Solutions | AI CRE Tools",
      description: "Discover the best {categoryName} tools and software. Compare features, pricing, and reviews to find the perfect AI solution for your commercial real estate needs.",
      keywords: "{categoryName}, {categoryName} tools, {categoryName} software, best {categoryName}, {categoryName} solutions, {categoryName} platforms, cre ai"
    },

    // Tool page SEO templates
    toolMetaTemplates: {
      title: "{toolName} - {toolTagline} | AI CRE Tools",
      description: "{toolName}: {toolDescription} Compare features, pricing, and user reviews. Find the best CRE AI solution for your needs.",
      keywords: "{toolName}, {toolName} review, {toolName} pricing, {toolName} features, {toolName} alternatives, cre ai tool"
    }
  },

  // Hero section content
  hero: {
    title: "Commercial Real Estate AI Tools",
    subtitle: "Discover and compare intelligent solutions that transform how you work with commercial real estate.",
    cta: {
      primary: {
        text: "Explore Tools",
        href: "/categories"
      },
      secondary: {
        text: "Learn More",
        href: "/about"
      }
    }
  },

  // Footer content
  footer: {
    description: "Discover and compare the best {categoryName} to make data-driven decisions and optimize your commercial real estate operations.",
    copyright: "{categoryName}. All rights reserved.",
  },

  // Navigation
  nav: {
    items: [
      { href: '/', label: 'Home' },
      { href: '/categories', label: 'Categories' },
      { href: '/favourites', label: 'Favourites' },
      { href: '/about', label: 'About' },
    ]
  },

  // Social links (optional)
  social: {
    twitter: "@aicretools",
    linkedin: "company/aicretools",
    github: "aicretools",
  },

  // Legacy keywords (for backward compatibility)
  keywords: [
    'commercial real estate ai tools',
    'cre ai software',
    'ai for real estate',
    'real estate technology',
    'proptech ai',
    'commercial real estate analytics',
    'ai in property management',
    'real estate investment analysis tools',
    'ai for property valuation',
    'commercial real estate market analysis',
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