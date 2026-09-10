import { NextResponse } from 'next/server';

const notImplementedStatus = 501;

const operationMessages: Record<string, string> = {
  authorize: 'Authorization endpoint is reserved for future protected API credentials.',
  token: 'Token endpoint is reserved for future protected API credentials.',
  register: 'Registration endpoint is available for discovery metadata; registration workflow is intentionally limited.',
  jwks: 'JWKS endpoint placeholder for future signed JWT support.',
  revocation: 'Revocation endpoint is not active in this build.',
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ operation: string }> }
) {
  const { operation } = await params;
  const message = operationMessages[operation];

  if (!message) {
    return NextResponse.json(
      { error: `Unknown agent auth operation: ${operation}` },
      { status: 404 }
    );
  }

  return NextResponse.json(
    {
      status: 'not_implemented',
      operation,
      message,
    },
    {
      status: notImplementedStatus,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
