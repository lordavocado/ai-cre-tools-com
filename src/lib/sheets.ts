
import type { DirectoryItem, Category, Guide } from '@/types';
import { GoogleSpreadsheet, type GoogleSpreadsheetRow, type GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Briefcase, Users, Palette, BarChart, Settings, ShieldCheck, FileText, Lightbulb, Zap, SearchCode, type LucideIcon } from 'lucide-react';
import type React from 'react';

// --- Configuration ---

// 1. Sheet Names Configuration:
//    Update these values if your sheet (tab) names are different.
const SHEET_NAMES = {
  ITEMS: 'Items',
  CATEGORIES: 'Categories',
  GUIDES: 'Guides',
  NEWSLETTER: 'Newsletter',
};

// 2. Column Name Mappings Configuration:
//    Update these values to match the exact column headers in your Google Sheet for each corresponding data field.
const COLUMN_MAPPINGS = {
  ITEMS: {
    ID: 'ID',
    SLUG: 'Slug',
    NAME: 'Name',
    TAGLINE: 'Tagline',
    DESCRIPTION: 'Description',
    LONG_DESCRIPTION: 'Long Description',
    CATEGORY_SLUG: 'Category Slug',
    WEBSITE: 'Website',
    IMAGE_URL: 'Image URL',
    FEATURES_JSON: 'Features JSON', // Expects: [{"name": "Feature 1", "description": "Optional desc"}, {"name": "Feature 2"}]
    PRICING: 'Pricing',
    RATING: 'Rating',
    REVIEW_COUNT: 'Review Count',
    PROS: 'Pros', // Expects: Comma-separated string, e.g., "Pro 1,Pro 2,Pro 3"
    CONS: 'Cons', // Expects: Comma-separated string, e.g., "Con 1,Con 2"
    LAST_UPDATED: 'Last Updated', // Expects: Date string, e.g., "2024-05-20"
    FOUNDED_YEAR: 'Founded Year',
    SOCIALS_JSON: 'Socials JSON', // Expects: {"twitter": "handle", "linkedin": "company/handle"}
  },
  CATEGORIES: {
    ID: 'ID',
    SLUG: 'Slug',
    NAME: 'Name',
    DESCRIPTION: 'Description',
    LONG_DESCRIPTION: 'Long Description',
    IMAGE_URL: 'Image URL',
    ICON_NAME: 'Icon Name', // Name of a Lucide icon, e.g., "Zap"
  },
  GUIDES: {
    ID: 'ID',
    SLUG: 'Slug',
    TITLE: 'Title',
    EXCERPT: 'Excerpt',
    CONTENT: 'Content', // Markdown content
    IMAGE_URL: 'Image URL',
    CATEGORY_SLUG: 'Category Slug',
    RELATED_ITEM_SLUGS: 'Related Item Slugs', // Expects: Comma-separated string of item slugs
    PUBLISHED_DATE: 'Published Date', // Expects: Date string, e.g., "2024-05-01"
    AUTHOR: 'Author',
    READING_TIME: 'Reading Time', // E.g., "5 min read"
  },
  NEWSLETTER: {
    EMAIL: 'Email',
    TIMESTAMP: 'Timestamp',
  },
};

// --- End Configuration ---

const lucideIconMap: { [key: string]: LucideIcon } = {
  Briefcase, Users, Palette, BarChart, Settings, ShieldCheck, FileText, Lightbulb, Zap, SearchCode,
  // Add more icons here if needed and reference them by key in your "Categories" sheet "Icon Name" column
};

let docInstance: GoogleSpreadsheet | null = null;
let docInfoLoaded: boolean = false;
let currentSheetIdEnv: string | null = null;
let currentServiceAccountEmailEnv: string | null = null;
let currentPrivateKeyEnv: string | null = null;


