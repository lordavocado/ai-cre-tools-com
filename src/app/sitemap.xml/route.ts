/**
 * Sitemap XML generation API route
 * Generates a comprehensive sitemap including static pages, blog posts, guides,
 * directory items, and category pages for optimal SEO crawling
 * @fileoverview Dynamic sitemap generation with error handling and fallbacks
 */

import { NextResponse } from 'next/server';
import { getGuides } from '@/lib/markdown';
import { getDirectoryItems, getCategories } from '@/lib/supabase';
import { getAllBlogPosts } from '@/lib/blog';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils-client';
import { siteConfig } from '@/config/site';
import type { DirectoryItem } from '@/types';
import type { MetadataRoute } from 'next';

/**
 * Generates and returns XML sitemap
 * @returns NextResponse containing XML sitemap with proper headers
 */
export async function GET() {
  const baseUrl = siteConfig.url;

  try {
    // Get dynamic content with error handling
    const guides = await getGuides();
    let directoryItems: DirectoryItem[] = [];
    try {
      directoryItems = await getDirectoryItems();
    } catch {
      // Continue without directory items - fallback handling below
    }
    const blogPosts = await getAllBlogPosts();

    // Get unique categories from directory items, with fallback to canonical category definitions
    let categories: string[] = [];
    if (directoryItems.length > 0) {
      categories = [
        ...new Set(
          directoryItems.flatMap((item) =>
            item.category
              .split(',')
              .map((category) => category.trim())
              .filter(Boolean)
          )
        ),
      ];
    } else {
      categories = (await getCategories(false)).map((category) => category.slug);
    }

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
        url: `${baseUrl}/blog`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
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

    // Blog pages
    const blogPages = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedDate),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // Directory item pages - filter out invalid slugs to prevent SEO issues
    const directoryPages = directoryItems
      .filter(item => isValidSlugFormat(item.slug) && isValidSlug(item.slug))
      .map(item => ({
        url: `${baseUrl}/${item.slug}`,
        lastModified: new Date(item.lastUpdated || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8, // Increased priority for tool pages as they're key content
      }));

    // Category pages - validate category slugs
    const categoryPages = categories
      .filter(category => isValidSlugFormat(category))
      .map(categorySlug => ({
        url: `${baseUrl}/categories/${categorySlug}`,
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.7, // Increased priority for category pages
      }));

    // Combine all pages
    const allPages = [
      ...staticPages,
      ...guidePages,
      ...blogPages,
      ...directoryPages,
      ...categoryPages,
    ];

    // Sort pages by priority and last modified for better SEO
    const sortedPages = allPages.sort((a, b) => {
      if (b.priority !== a.priority) {
        return b.priority - a.priority; // Higher priority first
      }
      return new Date(b.lastModified).getTime() - new Date(a.lastModified).getTime(); // Newer content first
    });

    // Generate XML sitemap with proper formatting
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sortedPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority.toFixed(1)}</priority>
  </url>`).join('\n')}
</urlset>`;

    // Sitemap successfully generated

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });

  } catch (error) {
    // Log error only in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error generating sitemap:', error);
    }

    // Return a basic sitemap with just the homepage if there's an error
    const basicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`;

    return new NextResponse(basicSitemap, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  }
}
