import { NextRequest, NextResponse } from 'next/server';
import { getAllBlogPosts, getBlogPostsByCategory } from '@/lib/blog';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search');
  const category = searchParams.get('category');

  try {
    let posts = await getAllBlogPosts();

    // Filter by category if provided
    if (category) {
      posts = await getBlogPostsByCategory(category);
    }

    // Filter by search term if provided
    if (search && search.length >= 2) {
      const lowerSearch = search.toLowerCase();
      const searchTerms = lowerSearch.split(/\s+/).filter(term => term.length > 0);
      
      posts = posts.filter(post => {
        const title = post.title.toLowerCase();
        const excerpt = post.excerpt.toLowerCase();
        const content = post.content.toLowerCase();
        const category = post.category.toLowerCase();
        const author = post.author.toLowerCase();
        
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

    return NextResponse.json(posts);
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json([], { status: 500 });
  }
}