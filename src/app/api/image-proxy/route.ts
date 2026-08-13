import { NextRequest, NextResponse } from 'next/server';

// Domain whitelist for security - only allow known safe domains
const ALLOWED_DOMAINS = [
  'placehold.co',
  'logo.clearbit.com',
  'upload.wikimedia.org',
  'www.google.com',
  't1.gstatic.com',
  'images.unsplash.com',
  'via.placeholder.com',
  'picsum.photos',
  // Add more trusted domains as needed
];

// Block private/internal network ranges
const BLOCKED_IP_RANGES = [
  /^127\./, // localhost
  /^10\./, // private class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // private class B
  /^192\.168\./, // private class C
  /^169\.254\./, // link-local
  /^::1$/, // IPv6 localhost
  /^fe80::/i, // IPv6 link-local
];

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

function isAllowedDomain(hostname: string): boolean {
  return ALLOWED_DOMAINS.some(domain => 
    hostname === domain || hostname.endsWith('.' + domain)
  );
}

function isBlockedIP(hostname: string): boolean {
  return BLOCKED_IP_RANGES.some(range => range.test(hostname));
}

async function readImageWithLimit(response: Response): Promise<Uint8Array> {
  const contentLength = Number(response.headers.get('content-length'));
  if (Number.isFinite(contentLength) && contentLength > MAX_IMAGE_BYTES) {
    throw new Error('Image exceeds the maximum allowed size');
  }

  if (!response.body) {
    throw new Error('Image response has no body');
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    totalBytes += value.byteLength;
    if (totalBytes > MAX_IMAGE_BYTES) {
      await reader.cancel();
      throw new Error('Image exceeds the maximum allowed size');
    }
    chunks.push(value);
  }

  const image = new Uint8Array(totalBytes);
  let offset = 0;
  for (const chunk of chunks) {
    image.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return image;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const imageUrl = searchParams.get('url');

  if (!imageUrl) {
    return new NextResponse('Missing image URL', { status: 400 });
  }

  // Validate URL format
  let parsedUrl: URL;
  try {
    parsedUrl = new URL(imageUrl);
  } catch {
    return new NextResponse('Invalid image URL', { status: 400 });
  }

  // Security checks
  if (parsedUrl.protocol !== 'https:') {
    return new NextResponse('Only HTTPS URLs are allowed', { status: 400 });
  }

  // Check domain whitelist
  if (!isAllowedDomain(parsedUrl.hostname)) {
    return new NextResponse('Domain not allowed', { status: 403 });
  }

  // Block private IP ranges
  if (isBlockedIP(parsedUrl.hostname)) {
    return new NextResponse('Access to private networks is forbidden', { status: 403 });
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

        let response: Response;
        try {
          response = await fetch(imageUrl, {
            signal: controller.signal,
            headers: strategy.headers as HeadersInit,
            // Do not follow redirects: the destination would otherwise bypass
            // the allowlist and could turn this public endpoint into an SSRF proxy.
            redirect: 'manual',
          });
        } finally {
          clearTimeout(timeoutId);
        }

        if (response.ok) {
          const contentType = response.headers.get('content-type');
          
          // Validate content type
          if (contentType && contentType.startsWith('image/')) {
            const imageBuffer = await readImageWithLimit(response);

            return new NextResponse(
              imageBuffer.buffer.slice(
                imageBuffer.byteOffset,
                imageBuffer.byteOffset + imageBuffer.byteLength
              ) as ArrayBuffer,
              {
              headers: {
                'Content-Type': contentType,
                'Cache-Control': 'public, max-age=86400, stale-while-revalidate=604800',
                'Access-Control-Allow-Origin': '*',
              },
              }
            );
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
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; ImageProxy/1.0)' },
        redirect: 'manual',
      });

      if (faviconResponse.ok) {
        const faviconBuffer = await readImageWithLimit(faviconResponse);
        return new NextResponse(
          faviconBuffer.buffer.slice(
            faviconBuffer.byteOffset,
            faviconBuffer.byteOffset + faviconBuffer.byteLength
          ) as ArrayBuffer,
          {
          headers: {
            'Content-Type': 'image/png',
            'Cache-Control': 'public, max-age=86400',
            'Access-Control-Allow-Origin': '*',
          },
          }
        );
      }
    } catch (faviconError) {
      // Favicon fallback also failed
    }

    throw lastError || new Error('All strategies failed');
  } catch (error) {
    console.error('Image proxy error:', error);
    
    // Return a fallback image or placeholder
    return NextResponse.redirect(new URL('/ai-cre-tools-logo.jpg', request.url));
  }
}
