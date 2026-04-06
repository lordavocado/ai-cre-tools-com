/**
 * API route for handling tool submissions
 * Validates submissions, researches tools via Perplexity API, and stores in Google Sheets
 * @fileoverview Tool submission API with validation, research, and storage
 */

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { researchToolWithPerplexity } from '@/lib/perplexity';
import { storeToolSubmission } from '@/lib/supabase';

/**
 * Validation schema for tool submission form data
 * Ensures website URL validity and email format compliance
 */
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

type SubmitToolData = z.infer<typeof submitToolSchema>;

/**
 * Handles POST requests for tool submissions
 * @param request - NextRequest containing tool submission data
 * @returns NextResponse with success/error status and message
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate the request body
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

    // Research tool using Perplexity API
    const researchResult = await researchToolWithPerplexity(website, comment);

    // Prepare submission data for storage
    const submissionData = {
      website: researchResult.website,
      email: email,
      comment: comment,
      slug: researchResult.slug,
      name: researchResult.name,
      category: researchResult.category,
      features: researchResult.features,
      oneLiner: researchResult.one_liner,
      description: researchResult.description,
      country: researchResult.country || '',
      city: researchResult.city || '',
      iconLink: researchResult.icon_link,
      researchStatus: researchResult.research_status,
      submittedAt: new Date().toISOString(),
      status: 'pending' as const,
    };

    const submissionId = await storeToolSubmission(submissionData);

    // Future enhancement: Send confirmation email to user

    return NextResponse.json({
      success: true,
      message: 'Your tool submission has been received! We will research this tool and review it for inclusion in our directory. You will receive an email update within 2-3 business days.',
      submissionId
    });

  } catch (error) {
    // Log error for debugging (only in development)
    if (process.env.NODE_ENV === 'development') {
      console.error('Tool submission error:', error);
    }

    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred while processing your submission. Please try again later.'
      },
      { status: 500 }
    );
  }
}

/**
 * Handles OPTIONS requests for CORS support
 * @returns NextResponse with 200 status for preflight requests
 */
export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}
