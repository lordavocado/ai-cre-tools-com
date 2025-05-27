import { NextResponse } from 'next/server';
import { getDirectoryItems, getCategories, getDirectoryItemBySlug, getAISuggestedDifferences, getItemsForComparison } from '@/lib/sheets';
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
        return item ? NextResponse.json(item) : NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }
      const items = await getDirectoryItems(searchTerm || undefined, categoryFilter || undefined);
      return NextResponse.json(items);
    }

    if (type === 'categories') {
      const categories = await getCategories();
      return NextResponse.json(categories);
    }

    if (type === 'guides') {
      const guides = await getGuides(searchTerm || undefined);
      return NextResponse.json(guides);
    }

    if (type === 'ai-suggestions') {
      const itemIds = searchParams.get('itemIds')?.split(',') || [];
      if (itemIds.length < 2) {
        return NextResponse.json({ error: 'At least 2 item IDs required for AI suggestions' }, { status: 400 });
      }
      const items = await getItemsForComparison(itemIds);
      const suggestions = await getAISuggestedDifferences(items);
      return NextResponse.json(suggestions);
    }

    return NextResponse.json({ error: 'Invalid type specified' }, { status: 400 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to fetch data' }, { status: 500 });
  }
}
