import { NextResponse } from 'next/server';
import { getGuides } from '@/lib/markdown';
import { getDirectoryItems, getCategories } from '@/lib/sheets';
import { getAllBlogPosts } from '@/lib/blog';
import { siteConfig } from '@/config/site';
import type { DirectoryItem } from '@/types';
import type { MetadataRoute } from 'next';

export async function GET() {
  const baseUrl = siteConfig.url;

  try {
    // Get dynamic content with error handling
    const guides = await getGuides();
    let directoryItems: DirectoryItem[] = [];
    try {
      directoryItems = await getDirectoryItems();
      console.log(`Sitemap: Successfully loaded ${directoryItems.length} directory items`);
    } catch (error) {
      console.error('Sitemap: Failed to load directory items from Google Sheets:', error);
      // Continue without directory items - they'll be handled in the fallback
    }
    const blogPosts = getAllBlogPosts();

    // Get unique categories from directory items, with fallback to hardcoded categories
    let categories: string[] = [];
    if (directoryItems.length > 0) {
      categories = [...new Set(directoryItems.map(item => item.category).filter(Boolean))];
    } else {
      // Fallback to known category slugs when Google Sheets fails
      categories = [
        'property-search-acquisition',
        'property-analysis-valuation', 
        'development-construction',
        'legal-compliance-duediligence',
        'property-management-operations',
        'asset-portfolio-management',
        'transactions-brokerage',
        'marketingleasing-enablement',
        'data-workflow-infrastructure',
        'productivity-copilots'
      ];
      console.log('Sitemap: Using fallback categories due to sheets failure');
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
        url: `${baseUrl}/submit-tool`,
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/favourites`,
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

    // Blog pages
    const blogPages = blogPosts.map(post => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.publishedDate),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    }));

    // Directory item pages
    const directoryPages = directoryItems.map(item => ({
      url: `${baseUrl}/${item.slug}`,
      lastModified: new Date(item.lastUpdated || Date.now()),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Category pages
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/categories/${typeof category === 'string' ? category : category.toLowerCase().replace(/\s+/g, '-')}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    // Combine all pages
    const allPages = [
      ...staticPages,
      ...guidePages,
      ...blogPages,
      ...directoryPages,
      ...categoryPages,
    ];

    // Generate XML sitemap
    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">

${allPages.map(page => `  <url>
    <loc>${page.url}</loc>
    <lastmod>${page.lastModified.toISOString()}</lastmod>
    <changefreq>${page.changeFrequency}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('\n')}

</urlset>`;

    return new NextResponse(sitemapXml, {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });

  } catch (error) {
    console.error('Error generating sitemap:', error);

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
