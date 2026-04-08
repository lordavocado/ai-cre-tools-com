import { researchToolWithPerplexity } from '@/lib/perplexity';
import { researchToolWithTavily } from '@/lib/tavily';
import { getConfiguredResearchProvider } from '@/lib/tool-submissions-config';

export async function researchTool(website: string, userComment: string) {
  const provider = getConfiguredResearchProvider();

  if (provider === 'tavily') {
    return researchToolWithTavily(website, userComment);
  }

  if (provider === 'perplexity') {
    return researchToolWithPerplexity(website, userComment);
  }

  throw new Error('No automated research provider is configured');
}
