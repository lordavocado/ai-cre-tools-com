import 'server-only';

import { finalizeAutoPublishDraft, verifyAutoPublishDraft } from '@/lib/submission-auto-publish';
import {
  getAdminToolBySlug,
  normalizeWebsiteUrl,
  publishToolFromSubmission,
} from '@/lib/supabase-admin';
import {
  getToolSubmissionById,
  getToolSubmissions,
  updateSubmissionStatus,
  updateToolSubmission,
  type ToolSubmission,
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

function normalizeDuplicateName(value: string | undefined) {
  return value?.trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g, '') ?? '';
}

function websitesMatch(left: string, right: string) {
  try {
    return normalizeWebsiteUrl(left) === normalizeWebsiteUrl(right);
  } catch {
    return left.trim().toLocaleLowerCase() === right.trim().toLocaleLowerCase();
  }
}

async function findCompletedDuplicate(submission: ToolSubmission) {
  const submissions = await getToolSubmissions();
  const submissionName = normalizeDuplicateName(submission.name);

  return submissions.find((candidate) => {
    if (
      candidate.submissionId === submission.submissionId
      || candidate.researchStatus !== 'completed'
      || candidate.status === 'pending'
    ) {
      return false;
    }

    if (websitesMatch(candidate.website, submission.website)) {
      return true;
    }

    return candidate.status === 'approved'
      && submissionName.length >= 4
      && submissionName === normalizeDuplicateName(candidate.name);
  });
}

async function resolveCompletedDuplicate(
  submission: ToolSubmission
): Promise<SubmissionAutomationOutcome | null> {
  const duplicate = await findCompletedDuplicate(submission);

  if (!duplicate) {
    return null;
  }

  const duplicateReview = {
    confidence: 1,
    evidence: [{
      claim: 'This website or product already has a completed submission decision.',
      url: duplicate.website,
      sourceType: 'official' as const,
      verifiedByWebSearch: false,
    }],
    model: 'completed-submission-deduplication',
    responseId: '',
  };

  if (duplicate.status === 'rejected') {
    await updateToolSubmission(submission.submissionId, {
      website: duplicate.website,
      name: duplicate.name ?? submission.name ?? '',
      researchStatus: 'completed',
    });
    const statusUpdated = await updateSubmissionStatus(submission.submissionId, 'rejected');

    if (!statusUpdated) {
      throw new Error('The duplicate rejection decision could not be saved.');
    }

    return {
      decision: 'rejected',
      ...duplicateReview,
      reason: 'An equivalent submission was already evaluated and rejected.',
      name: pickFirst(duplicate.name, submission.name, new URL(submission.website).hostname),
      website: submission.website,
    };
  }

  if (!duplicate.slug) {
    return null;
  }

  const existingTool = await getAdminToolBySlug(duplicate.slug);

  if (!existingTool) {
    return null;
  }

  const finalizedSubmission = await updateToolSubmission(submission.submissionId, {
    website: existingTool.websiteUrl,
    slug: existingTool.slug,
    name: existingTool.name,
    category: getCategoryDisplayName(existingTool.category),
    features: existingTool.features.join(', '),
    oneLiner: existingTool.oneLiner,
    description: existingTool.description,
    country: existingTool.country,
    city: existingTool.city,
    iconLink: existingTool.iconUrl,
    researchStatus: 'completed',
  });

  if (!finalizedSubmission) {
    throw new Error('The duplicate submission record could not be synchronized.');
  }

  const statusUpdated = await updateSubmissionStatus(submission.submissionId, 'approved');

  if (!statusUpdated) {
    throw new Error('The duplicate approval decision could not be saved.');
  }

  return {
    decision: 'accepted',
    ...duplicateReview,
    reason: 'This product is already approved and live; the existing listing was preserved.',
    tool: existingTool,
  };
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

  const descriptionLength = result.description.trim().length;
  if (descriptionLength < 260 || descriptionLength > 460) {
    return 'The AI description must be a clean 260-460 characters.';
  }

  const features = result.features
    .split(result.features.includes('\n') ? /\n+/ : /,/)
    .map((feature) => feature.trim())
    .filter(Boolean);

  if (features.length < 4 || features.length > 6) {
    return 'The AI must create 4-6 verified capability tags.';
  }

  if (features.some((feature) => feature.length > 48 || /[,;:.]$/.test(feature))) {
    return 'The AI capability tags must be short phrases without punctuation.';
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

  const duplicateOutcome = await resolveCompletedDuplicate(submission);

  if (duplicateOutcome) {
    return duplicateOutcome;
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
