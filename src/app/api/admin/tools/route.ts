import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { getCategories } from '@/lib/supabase';
import { getAdminToolBySlug, listAdminTools, updateAdminTool } from '@/lib/supabase-admin';
import { normalizeToolDescription } from '@/lib/tool-content';
import { isValidSlug, isValidSlugFormat } from '@/lib/routing-utils';
import {
  createAdminUnauthorizedApiResponse,
  isAuthenticatedAdminApiRequest,
} from '@/lib/admin-auth';
import { isSupabaseAdminConfigured } from '@/lib/tool-submissions-config';

const updateToolSchema = z.object({
  originalSlug: z.string().min(1),
  slug: z.string()
    .min(1)
    .refine((value) => isValidSlugFormat(value), {
      message: 'Slug must use lowercase letters, numbers, and hyphens only',
    })
    .refine((value) => isValidSlug(value), {
      message: 'Slug conflicts with a reserved site route',
    }),
  name: z.string().min(1),
  websiteUrl: z.string()
    .url({ message: 'Please enter a valid website URL' })
    .refine((url) => {
      try {
        const parsedUrl = new URL(url);
        return parsedUrl.protocol === 'http:' || parsedUrl.protocol === 'https:';
      } catch {
        return false;
      }
    }, { message: 'Website must start with http:// or https://' }),
  category: z.string().min(1),
  features: z.array(z.string().min(1)),
  oneLiner: z.string().min(10),
  description: z.string().min(50),
  country: z.string().optional(),
  city: z.string().optional(),
  iconUrl: z.string().url({ message: 'Please enter a valid icon URL' }).or(z.literal('')).optional(),
  displayOrder: z.number().int(),
});

export async function GET(request: NextRequest) {
  try {
    if (!isAuthenticatedAdminApiRequest(request)) {
      return createAdminUnauthorizedApiResponse();
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: 'Live tool editing is unavailable because the Supabase service role key is not configured.' },
        { status: 503 }
      );
    }

    const tools = await listAdminTools();
    return NextResponse.json(tools);
  } catch (error) {
    console.error('Error fetching admin tools:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch tools' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    if (!isAuthenticatedAdminApiRequest(request)) {
      return createAdminUnauthorizedApiResponse();
    }

    if (!isSupabaseAdminConfigured()) {
      return NextResponse.json(
        { error: 'Live tool editing is unavailable because the Supabase service role key is not configured.' },
        { status: 503 }
      );
    }

    const body = await request.json();
    const validatedData = updateToolSchema.safeParse(body);

    if (!validatedData.success) {
      return NextResponse.json(
        {
          error: 'Invalid request data',
          details: validatedData.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const categories = await getCategories(false);
    const validCategorySlugs = new Set(categories.map((category) => category.slug));

    if (!validCategorySlugs.has(validatedData.data.category)) {
      return NextResponse.json({ error: 'Invalid category slug' }, { status: 400 });
    }

    if (normalizeToolDescription(validatedData.data.description).length < 50) {
      return NextResponse.json(
        { error: 'Description must remain at least 50 plain-text characters after sanitization' },
        { status: 400 }
      );
    }

    if (validatedData.data.slug !== validatedData.data.originalSlug) {
      const existingTool = await getAdminToolBySlug(validatedData.data.slug);

      if (existingTool) {
        return NextResponse.json(
          { error: `Slug "${validatedData.data.slug}" is already in use by another tool` },
          { status: 409 }
        );
      }
    }

    const updatedTool = await updateAdminTool(validatedData.data);
    return NextResponse.json(updatedTool);
  } catch (error) {
    console.error('Error updating admin tool:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update tool' },
      { status: 500 }
    );
  }
}
