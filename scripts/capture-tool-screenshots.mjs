/**
 * Capture screenshots for directory tools and upload them to Supabase Storage.
 *
 * Why this is a script (not an API route):
 * - Puppeteer/Chromium is most reliable in CI/cron environments (GitHub Actions, server VM).
 * - You can run it locally to backfill screenshots quickly.
 *
 * Required env:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional env:
 * - SCREENSHOT_BUCKET (default: tool-screenshots)
 * - SCREENSHOT_SLUGS (comma-separated slug allowlist, default: all)
 * - SCREENSHOT_VIEWPORT_WIDTH (default: 1440)
 * - SCREENSHOT_VIEWPORT_HEIGHT (default: 900)
 * - SCREENSHOT_TIMEOUT_MS (default: 30000)
 * - SCREENSHOT_LIMIT (default: unlimited)
 * - SCREENSHOT_ONLY_MISSING ("true" | "false", default: true)
 */

import { config } from 'dotenv';
import puppeteer from 'puppeteer';
import { createClient } from '@supabase/supabase-js';

config({ path: '.env.local', quiet: true });

const TABLE = 'ecosystem_apps';
const DEFAULT_BUCKET = process.env.SCREENSHOT_BUCKET || 'tool-screenshots';

function requiredEnv(name) {
  const value = process.env[name];
  if (!value || value.includes('placeholder')) {
    throw new Error(`${name} is not configured`);
  }
  return value;
}

function getSupabaseAdmin() {
  const url = requiredEnv('NEXT_PUBLIC_SUPABASE_URL');
  const key = process.env.SUPABASE_SECRET_KEY || requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function parseIntEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  const v = Number.parseInt(raw, 10);
  return Number.isFinite(v) ? v : fallback;
}

function parseBoolEnv(name, fallback) {
  const raw = process.env[name];
  if (!raw) return fallback;
  return raw.toLowerCase() === 'true';
}

