import { NextRequest, NextResponse } from 'next/server';
import { siteConfig } from '@/config/site';
import { normalizeURL } from './src/lib/routing-utils';

const CANONICAL_ORIGIN = new URL(siteConfig.url).origin;
const CANONICAL_HOST = new URL(siteConfig.url).hostname.toLowerCase();

/**
 * Permanent redirect when the request host is not the canonical host but belongs to the same site
 * (e.g. apex → www). Prevents duplicate URLs with canonicals that target another hostname — the
 * situation Ahrefs reports as “canonical points to redirect” when the www URL returns a redirect hop.
 */
function redirectToCanonicalHost(request: NextRequest): NextResponse | null {
  const rawHost = request.headers.get('host')?.split(':')[0]?.toLowerCase() ?? '';
  if (!rawHost || rawHost === CANONICAL_HOST) {
    return null;
  }

  // Preview / local dev: never redirect unknown hosts
  if (
    rawHost === 'localhost' ||
    rawHost.endsWith('.sslip.io') ||
    rawHost.endsWith('.local')
  ) {
    return null;
  }

  const stripWww = (h: string) => (h.startsWith('www.') ? h.slice(4) : h);
  if (stripWww(rawHost) === stripWww(CANONICAL_HOST)) {
    const target = request.nextUrl.clone();
    target.hostname = CANONICAL_HOST;
    return NextResponse.redirect(target, 308);
  }

  return null;
}

/**
 * Next.js middleware for SEO URL normalization and routing optimization
 * Handles trailing slashes, canonicalization, and redirects
 */
export function middleware(request: NextRequest) {
  const hostRedirect = redirectToCanonicalHost(request);
  if (hostRedirect) {
    return hostRedirect;
  }

  const { pathname } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Skip middleware for:
  // - API routes
  // - Static files (_next, images, etc.)
  // - Actual files with extensions
  const skipMiddleware = 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/admin') ||
    pathname.startsWith('/admin-login') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.');

  if (skipMiddleware) {
    return NextResponse.next();
  }

  const isGooglebot = /googlebot/i.test(request.headers.get('user-agent') ?? '');

  // Handle trailing slash normalization (prefer no trailing slash)
  const normalizedPath = normalizeURL(pathname, false);
  const lowerCasePath = normalizedPath.toLowerCase();
  const differsBySlashOnly =
    pathname !== '/' && pathname !== normalizedPath && pathname.replace(/\/+$/, '') === normalizedPath;

  // Redirect mixed-case URLs to lowercase canonical versions while allowing trailing slash variants
  if (pathname !== lowerCasePath && pathname.replace(/\/+$/, '') !== lowerCasePath) {
    url.pathname = lowerCasePath;
    return NextResponse.redirect(url, 301);
  }

  // Handle common URL variations and redirects
  const redirectMap: Record<string, string> = {
    '/home': '/',
    '/index': '/',
    '/tools': '/categories',
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

  // Add security headers for SEO and performance
  const response = NextResponse.next();
  
  // Security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  // Performance headers
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  
  // SEO headers for crawlers
  if (!request.headers.get('user-agent')?.includes('bot')) {
    response.headers.set('Cache-Control', 'public, max-age=3600, stale-while-revalidate=86400');
  }

  // Prefer canonical hints over redirects for trailing slash variants (always use configured origin,
  // not request.nextUrl.origin, so apex vs www never disagrees with HTML metadata).
  const canonicalPath = lowerCasePath || '/';
  const canonicalUrl = `${CANONICAL_ORIGIN}${canonicalPath}`;
  response.headers.set('Link', `<${canonicalUrl}>; rel="canonical"`);

  return response;
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Most pages: host normalization (apex → www) + path rules. Excludes common non-page paths.
     * robots.txt + sitemap.xml are listed separately so apex host redirects still run (they contain
     * a dot and are excluded from the first pattern).
     */
    '/((?!api|admin|admin-login|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
    '/robots.txt',
    '/sitemap.xml',
  ],
};
