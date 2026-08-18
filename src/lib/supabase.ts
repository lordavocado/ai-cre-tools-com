/**
 * Supabase integration for AI CRE Tools directory
 * Server-side data fetching with optimal caching and performance
 * @fileoverview Handles all Supabase operations including caching, error handling, and server-side rendering
 */

// Ensure this module only runs on server-side for optimal performance
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

import type { DirectoryItem, DirectoryListItem, Category } from '@/types';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { normalizeToolDescription } from '@/lib/tool-content';

// --- Configuration ---

// Database table
const TABLE_NAME = 'ecosystem_apps';

const DIRECTORY_ITEM_COLUMNS = [
  'slug',
  'name',
  'one_liner',
  'description',
  'category',
  'website_url',
  'icon_url',
  'screenshot_url',
  'screenshot_path',
  'features',
  'country',
  'city',
  'display_order',
  'created_at',
  'updated_at',
].join(',');

const NORMALIZED_DIRECTORY_ITEM_COLUMNS = [
  DIRECTORY_ITEM_COLUMNS,
  'workflows', 'personas', 'asset_classes', 'integrations',
  'geographic_coverage', 'deployment_options', 'security_certifications',
  'input_types', 'output_types', 'limitations', 'pricing_model',
  'starting_price_amount', 'starting_price_currency', 'pricing_period',
  'has_free_trial', 'has_free_plan', 'best_for', 'source_urls',
  'last_verified_at', 'editorial_status', 'pseo_eligible',
].join(',');

/** Database shape required by the public directory. Keep this in sync with the query above. */
type EcosystemAppRow = {
  slug: string;
  name: string;
  one_liner: string | null;
  description: string | null;
  category: string | null;
  website_url: string | null;
  icon_url: string | null;
  screenshot_url: string | null;
  screenshot_path: string | null;
  features: string[] | null;
  country: string | null;
  city: string | null;
  display_order: number | null;
  created_at: string | null;
  updated_at: string | null;
  workflows?: DirectoryItem['workflows'] | null;
  personas?: DirectoryItem['personas'] | null;
  asset_classes?: DirectoryItem['assetClasses'] | null;
  integrations?: string[] | null;
  geographic_coverage?: string[] | null;
  deployment_options?: DirectoryItem['deploymentOptions'] | null;
  security_certifications?: string[] | null;
  input_types?: string[] | null;
  output_types?: string[] | null;
  limitations?: string[] | null;
  pricing_model?: DirectoryItem['pricingModel'] | null;
  starting_price_amount?: number | string | null;
  starting_price_currency?: string | null;
  pricing_period?: DirectoryItem['pricingPeriod'] | null;
  has_free_trial?: boolean | null;
  has_free_plan?: boolean | null;
  best_for?: string | null;
  source_urls?: string[] | null;
  last_verified_at?: string | null;
  editorial_status?: DirectoryItem['editorialStatus'] | null;
  pseo_eligible?: boolean | null;
};

// --- Supabase Client Setup ---

let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseSubmissionClient: ReturnType<typeof createClient> | null = null;

/**
 * Get or create Supabase client instance with proper configuration
 * @returns Configured Supabase client
 * @throws Error if environment variables are missing or invalid
 */
