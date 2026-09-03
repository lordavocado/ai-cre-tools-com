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

# Allow AI search and user-requested retrieval without opting into model training
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

# Apply one consistent opt-out policy to AI model-training crawlers
User-agent: GPTBot
Disallow: /

User-agent: Google-Extended
Disallow: /

User-agent: Applebot-Extended
Disallow: /

User-agent: ClaudeBot
Disallow: /

User-agent: anthropic-ai
Disallow: /

User-agent: DeepseekBot
Disallow: /

User-agent: Meta-ExternalAgent
Disallow: /

User-agent: xAI-Bot
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
