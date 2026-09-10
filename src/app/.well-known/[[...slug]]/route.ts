import { NextRequest, NextResponse } from 'next/server';
import {
  arDManifestPayload,
  apiCatalogGuidePayload,
  apiCatalogPayload,
  apiDiscoveryOpenApiSpec,
  agentSkillsPayload,
  dnsAidPayload,
  mcpServerCardPayload,
  oauthAuthorizationServerPayload,
  oauthProtectedResourcePayload,
  openIdConfigurationPayload,
} from '@/lib/agent-discovery';

const commonHeaders = {
  'Cache-Control': 'public, max-age=300, stale-while-revalidate=3600',
};

function plainTextResponse(text: string, status = 200) {
  return new NextResponse(text, {
    status,
    headers: {
      ...commonHeaders,
      'Content-Type': 'text/plain; charset=utf-8',
    },
  });
}

function jsonResponse(
  body: Record<string, unknown>,
  contentType = 'application/json; charset=utf-8',
  additionalHeaders: Record<string, string> = {}
) {
  return new NextResponse(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      ...commonHeaders,
      'Content-Type': contentType,
      ...additionalHeaders,
    },
  });
}

function markdownResponse(markdown: string, source: string) {
  return new NextResponse(markdown, {
    headers: {
      ...commonHeaders,
      'Content-Type': 'text/markdown; charset=utf-8',
      'X-Markdown-Tokens': String(markdown.split(/\s+/).filter(Boolean).length),
      'X-Source-Url': source,
    },
  });
}

function sanitizeHtmlToMarkdown(html: string): string {
  const withoutScripts = html
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, '');
  const withoutHiddenSections = withoutScripts
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '');
  let markdown = withoutHiddenSections
    .replace(
      /<h([1-6])[^>]*>(.*?)<\/h\1>/gi,
      (_match, level, text) => `\n\n${'#'.repeat(Number(level))} ${text.replace(/<[^>]+>/g, '').trim()}\n`
    )
    .replace(/<p[^>]*>/gi, '\n\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<li[^>]*>/gi, '\n- ')
    .replace(/<\/li>/gi, '\n')
    .replace(/<a [^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gi, (_match, href, text) => {
      return `[${text.replace(/<[^>]+>/g, '').trim()}](${href})`;
    })
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#(\d+);/g, (_match, code) => String.fromCharCode(Number(code)));

  return markdown
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

async function toMarkdown(request: NextRequest, source = '/') {
  const sourceUrl = new URL(source, request.url);
  if (sourceUrl.origin !== request.nextUrl.origin) {
    return plainTextResponse('Invalid source URL', 400);
  }
  const response = await fetch(sourceUrl.toString(), {
    headers: { Accept: 'text/html' },
    cache: 'no-store',
  });

  if (!response.ok) {
    return plainTextResponse(`Unable to fetch ${source}`, response.status);
  }

  const html = await response.text();
  const markdown = sanitizeHtmlToMarkdown(html);
  return markdownResponse(markdown, sourceUrl.toString());
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug?: string[] }> }
) {
  const { slug } = await params;
  const resourceSegments = slug ?? [];
  const resource = resourceSegments.join('/');
  const searchParams = request.nextUrl.searchParams;
  const source = searchParams.get('source') ?? '/';

  switch (resource) {
    case '':
      return plainTextResponse('AI CRE Tools well-known index');
    case 'api-catalog':
      return jsonResponse(apiCatalogPayload, 'application/linkset+json; charset=utf-8');
    case 'openapi.json':
      return jsonResponse(apiDiscoveryOpenApiSpec, 'application/vnd.oai.openapi+json; charset=utf-8');
    case 'api-docs/openapi.json':
      return jsonResponse(
        apiDiscoveryOpenApiSpec,
        'application/vnd.oai.openapi+json; charset=utf-8'
      );
    case 'open-id-configuration':
    case 'openid-configuration':
      return jsonResponse(openIdConfigurationPayload);
    case 'oauth-authorization-server':
      return jsonResponse(oauthAuthorizationServerPayload);
    case 'oauth-protected-resource':
      return jsonResponse(oauthProtectedResourcePayload);
    case 'agent-skills/index.json':
      return jsonResponse(agentSkillsPayload);
    case 'mcp/server-card.json':
      return jsonResponse(mcpServerCardPayload);
    case 'ai-catalog.json':
      return jsonResponse(
        arDManifestPayload,
        'application/json; charset=utf-8',
        {
          'Access-Control-Allow-Origin': '*',
        }
      );
    case 'dns-aid':
      return plainTextResponse(dnsAidPayload);
    case 'markdown':
      return toMarkdown(request, source);
    case 'api-catalog.txt':
      return plainTextResponse(apiCatalogGuidePayload);
    default:
      return plainTextResponse('Not found', 404);
  }
}
