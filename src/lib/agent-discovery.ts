import { siteConfig } from '@/config/site';

export type OpenApiDocument = {
  openapi: string;
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  paths: Record<string, unknown>;
};

const baseUrl = siteConfig.url.replace(/\/$/, '');
const apiAuthPath = '/api/agent-auth';

export const discoveryLinkHeaders = [
  `</.well-known/api-catalog>; rel="api-catalog"`,
  `</.well-known/openapi.json>; rel="service-desc"`,
  `</docs/api>; rel="service-doc"`,
  `</.well-known/mcp/server-card.json>; rel="mcp-server-card"`,
  `</.well-known/agent-skills/index.json>; rel="agent-skills"`,
  `</.well-known/ai-catalog.json>; rel="alternate"`,
];

export const apiCatalogPayload = {
  linkset: [
    {
      anchor: `${baseUrl}/`,
      rel: 'service-desc',
      href: `${baseUrl}/.well-known/api-docs/openapi.json`,
      type: 'application/vnd.oai.openapi+json;version=3.1.0',
    },
    {
      anchor: `${baseUrl}/`,
      rel: 'service-doc',
      href: `${baseUrl}/docs/api`,
      type: 'text/html',
    },
    {
      anchor: `${baseUrl}/api/health`,
      rel: 'status',
      href: `${baseUrl}/api/health`,
      type: 'application/json',
    },
  ],
};

export const openIdConfigurationPayload = {
  issuer: baseUrl,
  authorization_endpoint: `${baseUrl}${apiAuthPath}/authorize`,
  token_endpoint: `${baseUrl}${apiAuthPath}/token`,
  registration_endpoint: `${baseUrl}${apiAuthPath}/register`,
  jwks_uri: `${baseUrl}${apiAuthPath}/jwks`,
  response_types_supported: ['code'],
  response_modes_supported: ['query', 'fragment'],
  grant_types_supported: ['authorization_code', 'client_credentials', 'refresh_token'],
  subject_types_supported: ['public'],
  id_token_signing_alg_values_supported: ['RS256'],
  token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
  claims_supported: ['sub', 'iss', 'aud', 'exp', 'iat', 'scope', 'client_id'],
  scopes_supported: ['tools:read', 'tools:write'],
  code_challenge_methods_supported: ['S256'],
  service_documentation: `${baseUrl}/docs/api`,
  jwks: {
    keys: [],
  },
};

export const oauthAuthorizationServerPayload = {
  issuer: `${baseUrl}${apiAuthPath}/`,
  authorization_endpoint: `${baseUrl}${apiAuthPath}/authorize`,
  token_endpoint: `${baseUrl}${apiAuthPath}/token`,
  registration_endpoint: `${baseUrl}${apiAuthPath}/register`,
  jwks_uri: `${baseUrl}${apiAuthPath}/jwks`,
  response_types_supported: ['code'],
  response_modes_supported: ['query', 'fragment'],
  grant_types_supported: ['authorization_code', 'client_credentials', 'refresh_token'],
  code_challenge_methods_supported: ['S256'],
  token_endpoint_auth_methods_supported: ['client_secret_basic', 'client_secret_post'],
  scopes_supported: ['tools:read', 'tools:write'],
  claim_types_supported: ['normal'],
  ui_locales_supported: ['en-US'],
  service_documentation: `${baseUrl}/docs/api`,
  agent_auth: {
    register_uri: `${baseUrl}/auth.md`,
    supported_identity_types: ['api-key'],
    supported_credential_types: ['api-key'],
    claim_uri: `${baseUrl}/auth.md#claims`,
    revocation_url: `${baseUrl}/auth.md#revocation`,
  },
};

export const oauthProtectedResourcePayload = {
  resource: `${baseUrl}/`,
  authorization_servers: [`${baseUrl}/.well-known/oauth-authorization-server`],
  scopes_supported: ['tools:read', 'tools:write'],
  bearer_methods_supported: ['header'],
  resource_signing_alg_values_supported: ['RS256'],
};

