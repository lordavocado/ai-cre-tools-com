import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getToolSubmissions, updateSubmissionStatus } from '@/lib/supabase';
import {
  createAdminUnauthorizedApiResponse,
  isAuthenticatedAdminApiRequest,
} from '@/lib/admin-auth';
import { isSupabaseStorageConfigured } from '@/lib/tool-submissions-config';

// Schema for updating submission status
const updateStatusSchema = z.object({
  submissionId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticatedAdminApiRequest(request)) {
      return createAdminUnauthorizedApiResponse();
    }

    if (!isSupabaseStorageConfigured()) {
      return NextResponse.json(
        { error: 'The submissions dashboard is unavailable because Supabase storage is not configured.' },
        { status: 503 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    // Validate status parameter
    if (status && !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status parameter' },
        { status: 400 }
      );
    }

    const submissions = await getToolSubmissions(
      status as 'pending' | 'approved' | 'rejected' | undefined
    );

    return NextResponse.json(submissions);
  } catch (error) {
    console.error('Error fetching submissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch submissions' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAuthenticatedAdminApiRequest(request)) {
      return createAdminUnauthorizedApiResponse();
    }

    if (!isSupabaseStorageConfigured()) {
      return NextResponse.json(
        { error: 'Submission review is unavailable because Supabase storage is not configured.' },
        { status: 503 }
      );
    }

    const body = await request.json();

    // Validate the request body
    const validatedData = updateStatusSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validatedData.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const { submissionId, status } = validatedData.data;

    // Update the submission status
    const success = await updateSubmissionStatus(submissionId, status);

    if (!success) {
      return NextResponse.json(
        { error: 'Submission not found or could not be updated' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Submission status updated to ${status}`
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
