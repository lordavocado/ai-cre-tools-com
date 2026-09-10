import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    {
      status: 'not_implemented',
      detail: 'MCP transport endpoint is advertised for discovery; active tools are provided via browser-side context bootstrap.',
      capabilities: {
        tools: true,
        resources: true,
      },
    },
    {
      status: 501,
      headers: { 'Cache-Control': 'no-store' },
    }
  );
}
