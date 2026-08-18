import type {
  ToolAssetClass,
  ToolDeployment,
  ToolEditorialStatus,
  ToolPersona,
  ToolPricingModel,
  ToolPricingPeriod,
  ToolWorkflow,
} from '@/config/tool-taxonomy';

export interface DirectoryItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  website: string;
  imageUrl?: string;
  /**
   * Optional screenshot image for this tool (typically stored in Supabase Storage).
   * Prefer `screenshotPath` for storage portability; `screenshotUrl` can be derived.
   */
  screenshotUrl?: string;
  /** Supabase Storage object path, e.g. `tool-screenshots/<slug>.webp` */
  screenshotPath?: string;
  /** Hero screenshot for cards and detail pages (above the fold view) */
  heroScreenshotUrl?: string;
  /** Supabase Storage object path for hero screenshot */
  heroScreenshotPath?: string;
  features?: { name: string; description?: string }[];
  pricing?: string;
  bestFor?: string;
  workflows: ToolWorkflow[];
  personas: ToolPersona[];
  assetClasses: ToolAssetClass[];
  integrations: string[];
  geographicCoverage: string[];
  deploymentOptions: ToolDeployment[];
  securityCertifications: string[];
  inputTypes: string[];
  outputTypes: string[];
  limitations: string[];
  pricingModel: ToolPricingModel;
  startingPriceAmount?: number;
  startingPriceCurrency?: string;
  pricingPeriod?: ToolPricingPeriod;
  hasFreeTrial?: boolean;
  hasFreePlan?: boolean;
  sourceUrls: string[];
  lastVerifiedAt?: string;
  editorialStatus: ToolEditorialStatus;
  pseoEligible: boolean;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  pros?: string[];
  cons?: string[];
  foundedYear?: number;
  lastUpdated?: string;
  createdAt?: string;
  country?: string;
  city?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

/** Minimal, safe-to-serialize data required by directory cards and browser filtering. */
export type DirectoryListItem = Pick<
  DirectoryItem,
  'id' | 'slug' | 'name' | 'tagline' | 'category' | 'website' | 'imageUrl' | 'features' | 'tags'
>;

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  longDescription?: string;
  imageUrl?: string;
  itemCount?: number;
  icon?: string; // Icon key for CATEGORY_ICONS lookup
}

export interface Guide {
  id:string;
  slug: string;
  title: string;
  excerpt: string;
  content: string; // Markdown or HTML content
  imageUrl?: string;
  category?: string; // Optional category slug
  relatedItemSlugs?: string[]; // Optional array of related item slugs
  publishedDate: string; // ISO date string
  author?: string;
  readingTime?: string; // e.g., "5 min read"
}

export interface NewsletterSubscription {
  email: string;
}

export interface AdminTool {
  slug: string;
  name: string;
  websiteUrl: string;
  category: string;
  features: string[];
  oneLiner: string;
  description: string;
  country: string;
  city: string;
  iconUrl: string;
  screenshotUrl: string;
  screenshotPath: string;
  heroScreenshotUrl?: string;
  heroScreenshotPath?: string;
  displayOrder: number;
  workflows: ToolWorkflow[];
  personas: ToolPersona[];
  assetClasses: ToolAssetClass[];
  integrations: string[];
  geographicCoverage: string[];
  deploymentOptions: ToolDeployment[];
  securityCertifications: string[];
  inputTypes: string[];
  outputTypes: string[];
  limitations: string[];
  pricingModel: ToolPricingModel;
  startingPriceAmount: number | null;
  startingPriceCurrency: string;
  pricingPeriod: ToolPricingPeriod | null;
  hasFreeTrial: boolean | null;
  hasFreePlan: boolean | null;
  bestFor: string;
  sourceUrls: string[];
  lastVerifiedAt: string;
  editorialStatus: ToolEditorialStatus;
  pseoEligible: boolean;
  normalizedDataAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}
