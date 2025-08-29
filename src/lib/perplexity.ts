import { z } from 'zod';

// Perplexity API response schema
const PerplexityResponseSchema = z.object({
  id: z.string(),
  model: z.string(),
  created: z.number(),
  usage: z.object({
    prompt_tokens: z.number(),
    completion_tokens: z.number(),
    total_tokens: z.number(),
  }),
  citations: z.array(z.string()).optional(),
  choices: z.array(z.object({
    index: z.number(),
    finish_reason: z.string(),
    message: z.object({
      role: z.string(),
      content: z.string(),
    }),
  })),
});

// Scraped tool data schema
const ScrapedToolDataSchema = z.object({
  slug: z.string(),
  website: z.string(),
  name: z.string(),
  category: z.string(),
  features: z.string(),
  one_liner: z.string(),
  description: z.string(),
  country: z.string().optional(),
  city: z.string().optional(),
  icon_link: z.string().optional(),
});

type ScrapedToolData = z.infer<typeof ScrapedToolDataSchema>;

// Platform categories for CRE AI tools
const CRE_CATEGORIES = [
  'Development & Construction',
  'Efficiency & General Tools',
  'Investment & Portfolio Management',
  'Legal & Compliance',
  'Market Analysis & Valuation',
  'Property Management & Operations',
  'Transaction & Brokerage'
];

// Generate the scraping prompt
function generateScrapingPrompt(website: string, userComment: string): string {
  return `Scrape information for the following AI-powered real estate tools - some are not direct real estate tools but can be used for commercial real estate professionals. For each tool, extract and organize the following details in a table with these columns: • slug: A URL-friendly, lowercase identifier for the tool (e.g., "openai-gpt"). • website: The official website URL of the tool. • name: The full name of the tool. • category: The main category or type of the tool from these options: ${CRE_CATEGORIES.join(', ')}. • features: A comma-separated list of the tool's main features. • one liner: A concise, one-sentence summary of what the tool does. • description: A long SEO in markdown format paragraph (1000 characters sentences) describing the product and value proposition more in details • country: The country where the company or tool is based. • city: The city where the company or tool is based (if available). • icon link: A direct link to the tool's logo or icon image (preferably a PNG or SVG).

Instructions: • Only include tools that are specifically focused on real estate and use AI as a core technology. • Ensure all fields are filled out as completely as possible. • If a field (like city) is not available, leave it blank. • For icon link, provide a direct image URL (not a webpage).

Website to research: ${website}
User's comment on relevance: ${userComment}

Please provide the extracted information in JSON format with the following structure:
{
  "slug": "",
  "website": "",
  "name": "",
  "category": "",
  "features": "",
  "one_liner": "",
  "description": "",
  "country": "",
  "city": "",
  "icon_link": ""
}`;
}

// Call Perplexity API
async function callPerplexityAPI(prompt: string): Promise<string> {
  const apiKey = process.env.PERPLEXITY_API_KEY;

  if (!apiKey) {
    throw new Error('PERPLEXITY_API_KEY environment variable is not set');
  }

  const response = await fetch('https://api.perplexity.ai/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'llama-3.1-sonar-large-128k-online',
      messages: [
        {
          role: 'system',
          content: 'You are a helpful assistant that extracts and organizes information about AI tools for commercial real estate professionals. Always respond with valid JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      max_tokens: 2000,
      temperature: 0.2,
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Perplexity API error: ${response.status} - ${errorData}`);
  }

  const data = PerplexityResponseSchema.parse(await response.json());
  return data.choices[0]?.message?.content || '';
}

// Parse the JSON response from Perplexity
function parseToolData(jsonString: string): ScrapedToolData {
  try {
    // Extract JSON from the response (in case there's additional text)
    const jsonMatch = jsonString.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in Perplexity response');
    }

    const jsonData = JSON.parse(jsonMatch[0]);
    return ScrapedToolDataSchema.parse(jsonData);
  } catch (error) {
    console.error('Error parsing tool data:', error);
    throw new Error('Failed to parse tool information from Perplexity response');
  }
}

// Main function to research a tool using Perplexity
export async function researchToolWithPerplexity(
  website: string,
  userComment: string
): Promise<ScrapedToolData & { research_status: string }> {
  try {
    const prompt = generateScrapingPrompt(website, userComment);
    const rawResponse = await callPerplexityAPI(prompt);
    const toolData = parseToolData(rawResponse);

    return {
      ...toolData,
      research_status: 'completed',
    };
  } catch (error) {
    console.error('Perplexity research error:', error);

    // Return partial data with error status
    return {
      slug: `tool_${Date.now()}`,
      website,
      name: 'Research Failed',
      category: 'Unknown',
      features: 'Research in progress',
      one_liner: 'Tool research failed - manual review required',
      description: `Failed to automatically research this tool. Manual review required. User comment: ${userComment}`,
      country: '',
      city: '',
      icon_link: '',
      research_status: 'failed',
    };
  }
}

// Export categories for use in other parts of the app
export { CRE_CATEGORIES };

