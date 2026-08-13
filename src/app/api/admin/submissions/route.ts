import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  deleteToolSubmission,
  getToolSubmissionById,
  getToolSubmissions,
  ToolResearchStatus,
  updateSubmissionStatus,
  updateToolSubmission,
} from '@/lib/supabase';
import { generateSEOSlug, isValidSlug, isValidSlugFormat } from '@/lib/routing-utils';
import {
  createAdminUnauthorizedApiResponse,
  isAuthenticatedAdminApiRequest,
} from '@/lib/admin-auth';
import {
  isResearchProviderConfigured,
  isSupabaseAdminConfigured,
  isSupabaseStorageConfigured,
} from '@/lib/tool-submissions-config';
import { researchTool } from '@/lib/tool-research';
import { TOOL_SUBMISSION_CATEGORIES } from '@/lib/tool-submission-categories';
import { publishToolFromSubmission } from '@/lib/supabase-admin';
import { getCategoryDisplayName } from '@/lib/utils';
import {
  finalizeAutoPublishDraft,
  verifyAutoPublishDraft,
  type MergedPublishDraft,
} from '@/lib/submission-auto-publish';

const editableSubmissionFieldsSchema = z.object({
  website: z.string().url().optional(),
  slug: z.string().max(120).optional(),
  name: z.string().max(200).optional(),
  category: z.string()
    .refine(
      (value) => value.length === 0 || (TOOL_SUBMISSION_CATEGORIES as readonly string[]).includes(value),
      { message: 'Category must be one of the supported directory categories' }
    )
    .optional(),
  features: z.string().max(3000).optional(),
  oneLiner: z.string().max(300).optional(),
  description: z.string().max(10000).optional(),
  country: z.string().max(120).optional(),
  city: z.string().max(120).optional(),
  iconLink: z.union([z.literal(''), z.string().url()]).optional(),
  researchStatus: z.enum(['pending', 'completed', 'failed']).optional(),
}).strict();

const updateStatusSchema = z.object({
  action: z.literal('updateStatus'),
  submissionId: z.string(),
  status: z.enum(['pending', 'approved', 'rejected']),
});

const updateDetailsSchema = z.object({
  action: z.literal('updateDetails'),
  submissionId: z.string(),
  updates: editableSubmissionFieldsSchema,
});

const retryResearchSchema = z.object({
  action: z.literal('retryResearch'),
  submissionId: z.string(),
});

const publishSubmissionSchema = z.object({
  action: z.literal('publishSubmission'),
  submissionId: z.string(),
  updates: editableSubmissionFieldsSchema,
});

const acceptAutoPublishSchema = z.object({
  action: z.literal('acceptAutoPublish'),
  submissionId: z.string(),
});

const deleteSubmissionSchema = z.object({
  action: z.literal('deleteSubmission'),
  submissionId: z.string(),
});

const submissionPatchSchema = z.discriminatedUnion('action', [
  acceptAutoPublishSchema,
  updateStatusSchema,
  updateDetailsSchema,
  retryResearchSchema,
  publishSubmissionSchema,
  deleteSubmissionSchema,
]);

type EditableSubmissionFields = z.infer<typeof editableSubmissionFieldsSchema>;

