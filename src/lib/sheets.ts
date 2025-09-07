/**
 * Google Sheets integration for AI CRE Tools directory
 * Server-side only module for fetching and managing directory data
 * @fileoverview Handles all Google Sheets operations including caching, rate limiting, and error handling
 */

if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

import type { DirectoryItem, Category } from '@/types';
import { GoogleSpreadsheet, type GoogleSpreadsheetRow, type GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

// --- Configuration ---

// 1. Sheet Names Configuration:
const SHEET_NAMES = {
  ITEMS: 'aicretools',
  NEWSLETTER: 'Newsletter',
  SUBMISSIONS: 'ToolSubmissions',
};

// 2. Column Name Mappings Configuration:
const COLUMN_MAPPINGS = {
  ITEMS: {
    ID: 'slug', // Using slug as the unique identifier
    SLUG: 'slug', // Dedicated slug column
    NAME: 'name',
    TAGLINE: 'one_liner',
    DESCRIPTION: 'description',
    CATEGORY_SLUG: 'category',
    WEBSITE: 'website',
    IMAGE_URL: 'icon link',
    FEATURES_JSON: 'features', // Expects: [{"name": "Feature 1", "description": "Optional desc"}, {"name": "Feature 2"}]
    PRICING: 'pricing',
    BEST_FOR: 'best_for',
    TAGS: 'tags',
    RATING: 'rating',
    COUNTRY: 'country',
    CITY: 'city',
  },
  NEWSLETTER: {
    EMAIL: 'Email',
    TIMESTAMP: 'Timestamp',
  },
  SUBMISSIONS: {
    SUBMISSION_ID: 'Submission ID',
    WEBSITE: 'Website',
    EMAIL: 'Email',
    COMMENT: 'Comment',
    SLUG: 'Slug',
    NAME: 'Name',
    CATEGORY: 'Category',
    FEATURES: 'Features',
    ONE_LINER: 'One Liner',
    DESCRIPTION: 'Description',
    COUNTRY: 'Country',
    CITY: 'City',
    ICON_LINK: 'Icon Link',
    RESEARCH_STATUS: 'Research Status',
    SUBMITTED_AT: 'Submitted At',
    STATUS: 'Status',
  },
};

// --- End Configuration ---



/**
 * Retrieves all hardcoded categories with optional item count calculation
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
    return categories;
  }
};


let docInstance: GoogleSpreadsheet | null = null;
let docInfoLoaded: boolean = false;

// Cache for environment variables to avoid repeated lookups if they were initially found
let cachedSheetId: string | null = null;
let cachedServiceAccountEmail: string | null = null;
let cachedPrivateKey: string | null = null;

// Enhanced caching with timestamps
let allItemsCache: DirectoryItem[] | null = null;
let allItemsCacheTimestamp: number = 0;
const CACHE_DURATION_MS = 5 * 60 * 1000; // 5 minutes cache

// Rate limiting
let lastRequestTime: number = 0;
const MIN_REQUEST_INTERVAL_MS = 1000; // Minimum 1 second between requests
let requestQueue: Array<() => Promise<void>> = [];
let isProcessingQueue = false;

// Pending requests to prevent duplicate calls
let pendingDocInitialization: Promise<GoogleSpreadsheet> | null = null;
let pendingItemsRequest: Promise<DirectoryItem[]> | null = null;

// Circuit breaker for rate limiting
let circuitBreakerOpenUntil: number = 0;
let consecutiveFailures: number = 0;
const MAX_CONSECUTIVE_FAILURES = 3;
const CIRCUIT_BREAKER_TIMEOUT_MS = 60 * 1000; // 1 minute

// Circuit breaker utilities
function isCircuitBreakerOpen(): boolean {
  return Date.now() < circuitBreakerOpenUntil;
}

function openCircuitBreaker(): void {
  circuitBreakerOpenUntil = Date.now() + CIRCUIT_BREAKER_TIMEOUT_MS;
}

function closeCircuitBreaker(): void {
  circuitBreakerOpenUntil = 0;
  consecutiveFailures = 0;
}

// Rate limiting utilities
async function enforceRateLimit(): Promise<void> {
  // Check circuit breaker first
  if (isCircuitBreakerOpen()) {
    throw new Error(`Service temporarily unavailable due to rate limiting. Please try again in ${Math.ceil((circuitBreakerOpenUntil - Date.now()) / 1000)} seconds.`);
  }

  const now = Date.now();
  const timeSinceLastRequest = now - lastRequestTime;
  
  if (timeSinceLastRequest < MIN_REQUEST_INTERVAL_MS) {
    const waitTime = MIN_REQUEST_INTERVAL_MS - timeSinceLastRequest;
    await new Promise(resolve => setTimeout(resolve, waitTime));
  }
  
  lastRequestTime = Date.now();
}

// Exponential backoff retry utility
async function retryWithBackoff<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      if (attempt > 0) {
        const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      await enforceRateLimit();
      const result = await operation();
      
      // Success - reset circuit breaker
      closeCircuitBreaker();
      return result;
    } catch (error) {
      lastError = error as Error;
      
      // Check if it's a rate limit error
      if (error instanceof Error && (
        error.message.includes('429') || 
        error.message.includes('Quota exceeded') ||
        error.message.includes('rate limit')
      )) {
        consecutiveFailures++;
        
        if (consecutiveFailures >= MAX_CONSECUTIVE_FAILURES) {
          openCircuitBreaker();
        }
        
        if (attempt === maxRetries) {
          throw new Error(`Google Sheets API rate limit exceeded. Please try again in a few minutes. Original error: ${error.message}`);
        }
        continue;
      }
      
      // For non-rate-limit errors, don't retry
      consecutiveFailures++;
      throw error;
    }
  }
  
  throw lastError!;
}

// Check if cache is still valid
function isCacheValid(timestamp: number): boolean {
  return Date.now() - timestamp < CACHE_DURATION_MS;
}

/**
 * Gets an initialized Google Spreadsheet instance with proper authentication and caching
 * @returns Promise resolving to authenticated GoogleSpreadsheet instance
 * @throws Error if authentication fails or required environment variables are missing
 */
async function getInitializedDoc(): Promise<GoogleSpreadsheet> {
  // Try to use cached credentials if available and docInstance is not set or info not loaded
  if (docInstance && docInfoLoaded && 
      process.env.GOOGLE_SHEET_ID === cachedSheetId &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL === cachedServiceAccountEmail &&
      process.env.GOOGLE_PRIVATE_KEY === cachedPrivateKey) {
    return docInstance;
  }

  // If there's already a pending initialization, wait for it
  if (pendingDocInitialization) {
    return pendingDocInitialization;
  }

  // Start the initialization and cache the promise
  pendingDocInitialization = initializeDocWithRetry();

  try {
    const result = await pendingDocInitialization;
    return result;
  } finally {
    pendingDocInitialization = null;
  }
}

/**
 * Initializes Google Spreadsheet with retry logic and proper error handling
 * @returns Promise resolving to authenticated GoogleSpreadsheet instance
 * @throws Error if initialization fails after retries
 */
async function initializeDocWithRetry(): Promise<GoogleSpreadsheet> {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId) {
    throw new Error('GOOGLE_SHEET_ID is not defined in .env.local. Please ensure it is set.');
  }
  if (!serviceAccountEmail) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not defined in .env.local. Please ensure it is set.');
  }
  if (!rawPrivateKey) {
    throw new Error('GOOGLE_PRIVATE_KEY is not defined in .env.local. Please ensure it is set and properly formatted (e.g., newlines escaped as \\n in the .env.local file).');
  }

  const privateKeyProcessed = rawPrivateKey.replace(/\\n/g, '\n');

  const jwt = new JWT({
    email: serviceAccountEmail,
    key: privateKeyProcessed,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const newDocInstance = new GoogleSpreadsheet(sheetId, jwt);
  
  return retryWithBackoff(async () => {
    try {
      await newDocInstance.loadInfo(); // Loads document properties and worksheets
      docInstance = newDocInstance;
      docInfoLoaded = true;

      // Cache the successfully used environment variable values
      cachedSheetId = sheetId;
      cachedServiceAccountEmail = serviceAccountEmail;
      cachedPrivateKey = rawPrivateKey; // Cache the raw key as it was read from env

      return docInstance;
    } catch (error) {
      // Clear potentially stale cache on error
      docInstance = null;
      docInfoLoaded = false;
      cachedSheetId = null;
      cachedServiceAccountEmail = null;
      cachedPrivateKey = null;
      throw new Error(`Failed to load Google Sheet. Check sheet ID, permissions for ${serviceAccountEmail}, and credentials. Original error: ${error instanceof Error ? error.message : String(error)}`);
    }
  });
}

/**
 * Helper function to safely extract string values from Google Sheets rows
 * @param row - GoogleSpreadsheetRow instance
 * @param header - Column header name
 * @returns Trimmed string value or empty string if not found
 */
const getString = (row: GoogleSpreadsheetRow<any>, header: string): string => row.get(header)?.toString().trim() || '';
/**
 * Helper function to safely extract optional string values from Google Sheets rows
 * @param row - GoogleSpreadsheetRow instance
 * @param header - Column header name
 * @returns Trimmed string value or undefined if empty/not found
 */
const getOptionalString = (row: GoogleSpreadsheetRow<any>, header: string): string | undefined => {
  const val = row.get(header)?.toString().trim();
  return val ? val : undefined;
}
/**
 * Helper function to safely extract numeric values from Google Sheets rows
 * @param row - GoogleSpreadsheetRow instance
 * @param header - Column header name
 * @returns Parsed number or undefined if invalid/empty
 */
const getNumber = (row: GoogleSpreadsheetRow<any>, header: string): number | undefined => {
  const valStr = row.get(header)?.toString().trim();
  if (valStr === undefined || valStr === null || valStr === '') return undefined;
  const val = parseFloat(valStr);
  return isNaN(val) ? undefined : val;
}
/**
 * Helper function to safely extract comma-separated string arrays from Google Sheets rows
 * @param row - GoogleSpreadsheetRow instance
 * @param header - Column header name
 * @returns Array of trimmed strings or undefined if empty
 */
const getArrayStrings = (row: GoogleSpreadsheetRow<any>, header: string): string[] | undefined => {
  const val = row.get(header)?.toString().trim();
  if (!val) return undefined;
  
  return val
    .split(',')
    .map((s: string) => s.trim())
    .map((s: string) => s.replace(/^#/, '').trim())
    .filter((s: string) => s);
}
/**
 * Helper function to safely parse JSON values from Google Sheets rows
 * @param row - GoogleSpreadsheetRow instance
 * @param header - Column header name
 * @returns Parsed JSON object or undefined if invalid/empty
 */
const getJSON = <T>(row: GoogleSpreadsheetRow<any>, header: string): T | undefined => {
  const val = row.get(header)?.toString().trim();
  if (!val) return undefined;
  try {
    return JSON.parse(val) as T;
  } catch (e) {
    return undefined;
  }
}

/**
 * Parses feature strings into structured feature objects
 * @param featuresString - Comma-separated string of features, optionally with descriptions in parentheses
 * @returns Array of feature objects with name and optional description
 * @example parseFeatures('AI Search, Data Analysis (Advanced), Reporting')
 */
const parseFeatures = (featuresString: string): { name: string; description?: string }[] => {
  if (!featuresString) return [];
  
  return featuresString.split(',').map(feature => {
    const trimmed = feature.trim();
    const match = trimmed.match(/^(.+?)(?:\s*\((.*)\))?$/);
    
    if (match) {
      return {
        name: match[1].trim(),
        description: match[2]?.trim()
      };
    }
    
    return {
      name: trimmed,
      description: undefined
    };
  });
};

/**
 * Retrieves directory items with optional search and category filtering
 * Uses intelligent caching and rate limiting for optimal performance
 * @param searchTerm - Optional search term to filter items by name, description, tagline, or tags
 * @param categoryFilter - Optional comma-separated list of category slugs to filter by
 * @returns Promise resolving to array of filtered directory items
 */
export async function getDirectoryItems(
  searchTerm?: string, 
  categoryFilter?: string
): Promise<DirectoryItem[]> {
  // Check if we have valid cached data and no specific search/filter
  if (allItemsCache && isCacheValid(allItemsCacheTimestamp) && !searchTerm && !categoryFilter) {
    return allItemsCache;
  }

  // If there's a pending request for items and no search/filter, wait for it
  if (pendingItemsRequest && !searchTerm && !categoryFilter) {
    try {
      return await pendingItemsRequest;
    } catch (error) {
      // Clear the pending request on error to allow retry
      pendingItemsRequest = null;
      throw error;
    }
  }

  // For searches and filters, we still need the base data
  if (!allItemsCache || !isCacheValid(allItemsCacheTimestamp)) {
    if (!pendingItemsRequest) {
      // Start fetching fresh data
      pendingItemsRequest = fetchDirectoryItemsFromSheet();
    }
    
    // Wait for the fresh data with better error handling
    try {
      const result = await pendingItemsRequest;
      return result;
    } catch (error) {
      // Clear cache and pending request to prevent stuck state
      allItemsCache = [];
      allItemsCacheTimestamp = Date.now();
      return [];
    } finally {
      pendingItemsRequest = null;
    }
  }

  // Now apply filters to the cached data
  let items = allItemsCache!;

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const searchTerms = lowerSearchTerm.split(/\s+/).filter(term => term.length > 0);
    
    items = items.filter(item => {
      const description = item.description.toLowerCase();
      const tagline = item.tagline.toLowerCase();
      const name = item.name.toLowerCase();
      const tags = item.tags?.map(tag => tag.toLowerCase()) || [];
      
      // Check if all search terms are found in any of the fields
      return searchTerms.every(term => 
        description.includes(term) || 
        tagline.includes(term) || 
        name.includes(term) ||
        tags.some(tag => tag.includes(term))
      );
    });
  }
  
  if (categoryFilter) {
    const categoryFilters = categoryFilter.split(',');
    items = items.filter(item => {
      // Split item's categories and check if any overlap with the filter
      const itemCategories = item.category.split(',').map(cat => cat.trim());
      return itemCategories.some(itemCat => categoryFilters.includes(itemCat));
    });
  }

  
  return items;
}

/**
 * Fetches directory items directly from Google Sheets
 * @returns Promise resolving to array of directory items
 * @throws Error if sheet access fails
 */
async function fetchDirectoryItemsFromSheet(): Promise<DirectoryItem[]> {
  return retryWithBackoff(async () => {
    // Graceful fallback when env vars are missing during build/preview
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      allItemsCache = [];
      allItemsCacheTimestamp = Date.now();
      return [];
    }

    const doc = await getInitializedDoc();
    const sheet = doc.sheetsByTitle[SHEET_NAMES.ITEMS];
    if (!sheet) {
      throw new Error(`Sheet '${SHEET_NAMES.ITEMS}' not found. Check SHEET_NAMES configuration.`);
    }
    
    const rows = await sheet.getRows();
    const CM = COLUMN_MAPPINGS.ITEMS; // Alias for brevity
    
    const items: DirectoryItem[] = rows.map((row): DirectoryItem => {
      const slug = getString(row, CM.SLUG);
      return {
        id: slug, // Use slug as the unique identifier
        slug: slug,
        name: getString(row, CM.NAME),
        tagline: getString(row, CM.TAGLINE),
        description: getString(row, CM.DESCRIPTION),
        category: getString(row, CM.CATEGORY_SLUG),
        website: getString(row, CM.WEBSITE),
        imageUrl: getOptionalString(row, CM.IMAGE_URL),
        features: parseFeatures(getString(row, CM.FEATURES_JSON)),
        pricing: getOptionalString(row, CM.PRICING),
        bestFor: getOptionalString(row, CM.BEST_FOR),
        tags: getArrayStrings(row, CM.TAGS),
        rating: getNumber(row, CM.RATING),
        country: getOptionalString(row, CM.COUNTRY),
        city: getOptionalString(row, CM.CITY),
      };
    });

    // Update cache
    allItemsCache = items;
    allItemsCacheTimestamp = Date.now();
    
    return items;
  });
}

/**
 * Retrieves a specific directory item by its slug
 * @param slug - Unique identifier for the directory item
 * @returns Promise resolving to directory item or undefined if not found
 */
export async function getDirectoryItemBySlug(slug: string): Promise<DirectoryItem | undefined> {
  const items = await getDirectoryItems();
  return items.find(item => item.slug === slug);
}

/**
 * Retrieves a specific category by its slug with accurate item count
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
 * Submits newsletter subscription (placeholder for Mailchimp integration)
 * To enable Mailchimp integration, set MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID environment variables
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
 * Retrieves featured directory items based on highest ratings
 * @param limit - Maximum number of items to return (default: 3)
 * @returns Promise resolving to array of top-rated directory items
 */
export async function getFeaturedItems(limit: number = 3): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  return allItems
    .filter(item => typeof item.rating === 'number') 
    .sort((a,b) => (b.rating!) - (a.rating!)) 
    .slice(0, limit);
}

