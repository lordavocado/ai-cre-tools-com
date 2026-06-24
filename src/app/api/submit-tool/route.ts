/**
 * API route for handling tool submissions
 * Validates submissions and stores them for later admin review.
 * @fileoverview Tool submission API with validation and queue storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { notifyNewToolSubmission } from '@/lib/submission-notifications';
import { storeToolSubmission } from '@/lib/supabase';
import { isSupabaseStorageConfigured } from '@/lib/tool-submissions-config';
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

export async function POST(request: NextRequest) {
  try {
    if (!isSupabaseStorageConfigured()) {
      return NextResponse.json(
        {
          success: false,
          message: 'Tool submissions are temporarily unavailable because submission storage is not configured.'
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

    const { website, email, comment, name, category } = validatedData.data;
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

    try {
      await notifyNewToolSubmission({
        submissionId,
        website,
        email,
        comment,
        name: trimmedName || undefined,
        category: trimmedCategory || undefined,
      });
    } catch (notificationError) {
      console.error('Tool submission notification email failed:', notificationError);
    }

    return NextResponse.json({
      success: true,
      message: 'Your tool submission has been received and is now queued for review.',
      submissionId,
      researchStatus: 'pending',
    }, { status: 200 });

  } catch (error) {
    console.error('Tool submission error:', error);

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred while processing your submission. Please try again later.'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
