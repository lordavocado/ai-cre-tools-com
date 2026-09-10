import { siteConfig } from '@/config/site';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI CRE Tools API Documentation',
  description:
    'Agent-ready API documentation and discovery endpoints for AI CRE Tools.',
};

export default function DocsApiPage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 py-16">
      <p className="mb-4 text-sm uppercase tracking-[0.15em] text-muted-foreground">API docs</p>
      <h1 className="mb-6 text-3xl font-medium text-foreground">AI CRE Tools API</h1>
      <p className="mb-10 text-muted-foreground">
        This directory exposes a small, standards-oriented surface for agents, including
        health checks, metadata endpoints, and discovery documents.
      </p>

      <div className="space-y-8 text-sm leading-relaxed text-foreground">
        <section>
          <h2 className="mb-3 text-xl font-medium">Discovery endpoints</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <a className="underline underline-offset-4" href="/.well-known/api-catalog">
                /.well-known/api-catalog
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/.well-known/openapi.json">
                /.well-known/openapi.json
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/.well-known/agent-skills/index.json">
                /.well-known/agent-skills/index.json
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/.well-known/oauth-authorization-server">
                /.well-known/oauth-authorization-server
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/.well-known/oauth-protected-resource">
                /.well-known/oauth-protected-resource
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/.well-known/ai-catalog.json">
                /.well-known/ai-catalog.json
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/.well-known/mcp/server-card.json">
                /.well-known/mcp/server-card.json
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-medium">Health and auth placeholders</h2>
          <ul className="list-inside list-disc space-y-2 text-muted-foreground">
            <li>
              <a className="underline underline-offset-4" href="/api/health">
                /api/health
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/api/mcp">
                /api/mcp
              </a>
            </li>
            <li>
              <a className="underline underline-offset-4" href="/api/agent-auth/authorize">
                /api/agent-auth/authorize
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-3 text-xl font-medium">Agent registration</h2>
          <p className="text-muted-foreground">
            See <a className="underline underline-offset-4" href="/auth.md">/auth.md</a> for the registration
            and claim/revocation metadata expected by agent discovery scans.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Issuer for metadata: <strong>{siteConfig.url}</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
