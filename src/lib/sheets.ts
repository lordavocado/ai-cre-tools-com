
import type { DirectoryItem, Category, Guide } from '@/types';
import { GoogleSpreadsheet, type GoogleSpreadsheetRow } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { Briefcase, Users, Palette, BarChart, Settings, ShieldCheck, FileText, Lightbulb, Zap, SearchCode } from 'lucide-react';
import type React from 'react';

// Helper to map icon names from sheet to Lucide components
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
  SearchCode, // Added for 'seo' example if needed
  // Add more mappings here as you define them in your sheet
};

const SHEET_ID = process.env.GOOGLE_SHEET_ID!;
const SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!;
const PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY!.replace(/\\n/g, '\n');

const jwt = new JWT({
  email: SERVICE_ACCOUNT_EMAIL,
  key: PRIVATE_KEY,
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(SHEET_ID, jwt);

// Helper to safely get string value from row
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

async function loadDocInfo() {
  if (!doc.title) { // Check if doc info is already loaded
    await doc.loadInfo();
  }
}

export async function getDirectoryItems(searchTerm?: string, categoryFilter?: string): Promise<DirectoryItem[]> {
  if (allItemsCache && !searchTerm && !categoryFilter) { // Basic caching for full list
    return allItemsCache;
  }

  await loadDocInfo();
  const sheet = doc.sheetsByTitle['Items'];
  if (!sheet) {
    console.error("Sheet 'Items' not found.");
    return [];
  }
  const rows = await sheet.getRows();
  
  let items: DirectoryItem[] = rows.map((row): DirectoryItem => ({
    id: getString(row, 'ID') || `row-${row.rowNumber}`, // Fallback ID
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
    lastUpdated: getOptionalString(row, 'Last Updated'), // Ensure this is a valid date string or handle conversion
    foundedYear: getNumber(row, 'Founded Year'),
    socials: getJSON<{ twitter?: string; linkedin?: string; facebook?: string }>(row, 'Socials JSON'),
  }));

  if (!searchTerm && !categoryFilter) {
    allItemsCache = items; // Cache the full list
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
  const items = await getDirectoryItems(); // This will use cache if available for full list
  return items.find(item => item.slug === slug);
}

export async function getCategories(): Promise<Category[]> {
  if (allCategoriesCache) return allCategoriesCache;

  await loadDocInfo();
  const sheet = doc.sheetsByTitle['Categories'];
   if (!sheet) {
    console.error("Sheet 'Categories' not found.");
    return [];
  }
  const rows = await sheet.getRows();
  const allDirItems = await getDirectoryItems(); // For itemCount

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
      icon: lucideIconMap[iconName] || Lightbulb, // Default to Lightbulb if not found
    };
  });
  return allCategoriesCache;
}

export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const categories = await getCategories(); // Uses cache
  return categories.find(cat => cat.slug === slug);
}

export async function getGuides(searchTerm?: string): Promise<Guide[]> {
   if (allGuidesCache && !searchTerm) return allGuidesCache;

  await loadDocInfo();
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
    content: getString(row, 'Content'), // Assuming Markdown
    imageUrl: getOptionalString(row, 'Image URL'),
    category: getOptionalString(row, 'Category Slug'),
    relatedItemSlugs: getArrayStrings(row, 'Related Item Slugs'),
    publishedDate: getString(row, 'Published Date'), // Ensure this is a valid date string
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
  const guides = await getGuides(); // Uses cache
  return guides.find(guide => guide.slug === slug);
}

export async function submitNewsletter(email: string): Promise<{ success: boolean; message: string }> {
  if (!email || !email.includes('@')) {
    return { success: false, message: 'Please enter a valid email address.' };
  }
  try {
    await loadDocInfo();
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

// --- Functions that operate on fetched data ---

export async function getItemsForComparison(ids: string[]): Promise<DirectoryItem[]> {
  const allItems = await getDirectoryItems();
  return allItems.filter(item => ids.includes(item.id));
}

// This is a mock for the AI feature. In a real app, this would call a Genkit flow.
// It now operates on live data fetched from sheets if allItems is populated.
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
  // Add logic to determine "featured" items, e.g., highest rating, or a specific "Featured" column in sheet
  // For now, just taking top rated or first few.
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

// Function to clear cache, e.g., if data is updated
export function clearSheetCache() {
  allItemsCache = null;
  allCategoriesCache = null;
  allGuidesCache = null;
  console.log("Sheet cache cleared.");
}
