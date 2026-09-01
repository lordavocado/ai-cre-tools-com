/** Cheap process readiness check. It must not query the directory or database. */
export const dynamic = 'force-dynamic';

export function GET() {
  return Response.json({ status: 'ok' }, {
    headers: { 'Cache-Control': 'no-store' },
  });
}
