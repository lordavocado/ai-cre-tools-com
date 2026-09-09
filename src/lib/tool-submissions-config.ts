/**
 * Configuration helpers for the tool submission flow.
 * These checks keep admin and submit-tool experiences honest when backend services are missing.
 */

if (typeof window !== 'undefined') {
  throw new Error('tool-submissions-config can only be used on the server side');
}

/** Cost-balanced GPT-5.6 tier used by the autonomous submission evaluator. */
export const DEFAULT_TOOL_SUBMISSION_MODEL = 'openai/gpt-5.6-luna';
const DEFAULT_OPENAI_MODEL = 'gpt-5.6-luna';

type ResearchProvider = 'openrouter' | 'openai';

export function isOpenAIConfigured() {
  return hasRealValue(process.env.OPENAI_API_KEY);
}

function isOpenRouterConfigured() {
  return hasRealValue(process.env.OPENROUTER_API_KEY);
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
    && (
      hasRealValue(process.env.SUPABASE_SECRET_KEY)
      || hasRealValue(process.env.SUPABASE_SERVICE_ROLE_KEY)
    );
}

export function getConfiguredResearchProvider() {
  if (isOpenRouterConfigured()) {
    return 'openrouter' as ResearchProvider;
  }

  return isOpenAIConfigured() ? 'openai' as ResearchProvider : null;
}

export function isResearchProviderConfigured() {
  return isOpenRouterConfigured() || isOpenAIConfigured();
}

export function getToolSubmissionSystemStatus() {
  const configuredResearchProvider = getConfiguredResearchProvider();
  return {
    adminBasicAuthConfigured: isAdminBasicAuthConfigured(),
    supabaseStorageConfigured: isSupabaseStorageConfigured(),
    supabaseAdminConfigured: isSupabaseAdminConfigured(),
    researchProviderConfigured: isResearchProviderConfigured(),
    researchProvider: getConfiguredResearchProvider(),
    openAIConfigured: isOpenAIConfigured(),
    researchModel: process.env.OPENAI_TOOL_SUBMISSION_MODEL?.trim()
      || (configuredResearchProvider === 'openai'
        ? DEFAULT_OPENAI_MODEL
        : DEFAULT_TOOL_SUBMISSION_MODEL),
  };
}
