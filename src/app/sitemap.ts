
import { MetadataRoute } from 'next';
import { getDirectoryItems, getCategories } from '@/lib/sheets';
import { getGuides } from '@/lib/markdown';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'; // Replace with your actual domain

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticRoutes = [
    '',
    '/categories',
    '/guides',
    '/compare',
    '/privacy-policy',
    '/terms-of-service',
  ].map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: route === '' ? 'daily' : 'weekly', // Home page might change more
    priority: route === '' ? 1 : 0.8,
  }));

  const items = await getDirectoryItems();
  const itemRoutes = items.map((item) => ({
    url: `${BASE_URL}/${item.slug}`,
    lastModified: item.lastUpdated || new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const categories = await getCategories();
  const categoryRoutes = categories.map((category) => ({
    url: `${BASE_URL}/categories/${category.slug}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly',
    priority: 0.6,
  }));

  const guides = await getGuides();
  const guideRoutes = guides.map((guide) => ({
    url: `${BASE_URL}/guides/${guide.slug}`,
    lastModified: guide.publishedDate || new Date().toISOString(),
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...itemRoutes, ...categoryRoutes, ...guideRoutes];
}