function getSupabaseClient() {
  if (supabaseClient) {
    return supabaseClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not properly configured. Please set your actual Supabase project URL.');
  }
  if (!supabaseKey || supabaseKey.includes('placeholder')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY is not properly configured. Please set your actual Supabase anon key.');
  }

  try {
    supabaseClient = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false, // Server-side, no need for session persistence
      },
    });

    return supabaseClient;
  } catch (error) {
    throw new Error(`Failed to initialize Supabase client: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/** Uses a server-only elevated key for private submission records and status changes. */
function getSupabaseSubmissionClient() {
  if (supabaseSubmissionClient) {
    return supabaseSubmissionClient;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serverKey = process.env.SUPABASE_SECRET_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not properly configured.');
  }
  if (!serverKey || serverKey.includes('placeholder')) {
    throw new Error('SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY is not properly configured.');
  }

  supabaseSubmissionClient = createClient(supabaseUrl, serverKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return supabaseSubmissionClient;
}

// --- Caching Layer for Performance ---

// Enhanced caching with timestamps for server-side rendering
let allItemsCache: DirectoryItem[] | null = null;
let allItemsCacheTimestamp: number = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache for optimal performance

/**
 * Check if cache is still valid
 * @param timestamp - Cache timestamp to check
 * @returns True if cache is still valid
 */
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION_MS;
}

/**
 * Transform Supabase row to DirectoryItem interface
 * @param row - Raw row from Supabase
 * @returns Transformed DirectoryItem
 */
function transformSupabaseRowToDirectoryItem(row: EcosystemAppRow): DirectoryItem {
  const normalizedDataAvailable = row.editorial_status !== undefined;
  const startingPrice = row.starting_price_amount == null
    ? undefined
    : Number(row.starting_price_amount);

  return {
    id: row.slug, // Use slug as ID
    slug: row.slug,
    name: row.name,
    tagline: row.one_liner || '',
    description: row.description || '',
    category: row.category || '',
    website: row.website_url || '',
    imageUrl: row.icon_url || undefined,
    screenshotUrl: row.screenshot_url || undefined,
    screenshotPath: row.screenshot_path || undefined,
    features: transformFeatures(row.features || []),
    tags: row.features || [],
    country: row.country || undefined,
    city: row.city || undefined,
    workflows: row.workflows ?? [],
    personas: row.personas ?? [],
    assetClasses: row.asset_classes ?? [],
    integrations: row.integrations ?? [],
    geographicCoverage: row.geographic_coverage ?? [],
    deploymentOptions: row.deployment_options ?? [],
    securityCertifications: row.security_certifications ?? [],
    inputTypes: row.input_types ?? [],
    outputTypes: row.output_types ?? [],
    limitations: row.limitations ?? [],
    pricingModel: row.pricing_model ?? 'unknown',
    startingPriceAmount: Number.isFinite(startingPrice) ? startingPrice : undefined,
    startingPriceCurrency: row.starting_price_currency ?? undefined,
    pricingPeriod: row.pricing_period ?? undefined,
    hasFreeTrial: row.has_free_trial ?? undefined,
    hasFreePlan: row.has_free_plan ?? undefined,
    bestFor: row.best_for ?? undefined,
    sourceUrls: row.source_urls ?? [],
    lastVerifiedAt: row.last_verified_at ?? undefined,
    editorialStatus: row.editorial_status ?? 'legacy',
    pseoEligible: normalizedDataAvailable ? row.pseo_eligible === true : true,
    lastUpdated: row.updated_at || undefined,
    createdAt: row.created_at || undefined,
  };
}

function isMissingNormalizedColumnError(error: { code?: string; message?: string } | null): boolean {
  if (!error) return false;
  return error.code === '42703'
    || error.code === 'PGRST204'
    || /column .* does not exist|could not find .* column/i.test(error.message ?? '');
}

async function fetchDirectoryRows(columns: string): Promise<EcosystemAppRow[]> {
  const { data, error } = await getSupabaseClient()
    .from(TABLE_NAME)
    .select(columns)
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (error) throw error;
  return (data ?? []) as unknown as EcosystemAppRow[];
}

/**
 * Transform Supabase features array to DirectoryItem features format
 * @param features - Features array from Supabase
 * @returns Transformed features array
 */
function transformFeatures(features: string[]): { name: string; description?: string }[] {
  if (!Array.isArray(features)) {
    return [];
  }
  
  return features.map(feature => ({
    name: feature,
    description: undefined, // Supabase schema doesn't include descriptions
  }));
}

// --- Hardcoded Categories (same as Google Sheets implementation) ---

/**
 * Retrieves all hardcoded categories with optional item count calculation
 * Server-side rendered for optimal performance
 * @param includeItemCounts - Whether to calculate and include item counts for each category
 * @returns Promise resolving to array of categories
 */
export const getCategories = async (includeItemCounts: boolean = true): Promise<Category[]> => {
  const categories: Category[] = [
    {
      id: 'property-search-acquisition',
      slug: 'property-search-acquisition',
      name: 'Property Search & Acquisition',
      description: 'Tools that help investors, brokers, and occupiers discover, evaluate, and acquire new properties.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Tools that help investors, brokers, and occupiers discover, evaluate, and acquire new properties through intelligent search, matching, and analysis capabilities.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Site selection, deal sourcing, AI property search, buyer analysis, acquisition feasibility, off-market opportunity identification.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Commercial real estate professionals need to filter through large property inventories and identify off-market opportunities quickly. AI enhances speed and accuracy, helping users identify the best opportunities before competitors while reducing time spent on manual research.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-property-search-acquisition.jpg',
      itemCount: 0,
      icon: 'property-search-acquisition',
    },
    {
      id: 'property-analysis-valuation',
      slug: 'property-analysis-valuation',
      name: 'Property Analysis & Valuation',
      description: 'Advanced analytics and AI-driven valuation tools for commercial real estate assessment.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Advanced analytics and AI-driven valuation tools that provide deep insights into property values, market conditions, and investment potential through automated analysis and predictive modeling.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Automated property valuation, comparative market analysis, financial modeling, investment analysis, risk assessment, market trend forecasting.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Accurate property valuation and analysis is fundamental to all CRE decisions. AI-powered tools provide faster, more consistent analysis while reducing human error and bias, enabling better investment decisions and more competitive deal structuring.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-property-analysis-valuation.jpg',
      itemCount: 0,
      icon: 'property-analysis-valuation',
    },
    {
      id: 'development-construction',
      slug: 'development-construction',
      name: 'Development & Construction',
      description: 'Tools for planning, managing, and optimizing real estate development and construction projects.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Comprehensive tools for planning, managing, and optimizing real estate development and construction projects, from initial feasibility through project completion and delivery.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Project planning and scheduling, construction management, cost estimation, permit tracking, contractor management, quality control, progress monitoring.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Development and construction projects are complex, high-stakes endeavors with tight margins. AI tools help manage complexity, reduce delays, control costs, and improve quality outcomes while ensuring regulatory compliance and stakeholder communication.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-development-construction.jpg',
      itemCount: 0,
      icon: 'development-construction',
    },
    {
      id: 'legal-compliance-due-diligence',
      slug: 'legal-compliance-due-diligence',
      name: 'Legal, Compliance & Due Diligence',
      description: 'AI-powered tools for legal processes, regulatory compliance, and comprehensive due diligence.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">AI-powered tools for legal processes, regulatory compliance, and comprehensive due diligence that automate document review, ensure regulatory adherence, and streamline legal workflows.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Contract analysis and review, due diligence document processing, regulatory compliance monitoring, legal risk assessment, lease abstraction, title research.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Legal and compliance issues can derail deals and create significant liability. AI tools reduce risk by ensuring thorough analysis, maintaining compliance, and identifying potential issues early while significantly reducing the time and cost of legal processes.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-legal-compliance-duediligence.jpg',
      itemCount: 0,
      icon: 'legal-compliance-duediligence',
    },
    {
      id: 'property-management-operations',
      slug: 'property-management-operations',
      name: 'Property Management & Operations',
      description: 'Tools for day-to-day property management, tenant relations, and operational efficiency.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Comprehensive tools for day-to-day property management, tenant relations, and operational efficiency that automate routine tasks and enhance the tenant experience.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Lease administration, tenant communication, maintenance management, rent collection, financial reporting, tenant screening, space management.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Efficient property management directly impacts tenant satisfaction, retention, and property value. AI tools help streamline operations, reduce costs, improve tenant experiences, and enable property managers to focus on strategic activities rather than administrative tasks.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-property-management-operations.jpg',
      itemCount: 0,
      icon: 'property-management-operations',
    },
    {
      id: 'asset-portfolio-management',
      slug: 'asset-portfolio-management',
      name: 'Asset & Portfolio Management',
      description: 'Tools for managing and optimizing commercial real estate portfolios and individual assets.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Advanced tools for managing and optimizing commercial real estate portfolios and individual assets, providing strategic oversight and performance optimization across multiple properties.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Portfolio performance analysis, asset allocation optimization, risk management, investment strategy planning, performance benchmarking, capital deployment decisions.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Portfolio and asset management requires sophisticated analysis across multiple properties and markets. AI tools enable better decision-making through comprehensive data analysis, risk assessment, and performance optimization, ultimately maximizing returns and minimizing risk.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-asset-portfolio-management.jpg',
      itemCount: 0,
      icon: 'asset-portfolio-management',
    },
    {
      id: 'transactions-brokerage',
      slug: 'transactions-brokerage',
      name: 'Transactions & Brokerage',
      description: 'Tools for facilitating property transactions, deal management, and brokerage operations.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Comprehensive tools for facilitating property transactions, deal management, and brokerage operations that streamline the entire transaction lifecycle from prospecting to closing.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Deal pipeline management, client relationship management, transaction coordination, document management, commission tracking, market analysis, client communications.</p>
          </div>

          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Successful transactions require careful coordination of multiple parties, documents, and deadlines. AI tools help brokers manage complex deals more effectively, improve client service, and close transactions faster while reducing the risk of errors or missed opportunities.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-transactions-brokerage.jpg',
      itemCount: 0,
      icon: 'transactions-brokerage',
    },
    {
      id: 'marketing-leasing-enablement',
      slug: 'marketing-leasing-enablement',
      name: 'Marketing & Leasing Enablement',
      description: 'Tools for property marketing, tenant acquisition, and leasing process optimization.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Specialized tools for property marketing, tenant acquisition, and leasing process optimization that help attract, qualify, and convert prospects into tenants more effectively.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Property marketing campaigns, lead generation and qualification, virtual tours and presentations, proposal generation, lease negotiation support, market positioning analysis.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Effective marketing and leasing drives occupancy and rental rates, directly impacting property value and returns. AI tools enable more targeted marketing, better lead qualification, and streamlined leasing processes that reduce vacancy periods and improve tenant quality.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-marketingleasing-enablement.jpg',
      itemCount: 0,
      icon: 'marketing-leasing-enablement',
    },
    {
      id: 'data-workflow-infrastructure',
      slug: 'data-workflow-infrastructure',
      name: 'Data & Workflow Infrastructure',
      description: 'Backend systems, data management, and workflow automation tools for CRE operations.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">Backend systems, data management, and workflow automation tools that provide the foundational infrastructure for modern CRE operations, ensuring data quality, system integration, and process automation.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Data integration and cleaning, workflow automation, system integrations, reporting and analytics infrastructure, API management, data governance.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">Reliable data and efficient workflows are the foundation of all CRE operations. These infrastructure tools ensure data accuracy, system connectivity, and process automation that enable all other CRE functions to operate effectively and efficiently.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-data-workflow-infrastructure.jpg',
      itemCount: 0,
      icon: 'data-workflow-infrastructure',
    },
    {
      id: 'productivity-copilots',
      slug: 'productivity-copilots',
      name: 'Productivity & Copilots',
      description: 'AI assistants and productivity tools designed to augment human capabilities in CRE.',
      longDescription: `
        <div class="space-y-6">
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">What it covers</h3>
            <p class="text-foreground mb-4">AI assistants and productivity tools designed to augment human capabilities in CRE, providing intelligent support for daily tasks, decision-making, and strategic planning across all CRE functions.</p>
            <p class="text-foreground"><strong>Workflows supported:</strong> Document generation and analysis, research and data synthesis, meeting assistance and note-taking, task automation, decision support, strategic planning assistance.</p>
          </div>
          
          <div>
            <h3 class="text-xl font-semibold mb-3 text-primary">Why it matters</h3>
            <p class="text-foreground mb-4">AI copilots amplify human capabilities by handling routine tasks, providing intelligent insights, and supporting decision-making. This enables CRE professionals to focus on high-value strategic work while improving accuracy, speed, and outcomes across all functions.</p>
          </div>
        </div>
      `,
      imageUrl: '/categories/category-productivity-copilots.jpg',
      itemCount: 0,
      icon: 'productivity-copilots',
    },
  ];

  // Only calculate itemCount if requested (to avoid circular dependency)
  if (!includeItemCounts) {
    return categories;
  }

  // Calculate itemCount for each category dynamically
  try {
    const allDirItems = await getDirectoryItems();
    return categories.map(category => ({
      ...category,
      itemCount: allDirItems.filter(item => {
        const itemCategories = item.category.split(',').map(cat => cat.trim());
        return itemCategories.includes(category.slug);
      }).length
    }));
  } catch (error) {
    // Gracefully handle errors when calculating item counts
    console.warn('Error calculating category item counts:', error);
    return categories;
  }
};

// --- Main Data Fetching Functions ---

async function fetchAllDirectoryItemsFromDb(): Promise<DirectoryItem[]> {
  try {
    return (await fetchDirectoryRows(NORMALIZED_DIRECTORY_ITEM_COLUMNS))
      .map(transformSupabaseRowToDirectoryItem);
  } catch (error) {
    if (!isMissingNormalizedColumnError(error as { code?: string; message?: string })) {
      throw new Error(`Failed to fetch directory items: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    return (await fetchDirectoryRows(DIRECTORY_ITEM_COLUMNS))
      .map(transformSupabaseRowToDirectoryItem);
  }
}

