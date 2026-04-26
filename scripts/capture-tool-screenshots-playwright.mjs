/**
 * Capture screenshots for directory tools using Playwright.
 *
 * Required env:
 * - NEXT_PUBLIC_SUPABASE_URL
 * - SUPABASE_SERVICE_ROLE_KEY
 *
 * Optional env:
 * - SCREENSHOT_BUCKET (default: tool-screenshots)
 * - SCREENSHOT_VIEWPORT_WIDTH (default: 1440)
 * - SCREENSHOT_VIEWPORT_HEIGHT (default: 900)
 * - SCREENSHOT_TIMEOUT_MS (default: 30000)
 * - SCREENSHOT_LIMIT (default: unlimited)
 * - SCREENSHOT_ONLY_MISSING ("true" | "false", default: true)
 */

import { chromium } from 'playwright';
import { createClient } from '@supabase/supabase-js';

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
  const key = requiredEnv('SUPABASE_SERVICE_ROLE_KEY');
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

async function listToolsToCapture(supabase) {
  const onlyMissing = parseBoolEnv('SCREENSHOT_ONLY_MISSING', true);
  const limit = parseIntEnv('SCREENSHOT_LIMIT', 0);

  let query = supabase.from(TABLE).select('slug, website_url, screenshot_url, hero_screenshot_url').order('display_order', {
    ascending: true,
  });

  if (onlyMissing) {
    query = query.is('screenshot_url', null);
  }

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to list tools: ${error.message}`);
  return data || [];
}

async function captureScreenshotBytes(page, url, fullPage = true) {
  const timeoutMs = parseIntEnv('SCREENSHOT_TIMEOUT_MS', 30_000);
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: timeoutMs });
  await page.waitForTimeout(2000);
  return await page.screenshot({ type: 'png', fullPage });
}

async function uploadScreenshots(supabase, slug, fullPageBytes, heroBytes) {
  const fullName = `${slug}.png`;
  const { error: fullError } = await supabase.storage.from(DEFAULT_BUCKET).upload(fullName, fullPageBytes, {
    contentType: 'image/png',
    upsert: true,
    cacheControl: '31536000',
  });
  if (fullError) throw new Error(`Full screenshot upload failed for ${slug}: ${fullError.message}`);
  const { data: fullData } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(fullName);

  const heroName = `${slug}-hero.png`;
  const { error: heroError } = await supabase.storage.from(DEFAULT_BUCKET).upload(heroName, heroBytes, {
    contentType: 'image/png',
    upsert: true,
    cacheControl: '31536000',
  });
  if (heroError) throw new Error(`Hero screenshot upload failed for ${slug}: ${heroError.message}`);
  const { data: heroData } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(heroName);

  return {
    screenshot_path: `${DEFAULT_BUCKET}/${fullName}`,
    screenshot_url: fullData.publicUrl,
    hero_screenshot_path: `${DEFAULT_BUCKET}/${heroName}`,
    hero_screenshot_url: heroData.publicUrl,
  };
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

  console.log(`Found ${tools.length} tools to capture`);

  const browser = await chromium.launch({ headless: true });

  try {
    for (const tool of tools) {
      const slug = tool.slug;
      const url = tool.website_url;

      if (!slug || !url) {
        console.warn(`Skipping tool with missing slug/url: ${JSON.stringify({ slug, url })}`);
        continue;
      }

      const context = await browser.newContext({
        viewport: { width: viewportWidth, height: viewportHeight },
      });
      const page = await context.newPage();

      console.log(`Capturing ${slug} (${url})`);

      try {
        const fullPageBytes = await captureScreenshotBytes(page, url, true);
        const heroBytes = await captureScreenshotBytes(page, url, false);
        const uploaded = await uploadScreenshots(supabase, slug, fullPageBytes, heroBytes);
        await updateToolRow(supabase, slug, uploaded);
        console.log(`Saved ${slug} -> full + hero`);
      } catch (err) {
        console.error(`Failed ${slug}:`, err?.message || err);
      } finally {
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});