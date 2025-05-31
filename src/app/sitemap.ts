import { MetadataRoute } from 'next';
import { getGuides } from '@/lib/markdown';
import { getDirectoryItems } from '@/lib/sheets';
import { siteConfig } from '@/config/site';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = siteConfig.url;
  
  // Get dynamic content
  const guides = await getGuides();
  const directoryItems = await getDirectoryItems();
  
  // Get unique categories from directory items
  const categories = [...new Set(directoryItems.map(item => item.category).filter(Boolean))];

  // Static pages
  const staticPages = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily' as const,
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/guides`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/categories`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/compare`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'yearly' as const,
      priority: 0.3,
    },
  ];

  // Guide pages
  const guidePages = guides.map(guide => ({
    url: `${baseUrl}/guides/${guide.slug}`,
    lastModified: new Date(guide.publishedDate),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Directory item pages
  const directoryPages = directoryItems.map(item => ({
    url: `${baseUrl}/${item.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  // Category pages
  const categoryPages = categories.map(category => ({
    url: `${baseUrl}/categories/${category}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...guidePages,
    ...directoryPages,
    ...categoryPages,
  ];
}