const getCachedAllDirectoryItems = unstable_cache(
  fetchAllDirectoryItemsFromDb,
  ['directory-items-all'],
  { revalidate: 300, tags: ['directory-items'] }
);

/**
 * Retrieves directory items with optional search and category filtering
 * Server-side rendered with intelligent caching for optimal performance
 * @param searchTerm - Optional search term to filter items by name, description, tagline
 * @param categoryFilter - Optional comma-separated list of category slugs to filter by
 * @returns Promise resolving to array of filtered directory items
 */
export async function getDirectoryItems(
  searchTerm?: string,
  categoryFilter?: string
): Promise<DirectoryItem[]> {
  try {
    if (!searchTerm && !categoryFilter) {
      const items = await getCachedAllDirectoryItems();
      allItemsCache = items;
      allItemsCacheTimestamp = Date.now();
      return items;
    }

    const supabase = getSupabaseClient();

    let query = supabase
      .from(TABLE_NAME)
      .select(NORMALIZED_DIRECTORY_ITEM_COLUMNS)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      query = query.or(`name.ilike.%${searchTermLower}%,one_liner.ilike.%${searchTermLower}%,description.ilike.%${searchTermLower}%`);
    }

    if (categoryFilter) {
      const categoryFilters = categoryFilter.split(',').map(c => c.trim());
      const categoryConditions = categoryFilters.map(cat => `category.ilike.%${cat}%`).join(',');
      query = query.or(categoryConditions);
    }

    let { data, error } = await query;

    if (isMissingNormalizedColumnError(error)) {
      let legacyQuery = supabase
        .from(TABLE_NAME)
        .select(DIRECTORY_ITEM_COLUMNS)
        .order('display_order', { ascending: true })
        .order('name', { ascending: true });

      if (searchTerm) {
        const searchTermLower = searchTerm.toLowerCase();
        legacyQuery = legacyQuery.or(`name.ilike.%${searchTermLower}%,one_liner.ilike.%${searchTermLower}%,description.ilike.%${searchTermLower}%`);
      }
      if (categoryFilter) {
        const categoryConditions = categoryFilter.split(',').map((cat) => `category.ilike.%${cat.trim()}%`).join(',');
        legacyQuery = legacyQuery.or(categoryConditions);
      }

      const legacyResult = await legacyQuery;
      data = legacyResult.data;
      error = legacyResult.error;
    }

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch directory items: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map(transformSupabaseRowToDirectoryItem);

  } catch (error) {
    console.error('Error fetching directory items from Supabase:', error);
    
    // Return cached data if available, otherwise empty array
    if (allItemsCache && isCacheValid(allItemsCacheTimestamp)) {
      console.warn('Returning cached data due to fetch error');
      return allItemsCache;
    }
    
    // For development/build with placeholder environment variables, return empty array
    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning empty array for build compatibility');
      return [];
    }
    
    return [];
  }
}