function parseListEnv(name) {
  return (process.env[name] || '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

async function listToolsToCapture(supabase) {
  const onlyMissing = parseBoolEnv('SCREENSHOT_ONLY_MISSING', true);
  const limit = parseIntEnv('SCREENSHOT_LIMIT', 0);
  const slugs = parseListEnv('SCREENSHOT_SLUGS');

  let query = supabase
    .from(TABLE)
    .select('slug, name, website_url, icon_url, screenshot_path, screenshot_url, hero_screenshot_path, hero_screenshot_url')
    .order('display_order', { ascending: true })
    .order('name', { ascending: true });

  if (slugs.length) {
    query = query.in('slug', slugs);
  }

  if (onlyMissing) {
    query = query.is('screenshot_path', null);
  }

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to list tools: ${error.message}`);

  if (slugs.length) {
    const foundSlugs = new Set((data || []).map((tool) => tool.slug));
    const missingSlugs = slugs.filter((slug) => !foundSlugs.has(slug));
    if (missingSlugs.length && !onlyMissing) {
      throw new Error(`Unknown tool slugs: ${missingSlugs.join(', ')}`);
    }
  }

  return data || [];
}

async function dismissCookieBanner(page) {
  await page.evaluate(() => {
    const labels = /^(accept|accept all|allow all|agree|agree and close|got it|okay)$/i;
    const buttons = Array.from(document.querySelectorAll('button, [role="button"]'));
    const button = buttons.find((element) => labels.test((element.textContent || '').trim()));
    if (button instanceof HTMLElement) button.click();
  }).catch(() => undefined);
}

async function warmLazyContent(page) {
  await page.evaluate(async () => {
    const maximum = Math.min(document.documentElement.scrollHeight, window.innerHeight * 8);
    for (let y = window.innerHeight; y < maximum; y += window.innerHeight) {
      window.scrollTo(0, y);
      await new Promise((resolve) => window.setTimeout(resolve, 125));
    }
    window.scrollTo(0, 0);
  }).catch(() => undefined);
}

function getImageExtension(contentType, sourceUrl) {
  const normalizedType = contentType.toLowerCase().split(';')[0].trim();
  const extensionsByType = {
    'image/avif': 'avif',
    'image/gif': 'gif',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/svg+xml': 'svg',
    'image/webp': 'webp',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
  };
  if (extensionsByType[normalizedType]) return extensionsByType[normalizedType];

  if (sourceUrl.startsWith('http')) {
    const match = new URL(sourceUrl).pathname.match(/\.([a-z0-9]+)$/i);
    if (match && ['avif', 'gif', 'ico', 'jpg', 'jpeg', 'png', 'svg', 'webp'].includes(match[1].toLowerCase())) {
      return match[1].toLowerCase() === 'jpeg' ? 'jpg' : match[1].toLowerCase();
    }
  }

  return 'png';
}

async function findVerifiedIconAsset(page) {
  const candidates = await page.evaluate(() => {
    const links = Array.from(document.querySelectorAll('link[rel*="icon"]'));
    return links
      .map((link) => ({
        href: link.href,
        rel: (link.getAttribute('rel') || '').toLowerCase(),
        sizes: link.getAttribute('sizes') || '',
      }))
      .filter((candidate) => candidate.href.startsWith('http') || candidate.href.startsWith('data:image/'))
      .sort((left, right) => {
        const score = (candidate) =>
          (candidate.rel.includes('apple-touch-icon') ? 100 : 0) +
          (candidate.rel === 'icon' ? 25 : 0) +
          (candidate.sizes.includes('192') || candidate.sizes.includes('180') ? 10 : 0);
        return score(right) - score(left);
      })
      .map((candidate) => candidate.href);
  });

  const fallback = new URL('/favicon.ico', page.url()).toString();
  for (const candidate of [...new Set([...candidates, fallback])]) {
    try {
      const asset = await page.evaluate(async (iconUrl) => {
        const response = await fetch(iconUrl);
        if (!response.ok) return null;

        const contentType = response.headers.get('content-type') || '';
        const bytes = new Uint8Array(await response.arrayBuffer());
        let binary = '';
        for (let offset = 0; offset < bytes.length; offset += 32_768) {
          binary += String.fromCharCode(...bytes.subarray(offset, offset + 32_768));
        }

        return {
          base64: btoa(binary),
          contentType,
          sourceUrl: response.url || iconUrl,
        };
      }, candidate);

      if (asset?.base64 && asset.contentType.startsWith('image/')) {
        return {
          bytes: Buffer.from(asset.base64, 'base64'),
          contentType: asset.contentType,
          extension: getImageExtension(asset.contentType, asset.sourceUrl),
        };
      }
    } catch {
      // Browser-context fetches handle protected and embedded icons; try the next candidate on failure.
    }
  }

  return null;
}

async function captureToolAssets(page, url) {
  const timeoutMs = parseIntEnv('SCREENSHOT_TIMEOUT_MS', 30_000);
  const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
  const status = response?.status();
  if (status && status >= 400) {
    throw new Error(`Website returned HTTP ${status}`);
  }

  await new Promise((resolve) => setTimeout(resolve, 2_000));
  await dismissCookieBanner(page);
  await page.addStyleTag({
    content: '*, *::before, *::after { animation-duration: 0s !important; transition-duration: 0s !important; }',
  }).catch(() => undefined);

  const heroBytes = await page.screenshot({ type: 'png', fullPage: false });
  const iconAsset = await findVerifiedIconAsset(page);
  await warmLazyContent(page);
  const fullPageBytes = await page.screenshot({ type: 'png', fullPage: true });

  return {
    finalUrl: page.url(),
    fullPageBytes,
    heroBytes,
    iconAsset,
  };
}

async function uploadImage(supabase, objectName, bytes, contentType = 'image/png') {
  const { error } = await supabase.storage.from(DEFAULT_BUCKET).upload(objectName, bytes, {
    contentType,
    upsert: true,
    cacheControl: '31536000',
  });

  if (error) {
    throw new Error(`Upload failed for ${objectName}: ${error.message}`);
  }

  const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(objectName);
  return data.publicUrl;
}

async function uploadAssets(supabase, { slug, fullPageBytes, heroBytes, iconAsset }) {
  const fullName = `${slug}.png`;
  const heroName = `${slug}-hero.png`;
  const [screenshotUrl, heroScreenshotUrl] = await Promise.all([
    uploadImage(supabase, fullName, fullPageBytes),
    uploadImage(supabase, heroName, heroBytes),
  ]);

  const uploaded = {
    screenshot_path: `${DEFAULT_BUCKET}/${fullName}`,
    screenshot_url: screenshotUrl,
    hero_screenshot_path: `${DEFAULT_BUCKET}/${heroName}`,
    hero_screenshot_url: heroScreenshotUrl,
  };

  if (iconAsset) {
    const iconName = `icons/${slug}.${iconAsset.extension}`;
    uploaded.icon_url = await uploadImage(supabase, iconName, iconAsset.bytes, iconAsset.contentType);
  }

  return uploaded;
}

async function updateToolRow(supabase, slug, patch) {
  const { error } = await supabase.from(TABLE).update(patch).eq('slug', slug);
  if (error) throw new Error(`Failed to update ${slug}: ${error.message}`);
}

async function main() {
  const viewportWidth = parseIntEnv('SCREENSHOT_VIEWPORT_WIDTH', 1440);
  const viewportHeight = parseIntEnv('SCREENSHOT_VIEWPORT_HEIGHT', 900);

  const supabase = getSupabaseAdmin();
  const tools = await listToolsToCapture(supabase);

  if (!tools.length) {
    console.log('No tools to capture.');
    return;
  }

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    let failedCount = 0;

    for (const tool of tools) {
      const slug = tool.slug;
      const url = tool.website_url;

      if (!slug || !url) {
        console.warn(`Skipping tool with missing slug/url: ${JSON.stringify({ slug, url })}`);
        continue;
      }

      console.log(`Capturing ${slug} (${url})`);
      const page = await browser.newPage();
      await page.setViewport({ width: viewportWidth, height: viewportHeight, deviceScaleFactor: 1 });

      try {
        const captured = await captureToolAssets(page, url);
        const uploaded = await uploadAssets(supabase, { slug, ...captured });
        await updateToolRow(supabase, slug, uploaded);
        console.log(`Saved ${slug} -> full + hero${captured.iconAsset ? ' + stored icon' : ''} (${captured.finalUrl})`);
      } catch (err) {
        failedCount += 1;
        console.error(`Failed ${slug}:`, err?.message || err);
      } finally {
        await page.close();
      }
    }

    if (failedCount > 0) {
      throw new Error(`${failedCount} screenshot capture${failedCount === 1 ? '' : 's'} failed`);
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
