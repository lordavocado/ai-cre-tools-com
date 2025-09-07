import { NextRequest, NextResponse } from 'next/server';
import { generateURLSuggestions } from '@/lib/routing-utils';

/**
 * API route for generating URL suggestions for 404 pages
 * This allows client-side components to get suggestions without importing server-only libraries
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    const suggestions = await generateURLSuggestions(path);

    return NextResponse.json(suggestions, {
      headers: {
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600', // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error('Error generating URL suggestions:', error);
    
    // Return empty suggestions on error
    return NextResponse.json([], {
      headers: {
        'Cache-Control': 'public, max-age=60', // Shorter cache on error
      },
    });
  }
}