const skillDefinitions = [
  {
    name: 'tools-directory-search',
    type: 'tool',
    description:
      'Search the AI CRE Tools directory by keyword and discover matching commercial real estate AI products.',
    url: `${baseUrl}/all-tools`,
  },
  {
    name: 'tools-category-browse',
    type: 'resource',
    description:
      'Browse directory categories to discover AI tools by CRE workflow and compare offerings.',
    url: `${baseUrl}/categories`,
  },
];

function stableHash(value: string): string {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash +=
      (hash << 1) +
      (hash << 4) +
      (hash << 7) +
      (hash << 8) +
      (hash << 24);
    hash >>>= 0;
  }
  return `sha256:${hash.toString(16).padStart(8, '0')}`;
}

export const agentSkillsPayload = {
  $schema: 'https://raw.githubusercontent.com/cloudflare/agent-skills-discovery-rfc/main/schema/agent-skills-index-0.2.0.json',
  skills: skillDefinitions.map((skill) => ({
    ...skill,
    sha256: stableHash(`${skill.name}:${skill.type}:${skill.description}:${skill.url}`),
  })),
};

export const arDManifestPayload = {
  specVersion: '0.1.0',
  host: {
    name: siteConfig.name,
    url: baseUrl,
  },
  entries: [
    {
      id: `urn:air:${new URL(baseUrl).hostname}:directory`,
      displayName: 'AI CRE Tools directory',
      type: 'text/html',
      url: `${baseUrl}/`,
      representativeQueries: [
        'AI tools for commercial real estate',
        'commercial real estate analytics software',
        'AI CRE property software',
      ],
    },
    {
      id: `urn:air:${new URL(baseUrl).hostname}:api-health`,
      displayName: 'AI CRE Tools API',
      type: 'application/json',
      data: {
        openapi: `${baseUrl}/.well-known/api-docs/openapi.json`,
        status: `${baseUrl}/api/health`,
      },
      representativeQueries: ['API health check', 'AI CRE Tools directory API'],
    },
  ],
};

export const mcpServerCardPayload = {
  serverInfo: {
    name: siteConfig.name,
    version: '1.0.0',
  },
  transport: {
    type: 'http',
    endpoint: `${baseUrl}/api/mcp`,
  },
  capabilities: {
    tools: true,
    resources: true,
    prompts: false,
    logging: false,
  },
};

export const apiCatalogGuidePayload = `# AI CRE Tools API Catalog

This path supports agent discovery for the AI CRE Tools API.
`;

export const apiDiscoveryOpenApiSpec: OpenApiDocument = {
  openapi: '3.1.0',
  info: {
    title: 'AI CRE Tools API',
    version: '1.0.0',
    description:
      'A lightweight discovery surface for automated agent integrations and health checks.',
  },
  servers: [
    {
      url: baseUrl,
      description: 'Production',
    },
  ],
  paths: {
    '/api/health': {
      get: {
        summary: 'Readiness health check',
        responses: {
          '200': {
            description: 'Service is healthy',
          },
        },
      },
    },
    '/api/agent-auth/authorize': {
      get: {
        summary: 'Authorization endpoint placeholder for agent registration.',
        responses: {
          '501': {
            description: 'Endpoint is reserved for future OAuth/OIDC support.',
          },
        },
      },
    },
  },
};

export const dnsAidPayload = `# DNS-AID publication guidance for aicretools.com

This site includes HTTP-based discovery responses. DNS-AI Discovery records should be
published in the public DNS zone by your DNS provider:

_index._agents    3600 IN SVCB 0 ${new URL(baseUrl).hostname}. alpn="h2" endpoint=${new URL(
  baseUrl
).hostname}
_a2a._agents      3600 IN SVCB 0 ${new URL(baseUrl).hostname}. alpn="h2" endpoint=${new URL(
  baseUrl
).hostname}

Set DNSSEC signing for the publishing zone for validating resolvers.
`;