async function getInitializedDoc(): Promise<GoogleSpreadsheet> {
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

  if (docInstance && docInfoLoaded &&
      currentSheetIdEnv === sheetId &&
      currentServiceAccountEmailEnv === serviceAccountEmail &&
      currentPrivateKeyEnv === rawPrivateKey) {
    return docInstance;
  }

  console.log("Initializing Google Sheets connection...");
  currentSheetIdEnv = sheetId;
  currentServiceAccountEmailEnv = serviceAccountEmail;
  currentPrivateKeyEnv = rawPrivateKey;

  const privateKeyProcessed = rawPrivateKey.replace(/\\n/g, '\n');

  const jwt = new JWT({
    email: serviceAccountEmail,
    key: privateKeyProcessed,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  docInstance = new GoogleSpreadsheet(sheetId, jwt);
  docInfoLoaded = false;

  try {
    await docInstance.loadInfo(); // Loads document properties and worksheets
    docInfoLoaded = true;
    console.log(`Successfully loaded Google Sheet document: "${docInstance.title}"`);
  } catch (error) {
    console.error("Failed to load Google Sheet document info:", error);
    docInstance = null;
    docInfoLoaded = false;
    currentSheetIdEnv = null;
    currentServiceAccountEmailEnv = null;
    currentPrivateKeyEnv = null;
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
  return val ? val.split(',').map(s => s.trim()).filter(s => s) : undefined;
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

let allItemsCache: DirectoryItem[] | null = null;
let allCategoriesCache: Category[] | null = null;
let allGuidesCache: Guide[] | null = null;

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
  
  let items: DirectoryItem[] = rows.map((row): DirectoryItem => ({
    id: getString(row, CM.ID) || `item-row-${row.rowNumber}`, // Fallback ID
    slug: getString(row, CM.SLUG),
    name: getString(row, CM.NAME),
    tagline: getString(row, CM.TAGLINE),
    description: getString(row, CM.DESCRIPTION),
    longDescription: getOptionalString(row, CM.LONG_DESCRIPTION),
    category: getString(row, CM.CATEGORY_SLUG),
    website: getString(row, CM.WEBSITE),
    imageUrl: getOptionalString(row, CM.IMAGE_URL),
    features: getJSON<{ name: string; description?: string }[]>(row, CM.FEATURES_JSON) || [],
    pricing: getOptionalString(row, CM.PRICING),
    rating: getNumber(row, CM.RATING),
    reviewCount: getNumber(row, CM.REVIEW_COUNT),
    pros: getArrayStrings(row, CM.PROS),
    cons: getArrayStrings(row, CM.CONS),
    lastUpdated: getOptionalString(row, CM.LAST_UPDATED),
    foundedYear: getNumber(row, CM.FOUNDED_YEAR),
    socials: getJSON<{ twitter?: string; linkedin?: string; facebook?: string }>(row, CM.SOCIALS_JSON),
  }));

  if (!searchTerm && !categoryFilter) {
    allItemsCache = items;
  }

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    items = items.filter(item => 
      item.name.toLowerCase().includes(lowerSearchTerm) || 
      item.description.toLowerCase().includes(lowerSearchTerm) ||
      item.tagline.toLowerCase().includes(lowerSearchTerm)
    );
  }
  if (categoryFilter) {
    items = items.filter(item => item.category === categoryFilter);
  }
  return items;
}

export async function getDirectoryItemBySlug(slug: string): Promise<DirectoryItem | undefined> {
  const items = await getDirectoryItems();
  return items.find(item => item.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  if (allCategoriesCache) return allCategoriesCache;

  const doc = await getInitializedDoc();
  const sheet = doc.sheetsByTitle[SHEET_NAMES.CATEGORIES];
   if (!sheet) {
    console.error(`Sheet '${SHEET_NAMES.CATEGORIES}' not found. Check SHEET_NAMES configuration in src/lib/sheets.ts.`);
    return [];
  }
  const rows = await sheet.getRows();
  const allDirItems = await getDirectoryItems(); 
  const CM = COLUMN_MAPPINGS.CATEGORIES; // Alias for brevity

  allCategoriesCache = rows.map((row): Category => {
    const slug = getString(row, CM.SLUG);
    const iconName = getString(row, CM.ICON_NAME);
    return {
      id: getString(row, CM.ID) || `cat-row-${row.rowNumber}`, // Fallback ID
      slug: slug,
      name: getString(row, CM.NAME),
      description: getString(row, CM.DESCRIPTION),
      longDescription: getOptionalString(row, CM.LONG_DESCRIPTION),
      imageUrl: getOptionalString(row, CM.IMAGE_URL),
      itemCount: allDirItems.filter(item => item.category === slug).length,
      icon: lucideIconMap[iconName] || Lightbulb, // Default icon if not found
    };
  });
  return allCategoriesCache;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories();
  return categories.find(cat => cat.slug === slug);
}

export async function getGuides(searchTerm?: string): Promise<Guide[]> {
   if (allGuidesCache && !searchTerm) return allGuidesCache;

  const doc = await getInitializedDoc();
  const sheet = doc.sheetsByTitle[SHEET_NAMES.GUIDES];
  if (!sheet) {
    console.error(`Sheet '${SHEET_NAMES.GUIDES}' not found. Check SHEET_NAMES configuration in src/lib/sheets.ts.`);
    return [];
  }
  const rows = await sheet.getRows();
  const CM = COLUMN_MAPPINGS.GUIDES; // Alias for brevity

  let guides: Guide[] = rows.map((row): Guide => ({
    id: getString(row, CM.ID) || `guide-row-${row.rowNumber}`, // Fallback ID
    slug: getString(row, CM.SLUG),
    title: getString(row, CM.TITLE),
    excerpt: getString(row, CM.EXCERPT),
    content: getString(row, CM.CONTENT),
    imageUrl: getOptionalString(row, CM.IMAGE_URL),
    category: getOptionalString(row, CM.CATEGORY_SLUG),
    relatedItemSlugs: getArrayStrings(row, CM.RELATED_ITEM_SLUGS),
    publishedDate: getString(row, CM.PUBLISHED_DATE),
    author: getOptionalString(row, CM.AUTHOR),
    readingTime: getOptionalString(row, CM.READING_TIME),
  }));
  
  if (!searchTerm) {
    allGuidesCache = guides;
  }

  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    guides = guides.filter(guide => 
      guide.title.toLowerCase().includes(lowerSearchTerm) || 
      guide.excerpt.toLowerCase().includes(lowerSearchTerm)
    );
  }
  return guides;
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
  const guides = await getGuides();
  return guides.find(guide => guide.slug === slug);
}

export async function submitNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  try {
    const doc = await getInitializedDoc();
    const sheet = doc.sheetsByTitle[SHEET_NAMES.NEWSLETTER];
    if (!sheet) {
      console.error(`Sheet '${SHEET_NAMES.NEWSLETTER}' not found. Check SHEET_NAMES configuration in src/lib/sheets.ts.`);
      return { success: false, message: 'Could not subscribe. Service error.' };
    }
    const CM = COLUMN_MAPPINGS.NEWSLETTER;
    await sheet.addRow({ 
      [CM.EMAIL]: email, 
      [CM.TIMESTAMP]: new Date().toISOString() 
    });
    return { success: true, message: 'Successfully subscribed to the newsletter!' };
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return { success: false, message: 'Subscription failed. Please try again later.' };
  }
}

export async function getItemsForComparison(ids: string[]): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  return allItems.filter(item => ids.includes(item.id));
}

