import { MetadataRoute } from 'next';
import { getDirectoryItems, getCategories } from '@/lib/sheets';
import { getGuides } from '@/lib/markdown';
import type { DirectoryItem } from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://productanalyticstools.com'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    { route: '', priority: 1.0, changeFreq: 'daily' as const }, // Homepage
    { route: '/categories', priority: 0.9, changeFreq: 'weekly' as const }, // High value page
    { route: '/guides', priority: 0.8, changeFreq: 'weekly' as const }, // Content hub
    { route: '/compare', priority: 0.7, changeFreq: 'monthly' as const }, // Utility page
    { route: '/privacy-policy', priority: 0.3, changeFreq: 'yearly' as const }, // Legal
    { route: '/terms-of-service', priority: 0.3, changeFreq: 'yearly' as const }, // Legal
  ].map(({ route, priority, changeFreq }) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: changeFreq,
    priority,
  }));

  const items = await getDirectoryItems();
  const itemRoutes = items.map((item) => ({
    url: `${BASE_URL}/${item.slug}`,
    lastModified: new Date().toISOString(), // Consider adding updatedAt field to DirectoryItem
    changeFrequency: 'monthly' as const, // Products change less frequently
    priority: calculateItemPriority(item), // Dynamic priority based on rating/popularity
  }));

  const categories = await getCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'monthly' as const, // Categories are more stable
    priority: 0.8, // Higher than individual items - category pages are valuable
  }));

  const guides = await getGuides();
  const guideRoutes = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guide.publishedDate || new Date().toISOString(),
    changeFrequency: 'monthly' as const,
    priority: 0.6, // Content pages
  }));

  return [...staticRoutes, ...itemRoutes, ...categoryRoutes, ...guideRoutes];
}

// Helper function for dynamic item priority
function calculateItemPriority(item: DirectoryItem): number {
  let priority = 0.5; // Base priority
  
  // Boost for highly rated items
  if (item.rating && item.rating >= 4.5) priority += 0.2;
  else if (item.rating && item.rating >= 4.0) priority += 0.1;
  
  // Boost for featured/popular categories
  const popularCategories = ['event-tracking', 'session-replay', 'funnel-analytics'];
  if (popularCategories.includes(item.category)) priority += 0.1;
  
  return Math.min(priority, 0.9); // Cap at 0.9
}
