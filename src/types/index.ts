
export interface DirectoryItem {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  longDescription?: string;
  category: string; // category slug
  website: string;
  imageUrl?: string;
  features?: { name: string; description?: string }[];
  pricing?: string; // e.g., "Free", "Paid", "Freemium", "$10/month"
  rating?: number; // 1-5
  reviewCount?: number;
  pros?: string[];
  cons?: string[];
  lastUpdated?: string; // ISO Date string
  foundedYear?: number;
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
  icon?: React.ElementType; // Lucide icon component
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
