import { NextRequest, NextResponse } from 'next/server';

// Simple rate limiting - in production, use Redis or a proper solution
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(ip: string, limit: number = 100, windowMs: number = 60000): boolean {
  const now = Date.now();
  const userLimit = rateLimit.get(ip);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (userLimit.count >= limit) {
    return false;
  }

  userLimit.count++;
  return true;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get client IP
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown';

  // Rate limiting for API routes
  if (pathname.startsWith('/api/')) {
    if (!checkRateLimit(ip, 100, 60000)) { // 100 requests per minute
      return new NextResponse('Too Many Requests', { status: 429 });
    }
  }

  // Admin route protection
  if (pathname.startsWith('/admin')) {
    // Basic auth check - replace with your actual auth system
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !isValidAuth(authHeader)) {
      return new NextResponse('Unauthorized', {
        status: 401,
        headers: {
          'WWW-Authenticate': 'Basic realm="Admin Area"',
        },
      });
    }
  }

  return NextResponse.next();
}

function isValidAuth(authHeader: string): boolean {
  // Basic auth implementation - replace with your auth logic
  // This is just an example - use proper authentication in production
  try {
    const base64Credentials = authHeader.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [username, password] = credentials.split(':');
    
    // Check against environment variables or your auth system
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.warn('ADMIN_PASSWORD not set - admin routes are unprotected!');
      return false;
    }
    
    return username === adminUsername && password === adminPassword;
  } catch (error) {
    return false;
  }
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/:path*',
  ],
}; 