/**
 * Clears all cached data and resets connections
 * Use this function when you need to force a fresh data fetch
 */
export function clearSheetCache() {
  allItemsCache = null;
  allItemsCacheTimestamp = 0;
  docInstance = null; 
  docInfoLoaded = false;
  cachedSheetId = null;
  cachedServiceAccountEmail = null;
  cachedPrivateKey = null;
  pendingDocInitialization = null;
  pendingItemsRequest = null;
  closeCircuitBreaker();
}

/**
 * Returns current circuit breaker status for debugging
 * @returns Object containing circuit breaker state information
 */
export function getCircuitBreakerStatus() {
  return {
    isOpen: isCircuitBreakerOpen(),
    openUntil: circuitBreakerOpenUntil,
    consecutiveFailures,
    timeRemaining: Math.max(0, circuitBreakerOpenUntil - Date.now())
  };
}

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
  status: 'pending' | 'approved' | 'rejected';
}

/**
 * Stores a new tool submission in Google Sheets
 * @param submissionData - Tool submission data without submissionId
 * @returns Promise resolving to generated submission ID
 */
export async function storeToolSubmission(submissionData: Omit<ToolSubmission, 'submissionId'>): Promise<string> {
  const submissionId = `submission_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  return retryWithBackoff(async () => {
    // Graceful fallback when env vars are missing during build/preview
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return submissionId;
    }

    const doc = await getInitializedDoc();
    const sheet = doc.sheetsByTitle[SHEET_NAMES.SUBMISSIONS];

    if (!sheet) {
      // Try to create the sheet if it doesn't exist
      try {
        await doc.addSheet({
          title: SHEET_NAMES.SUBMISSIONS,
          headerValues: Object.values(COLUMN_MAPPINGS.SUBMISSIONS)
        });
        return submissionId;
      } catch (error) {
        throw new Error(`Could not create submissions sheet. Please create it manually in Google Sheets.`);
      }
    }

    const CM = COLUMN_MAPPINGS.SUBMISSIONS;

    await sheet.addRow({
      [CM.SUBMISSION_ID]: submissionId,
      [CM.WEBSITE]: submissionData.website,
      [CM.EMAIL]: submissionData.email,
      [CM.COMMENT]: submissionData.comment,
      [CM.SLUG]: submissionData.slug || '',
      [CM.NAME]: submissionData.name || '',
      [CM.CATEGORY]: submissionData.category || '',
      [CM.FEATURES]: submissionData.features || '',
      [CM.ONE_LINER]: submissionData.oneLiner || '',
      [CM.DESCRIPTION]: submissionData.description || '',
      [CM.COUNTRY]: submissionData.country || '',
      [CM.CITY]: submissionData.city || '',
      [CM.ICON_LINK]: submissionData.iconLink || '',
      [CM.RESEARCH_STATUS]: submissionData.researchStatus,
      [CM.SUBMITTED_AT]: submissionData.submittedAt,
      [CM.STATUS]: submissionData.status,
    });

    return submissionId;
  });
}

/**
 * Retrieves tool submissions from Google Sheets with optional status filtering
 * @param status - Optional status filter ('pending' | 'approved' | 'rejected')
 * @returns Promise resolving to array of tool submissions
 */
export async function getToolSubmissions(status?: 'pending' | 'approved' | 'rejected'): Promise<ToolSubmission[]> {
  return retryWithBackoff(async () => {
    // Graceful fallback when env vars are missing during build/preview
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return [];
    }

    const doc = await getInitializedDoc();
    const sheet = doc.sheetsByTitle[SHEET_NAMES.SUBMISSIONS];

    if (!sheet) {
      return [];
    }

    const rows = await sheet.getRows();
    const CM = COLUMN_MAPPINGS.SUBMISSIONS;

    const submissions: ToolSubmission[] = rows.map((row): ToolSubmission => ({
      submissionId: getString(row, CM.SUBMISSION_ID),
      website: getString(row, CM.WEBSITE),
      email: getString(row, CM.EMAIL),
      comment: getString(row, CM.COMMENT),
      slug: getOptionalString(row, CM.SLUG),
      name: getOptionalString(row, CM.NAME),
      category: getOptionalString(row, CM.CATEGORY),
      features: getOptionalString(row, CM.FEATURES),
      oneLiner: getOptionalString(row, CM.ONE_LINER),
      description: getOptionalString(row, CM.DESCRIPTION),
      country: getOptionalString(row, CM.COUNTRY),
      city: getOptionalString(row, CM.CITY),
      iconLink: getOptionalString(row, CM.ICON_LINK),
      researchStatus: getString(row, CM.RESEARCH_STATUS),
      submittedAt: getString(row, CM.SUBMITTED_AT),
      status: (getString(row, CM.STATUS) as 'pending' | 'approved' | 'rejected') || 'pending',
    }));

    // Filter by status if provided
    if (status) {
      return submissions.filter(submission => submission.status === status);
    }

    return submissions;
  });
}

/**
 * Updates the status of a tool submission
 * @param submissionId - Unique identifier for the submission
 * @param status - New status to set ('pending' | 'approved' | 'rejected')
 * @returns Promise resolving to boolean indicating success
 */
export async function updateSubmissionStatus(
  submissionId: string,
  status: 'pending' | 'approved' | 'rejected'
): Promise<boolean> {
  return retryWithBackoff(async () => {
    // Graceful fallback when env vars are missing during build/preview
    if (!process.env.GOOGLE_SHEET_ID || !process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return false;
    }

    const doc = await getInitializedDoc();
    const sheet = doc.sheetsByTitle[SHEET_NAMES.SUBMISSIONS];

    if (!sheet) {
      return false;
    }

    const rows = await sheet.getRows();
    const CM = COLUMN_MAPPINGS.SUBMISSIONS;

    for (const row of rows) {
      if (getString(row, CM.SUBMISSION_ID) === submissionId) {
        row.set(CM.STATUS, status);
        await row.save();
        return true;
      }
    }

    return false;
  });
}
