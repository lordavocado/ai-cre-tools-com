import { NextRequest, NextResponse } from 'next/server';
import { normalizeURL } from './src/lib/routing-utils';

/**
 * Next.js middleware for SEO URL normalization and routing optimization
 * Handles trailing slashes, canonicalization, and redirects
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const url = request.nextUrl.clone();

  // Skip middleware for:
  // - API routes
  // - Static files (_next, images, etc.)
  // - Actual files with extensions
  const skipMiddleware = 
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.includes('.') ||
    pathname.startsWith('/admin/');

  if (skipMiddleware) {
    return NextResponse.next();
  }

  // Handle trailing slash normalization
  const normalizedPath = normalizeURL(pathname, false); // We prefer no trailing slash
  
  // Redirect if URL needs normalization (except for root path)
  if (pathname !== '/' && pathname !== normalizedPath) {
    url.pathname = normalizedPath;
    return NextResponse.redirect(url, 301); // Permanent redirect for SEO
  }

  // Handle lowercase URL enforcement for SEO consistency
  const lowercasePath = pathname.toLowerCase();
  if (pathname !== lowercasePath) {
    url.pathname = lowercasePath;
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

  const redirectTarget = redirectMap[pathname];
  if (redirectTarget) {
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

  return response;
}

/**
 * Configure which paths the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt
     * - sitemap.xml
     * - Files with extensions
     */
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.).*)',
  ],
};