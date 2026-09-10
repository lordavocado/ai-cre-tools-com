'use client';

import { useEffect } from 'react';
import { siteConfig } from '@/config/site';

type AgentToolInputSchema = {
  type: string;
  properties: Record<string, {
    type: string;
    description: string;
    examples?: string[] | boolean[] | number[];
  }>;
  required: string[];
};

type AgentTool = {
  name: string;
  description: string;
  inputSchema: AgentToolInputSchema;
  execute: (input: Record<string, unknown>) => Promise<Record<string, unknown>>;
};

type ModelContext = {
  provideContext: (context: {
    name: string;
    description: string;
    tools: AgentTool[];
  }) => void;
};

declare global {
  interface Navigator {
    modelContext?: ModelContext;
  }
}

export function WebMcpBootstrap() {
  useEffect(() => {
    const contextModel = navigator.modelContext;
    if (!contextModel?.provideContext) return;

    contextModel.provideContext({
      name: siteConfig.name,
      description: 'Read-only tool directory and API discovery endpoints.',
      tools: [
        {
          name: 'get_directory_health',
          description: 'Read service health status for the directory APIs.',
          inputSchema: {
            type: 'object',
            properties: {},
            required: [],
          },
          execute: async () => {
            const response = await fetch('/api/health');
            const payload = await response.json();
            return {
              endpoint: `${siteConfig.url}/api/health`,
              payload,
            };
          },
        },
        {
          name: 'build_tool_url',
          description: 'Build a direct URL to a tool page or tools index path.',
          inputSchema: {
            type: 'object',
            properties: {
              path: {
                type: 'string',
                description: 'Relative path to resolve on this site.',
                examples: ['all-tools', 'tools/sample'],
              },
            },
            required: ['path'],
          },
          execute: async (input) => {
            const path = `/${String(input.path ?? '').replace(/^\/+/, '')}`;
            const url = new URL(path, siteConfig.url).toString();
            return { url };
          },
        },
      ],
    });
  }, []);

  return null;
}