/** Returns the compact data shape used by directory cards and client-side filtering. */
export async function getDirectoryListItems(): Promise<DirectoryListItem[]> {
  const items = await getDirectoryItems();
  return items.map((item) => ({
    id: item.id,
    slug: item.slug,
    name: item.name,
    tagline: item.tagline,
    category: item.category,
    website: item.website,
    imageUrl: item.imageUrl,
    features: item.features,
    tags: item.tags,
  }));
}

/**
 * Retrieves a specific directory item by its slug
 * Server-side rendered for optimal performance
 * @param slug - Unique identifier for the directory item
 * @returns Promise resolving to directory item or undefined if not found
 */
export async function getDirectoryItemBySlug(slug: string): Promise<DirectoryItem | undefined> {
  try {
    const supabase = getSupabaseClient();
    
    let { data, error } = await supabase
      .from(TABLE_NAME)
      .select(NORMALIZED_DIRECTORY_ITEM_COLUMNS)
      .eq('slug', slug)
      .single();

    if (isMissingNormalizedColumnError(error)) {
      const legacyResult = await supabase
        .from(TABLE_NAME)
        .select(DIRECTORY_ITEM_COLUMNS)
        .eq('slug', slug)
        .single();
      data = legacyResult.data;
      error = legacyResult.error;
    }

    if (error) {
      if (error.code === 'PGRST116') {
        // Not found
        return undefined;
      }
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch directory item: ${error.message}`);
    }

    if (!data) {
      return undefined;
    }

    return transformSupabaseRowToDirectoryItem(data);

  } catch (error) {
    console.error('Error fetching directory item by slug from Supabase:', error);
    
    // For development/build with placeholder environment variables, return undefined
    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning undefined for build compatibility');
      return undefined;
    }
    
    return undefined;
  }
}

/**
 * Retrieves a specific category by its slug with accurate item count
 * Server-side rendered for optimal performance
 * @param slug - Unique identifier for the category
 * @returns Promise resolving to category with updated item count or undefined if not found
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  const allDirItems = await getDirectoryItems();
  
  const category = categories.find(cat => cat.slug === slug);

  if (category) {
    // Update itemCount for the specific category based on actual items
    return {
      ...category,
      itemCount: allDirItems.filter(item => {
        const itemCategories = item.category.split(',').map(cat => cat.trim());
        return itemCategories.includes(category.slug);
      }).length
    };
  }
  return undefined;
}

/**
 * Retrieves featured directory items (placeholder implementation)
 * Server-side rendered for optimal performance
 * @param limit - Maximum number of items to return (default: 3)
 * @returns Promise resolving to array of featured directory items
 */
export async function getFeaturedItems(limit: number = 3): Promise<DirectoryItem[]> {
  try {
    const supabase = getSupabaseClient();
    
    // Get featured items using display_order (prioritized tools first) and limit results
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(DIRECTORY_ITEM_COLUMNS)
      .order('display_order', { ascending: true })
      .order('name', { ascending: true })
      .limit(limit);

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch featured items: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return data.map(transformSupabaseRowToDirectoryItem);

  } catch (error) {
    console.error('Error fetching featured items from Supabase:', error);
    
    // For development/build with placeholder environment variables, return empty array
    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning empty array for build compatibility');
      return [];
    }
    
    return [];
  }
}

/**
 * Newsletter submission (kept from original implementation)
 * @param email - Email address to subscribe
 * @returns Promise resolving to success status and message
 */
export async function submitNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // Placeholder implementation - replace with actual Mailchimp integration
  return { success: true, message: 'Newsletter subscription placeholder - Mailchimp integration pending.' };
}

/**
 * Clears all cached data and resets connections
 * Use this function when you need to force a fresh data fetch
 */
export function clearSupabaseCache() {
  allItemsCache = null;
  allItemsCacheTimestamp = 0;
}

/**
 * Returns current cache status for debugging
 * @returns Object containing cache state information
 */
export function getSupabaseCacheStatus() {
  return {
    hasCachedData: !!allItemsCache,
    cacheTimestamp: allItemsCacheTimestamp,
    cacheAge: Date.now() - allItemsCacheTimestamp,
    isValid: isCacheValid(allItemsCacheTimestamp),
  };
}

// --- Tool Submissions ---

const SUBMISSIONS_TABLE = 'tool_submissions';

export type ToolSubmissionStatus = 'pending' | 'approved' | 'rejected';
export type ToolResearchStatus = 'pending' | 'completed' | 'failed';

/**
 * Tool submission interface for managing user-submitted tools
 */
export interface ToolSubmission {
  submissionId: string;
  website: string;
  email: string;
  comment: string;
  slug?: string;
  name?: string;
  category?: string;
  features?: string;
  oneLiner?: string;
  description?: string;
  country?: string;
  city?: string;
  iconLink?: string;
  researchStatus: string;
  submittedAt: string;
  status: ToolSubmissionStatus;
}

export interface ToolSubmissionUpdateInput {
  website?: string;
  slug?: string;
  name?: string;
  category?: string;
  features?: string;
  oneLiner?: string;
  description?: string;
  country?: string;
  city?: string;
  iconLink?: string;
  researchStatus?: ToolResearchStatus;
}

/** Database row type for tool_submissions table */
interface ToolSubmissionRow {
  submission_id: string;
  website: string;
  email: string;
  comment: string;
  slug: string | null;
  name: string | null;
  category: string | null;
  features: string | null;
  one_liner: string | null;
  description: string | null;
  country: string | null;
  city: string | null;
  icon_link: string | null;
  research_status: string;
  submitted_at: string;
  status: string;
}

function mapToolSubmissionRow(row: ToolSubmissionRow): ToolSubmission {
  return {
    submissionId: row.submission_id,
    website: row.website,
    email: row.email,
    comment: row.comment,
    slug: row.slug || undefined,
    name: row.name || undefined,
    category: row.category || undefined,
    features: row.features || undefined,
    oneLiner: row.one_liner || undefined,
    description: row.description ? normalizeToolDescription(row.description) : undefined,
    country: row.country || undefined,
    city: row.city || undefined,
    iconLink: row.icon_link || undefined,
    researchStatus: row.research_status,
    submittedAt: row.submitted_at,
    status: (row.status as ToolSubmissionStatus) || 'pending',
  };
}

function trimToNullable(value: string): string | null {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function normalizeDescriptionToNullable(value: string | undefined): string | null {
  if (value === undefined) {
    return null;
  }

  const normalized = normalizeToolDescription(value);
  return normalized.length > 0 ? normalized : null;
}

/**
 * Stores a new tool submission in Supabase
 * @param submissionData - Tool submission data without submissionId
 * @returns Promise resolving to generated submission ID
 */
export async function storeToolSubmission(submissionData: Omit<ToolSubmission, 'submissionId'>): Promise<string> {
  const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  try {
    const supabase = getSupabaseSubmissionClient();

    const insertData: ToolSubmissionRow = {
      submission_id: submissionId,
      website: submissionData.website,
      email: submissionData.email,
      comment: submissionData.comment,
      slug: submissionData.slug || null,
      name: submissionData.name || null,
      category: submissionData.category || null,
      features: submissionData.features || null,
      one_liner: submissionData.oneLiner || null,
      description: normalizeDescriptionToNullable(submissionData.description),
      country: submissionData.country || null,
      city: submissionData.city || null,
      icon_link: submissionData.iconLink || null,
      research_status: submissionData.researchStatus,
      submitted_at: submissionData.submittedAt,
      status: submissionData.status,
    };

    const { error } = await supabase
      .from(SUBMISSIONS_TABLE)
      .insert(insertData as any);

    if (error) {
      console.error('Supabase insert error:', error);
      throw new Error(`Failed to store submission: ${error.message}`);
    }

    return submissionId;

  } catch (error) {
    console.error('Error storing tool submission:', error);
    
    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning placeholder ID');
      return submissionId;
    }
    
    throw error;
  }
}

/**
 * Retrieves tool submissions from Supabase with optional status filtering
 * @param status - Optional status filter ('pending' | 'approved' | 'rejected')
 * @returns Promise resolving to array of tool submissions
 */
export async function getToolSubmissions(status?: 'pending' | 'approved' | 'rejected'): Promise<ToolSubmission[]> {
  try {
    const supabase = getSupabaseSubmissionClient();

    let query = supabase
      .from(SUBMISSIONS_TABLE)
      .select('*')
      .order('submitted_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch submissions: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    return (data as unknown as ToolSubmissionRow[]).map(mapToolSubmissionRow);

  } catch (error) {
    console.error('Error fetching tool submissions:', error);
    
    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning empty array');
      return [];
    }
    
    return [];
  }
}

/**
 * Retrieves a single tool submission by ID.
 * @param submissionId - Unique identifier for the submission
 * @returns Promise resolving to the submission or undefined when not found
 */
export async function getToolSubmissionById(submissionId: string): Promise<ToolSubmission | undefined> {
  try {
    const supabase = getSupabaseSubmissionClient();

    const { data, error } = await (supabase
      .from(SUBMISSIONS_TABLE) as any)
      .select('*')
      .eq('submission_id', submissionId)
      .maybeSingle();

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch submission: ${error.message}`);
    }

    if (!data) {
      return undefined;
    }

    return mapToolSubmissionRow(data as ToolSubmissionRow);
  } catch (error) {
    console.error('Error fetching tool submission by ID:', error);

    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning undefined');
      return undefined;
    }

    return undefined;
  }
}

