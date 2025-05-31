import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface GuideFrontmatter {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category?: string;
  publishedDate: string;
  author?: string;
  readingTime?: string;
  imageUrl?: string;
  relatedItems?: string[];
}

export interface Guide extends GuideFrontmatter {
  content: string;
}

const guidesDirectory = path.join(process.cwd(), 'src/content/guides');

// Helper function to normalize relatedItems from different formats
function normalizeRelatedItems(relatedItems: any): string[] {
  if (!relatedItems) return [];
  
  // If it's already an array of strings
  if (Array.isArray(relatedItems) && relatedItems.every(item => typeof item === 'string')) {
    return relatedItems;
  }
  
  // If it's an array of objects (Pages CMS format)
  if (Array.isArray(relatedItems) && relatedItems.every(item => typeof item === 'object' && item.slug)) {
    return relatedItems.map(item => item.slug);
  }
  
  // If it's a string (fallback)
  if (typeof relatedItems === 'string') {
    return [relatedItems];
  }
  
  return [];
}

export async function getGuides(searchTerm?: string): Promise<Guide[]> {
  const fileNames = fs.readdirSync(guidesDirectory);
  let guides = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const fullPath = path.join(guidesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Normalize the frontmatter data
      const normalizedData = {
        ...data,
        relatedItems: normalizeRelatedItems(data.relatedItems),
      } as GuideFrontmatter;
      
      return {
        ...normalizedData,
        content,
      };
    })
    .sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());

  // Apply search filter if searchTerm is provided
  if (searchTerm) {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const searchTerms = lowerSearchTerm.split(/\s+/).filter(term => term.length > 0);
    
    guides = guides.filter(guide => {
      const title = guide.title.toLowerCase();
      const excerpt = guide.excerpt.toLowerCase();
      const content = guide.content.toLowerCase();
      const category = guide.category?.toLowerCase() || '';
      const author = guide.author?.toLowerCase() || '';
      
      // Check if all search terms are found in any of the fields
      return searchTerms.every(term => 
        title.includes(term) || 
        excerpt.includes(term) || 
        content.includes(term) ||
        category.includes(term) ||
        author.includes(term)
      );
    });
  }

  return guides;
}

export async function getGuideBySlug(slug: string): Promise<Guide | undefined> {
  const guides = await getGuides();
  return guides.find(guide => guide.slug === slug);
}

export async function getRecentGuides(limit: number = 3): Promise<Guide[]> {
  const guides = await getGuides();
  return guides.slice(0, limit);
} 