function trimValue(value: string | undefined) {
  if (value === undefined) {
    return undefined;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function pickPreferredValue(...values: Array<string | undefined>) {
  for (const value of values) {
    const trimmed = trimValue(value);

    if (trimmed) {
      return trimmed;
    }
  }

  return '';
}

function buildSlugCandidate(manualSlug: string | undefined, researchSlug: string | undefined, fallbackName: string) {
  const candidate = pickPreferredValue(manualSlug, researchSlug);

  if (candidate && isValidSlugFormat(candidate) && isValidSlug(candidate)) {
    return candidate;
  }

  return generateSEOSlug(candidate || fallbackName);
}

function buildPublishDraft(params: {
  submission: Awaited<ReturnType<typeof getToolSubmissionById>>;
  researchResult: Awaited<ReturnType<typeof researchTool>>;
  manualOverrides: EditableSubmissionFields;
}) {
  const submission = params.submission;

  if (!submission) {
    return null;
  }

  const name = pickPreferredValue(
    params.manualOverrides.name,
    params.researchResult.name,
    submission.name
  );

  return {
    website: pickPreferredValue(
      params.manualOverrides.website,
      params.researchResult.website,
      submission.website
    ),
    slug: buildSlugCandidate(
      params.manualOverrides.slug,
      params.researchResult.slug,
      name
    ),
    name,
    category: pickPreferredValue(
      params.manualOverrides.category,
      params.researchResult.category,
      submission.category
    ),
    features: pickPreferredValue(
      params.manualOverrides.features,
      params.researchResult.features,
      submission.features
    ),
    oneLiner: pickPreferredValue(
      params.manualOverrides.oneLiner,
      params.researchResult.one_liner,
      submission.oneLiner
    ),
    description: pickPreferredValue(
      params.manualOverrides.description,
      params.researchResult.description,
      submission.description
    ),
    country: pickPreferredValue(
      params.manualOverrides.country,
      params.researchResult.country,
      submission.country
    ),
    city: pickPreferredValue(
      params.manualOverrides.city,
      params.researchResult.city,
      submission.city
    ),
    iconLink: pickPreferredValue(
      params.manualOverrides.iconLink,
      params.researchResult.icon_link,
      submission.iconLink
    ),
  };
}

function validatePublishDraft(draft: ReturnType<typeof buildPublishDraft>) {
  if (!draft) {
    return 'Submission not found.';
  }

  if (!draft.website) {
    return 'Website is required before publishing.';
  }

  if (!draft.name) {
    return 'Name is required before publishing.';
  }

  if (!draft.slug || !isValidSlugFormat(draft.slug) || !isValidSlug(draft.slug)) {
    return 'Slug must use lowercase letters, numbers, and hyphens, and it cannot conflict with a reserved route.';
  }

  if (!draft.category) {
    return 'Category is required before publishing.';
  }

  if (!draft.oneLiner) {
    return 'Tagline is required before publishing.';
  }

  if (!draft.description) {
    return 'Description is required before publishing.';
  }

  return null;
}

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

    if (action.action === 'acceptAutoPublish') {
      if (!isSupabaseAdminConfigured()) {
        return NextResponse.json(
          { error: 'Live publishing is unavailable because the Supabase service role key is not configured.' },
          { status: 503 }
        );
      }

      if (!isResearchProviderConfigured()) {
        return NextResponse.json(
          {
            error:
              'Automatic accept requires OpenAI research. Set OPENAI_API_KEY, or use “Publish using form fields” instead.',
          },
          { status: 503 }
        );
      }

      const submission = await getToolSubmissionById(action.submissionId);

      if (!submission) {
        return NextResponse.json(
          { error: 'Submission not found.' },
          { status: 404 }
        );
      }

      const researchResult = await researchTool(submission.website, submission.comment);
      const researchStatus = researchResult.research_status as ToolResearchStatus;

      const merged = buildPublishDraft({
        submission,
        researchResult,
        manualOverrides: {},
      });

      if (!merged) {
        return NextResponse.json(
          { error: 'Could not build a publish draft from this submission.' },
          { status: 500 }
        );
      }

      const draft = finalizeAutoPublishDraft(merged as MergedPublishDraft, {
        website: submission.website,
        comment: submission.comment,
      });

      const verifyError = verifyAutoPublishDraft(draft);
      if (verifyError) {
        const partial = await updateToolSubmission(action.submissionId, {
          researchStatus,
          name: draft.name,
          category: draft.category,
          oneLiner: draft.oneLiner,
          description: draft.description,
          features: draft.features,
          slug: draft.slug,
        });

        return NextResponse.json(
          {
            error: `Auto-publish verification failed: ${verifyError}`,
            submission: partial,
          },
          { status: 422 }
        );
      }

      const publishValidationError = validatePublishDraft(draft);

      if (publishValidationError) {
        const partial = await updateToolSubmission(action.submissionId, {
          researchStatus,
          name: draft.name,
          category: draft.category,
          oneLiner: draft.oneLiner,
          description: draft.description,
          features: draft.features,
          slug: draft.slug,
        });

        return NextResponse.json(
          {
            error: publishValidationError,
            submission: partial,
          },
          { status: 422 }
        );
      }

      try {
        const publishedTool = await publishToolFromSubmission({ draft });
        const finalizedSubmission = await updateToolSubmission(action.submissionId, {
          website: publishedTool.websiteUrl,
          slug: publishedTool.slug,
          name: publishedTool.name,
          category: getCategoryDisplayName(publishedTool.category),
          features: publishedTool.features.join(', '),
          oneLiner: publishedTool.oneLiner,
          description: publishedTool.description,
          country: publishedTool.country,
          city: publishedTool.city,
          iconLink: publishedTool.iconUrl,
          researchStatus,
        });

        if (!finalizedSubmission) {
          return NextResponse.json(
            { error: 'The tool was published, but the submission record could not be updated afterward.' },
            { status: 500 }
          );
        }

        const statusUpdated = await updateSubmissionStatus(action.submissionId, 'approved');

        if (!statusUpdated) {
          return NextResponse.json(
            { error: 'The tool was published, but the submission status could not be marked as approved.' },
            { status: 500 }
          );
        }

        const approvedSubmission = await getToolSubmissionById(action.submissionId);

        return NextResponse.json({
          success: true,
          message:
            'Researched, auto-verified, and published to the live directory.',
          submission: approvedSubmission ?? finalizedSubmission,
          tool: publishedTool,
        });
      } catch (publishError) {
        const message =
          publishError instanceof Error ? publishError.message : 'Publish failed';
        await updateToolSubmission(action.submissionId, {
          researchStatus,
          name: draft.name,
          category: draft.category,
          oneLiner: draft.oneLiner,
          description: draft.description,
          features: draft.features,
          slug: draft.slug,
        });

        return NextResponse.json(
          { error: message },
          { status: 500 }
        );
      }
    }

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

    if (action.action === 'deleteSubmission') {
      const existingSubmission = await getToolSubmissionById(action.submissionId);

      if (!existingSubmission) {
        return NextResponse.json(
          { error: 'Submission not found' },
          { status: 404 }
        );
      }

      const success = await deleteToolSubmission(action.submissionId);

      if (!success) {
        return NextResponse.json(
          { error: 'Submission could not be deleted' },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        message: 'Submission permanently deleted',
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

    if (action.action === 'publishSubmission') {
      if (!isSupabaseAdminConfigured()) {
        return NextResponse.json(
          { error: 'Live publishing is unavailable because the Supabase service role key is not configured.' },
          { status: 503 }
        );
      }

      const preparedSubmission = Object.keys(action.updates).length > 0
        ? await updateToolSubmission(action.submissionId, action.updates)
        : await getToolSubmissionById(action.submissionId);

      if (!preparedSubmission) {
        return NextResponse.json(
          { error: 'Submission not found or could not be prepared for publishing.' },
          { status: 404 }
        );
      }

      /** When no OpenAI key is set, admins publish using only saved submission + form fields. */
      const researchResult = isResearchProviderConfigured()
        ? await researchTool(
          preparedSubmission.website,
          preparedSubmission.comment
        )
        : {
            is_relevant: true,
            confidence: 1,
            relevance_reason: 'Publishing from administrator-provided fields without automated research.',
            evidence: [],
            model: 'admin-fields',
            response_id: '',
            slug: '',
            website: preparedSubmission.website,
            name: '',
            category: '',
            features: '',
            one_liner: '',
            description: '',
            country: '',
            city: '',
            icon_link: '',
            research_status: 'completed' as const,
          };
      const researchStatus = researchResult.research_status as ToolResearchStatus;
      const publishDraft = buildPublishDraft({
        submission: preparedSubmission,
        researchResult,
        manualOverrides: action.updates,
      });
      const publishValidationError = validatePublishDraft(publishDraft);

      if (publishValidationError) {
        const failedSubmission = await updateToolSubmission(action.submissionId, {
          researchStatus,
          oneLiner: researchResult.one_liner,
          description: researchResult.description,
        });

        return NextResponse.json(
          {
            error: publishValidationError,
            submission: failedSubmission,
          },
          { status: 422 }
        );
      }

      const publishedTool = await publishToolFromSubmission({ draft: publishDraft! });
      const finalizedSubmission = await updateToolSubmission(action.submissionId, {
        website: publishedTool.websiteUrl,
        slug: publishedTool.slug,
        name: publishedTool.name,
        category: getCategoryDisplayName(publishedTool.category),
        features: publishedTool.features.join(', '),
        oneLiner: publishedTool.oneLiner,
        description: publishedTool.description,
        country: publishedTool.country,
        city: publishedTool.city,
        iconLink: publishedTool.iconUrl,
        researchStatus,
      });

      if (!finalizedSubmission) {
        return NextResponse.json(
          { error: 'The tool was published, but the submission record could not be updated afterward.' },
          { status: 500 }
        );
      }

      const statusUpdated = await updateSubmissionStatus(action.submissionId, 'approved');

      if (!statusUpdated) {
        return NextResponse.json(
          { error: 'The tool was published, but the submission status could not be marked as approved.' },
          { status: 500 }
        );
      }

      const approvedSubmission = await getToolSubmissionById(action.submissionId);

      return NextResponse.json({
        success: true,
        message: 'Submission accepted, researched, and published to the live directory.',
        submission: approvedSubmission ?? finalizedSubmission,
        tool: publishedTool,
      });
    }

    if (!isResearchProviderConfigured()) {
      return NextResponse.json(
        { error: 'Automated research is unavailable because no research provider is configured.' },
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

    const researchResult = await researchTool(
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
      { error: error instanceof Error ? error.message : 'Failed to update submission' },
      { status: 500 }
    );
  }
}
