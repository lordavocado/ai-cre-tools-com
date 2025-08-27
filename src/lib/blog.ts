import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';

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
}

export function getAllBlogPosts(): BlogPost[] {
  const fileNames = fs.readdirSync(blogDirectory);
  const allPostsData = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const id = fileName.replace(/\.md$/, '');
      const fullPath = path.join(blogDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const matterResult = matter(fileContents);

      const processedContent = remark()
        .use(remarkHtml)
        .processSync(matterResult.content);
      const htmlContent = processedContent.toString();

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
      } as BlogPost;
    });

  return allPostsData.sort((a, b) => (a.publishedDate < b.publishedDate ? 1 : -1));
}

export function getBlogPost(slug: string): BlogPost | undefined {
  const allPosts = getAllBlogPosts();
  return allPosts.find(post => post.slug === slug);
}

export function getBlogPostsByCategory(category: string): BlogPost[] {
  const allPosts = getAllBlogPosts();
  return allPosts.filter(post => post.category.toLowerCase() === category.toLowerCase());
}

export function getAllCategories(): string[] {
  const allPosts = getAllBlogPosts();
  const categories = allPosts.map(post => post.category);
  return Array.from(new Set(categories));
}
