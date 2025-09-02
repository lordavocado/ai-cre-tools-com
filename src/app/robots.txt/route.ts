import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export async function GET() {
  const robotsTxt = `# Robots.txt for ${siteConfig.name}
# Generated on ${new Date().toISOString()}

# Allow all crawlers to access the site
User-agent: *
Allow: /

# Allow access to essential pages
Allow: /about
Allow: /categories
Allow: /guides
Allow: /blog
Allow: /favorites
Allow: /privacy-policy
Allow: /terms-of-service
Allow: /submit-tool

# Block access to sensitive areas
Disallow: /api/
Disallow: /admin/
Disallow: /_next/
Disallow: /private/
Disallow: *.json$
Disallow: /search?*
Disallow: /admin/*
Disallow: /api/*
Disallow: /_next/*
Disallow: /private/*

# Block AI crawlers that may not respect robots.txt
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
Disallow: /

User-agent: Google-Extended
Disallow: /

# Allow social media crawlers with specific rules
User-agent: FacebookBot
Allow: /
Crawl-delay: 2

User-agent: TwitterBot
Allow: /
Crawl-delay: 2

User-agent: LinkedInBot
Allow: /
Crawl-delay: 2

# Allow major search engine bots
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Bingbot
Allow: /
Crawl-delay: 1

User-agent: Slurp
Allow: /
Crawl-delay: 1

User-agent: DuckDuckBot
Allow: /
Crawl-delay: 1

# Sitemap location
Sitemap: ${siteConfig.url}/sitemap.xml

# Host directive for international sites
Host: ${siteConfig.url}`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
