if (typeof window !== 'undefined') {
  throw new Error('This module can only be used on the server side');
}

import type { DirectoryItem, Category } from '@/types';
import { GoogleSpreadsheet, type GoogleSpreadsheetRow, type GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Briefcase, Users, Palette, BarChart, Settings, ShieldCheck, FileText, Lightbulb, Zap, SearchCode, Code, type LucideIcon } from 'lucide-react';
import type React from 'react';

// --- Configuration ---

// 1. Sheet Names Configuration:
const SHEET_NAMES = {
  ITEMS: 'productanalyticstools',
  NEWSLETTER: 'Newsletter',
};

// 2. Column Name Mappings Configuration:
const COLUMN_MAPPINGS = {
  ITEMS: {
    ID: 'id',
    SLUG: 'id', // Using id as slug since there's no dedicated slug column
    NAME: 'name',
    TAGLINE: 'one_liner',
    DESCRIPTION: 'description',
    CATEGORY_SLUG: 'category',
    WEBSITE: 'website',
    IMAGE_URL: 'icon_link',
    FEATURES_JSON: 'key_features', // Expects: [{"name": "Feature 1", "description": "Optional desc"}, {"name": "Feature 2"}]
    PRICING: 'pricing',
    BEST_FOR: 'best_for',
    TAGS: 'tags',
    RATING: 'rating',
  },
  NEWSLETTER: {
    EMAIL: 'Email',
    TIMESTAMP: 'Timestamp',
  },
};

// --- End Configuration ---

const lucideIconMap: { [key: string]: LucideIcon } = {
  Briefcase, Users, Palette, BarChart, Settings, ShieldCheck, FileText, Lightbulb, Zap, SearchCode,
};

// Hardcoded categories
const HARDCODED_CATEGORIES: Category[] = [
  {
    id: 'analytics',
    slug: 'analytics',
    name: 'Analytics',
    description: 'Tools for tracking and analyzing user behavior and website performance',
    longDescription: 'Comprehensive analytics solutions for understanding user behavior, tracking conversions, and measuring website performance.',
    imageUrl: '/categories/analytics.jpg',
    itemCount: 0, // Will be calculated dynamically
    icon: BarChart,
  },
  {
    id: 'product',
    slug: 'product',
    name: 'Product Analytics',
    description: 'Tools for understanding product usage and user engagement',
    longDescription: 'Deep insights into how users interact with your product, feature usage, and user engagement metrics.',
    imageUrl: '/categories/product.jpg',
    itemCount: 0,
    icon: Users,
  },
  {
    id: 'design',
    slug: 'design',
    name: 'Design Tools',
    description: 'Tools for creating and managing design assets',
    longDescription: 'Professional design tools for creating, managing, and collaborating on design assets and prototypes.',
    imageUrl: '/categories/design.jpg',
    itemCount: 0,
    icon: Palette,
  },
  {
    id: 'development',
    slug: 'development',
    name: 'Development',
    description: 'Tools for developers and technical teams',
    longDescription: 'Essential tools for developers, from code editors to deployment platforms and development utilities.',
    imageUrl: '/categories/development.jpg',
    itemCount: 0,
    icon: Code,
  },
  {
    id: 'marketing',
    slug: 'marketing',
    name: 'Marketing',
    description: 'Tools for marketing and growth teams',
    longDescription: 'Comprehensive marketing tools for campaigns, automation, and growth strategies.',
    imageUrl: '/categories/marketing.jpg',
    itemCount: 0,
    icon: Zap,
  },
  {
    id: 'security',
    slug: 'security',
    name: 'Security',
    description: 'Tools for protecting your application and data',
    longDescription: 'Enterprise-grade security solutions for protecting your applications, data, and infrastructure.',
    imageUrl: '/categories/security.jpg',
    itemCount: 0,
    icon: ShieldCheck,
  }
];

let docInstance: GoogleSpreadsheet | null = null;
let docInfoLoaded: boolean = false;

