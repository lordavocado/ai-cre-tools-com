import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  getToolSubmissionById,
  getToolSubmissions,
  ToolResearchStatus,
  updateSubmissionStatus,
  updateToolSubmission,
} from '@/lib/supabase';
import {
  createAdminUnauthorizedApiResponse,
  isAuthenticatedAdminApiRequest,
} from '@/lib/admin-auth';
import {
  isPerplexityConfigured,
  isSupabaseStorageConfigured,
} from '@/lib/tool-submissions-config';
import { researchToolWithPerplexity } from '@/lib/perplexity';
import { TOOL_SUBMISSION_CATEGORIES } from '@/lib/tool-submission-categories';

const updateStatusSchema = z.object({
  action: z.literal('updateStatus'),
  submissionId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

const updateDetailsSchema = z.object({
  action: z.literal('updateDetails'),
  submissionId: z.string(),
  updates: z.object({
    website: z.string().url().optional(),
    slug: z.string().max(120).optional(),
    name: z.string().max(200).optional(),
    category: z.string()
      .refine(
        (value) => value.length === 0 || TOOL_SUBMISSION_CATEGORIES.includes(value as (typeof TOOL_SUBMISSION_CATEGORIES)[number]),
        { message: 'Category must be one of the supported submission categories' }
      )
      .optional(),
    features: z.string().max(3000).optional(),
    oneLiner: z.string().max(300).optional(),
    description: z.string().max(10000).optional(),
    country: z.string().max(120).optional(),
    city: z.string().max(120).optional(),
    iconLink: z.union([z.literal(''), z.string().url()]).optional(),
    researchStatus: z.enum(['pending', 'completed', 'failed']).optional(),
  }).strict(),
});

const retryResearchSchema = z.object({
  action: z.literal('retryResearch'),
  submissionId: z.string(),
});

const submissionPatchSchema = z.discriminatedUnion('action', [
  updateStatusSchema,
  updateDetailsSchema,
  retryResearchSchema,
]);

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
    const validatedData = submissionPatchSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validatedData.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    const action = validatedData.data;

    if (action.action === 'updateStatus') {
      const success = await updateSubmissionStatus(action.submissionId, action.status);

      if (!success) {
        return NextResponse.json(
          { error: 'Submission not found or could not be updated' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: `Submission status updated to ${action.status}`,
      });
    }

    if (action.action === 'updateDetails') {
      const updatedSubmission = await updateToolSubmission(action.submissionId, action.updates);

      if (!updatedSubmission) {
        return NextResponse.json(
          { error: 'Submission not found or could not be updated' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Submission details updated',
        submission: updatedSubmission,
      });
    }

    if (!isPerplexityConfigured()) {
      return NextResponse.json(
        { error: 'Automated research is unavailable because Perplexity is not configured.' },
        { status: 503 }
      );
    }

    const existingSubmission = await getToolSubmissionById(action.submissionId);

    if (!existingSubmission) {
      return NextResponse.json(
        { error: 'Submission not found' },
        { status: 404 }
      );
    }

    const researchResult = await researchToolWithPerplexity(
      existingSubmission.website,
      existingSubmission.comment
    );
    const researchStatus = researchResult.research_status as ToolResearchStatus;

    const researchUpdates = researchResult.research_status === 'completed'
      ? {
          website: researchResult.website,
          slug: researchResult.slug,
          name: researchResult.name,
          category: researchResult.category,
          features: researchResult.features,
          oneLiner: researchResult.one_liner,
          description: researchResult.description,
          country: researchResult.country || '',
          city: researchResult.city || '',
          iconLink: researchResult.icon_link || '',
          researchStatus,
        }
      : {
          researchStatus,
          oneLiner: researchResult.one_liner,
          description: researchResult.description,
          ...(existingSubmission.name === 'Research Failed' || !existingSubmission.name
            ? { name: researchResult.name }
            : {}),
          ...(existingSubmission.category === 'Unknown' || !existingSubmission.category
            ? { category: researchResult.category }
            : {}),
          ...(existingSubmission.features === 'Research in progress' || !existingSubmission.features
            ? { features: researchResult.features }
            : {}),
        };

    const updatedSubmission = await updateToolSubmission(action.submissionId, researchUpdates);

    if (!updatedSubmission) {
      return NextResponse.json(
        { error: 'Submission research completed, but the updated submission could not be saved' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: researchResult.research_status === 'completed'
        ? 'Automated research completed and submission details were refreshed.'
        : 'Automated research ran again, but still needs manual review.',
      submission: updatedSubmission,
    });
  } catch (error) {
    console.error('Error updating submission:', error);
    return NextResponse.json(
      { error: 'Failed to update submission' },
      { status: 500 }
    );
  }
}
