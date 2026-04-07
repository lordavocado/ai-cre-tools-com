import { NextRequest, NextResponse } from 'next/server';
import {
  ADMIN_SESSION_COOKIE,
  createAdminSessionCookieOptions,
  createAdminSessionCookieValue,
  isAdminCredentialsConfigured,
  normalizeAdminNextPath,
  verifyAdminCredentials,
} from '@/lib/admin-auth';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const username = String(formData.get('username') ?? '');
  const password = String(formData.get('password') ?? '');
  const nextPath = normalizeAdminNextPath(String(formData.get('next') ?? '/admin'));
  const loginUrl = new URL(`/admin-login?next=${encodeURIComponent(nextPath)}`, request.url);

  if (!isAdminCredentialsConfigured()) {
    loginUrl.searchParams.set('error', 'unavailable');
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  if (!verifyAdminCredentials(username, password)) {
    loginUrl.searchParams.set('error', 'invalid');
    return NextResponse.redirect(loginUrl, { status: 303 });
  }

  const response = NextResponse.redirect(new URL(nextPath, request.url), { status: 303 });
  response.cookies.set(
    ADMIN_SESSION_COOKIE,
    createAdminSessionCookieValue(),
    createAdminSessionCookieOptions(request)
  );

  return response;
}
