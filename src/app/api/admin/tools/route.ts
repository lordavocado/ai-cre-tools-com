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
import {
  TOOL_ASSET_CLASS_OPTIONS,
  TOOL_DEPLOYMENT_OPTIONS,
  TOOL_EDITORIAL_STATUSES,
  TOOL_PERSONA_OPTIONS,
  TOOL_PRICING_MODELS,
  TOOL_PRICING_PERIODS,
  TOOL_WORKFLOW_OPTIONS,
  type ToolAssetClass,
  type ToolDeployment,
  type ToolEditorialStatus,
  type ToolPersona,
  type ToolPricingModel,
  type ToolPricingPeriod,
  type ToolWorkflow,
} from '@/config/tool-taxonomy';

const optionValues = (options: ReadonlyArray<{ value: string }>) => new Set(options.map((option) => option.value));
const workflowValues = optionValues(TOOL_WORKFLOW_OPTIONS);
const personaValues = optionValues(TOOL_PERSONA_OPTIONS);
const assetClassValues = optionValues(TOOL_ASSET_CLASS_OPTIONS);
const deploymentValues = optionValues(TOOL_DEPLOYMENT_OPTIONS);
const pricingModelValues = optionValues(TOOL_PRICING_MODELS);
const pricingPeriodValues = optionValues(TOOL_PRICING_PERIODS);
const editorialStatusValues = optionValues(TOOL_EDITORIAL_STATUSES);

const trimmedStringArray = z.array(z.string().trim().min(1).max(160)).max(50);
const urlArray = z.array(z.string().url()).max(20);
const controlledValue = <T extends string>(values: Set<string>, label: string) =>
  z.custom<T>((value) => typeof value === 'string' && values.has(value), `Invalid ${label}`);

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
  workflows: z.array(controlledValue<ToolWorkflow>(workflowValues, 'workflow')).max(TOOL_WORKFLOW_OPTIONS.length),
  personas: z.array(controlledValue<ToolPersona>(personaValues, 'persona')).max(TOOL_PERSONA_OPTIONS.length),
  assetClasses: z.array(controlledValue<ToolAssetClass>(assetClassValues, 'asset class')).max(TOOL_ASSET_CLASS_OPTIONS.length),
  integrations: trimmedStringArray,
  geographicCoverage: trimmedStringArray,
  deploymentOptions: z.array(controlledValue<ToolDeployment>(deploymentValues, 'deployment option')).max(TOOL_DEPLOYMENT_OPTIONS.length),
  securityCertifications: trimmedStringArray,
  inputTypes: trimmedStringArray,
  outputTypes: trimmedStringArray,
  limitations: trimmedStringArray,
  pricingModel: controlledValue<ToolPricingModel>(pricingModelValues, 'pricing model'),
  startingPriceAmount: z.number().nonnegative().nullable(),
  startingPriceCurrency: z.string().trim().regex(/^$|^[A-Za-z]{3}$/, 'Use a three-letter ISO currency code').optional(),
  pricingPeriod: controlledValue<ToolPricingPeriod>(pricingPeriodValues, 'pricing period').nullable(),
  hasFreeTrial: z.boolean().nullable(),
  hasFreePlan: z.boolean().nullable(),
  bestFor: z.string().trim().max(500).optional(),
  sourceUrls: urlArray,
  lastVerifiedAt: z.string().datetime({ offset: true }).or(z.literal('')).optional(),
  editorialStatus: controlledValue<ToolEditorialStatus>(editorialStatusValues, 'editorial status'),
  pseoEligible: z.boolean(),
}).superRefine((value, context) => {
  if (value.editorialStatus === 'verified' && (!value.lastVerifiedAt || value.sourceUrls.length === 0)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['editorialStatus'],
      message: 'Verified tools require a verification date and at least one source URL',
    });
  }

  if (value.pseoEligible && value.editorialStatus !== 'verified' && value.editorialStatus !== 'legacy') {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['pseoEligible'],
      message: 'Only verified or legacy tools can be included in pSEO pages',
    });
  }
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
