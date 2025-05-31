import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  // Validate URL format
  try {
    new URL(imageUrl);
  } catch {
    return new NextResponse('Invalid image URL', { status: 400 });
  }

  try {
    // Try multiple strategies to fetch the image
    const strategies = [
      // Strategy 1: Direct fetch with browser headers
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'image/*,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate, br',
          'Referer': new URL(imageUrl).origin,
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
        }
      },
      // Strategy 2: Try as a bot/crawler
      {
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
          'Accept': 'image/*',
        }
      },
      // Strategy 3: Minimal headers
      {
        headers: {
          'User-Agent': 'curl/7.68.0',
          'Accept': '*/*',
        }
      }
    ];

    let lastError: Error | null = null;

    for (const strategy of strategies) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout per strategy

        const response = await fetch(imageUrl, {
          signal: controller.signal,
          headers: strategy.headers,
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          
          // Validate content type
          if (contentType && contentType.startsWith('image/')) {
            const imageBuffer = await response.arrayBuffer();

            return new NextResponse(imageBuffer, {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
                'Access-Control-Allow-Origin': '*',
              },
            });
          }
        }

        lastError = new Error(`Strategy failed: ${response.status} ${response.statusText}`);
      } catch (strategyError) {
        lastError = strategyError instanceof Error ? strategyError : new Error('Unknown strategy error');
        // Continue to next strategy
      }
    }

    // If all strategies fail, try to generate a favicon URL as fallback
    try {
      const url = new URL(imageUrl);
      const faviconUrl = `https://www.google.com/s2/favicons?domain=${url.hostname}&sz=64`;
      
      const faviconResponse = await fetch(faviconUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)' }
      });

      if (faviconResponse.ok) {
        const faviconBuffer = await faviconResponse.arrayBuffer();
        return new NextResponse(faviconBuffer, {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    } catch (faviconError) {
      // Favicon fallback also failed
    }

    throw lastError || new Error('All strategies failed');
  } catch (error) {
    console.error('Image proxy error:', error);
    
    // Return a fallback image or placeholder
    return NextResponse.redirect(new URL('/product-analytics-tools-logo.png', request.url));
  }
} 