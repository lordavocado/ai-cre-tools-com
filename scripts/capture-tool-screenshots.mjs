/**
 * Capture screenshots for directory tools and upload them to Supabase Storage.
 *
 * Why this is a script (not an API route):
 * - Puppeteer/Chromium is most reliable in CI/cron environments (GitHub Actions, server VM).
 * - You can run it locally to backfill screenshots quickly.
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

import puppeteer from 'puppeteer';
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

  let query = supabase.from(TABLE).select('slug, website_url, screenshot_path, screenshot_url').order('display_order', {
    ascending: true,
  });

  if (onlyMissing) {
    query = query.is('screenshot_path', null);
  }

  if (limit > 0) {
    query = query.limit(limit);
  }

  const { data, error } = await query;
  if (error) throw new Error(`Failed to list tools: ${error.message}`);
  return data || [];
}

async function captureScreenshotBytes(page, url) {
  const timeoutMs = parseIntEnv('SCREENSHOT_TIMEOUT_MS', 30_000);
  await page.goto(url, { waitUntil: 'networkidle2', timeout: timeoutMs });
  return await page.screenshot({ type: 'png', fullPage: true });
}

async function uploadToStorage(supabase, { slug, bytes }) {
  const objectName = `${slug}.png`;
  const { error: uploadError } = await supabase.storage.from(DEFAULT_BUCKET).upload(objectName, bytes, {
    contentType: 'image/png',
    upsert: true,
    cacheControl: '31536000',
  });

  if (uploadError) {
    throw new Error(`Upload failed for ${slug}: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(DEFAULT_BUCKET).getPublicUrl(objectName);
  return {
    screenshot_path: `${DEFAULT_BUCKET}/${objectName}`,
    screenshot_url: data.publicUrl,
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

  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: viewportWidth, height: viewportHeight, deviceScaleFactor: 1 });

    for (const tool of tools) {
      const slug = tool.slug;
      const url = tool.website_url;

      if (!slug || !url) {
        console.warn(`Skipping tool with missing slug/url: ${JSON.stringify({ slug, url })}`);
        continue;
      }

      console.log(`Capturing ${slug} (${url})`);

      try {
        const bytes = await captureScreenshotBytes(page, url);
        const uploaded = await uploadToStorage(supabase, { slug, bytes });
        await updateToolRow(supabase, slug, uploaded);
        console.log(`Saved ${slug} -> ${uploaded.screenshot_path}`);
      } catch (err) {
        console.error(`Failed ${slug}:`, err?.message || err);
        // Optional extension: store error in DB (screenshot_error column) if you add it.
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