// Cache for environment variables to avoid repeated lookups if they were initially found
let cachedSheetId: string | null = null;
let cachedServiceAccountEmail: string | null = null;
let cachedPrivateKey: string | null = null;

let allItemsCache: DirectoryItem[] | null = null;

async function getInitializedDoc(): Promise<GoogleSpreadsheet> {
  // Try to use cached credentials if available and docInstance is not set or info not loaded
  if (docInstance && docInfoLoaded && 
      process.env.GOOGLE_SHEET_ID === cachedSheetId &&
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL === cachedServiceAccountEmail &&
      process.env.GOOGLE_PRIVATE_KEY === cachedPrivateKey) {
    return docInstance;
  }

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
  
  console.log("Attempting to initialize Google Sheets connection with environment variables...");

  const privateKeyProcessed = rawPrivateKey.replace(/\\n/g, '\n');

  const jwt = new JWT({
    email: serviceAccountEmail,
    key: privateKeyProcessed,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const newDocInstance = new GoogleSpreadsheet(sheetId, jwt);
  
  try {
    await newDocInstance.loadInfo(); // Loads document properties and worksheets
    docInstance = newDocInstance;
    docInfoLoaded = true;

    // Cache the successfully used environment variable values
    cachedSheetId = sheetId;
    cachedServiceAccountEmail = serviceAccountEmail;
    cachedPrivateKey = rawPrivateKey; // Cache the raw key as it was read from env

    console.log(`Successfully loaded Google Sheet document: "${docInstance.title}"`);
  } catch (error) {
    console.error("Failed to load Google Sheet document info:", error);
    // Clear potentially stale cache on error
    docInstance = null;
    docInfoLoaded = false;
    cachedSheetId = null;
    cachedServiceAccountEmail = null;
    cachedPrivateKey = null;
    throw new Error(`Failed to load Google Sheet. Check sheet ID, permissions for ${serviceAccountEmail}, and credentials. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }

  return docInstance;
}

const getString = (row: GoogleSpreadsheetRow<any>, header: string): string => row.get(header)?.toString().trim() || '';
const getOptionalString = (row: GoogleSpreadsheetRow<any>, header: string): string | undefined => {
  const val = row.get(header)?.toString().trim();
  return val ? val : undefined;
}
const getNumber = (row: GoogleSpreadsheetRow<any>, header: string): number | undefined => {
  const valStr = row.get(header)?.toString().trim();
  if (valStr === undefined || valStr === null || valStr === '') return undefined;
  const val = parseFloat(valStr);
  return isNaN(val) ? undefined : val;
}
const getArrayStrings = (row: GoogleSpreadsheetRow<any>, header: string): string[] | undefined => {
  const val = row.get(header)?.toString().trim();
  if (!val) return undefined;
  
  return val
    .split(',')
    .map((s: string) => s.trim())
    .map((s: string) => s.replace(/^#/, '').trim()) // Remove leading # if present
    .filter((s: string) => s); // Remove empty strings
}
const getJSON = <T>(row: GoogleSpreadsheetRow<any>, header: string): T | undefined => {
  const val = row.get(header)?.toString().trim();
  if (!val) return undefined;
  try {
    return JSON.parse(val) as T;
  } catch (e) {
    console.warn(`Failed to parse JSON for header "${header}" in row ${row.rowNumber}:`, e, `Value: "${val}"`);
    return undefined;
  }
}

// Add this helper function after the other helper functions
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

// Update the getDirectoryItems function
export async function getDirectoryItems(searchTerm?: string, categoryFilter?: string): Promise<DirectoryItem[]> {
  if (allItemsCache && !searchTerm && !categoryFilter) {
    return allItemsCache;
  }

  const doc = await getInitializedDoc();
  const sheet = doc.sheetsByTitle[SHEET_NAMES.ITEMS];
  if (!sheet) {
    console.error(`Sheet '${SHEET_NAMES.ITEMS}' not found. Check SHEET_NAMES configuration in src/lib/sheets.ts.`);
    return [];
  }
  const rows = await sheet.getRows();
  const CM = COLUMN_MAPPINGS.ITEMS; // Alias for brevity
  
  let items: DirectoryItem[] = rows.map((row): DirectoryItem => {
    const baseId = getString(row, CM.ID);
    return {
      id: `${baseId}-${row.rowNumber}`, // Make ID unique by combining with row number
      slug: baseId, // Keep the original ID as the slug
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
    };
  });

  if (!searchTerm && !categoryFilter) {
    allItemsCache = items;
  }

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
    items = items.filter(item => categoryFilters.includes(item.category));
  }
  return items;
}

export async function getDirectoryItemBySlug(slug: string): Promise<DirectoryItem | undefined> {
  const items = await getDirectoryItems();
  return items.find(item => item.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  const allDirItems = await getDirectoryItems();
  
  // Update itemCount for each category based on actual items
  return HARDCODED_CATEGORIES.map(category => ({
    ...category,
    itemCount: allDirItems.filter(item => item.category === category.slug).length
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug);
}

// Newsletter subscription (Mailchimp integration placeholder)
// To enable Mailchimp integration:
// 1. Set MAILCHIMP_API_KEY and MAILCHIMP_LIST_ID in your environment variables.
// 2. Implement the API call in the function below.

export async function submitNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }

  // TODO: Integrate with Mailchimp API
  // Example:
  // const response = await fetch('https://<dc>.api.mailchimp.com/3.0/lists/' + process.env.MAILCHIMP_LIST_ID + '/members', {
  //   method: 'POST',
  //   headers: {
  //     'Authorization': 'apikey ' + process.env.MAILCHIMP_API_KEY,
  //     'Content-Type': 'application/json',
  //   },
  //   body: JSON.stringify({ email_address: email, status: 'subscribed' }),
  // });
  // if (response.ok) return { success: true, message: 'Successfully subscribed to the newsletter!' };
  // else return { success: false, message: 'Subscription failed. Please try again later.' };

  return { success: true, message: 'This would subscribe to Mailchimp. (Integration not yet implemented.)' };
}

export async function getItemsForComparison(ids: string[]): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  return allItems.filter(item => ids.includes(item.id));
}

export async function getAISuggestedDifferences(itemsToCompare: DirectoryItem[]): Promise<string[]> {
  if (itemsToCompare.length < 2) return ["Please select at least two items to compare."];

  const suggestions = [
    `${itemsToCompare[0].name} excels in ${itemsToCompare[0].features?.[0]?.name || 'key areas'}, while ${itemsToCompare[1].name} offers strong ${itemsToCompare[1].features?.[0]?.name || 'alternative features'}.`,
    `Consider ${itemsToCompare[0].name}'s pricing (${itemsToCompare[0].pricing || 'N/A'}) versus ${itemsToCompare[1].name}'s (${itemsToCompare[1].pricing || 'N/A'}) for your budget.`,
  ];
  if (itemsToCompare.length > 2 && itemsToCompare[2]) {
    suggestions.push(`${itemsToCompare[2].name} provides a unique approach with its ${itemsToCompare[2].tagline?.toLowerCase() || 'features'}.`);
  }
  return suggestions;
}

export async function getFeaturedItems(limit: number = 3): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  return allItems
    .filter(item => typeof item.rating === 'number') 
    .sort((a,b) => (b.rating!) - (a.rating!)) 
    .slice(0, limit);
}

export function clearSheetCache() {
  allItemsCache = null;
  docInstance = null; 
  docInfoLoaded = false;
  cachedSheetId = null;
  cachedServiceAccountEmail = null;
  cachedPrivateKey = null;
  console.log("Sheet cache and Google Doc instance cleared. Data will be re-fetched on next request.");
}
