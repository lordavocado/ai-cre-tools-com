import { NextRequest, NextResponse } from 'next/server';
import {
  createAdminUnauthorizedApiResponse,
  isAuthenticatedAdminApiRequest,
} from '@/lib/admin-auth';
import { getToolSubmissionSystemStatus } from '@/lib/tool-submissions-config';

/**
 * Returns which backend pieces are configured for the submission → publish pipeline.
 * Used by the admin submissions UI so operators know why a step might be blocked.
 */
export async function GET(request: NextRequest) {
  if (!isAuthenticatedAdminApiRequest(request)) {
    return createAdminUnauthorizedApiResponse();
  }

  return NextResponse.json(getToolSubmissionSystemStatus());
}