/**
 * Updates the status of a tool submission
 * @param submissionId - Unique identifier for the submission
 * @param status - New status to set ('pending' | 'approved' | 'rejected')
 * @returns Promise resolving to boolean indicating success
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: ToolSubmissionStatus
): Promise<boolean> {
  try {
    const supabase = getSupabaseSubmissionClient();

    // Use raw SQL via rpc or direct update with type bypass
    // The table isn't in generated types yet, so we use any casting
    const { error } = await (supabase
      .from(SUBMISSIONS_TABLE) as any)
      .update({ status })
      .eq('submission_id', submissionId);

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Failed to update submission: ${error.message}`);
    }

    return true;

  } catch (error) {
    console.error('Error updating submission status:', error);
    
    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning false');
      return false;
    }
    
    return false;
  }
}

/**
 * Updates editable fields for a tool submission and returns the latest saved record.
 * @param submissionId - Unique identifier for the submission
 * @param updates - Partial set of editable submission fields
 * @returns Promise resolving to the updated submission or undefined when not found
 */
export async function updateToolSubmission(
  submissionId: string,
  updates: ToolSubmissionUpdateInput
): Promise<ToolSubmission | undefined> {
  try {
    const supabase = getSupabaseSubmissionClient();

    const updateData: Record<string, string | null> = {};

    if (updates.website !== undefined) {
      updateData.website = updates.website.trim();
    }
    if (updates.slug !== undefined) {
      updateData.slug = trimToNullable(updates.slug);
    }
    if (updates.name !== undefined) {
      updateData.name = trimToNullable(updates.name);
    }
    if (updates.category !== undefined) {
      updateData.category = trimToNullable(updates.category);
    }
    if (updates.features !== undefined) {
      updateData.features = trimToNullable(updates.features);
    }
    if (updates.oneLiner !== undefined) {
      updateData.one_liner = trimToNullable(updates.oneLiner);
    }
    if (updates.description !== undefined) {
      updateData.description = normalizeDescriptionToNullable(updates.description);
    }
    if (updates.country !== undefined) {
      updateData.country = trimToNullable(updates.country);
    }
    if (updates.city !== undefined) {
      updateData.city = trimToNullable(updates.city);
    }
    if (updates.iconLink !== undefined) {
      updateData.icon_link = trimToNullable(updates.iconLink);
    }
    if (updates.researchStatus !== undefined) {
      updateData.research_status = updates.researchStatus;
    }

    const { data, error } = await (supabase
      .from(SUBMISSIONS_TABLE) as any)
      .update(updateData)
      .eq('submission_id', submissionId)
      .select('*')
      .maybeSingle();

    if (error) {
      console.error('Supabase update error:', error);
      throw new Error(`Failed to update submission details: ${error.message}`);
    }

    if (!data) {
      return undefined;
    }

    return mapToolSubmissionRow(data as ToolSubmissionRow);
  } catch (error) {
    console.error('Error updating tool submission:', error);

    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning undefined');
      return undefined;
    }

    return undefined;
  }
}

/**
 * Permanently deletes a tool submission from Supabase.
 * @param submissionId - Unique identifier for the submission
 * @returns Promise resolving to boolean indicating success
 */
export async function deleteToolSubmission(submissionId: string): Promise<boolean> {
  try {
    const supabase = getSupabaseSubmissionClient();

    const { error } = await (supabase
      .from(SUBMISSIONS_TABLE) as any)
      .delete()
      .eq('submission_id', submissionId);

    if (error) {
      console.error('Supabase delete error:', error);
      throw new Error(`Failed to delete submission: ${error.message}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting tool submission:', error);

    if (error instanceof Error && error.message.includes('not properly configured')) {
      console.warn('Supabase not configured, returning false');
      return false;
    }

    return false;
  }
}
