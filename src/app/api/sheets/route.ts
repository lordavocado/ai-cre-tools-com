import { NextResponse } from 'next/server';
import { getDirectoryItems, getCategories, getDirectoryItemBySlug } from '@/lib/supabase';
import { getGuides } from '@/lib/markdown';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type'); // e.g., 'items', 'categories', 'guides'
  const slug = searchParams.get('slug');
  const searchTerm = searchParams.get('search');
  const categoryFilter = searchParams.get('category');

  try {
    if (type === 'items') {
      if (slug) {
        const item = await getDirectoryItemBySlug(slug);
        return item
          ? NextResponse.json(item, {
              headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
              },
            })
          : NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      const items = await getDirectoryItems(searchTerm || undefined, categoryFilter || undefined);
      return NextResponse.json(items, {
        headers: {
          // Cache at the CDN to reduce repeated Sheets reads + function invocations.
          // Searches still benefit from short caching during bursts.
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    if (type === 'categories') {
      const categories = await getCategories();
      return NextResponse.json(categories, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    if (type === 'guides') {
      const guides = await getGuides(searchTerm || undefined);
      return NextResponse.json(guides, {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
        },
      });
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
