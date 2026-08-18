import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

export async function GET() {
  const host = new URL(siteConfig.url).host;
  const robotsTxt = `# Robots.txt for ${siteConfig.name}
# Allow all crawlers to access the site
User-agent: *
Allow: /

# Allow access to essential pages
Allow: /about
Allow: /categories
Allow: /guides
Allow: /blog
Allow: /for
Allow: /tags
Allow: /use-cases
Allow: /asset-classes
Allow: /integrations
Allow: /compare
Allow: /glossary
Allow: /all-tools
Allow: /favorites
Allow: /privacy-policy
Allow: /terms-of-service
Allow: /submit-tool

# Block access to sensitive areas
Disallow: /api/
Disallow: /admin/
Disallow: /private/
Disallow: *.json$
Disallow: /search?*
Disallow: /admin/*
Disallow: /api/*
Disallow: /private/*

# Allow Google AI features (Search Generative Experience / AI Overviews)
User-agent: Google-Extended
Allow: /

# Block training crawlers that may not respect robots.txt
User-agent: GPTBot
Disallow: /

User-agent: ChatGPT-User
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
Host: ${host}`;

  return new NextResponse(robotsTxt, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
