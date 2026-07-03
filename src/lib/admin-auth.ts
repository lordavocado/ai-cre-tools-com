import 'server-only';

import { createHash, timingSafeEqual } from 'crypto';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { NextRequest, NextResponse } from 'next/server';

export const ADMIN_SESSION_COOKIE = 'ai_cre_admin_session';

function getConfiguredAdminUsername() {
  return process.env.ADMIN_USERNAME ?? 'admin';
}

function getConfiguredAdminPassword() {
  return process.env.ADMIN_PASSWORD;
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);

  if (leftBuffer.length !== rightBuffer.length) {
    return false;
  }

  return timingSafeEqual(leftBuffer, rightBuffer);
}

function createSessionValue(username: string, password: string) {
  return createHash('sha256')
    .update(`${username}:${password}`)
    .digest('hex');
}

function parseBasicAuthorizationHeader(authorizationHeader: string | null) {
  if (!authorizationHeader || !authorizationHeader.toLowerCase().startsWith('basic ')) {
    return null;
  }

  try {
    const encodedCredentials = authorizationHeader.split(' ')[1];

    if (!encodedCredentials) {
      return null;
    }

    const decodedCredentials = Buffer.from(encodedCredentials, 'base64').toString('utf8');
    const separatorIndex = decodedCredentials.indexOf(':');

    if (separatorIndex === -1) {
      return null;
    }

    return {
      username: decodedCredentials.slice(0, separatorIndex),
      password: decodedCredentials.slice(separatorIndex + 1),
    };
  } catch {
    return null;
  }
}

export function isAdminCredentialsConfigured() {
  return Boolean(getConfiguredAdminPassword());
}

export function verifyAdminCredentials(username: string, password: string) {
  const configuredUsername = getConfiguredAdminUsername();
  const configuredPassword = getConfiguredAdminPassword();

  if (!configuredPassword) {
    return false;
  }

  return safeEqual(username, configuredUsername) && safeEqual(password, configuredPassword);
}

export function createAdminSessionCookieValue() {
  const configuredPassword = getConfiguredAdminPassword();

  if (!configuredPassword) {
    throw new Error('ADMIN_PASSWORD is not configured');
  }

  return createSessionValue(getConfiguredAdminUsername(), configuredPassword);
}

export function isValidAdminSessionCookie(sessionValue: string | undefined) {
  if (!sessionValue || !isAdminCredentialsConfigured()) {
    return false;
  }

  return safeEqual(sessionValue, createAdminSessionCookieValue());
}

export function normalizeAdminNextPath(value: string | null | undefined) {
  if (!value || typeof value !== 'string') {
    return '/admin';
  }

  if (!value.startsWith('/admin')) {
    return '/admin';
  }

  return value;
}

export async function isAuthenticatedAdminRequest() {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const sessionCookie = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (isValidAdminSessionCookie(sessionCookie)) {
    return true;
  }

  const basicCredentials = parseBasicAuthorizationHeader(headerStore.get('authorization'));

  if (!basicCredentials) {
    return false;
  }

  return verifyAdminCredentials(basicCredentials.username, basicCredentials.password);
}

export async function requireAdminPageAuth(nextPath: string) {
  if (!isAdminCredentialsConfigured()) {
    redirect(`/admin-login?error=unavailable&next=${encodeURIComponent(normalizeAdminNextPath(nextPath))}`);
  }

  if (!(await isAuthenticatedAdminRequest())) {
    redirect(`/admin-login?next=${encodeURIComponent(normalizeAdminNextPath(nextPath))}`);
  }
}

function shouldUseSecureAdminCookie(request?: NextRequest) {
  if (process.env.NODE_ENV !== 'production') {
    return false;
  }

  if (request) {
    return request.nextUrl.protocol === 'https:' || request.headers.get('x-forwarded-proto') === 'https';
  }

  // Production behind Coolify/Traefik: default secure when no request context (e.g. server actions)
  return true;
}

export function createAdminSessionCookieOptions(request?: NextRequest) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: shouldUseSecureAdminCookie(request),
    path: '/',
    maxAge: 60 * 60 * 12,
  };
}

export function createClearedAdminSessionCookieOptions(request?: NextRequest) {
  return {
    ...createAdminSessionCookieOptions(request),
    expires: new Date(0),
    maxAge: 0,
  };
}

export function createAdminUnauthorizedApiResponse() {
  return NextResponse.json(
    { error: 'Unauthorized' },
    {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="Admin Area"',
      },
    }
  );
}

export function isAuthenticatedAdminApiRequest(request: NextRequest) {
  const sessionCookie = request.cookies.get(ADMIN_SESSION_COOKIE)?.value;

  if (isValidAdminSessionCookie(sessionCookie)) {
    return true;
  }

  const basicCredentials = parseBasicAuthorizationHeader(request.headers.get('authorization'));

  if (!basicCredentials) {
    return false;
  }

  return verifyAdminCredentials(basicCredentials.username, basicCredentials.password);
}
