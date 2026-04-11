export const siteConfig = {
  // Main category/site name - Change this to update across the entire site
  categoryName: "AI CRE Tools",

  // Site metadata
  name: "AI CRE Tools",
  description: "The best AI real estate tools for commercial property teams. Compare software for investors, brokers, asset managers, and operators — one focused directory.",
  url: "https://www.aicretools.com",

  // SEO Configuration
  seo: {
    // Primary keywords for the site
    primaryKeywords: [
      'ai real estate tools',
      'best ai real estate tools',
      'ai tools for real estate',
      'real estate ai tools',
      'commercial real estate ai tools',
      'cre ai software',
      'ai for real estate',
      'real estate technology',
      'proptech ai',
      'commercial real estate analytics',
    ],

    // Secondary/Long-tail keywords
    secondaryKeywords: [
      'ai real estate software',
      'real estate technology tools',
      'ai tools real estate investors',
      'commercial real estate tools directory',
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
        default: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Find the best AI real estate tools'
      }
    },

    // Twitter card configuration
    twitter: {
      card: 'summary_large_image',
      site: '@aicretools',
      creator: '@aicretools',
      images: {
        default: '/twitter-image',
        width: 1200,
        height: 630,
        alt: 'Find the best AI real estate tools'
      }
    },

    // Structured data configuration
    structuredData: {
      organization: {
        name: 'AI CRE Tools',
        url: 'https://www.aicretools.com',
        logo: 'https://www.aicretools.com/ai-cre-tools-logo.jpg',
        description: 'The most comprehensive directory of AI real estate tools for commercial property professionals.',
        sameAs: [
          'https://twitter.com/aicretools',
          'https://linkedin.com/company/aicretools'
        ]
      },
      website: {
        name: 'AI CRE Tools',
        url: 'https://www.aicretools.com',
        description: 'Find and compare the best Commercial Real Estate AI tools and solutions.',
        inLanguage: 'en-US'
      }
    },

    // Category-specific SEO templates (optimized for SERP display)
    // Title: max 60 chars, Description: max 155 chars
    categoryMetaTemplates: {
      title: "Best {categoryName} AI Tools for Real Estate | AI CRE Tools",
      description: "Compare top {categoryName} software for commercial real estate. Find AI solutions with features, pricing & reviews.",
      keywords: "{categoryName}, {categoryName} tools, {categoryName} software, best {categoryName}, {categoryName} solutions, {categoryName} platforms, cre ai"
    },

    // Tool page SEO templates (optimized for SERP display)
    // Title: max 60 chars, Description: max 155 chars
    toolMetaTemplates: {
      title: "{toolName} Review & Features | AI CRE Tools",
      description: "{toolName} - {toolTagline}. Compare features, pricing & alternatives for real estate teams.",
      keywords: "{toolName}, {toolName} review, {toolName} pricing, {toolName} features, {toolName} alternatives, cre ai tool"
    }
  },

  // Hero section content
  hero: {
    title: "Commercial Real Estate AI Tools",
    subtitle: "Discover intelligent solutions that transform how you work with commercial real estate.",
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
    description: "Find the best AI tools for commercial real estate",
    copyright: "{categoryName}. All rights reserved.",
  },

  // Navigation
  nav: {
    items: [
      { href: '/#directory', label: 'Tools' },
      { href: '/categories', label: 'Categories' },
      { href: '/blog', label: 'Blog' },
      { href: '/favorites', label: 'Favorites' },
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

// SEO constants for optimal SERP display
const SEO_LIMITS = {
  TITLE_MAX: 60,
  DESCRIPTION_MAX: 155,
} as const;

// Truncate text at word boundary with ellipsis
function truncateAtWord(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  const truncated = text.slice(0, maxLength - 3);
  const lastSpace = truncated.lastIndexOf(' ');
  
  if (lastSpace > maxLength * 0.6) {
    return truncated.slice(0, lastSpace) + '...';
  }
  return truncated + '...';
}

// SEO helper functions
export function generateCategoryMeta(categoryName: string, categoryDescription?: string) {
  const { categoryMetaTemplates } = siteConfig.seo;
  
  const rawTitle = interpolateText(categoryMetaTemplates.title, { categoryName });
  const rawDescription = categoryDescription || interpolateText(categoryMetaTemplates.description, { categoryName });
  
  return {
    title: truncateAtWord(rawTitle, SEO_LIMITS.TITLE_MAX),
    description: truncateAtWord(rawDescription, SEO_LIMITS.DESCRIPTION_MAX),
    keywords: interpolateText(categoryMetaTemplates.keywords, { categoryName }),
  };
}

export function generateToolMeta(toolName: string, toolTagline?: string, toolDescription?: string) {
  const { toolMetaTemplates } = siteConfig.seo;
  
  // Use shorter tagline, fall back to generic
  const shortTagline = toolTagline 
    ? truncateAtWord(toolTagline, 40) 
    : 'CRE AI Tool';
  
  const rawTitle = interpolateText(toolMetaTemplates.title, { 
    toolName, 
    toolTagline: shortTagline 
  });
  
  const rawDescription = interpolateText(toolMetaTemplates.description, { 
    toolName, 
    toolTagline: shortTagline
  });
  
  return {
    title: truncateAtWord(rawTitle, SEO_LIMITS.TITLE_MAX),
    description: truncateAtWord(rawDescription, SEO_LIMITS.DESCRIPTION_MAX),
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