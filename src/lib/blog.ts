import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { markdownToHtml, generateTableOfContents } from '@/lib/markdown-renderer';

const blogDirectory = path.join(process.cwd(), 'src/content/blog');

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  author: string;
  readingTime: string;
  imageUrl: string;
  content: string;
  htmlContent: string;
  toc?: Array<{ text: string; id: string; level: number }>;
}

export function getAllBlogPosts(): BlogPost[] {
  try {
    // Check if blog directory exists
    if (!fs.existsSync(blogDirectory)) {
      console.warn(`Blog directory does not exist: ${blogDirectory}`);
      return [];
    }

    const fileNames = fs.readdirSync(blogDirectory);
    const allPostsData = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      const htmlContent = await markdownToHtml(matterResult.content);
      const toc = generateTableOfContents(matterResult.content);

      return {
        id,
        slug: matterResult.data.slug || id,
        title: matterResult.data.title,
        excerpt: matterResult.data.excerpt,
        category: matterResult.data.category,
        publishedDate: matterResult.data.publishedDate,
        author: matterResult.data.author,
        readingTime: matterResult.data.readingTime,
        imageUrl: matterResult.data.imageUrl,
        content: matterResult.content,
        htmlContent,
        toc,
        } as BlogPost;
      });

    return allPostsData.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
  } catch (error) {
    console.error('Error loading blog posts:', error);
    return [];
  }
}

export function getBlogPost(slug: string): BlogPost | undefined {
  try {
    const allPosts = getAllBlogPosts();
    return allPosts.find(post => post.slug === slug);
  } catch (error) {
    console.error('Error getting blog post:', error);
    return undefined;
  }
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  try {
    const allPosts = getAllBlogPosts();
    return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
  } catch (error) {
    console.error('Error getting blog posts by category:', error);
    return [];
  }
}

export function getAllCategories(): string[] {
  try {
    const allPosts = getAllBlogPosts();
    const categories = allPosts.map(post => post.category);
    return Array.from(new Set(categories));
  } catch (error) {
    console.error('Error getting blog categories:', error);
    return [];
  }
}
