import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';

const CANONICAL_HOST = new URL(siteConfig.url).hostname.toLowerCase();

function normalizePathname(pathname: string): string {
  return pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
}

function redirectToCanonicalHost(request: NextRequest): NextResponse | null {
  const rawHost = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  if (!rawHost || rawHost === CANONICAL_HOST) return null;

  if (rawHost === 'localhost' || rawHost.endsWith('.sslip.io') || rawHost.endsWith('.local')) {
    return null;
  }

  const stripWww = (host: string) => (host.startsWith('www.') ? host.slice(4) : host);
  if (stripWww(rawHost) === stripWww(CANONICAL_HOST)) {
    const target = request.nextUrl.clone();
    target.hostname = CANONICAL_HOST;
    return NextResponse.redirect(target, 308);
  }

  return null;
}

/** Normalizes public URLs and applies security headers; pages own their canonical metadata. */
export function middleware(request: NextRequest) {
  const hostRedirect = redirectToCanonicalHost(request);
  if (hostRedirect) return hostRedirect;

  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();
  const skipMiddleware =
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/admin-login') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.');

  if (skipMiddleware) return NextResponse.next();

  const isGooglebot = /googlebot/i.test(request.headers.get('user-agent') ?? '');
  const normalizedPath = normalizePathname(pathname);
  const lowerCasePath = normalizedPath.toLowerCase();
  const differsBySlashOnly =
    pathname !== '/' && pathname !== normalizedPath && pathname.replace(/\/+$/, '') === normalizedPath;

  if (pathname !== lowerCasePath && pathname.replace(/\/+$/, '') !== lowerCasePath) {
    url.pathname = lowerCasePath;
    return NextResponse.redirect(url, 301);
  }

  const redirectMap: Record<string, string> = {
    '/home': '/',
    '/index': '/',
    '/tools': '/all-tools',
    '/directory': '/categories',
    '/contact': '/about',
    '/privacy': '/privacy-policy',
    '/terms': '/terms-of-service',
    '/tos': '/terms-of-service',
    '/submit': '/submit-tool',
  };
  const redirectTarget = redirectMap[normalizedPath];
  if (redirectTarget && !(isGooglebot && differsBySlashOnly)) {
    url.pathname = redirectTarget;
    return NextResponse.redirect(url, 301);
  }

  const response = NextResponse.next();
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'on');

  if (request.nextUrl.searchParams.has('search') || request.nextUrl.searchParams.has('category')) {
    response.headers.set('X-Robots-Tag', 'noindex, follow');
  }

  // Next owns cache headers, including private responses and its RSC variants.
  // A blanket canonical here would contradict paginated and filtered metadata.
  return response;
}

export const config = {
  matcher: [
    '/((?!api|admin|admin-login|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    '/robots.txt',
    '/sitemap.xml',
  ],
};
