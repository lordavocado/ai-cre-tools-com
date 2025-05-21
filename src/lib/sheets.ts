
import type { DirectoryItem, Category, Guide } from '@/types';
import { GoogleSpreadsheet, type GoogleSpreadsheetRow, type GoogleSpreadsheetWorksheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Briefcase, Users, Palette, BarChart, Settings, ShieldCheck, FileText, Lightbulb, Zap, SearchCode } from 'lucide-react';
import type React from 'react';

const lucideIconMap: { [key: string]: React.ElementType } = {
  Briefcase,
  Users,
  Palette,
  BarChart,
  Settings,
  ShieldCheck,
  FileText,
  Lightbulb,
  Zap,
  SearchCode,
};

let docInstance: GoogleSpreadsheet | null = null;
let docInfoLoaded: boolean = false; 
let currentSheetId: string | null = null;
let currentServiceAccountEmail: string | null = null;


async function getInitializedDoc(): Promise<GoogleSpreadsheet> {
  const sheetIdEnv = process.env.GOOGLE_SHEET_ID;
  const serviceAccountEmailEnv = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawPrivateKeyEnv = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetIdEnv) {
    throw new Error('GOOGLE_SHEET_ID is not defined in .env.local. Please ensure it is set.');
  }
  if (!serviceAccountEmailEnv) {
    throw new Error('GOOGLE_SERVICE_ACCOUNT_EMAIL is not defined in .env.local. Please ensure it is set.');
  }
  if (!rawPrivateKeyEnv) {
    throw new Error('GOOGLE_PRIVATE_KEY is not defined in .env.local. Please ensure it is set and properly formatted (e.g., newlines escaped as \\n in the .env.local file).');
  }

  // Check if configuration has changed or if the doc was never initialized/loaded properly
  if (docInstance && docInfoLoaded && 
      currentSheetId === sheetIdEnv && 
      currentServiceAccountEmail === serviceAccountEmailEnv) {
    return docInstance;
  }

  // If config changed or not loaded, re-initialize
  console.log("Initializing Google Sheets connection...");
  currentSheetId = sheetIdEnv;
  currentServiceAccountEmail = serviceAccountEmailEnv;

  const privateKeyProcessed = rawPrivateKeyEnv.replace(/\\n/g, '\n');
  
  const jwt = new JWT({
    email: serviceAccountEmailEnv,
    key: privateKeyProcessed,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  docInstance = new GoogleSpreadsheet(sheetIdEnv, jwt);
  docInfoLoaded = false; 

  try {
    await docInstance.loadInfo();
    docInfoLoaded = true;
    console.log("Successfully loaded Google Sheet document info.");
  } catch (error) {
    console.error("Failed to load Google Sheet document info:", error);
    docInstance = null; 
    docInfoLoaded = false;
    currentSheetId = null; // Reset tracking vars on error
    currentServiceAccountEmail = null;
    throw new Error(`Failed to load Google Sheet. Check sheet ID, permissions, and credentials. Original error: ${error instanceof Error ? error.message : String(error)}`);
  }
  
  return docInstance;
}

const getString = (row: GoogleSpreadsheetRow<any>, header: string): string => row.get(header)?.toString().trim() || '';
const getOptionalString = (row: GoogleSpreadsheetRow<any>, header: string): string | undefined => {
  const val = row.get(header)?.toString().trim();
  return val ? val : undefined;
}
const getNumber = (row: GoogleSpreadsheetRow<any>, header: string): number | undefined => {
  const val = parseFloat(row.get(header));
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
    console.error(`Failed to parse JSON for header "${header}" in row ${row.rowNumber}:`, e, `Value: "${val}"`);
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
  const sheet = doc.sheetsByTitle['Items'];
  if (!sheet) {
    console.error("Sheet 'Items' not found.");
    return [];
  }
  const rows = await sheet.getRows();
  
  let items: DirectoryItem[] = rows.map((row): DirectoryItem => ({
    id: getString(row, 'ID') || `row-${row.rowNumber}`,
    slug: getString(row, 'Slug'),
    name: getString(row, 'Name'),
    tagline: getString(row, 'Tagline'),
    description: getString(row, 'Description'),
    longDescription: getOptionalString(row, 'Long Description'),
    category: getString(row, 'Category Slug'),
    website: getString(row, 'Website'),
    imageUrl: getOptionalString(row, 'Image URL'),
    features: getJSON<{ name: string; description?: string }[]>(row, 'Features JSON') || [],
    pricing: getOptionalString(row, 'Pricing'),
    rating: getNumber(row, 'Rating'),
    reviewCount: getNumber(row, 'Review Count'),
    pros: getArrayStrings(row, 'Pros'),
    cons: getArrayStrings(row, 'Cons'),
    lastUpdated: getOptionalString(row, 'Last Updated'),
    foundedYear: getNumber(row, 'Founded Year'),
    socials: getJSON<{ twitter?: string; linkedin?: string; facebook?: string }>(row, 'Socials JSON'),
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
  const sheet = doc.sheetsByTitle['Categories'];
   if (!sheet) {
    console.error("Sheet 'Categories' not found.");
    return [];
  }
  const rows = await sheet.getRows();
  const allDirItems = await getDirectoryItems(); 

  allCategoriesCache = rows.map((row): Category => {
    const slug = getString(row, 'Slug');
    const iconName = getString(row, 'Icon Name');
    return {
      id: getString(row, 'ID') || `cat-row-${row.rowNumber}`,
      slug: slug,
      name: getString(row, 'Name'),
      description: getString(row, 'Description'),
      longDescription: getOptionalString(row, 'Long Description'),
      imageUrl: getOptionalString(row, 'Image URL'),
      itemCount: allDirItems.filter(item => item.category === slug).length,
      icon: lucideIconMap[iconName] || Lightbulb,
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
  const sheet = doc.sheetsByTitle['Guides'];
  if (!sheet) {
    console.error("Sheet 'Guides' not found.");
    return [];
  }
  const rows = await sheet.getRows();

  let guides: Guide[] = rows.map((row): Guide => ({
    id: getString(row, 'ID') || `guide-row-${row.rowNumber}`,
    slug: getString(row, 'Slug'),
    title: getString(row, 'Title'),
    excerpt: getString(row, 'Excerpt'),
    content: getString(row, 'Content'),
    imageUrl: getOptionalString(row, 'Image URL'),
    category: getOptionalString(row, 'Category Slug'),
    relatedItemSlugs: getArrayStrings(row, 'Related Item Slugs'),
    publishedDate: getString(row, 'Published Date'),
    author: getOptionalString(row, 'Author'),
    readingTime: getOptionalString(row, 'Reading Time'),
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
    const sheet = doc.sheetsByTitle['Newsletter'];
    if (!sheet) {
      console.error("Sheet 'Newsletter' not found.");
      return { success: false, message: 'Could not subscribe. Service error.' };
    }
    await sheet.addRow({ Email: email, Timestamp: new Date().toISOString() });
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

export async function getAISuggestedDifferences(itemsToCompare: DirectoryItem[]): Promise<string[]> {
  if (itemsToCompare.length < 2) return ["Please select at least two items to compare."];

  // This is still mock data as per previous implementation
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
  return allItems.sort((a,b) => (b.rating || 0) - (a.rating || 0) ).slice(0, limit);
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
    .sort((a,b) => (b.itemCount || 0) - (a.itemCount || 0))
    .slice(0, limit);
}

export function clearSheetCache() {
  allItemsCache = null;
  allCategoriesCache = null;
  allGuidesCache = null;
  docInstance = null; 
  docInfoLoaded = false;
  currentSheetId = null;
  currentServiceAccountEmail = null;
  console.log("Sheet cache and doc instance cleared.");
}

    