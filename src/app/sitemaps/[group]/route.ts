import { NextResponse } from 'next/server';
import {
  SITEMAP_GROUPS,
  buildUrlSetXml,
  getSitemapEntries,
  type SitemapGroup,
} from '@/lib/sitemap';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ group: string }> }
) {
  const { group: groupParam } = await params;
  const group = groupParam.replace(/\.xml$/, '') as SitemapGroup;

  if (!SITEMAP_GROUPS.includes(group)) {
    return new NextResponse('Sitemap not found', { status: 404 });
  }

  try {
    const entries = await getSitemapEntries(group);
    return new NextResponse(buildUrlSetXml(entries), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Error generating ${group} sitemap:`, error);
    }
    return new NextResponse(buildUrlSetXml([]), {
      headers: {
        'Content-Type': 'application/xml; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  }
}