// This function uses mock data as per original implementation.
// If real AI comparison is needed, it would involve sending item data to an AI model.
export async function getAISuggestedDifferences(itemsToCompare: DirectoryItem[]): Promise<string[]> {
  if (itemsToCompare.length < 2) return ["Please select at least two items to compare."];

  const suggestions = [
    `${itemsToCompare[0].name} excels in ${itemsToCompare[0].pros?.[0] || 'key areas'}, while ${itemsToCompare[1].name} offers strong ${itemsToCompare[1].features?.[0]?.name || 'alternative features'}.`,
    `Consider ${itemsToCompare[0].name}'s pricing (${itemsToCompare[0].pricing || 'N/A'}) versus ${itemsToCompare[1].name}'s (${itemsToCompare[1].pricing || 'N/A'}) for your budget.`,
  ];
  if (itemsToCompare.length > 2 && itemsToCompare[2]) {
    suggestions.push(`${itemsToCompare[2].name} provides a unique approach with its ${itemsToCompare[2].tagline?.toLowerCase() || 'features'}.`);
  }
  suggestions.push("AI-powered comparison is a feature placeholder.");
  return suggestions;
}

export async function getFeaturedItems(limit: number = 3): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  // Simple sort by rating for featured items
  return allItems
    .filter(item => typeof item.rating === 'number') // Ensure rating is a number for sorting
    .sort((a,b) => (b.rating!) - (a.rating!)) // Non-null assertion as we filtered
    .slice(0, limit);
}

export async function getRecentGuides(limit: number = 3): Promise<Guide[]> {
  const allGuides = await getGuides();
  return allGuides
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime())
    .slice(0, limit);
}

export async function getTopCategories(limit: number = 4): Promise<Category[]> {
  const allCategories = await getCategories();
   return allCategories
    .filter(cat => typeof cat.itemCount === 'number') // Ensure itemCount is a number
    .sort((a,b) => (b.itemCount!) - (a.itemCount!)) // Non-null assertion
    .slice(0, limit);
}

// Call this function if you need to invalidate the cache (e.g., after updating the sheet)
export function clearSheetCache() {
  allItemsCache = null;
  allCategoriesCache = null;
  allGuidesCache = null;
  docInstance = null; 
  docInfoLoaded = false;
  currentSheetIdEnv = null;
  currentServiceAccountEmailEnv = null;
  currentPrivateKeyEnv = null;
  console.log("Sheet cache and Google Doc instance cleared. Data will be re-fetched on next request.");
}
