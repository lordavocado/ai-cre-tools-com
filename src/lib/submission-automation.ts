import 'server-only';

import { finalizeAutoPublishDraft, verifyAutoPublishDraft } from '@/lib/submission-auto-publish';
import { publishToolFromSubmission } from '@/lib/supabase-admin';
import {
  getToolSubmissionById,
  updateSubmissionStatus,
  updateToolSubmission,
  type ToolResearchStatus,
} from '@/lib/supabase';
import {
  researchTool,
  type ToolResearchEvidence,
  type ToolResearchResult,
} from '@/lib/tool-research';
import { getCategoryDisplayName } from '@/lib/utils';
import type { AdminTool } from '@/types';

type SubmissionAutomationReview = {
  reason: string;
  confidence: number;
  evidence: ToolResearchEvidence[];
  model: string;
  responseId: string;
};

export type SubmissionAutomationOutcome = SubmissionAutomationReview & (
  | {
      decision: 'accepted';
      tool: AdminTool;
    }
  | {
      decision: 'rejected';
      name: string;
      website: string;
    }
  | {
      decision: 'needs_attention';
      name: string;
      website: string;
    }
);

function pickFirst(...values: Array<string | undefined>) {
  return values.find((value) => Boolean(value?.trim()))?.trim() ?? '';
}

function researchUpdates(result: ToolResearchResult) {
  return {
    website: result.website,
    slug: result.slug,
    name: result.name,
    category: result.category,
    features: result.features,
    oneLiner: result.one_liner,
    description: result.description,
    country: result.country,
    city: result.city,
    iconLink: result.icon_link,
    researchStatus: result.research_status as ToolResearchStatus,
  };
}

function verifyEditorialQuality(result: ToolResearchResult) {
  if (!result.name.trim() || result.name === 'Research Failed') {
    return 'The AI could not verify the product name.';
  }

  if (result.one_liner.trim().length < 20) {
    return 'The AI could not create a sufficiently specific tagline.';
  }

  if (result.description.trim().length < 120) {
    return 'The AI could not create a sufficiently complete description.';
  }

  const features = result.features
    .split(/[\n,]/)
    .map((feature) => feature.trim())
    .filter(Boolean);

  if (features.length < 3) {
    return 'The AI could not verify enough concrete product capabilities.';
  }

  return null;
}

/**
 * Runs the full public-submission workflow: research, relevance decision,
 * editorial drafting, live publication, and queue status synchronization.
 */
export async function automateToolSubmission(submissionId: string): Promise<SubmissionAutomationOutcome> {
  const submission = await getToolSubmissionById(submissionId);

  if (!submission) {
    throw new Error('The saved submission could not be loaded for automated review.');
  }

  const research = await researchTool(submission.website, submission.comment);
  const review = {
    reason: research.relevance_reason,
    confidence: research.confidence,
    evidence: research.evidence,
    model: research.model,
    responseId: research.response_id,
  };

  if (research.research_status !== 'completed') {
    await updateToolSubmission(submissionId, {
      researchStatus: 'failed',
      oneLiner: research.one_liner,
      description: research.description,
    });
    throw new Error(`Automated research could not complete: ${research.relevance_reason}`);
  }

  await updateToolSubmission(submissionId, researchUpdates(research));

  if (research.is_relevant === null) {
    return {
      decision: 'needs_attention',
      ...review,
      name: pickFirst(research.name, submission.name, new URL(submission.website).hostname),
      website: submission.website,
    };
  }

  if (!research.is_relevant) {
    const statusUpdated = await updateSubmissionStatus(submissionId, 'rejected');
    if (!statusUpdated) {
      throw new Error('The rejection decision could not be saved.');
    }

    return {
      decision: 'rejected',
      ...review,
      name: pickFirst(research.name, submission.name, new URL(submission.website).hostname),
      website: submission.website,
    };
  }

  const editorialError = verifyEditorialQuality(research);
  if (editorialError) {
    await updateToolSubmission(submissionId, { researchStatus: 'failed' });
    return {
      decision: 'needs_attention',
      ...review,
      reason: editorialError,
      name: pickFirst(research.name, submission.name, new URL(submission.website).hostname),
      website: submission.website,
    };
  }

  const draft = finalizeAutoPublishDraft(
    {
      website: pickFirst(research.website, submission.website),
      slug: pickFirst(research.slug, submission.slug),
      name: pickFirst(research.name, submission.name),
      category: pickFirst(research.category, submission.category),
      features: research.features,
      oneLiner: research.one_liner,
      description: research.description,
      country: research.country,
      city: research.city,
      iconLink: research.icon_link,
    },
    {
      website: submission.website,
      comment: submission.comment,
    }
  );

  const draftError = verifyAutoPublishDraft(draft);
  if (draftError) {
    await updateToolSubmission(submissionId, { researchStatus: 'failed' });
    return {
      decision: 'needs_attention',
      ...review,
      reason: `The generated listing did not pass verification: ${draftError}`,
      name: pickFirst(research.name, submission.name, new URL(submission.website).hostname),
      website: submission.website,
    };
  }

  const publishedTool = await publishToolFromSubmission({ draft });
  const finalizedSubmission = await updateToolSubmission(submissionId, {
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
    researchStatus: 'completed',
  });

  if (!finalizedSubmission) {
    throw new Error('The tool was published, but its submission record could not be finalized.');
  }

  const statusUpdated = await updateSubmissionStatus(submissionId, 'approved');
  if (!statusUpdated) {
    throw new Error('The tool was published, but its approval status could not be saved.');
  }

  return {
    decision: 'accepted',
    ...review,
    tool: publishedTool,
  };
}
