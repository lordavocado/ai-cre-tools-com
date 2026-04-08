/**
 * Configuration helpers for the tool submission flow.
 * These checks keep admin and submit-tool experiences honest when backend services are missing.
 */

if (typeof window !== 'undefined') {
  throw new Error('tool-submissions-config can only be used on the server side');
}

function hasRealValue(value: string | undefined) {
  return Boolean(value && !value.includes('placeholder'));
}

export function isAdminBasicAuthConfigured() {
  return Boolean(process.env.ADMIN_PASSWORD);
}

export function isSupabaseStorageConfigured() {
  return hasRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
    && hasRealValue(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY);
}

export function isSupabaseAdminConfigured() {
  return hasRealValue(process.env.NEXT_PUBLIC_SUPABASE_URL)
    && hasRealValue(process.env.SUPABASE_SERVICE_ROLE_KEY);
}

export function isPerplexityConfigured() {
  return Boolean(process.env.PERPLEXITY_API_KEY);
}

export function isTavilyConfigured() {
  return Boolean(process.env.TAVILY_API_KEY);
}

export function getConfiguredResearchProvider() {
  if (isTavilyConfigured()) {
    return 'tavily' as const;
  }

  if (isPerplexityConfigured()) {
    return 'perplexity' as const;
  }

  return null;
}

export function isResearchProviderConfigured() {
  return getConfiguredResearchProvider() !== null;
}

export function getToolSubmissionSystemStatus() {
  return {
    adminBasicAuthConfigured: isAdminBasicAuthConfigured(),
    supabaseStorageConfigured: isSupabaseStorageConfigured(),
    supabaseAdminConfigured: isSupabaseAdminConfigured(),
    researchProviderConfigured: isResearchProviderConfigured(),
    researchProvider: getConfiguredResearchProvider(),
    tavilyConfigured: isTavilyConfigured(),
    perplexityConfigured: isPerplexityConfigured(),
  };
}
