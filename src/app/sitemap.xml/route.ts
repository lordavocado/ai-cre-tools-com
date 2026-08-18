import { NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { SITEMAP_GROUPS, buildSitemapIndexXml } from '@/lib/sitemap';

export async function GET() {
  return new NextResponse(buildSitemapIndexXml(
    SITEMAP_GROUPS.map((group) => `${siteConfig.url}/sitemaps/${group}.xml`)
  ), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
    },
  });
}
