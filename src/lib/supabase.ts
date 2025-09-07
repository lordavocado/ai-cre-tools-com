/**
 * Supabase integration for AI CRE Tools directory
 * Server-side data fetching with optimal caching and performance
 * @fileoverview Handles all Supabase operations including caching, error handling, and server-side rendering
 */

// Ensure this module only runs on server-side for optimal performance
if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

import type { DirectoryItem, Category } from '@/types';
import { createClient } from '@supabase/supabase-js';

// --- Configuration ---

// Database table and column mappings
const TABLE_NAME = 'ecosystem_apps';

// Column mappings from Supabase to DirectoryItem interface
const COLUMN_MAPPINGS = {
  SLUG: 'slug',
  NAME: 'name',
  TAGLINE: 'one_liner',
  DESCRIPTION: 'description',
  CATEGORY: 'category',
  WEBSITE: 'website_url',
  IMAGE_URL: 'icon_url',
  FEATURES: 'features',
  COUNTRY: 'country',
  CITY: 'city',
  DISPLAY_ORDER: 'display_order',
  CREATED_AT: 'created_at',
  UPDATED_AT: 'updated_at',
};

// --- Supabase Client Setup ---

let supabaseClient: ReturnType<typeof createClient> | null = null;

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
function transformSupabaseRowToDirectoryItem(row: any): DirectoryItem {
  return {
    id: row[COLUMN_MAPPINGS.SLUG], // Use slug as ID
    slug: row[COLUMN_MAPPINGS.SLUG],
    name: row[COLUMN_MAPPINGS.NAME] || '',
    tagline: row[COLUMN_MAPPINGS.TAGLINE] || '',
    description: row[COLUMN_MAPPINGS.DESCRIPTION] || '',
    category: row[COLUMN_MAPPINGS.CATEGORY] || '',
    website: row[COLUMN_MAPPINGS.WEBSITE] || '',
    imageUrl: row[COLUMN_MAPPINGS.IMAGE_URL] || undefined,
    features: transformFeatures(row[COLUMN_MAPPINGS.FEATURES] || []),
    country: row[COLUMN_MAPPINGS.COUNTRY] || undefined,
    city: row[COLUMN_MAPPINGS.CITY] || undefined,
  };
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
    // Check if we have valid cached data and no specific search/filter
    if (allItemsCache && isCacheValid(allItemsCacheTimestamp) && !searchTerm && !categoryFilter) {
      return allItemsCache;
    }

    // Get fresh data from Supabase
    const supabase = getSupabaseClient();
    
    let query = supabase
      .from(TABLE_NAME)
      .select('*')
      .order('display_order', { ascending: true })
      .order('name', { ascending: true });

    // Apply search filter if provided
    if (searchTerm) {
      const searchTermLower = searchTerm.toLowerCase();
      query = query.or(`name.ilike.%${searchTermLower}%,one_liner.ilike.%${searchTermLower}%,description.ilike.%${searchTermLower}%`);
    }

    // Apply category filter if provided
    if (categoryFilter) {
      const categoryFilters = categoryFilter.split(',').map(c => c.trim());
      // Use Supabase's array operators for category filtering
      const categoryConditions = categoryFilters.map(cat => `category.ilike.%${cat}%`).join(',');
      query = query.or(categoryConditions);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase query error:', error);
      throw new Error(`Failed to fetch directory items: ${error.message}`);
    }

    if (!data) {
      return [];
    }

    // Transform Supabase data to DirectoryItem format
    const items = data.map(transformSupabaseRowToDirectoryItem);

    // Update cache only if no search/filter was applied
    if (!searchTerm && !categoryFilter) {
      allItemsCache = items;
      allItemsCacheTimestamp = Date.now();
    }

    return items;

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

/**
 * Retrieves a specific directory item by its slug
 * Server-side rendered for optimal performance
 * @param slug - Unique identifier for the directory item
 * @returns Promise resolving to directory item or undefined if not found
 */
export async function getDirectoryItemBySlug(slug: string): Promise<DirectoryItem | undefined> {
  try {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select('*')
      .eq('slug', slug)
      .single();

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
      .select('*')
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