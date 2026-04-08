/**
 * API route for handling tool submissions
 * Validates submissions and stores them for later admin review.
 * @fileoverview Tool submission API with validation and queue storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { storeToolSubmission } from '@/lib/supabase';
import { isSupabaseStorageConfigured } from '@/lib/tool-submissions-config';

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

    const { website, email, comment } = validatedData.data;

    const submissionId = await storeToolSubmission({
      website,
      email,
      comment,
      slug: '',
      name: '',
      category: '',
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
