export interface DirectoryItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  category: string;
  website: string;
  imageUrl?: string;
  features?: { name: string; description?: string }[];
  pricing?: string;
  bestFor?: string;
  tags?: string[];
  rating?: number;
  reviewCount?: number;
  pros?: string[];
  cons?: string[];
  foundedYear?: number;
  lastUpdated?: string;
  country?: string;
  city?: string;
  socials?: {
    twitter?: string;
    linkedin?: string;
    facebook?: string;
  };
}

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
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}
