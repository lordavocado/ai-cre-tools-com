/**
 * API route for handling tool submissions
 * Validates submissions, runs autonomous editorial review, and publishes accepted tools.
 * @fileoverview End-to-end AI tool submission and publishing API
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import {
  notifyToolSubmissionDecision,
  notifyToolSubmissionFailure,
} from '@/lib/submission-notifications';
import { automateToolSubmission } from '@/lib/submission-automation';
import { storeToolSubmission } from '@/lib/supabase';
import {
  isResearchProviderConfigured,
  isSupabaseAdminConfigured,
  isSupabaseStorageConfigured,
} from '@/lib/tool-submissions-config';
import { TOOL_SUBMISSION_CATEGORIES } from '@/lib/tool-submission-categories';

const submitToolSchema = z.object({
  website: z.string()
    .url({ message: "Please enter a valid website URL" })
    .refine((url) => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
      } catch {
        return false;
      }
    }, { message: "Website must start with http:// or https://" }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  comment: z.string()
    .min(10, { message: "Please provide at least 10 characters explaining why this tool is relevant" })
    .max(500, { message: "Comment must be less than 500 characters" }),
  /** Optional; helps the queue when automated research is off or weak */
  name: z.string().max(200).optional(),
  /** Optional; must be a directory display label when set */
  category: z.string().max(120).optional(),
}).superRefine((data, ctx) => {
  const category = data.category?.trim();
  if (category && !(TOOL_SUBMISSION_CATEGORIES as readonly string[]).includes(category)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Please choose a category from the list or leave it blank.',
      path: ['category'],
    });
  }
});

const submissionAttempts = new Map<string, { count: number; resetsAt: number }>();
const SUBMISSION_LIMIT = 5;
const SUBMISSION_WINDOW_MS = 60 * 60 * 1000;

export const maxDuration = 120;

function getClientKey(request: NextRequest) {
  return request.headers.get('cf-connecting-ip')
    ?? request.headers.get('x-real-ip')
    ?? request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? 'unknown';
}

function isRateLimited(request: NextRequest) {
  const now = Date.now();
  const key = getClientKey(request);
  const attempt = submissionAttempts.get(key);

  if (!attempt || attempt.resetsAt <= now) {
    submissionAttempts.set(key, { count: 1, resetsAt: now + SUBMISSION_WINDOW_MS });
    return false;
  }

  attempt.count += 1;
  return attempt.count > SUBMISSION_LIMIT;
}

export async function POST(request: NextRequest) {
  let storedSubmissionId: string | null = null;
  let submittedWebsite = '';

  try {
    if (!isSupabaseStorageConfigured() || !isSupabaseAdminConfigured() || !isResearchProviderConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Automated tool review is temporarily unavailable. Please try again soon.'
        },
        { status: 503 }
      );
    }

    const body = await request.json();
    const validatedData = submitToolSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid form data',
          errors: validatedData.error.flatten().fieldErrors
        },
        { status: 400 }
      );
    }

    if (isRateLimited(request)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Too many submissions from this connection. Please try again later.',
        },
        { status: 429 }
      );
    }

    const { website, email, comment, name, category } = validatedData.data;
    submittedWebsite = website;
    const trimmedName = name?.trim() ?? '';
    const trimmedCategory = category?.trim() ?? '';

    const submissionId = await storeToolSubmission({
      website,
      email,
      comment,
      slug: '',
      name: trimmedName,
      category: trimmedCategory,
      features: '',
      oneLiner: '',
      description: '',
      country: '',
      city: '',
      iconLink: '',
      researchStatus: 'pending',
      submittedAt: new Date().toISOString(),
      status: 'pending',
    });
    storedSubmissionId = submissionId;

    const outcome = await automateToolSubmission(submissionId);

    try {
      await notifyToolSubmissionDecision({
        submissionId,
        submitterEmail: email,
        outcome,
      });
    } catch (notificationError) {
      console.error('Tool submission decision email failed:', notificationError);
    }

    if (outcome.decision === 'rejected') {
      return NextResponse.json({
        success: true,
        decision: 'rejected',
        message: 'This tool is not a fit for the AI CRE Tools directory at this time.',
        reason: outcome.reason,
        submissionId,
      }, { status: 200 });
    }

    if (outcome.decision === 'needs_attention') {
      return NextResponse.json({
        success: true,
        decision: 'needs_attention',
        message: 'The automated review needs a quick manual check. Your submission has been saved.',
        reason: outcome.reason,
        submissionId,
      }, { status: 200 });
    }

    return NextResponse.json({
      success: true,
      decision: 'accepted',
      message: 'Approved. It will be online within 5 minutes.',
      submissionId,
      tool: {
        name: outcome.tool.name,
        slug: outcome.tool.slug,
        category: outcome.tool.category,
        tagline: outcome.tool.oneLiner,
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Tool submission error:', error);

    if (storedSubmissionId && submittedWebsite) {
      const message = error instanceof Error ? error.message : 'Unknown automation error';
      try {
        await notifyToolSubmissionFailure({
          submissionId: storedSubmissionId,
          website: submittedWebsite,
          error: message,
        });
      } catch (notificationError) {
        console.error('Tool submission failure email failed:', notificationError);
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: storedSubmissionId
          ? 'We saved your submission, but the automated review could not finish. It has been kept for follow-up.'
          : 'The submission could not be saved. Please try again.'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
