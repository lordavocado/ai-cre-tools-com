import { NextResponse } from 'next/server';

const authMd = `# AI CRE Tools Agent Registration

AI agents may discover and register for protected API access using the OAuth metadata:

- `auth.md` (this file): Agent metadata and onboarding instructions
- `/.well-known/oauth-authorization-server` registration endpoints
- `/.well-known/oauth-protected-resource` for resource discovery

## Supported identity

- Identity type: \`api-key\`
- Credential type: \`api-key\`

## Registration endpoint

POST to:

\`\`\`
/api/agent-auth/register
\`\`\`

## Claim endpoint

To request agent identity claims:

\`\`\`
/auth.md#claims
\`\`\`

## Revocation endpoint

\`\`\`
/auth.md#revocation
\`\`\`

## Notes

Protected APIs are discovery-ready and currently expose metadata endpoints for standards-based integration.
`;

export async function GET() {
  return new NextResponse(authMd, {
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
    },
  });
}
