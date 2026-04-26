import 'server-only';

import { createClient } from '@supabase/supabase-js';

export const TOOL_SCREENSHOTS_BUCKET = 'tool-screenshots';

type UploadScreenshotInput = {
  slug: string;
  bytes: Uint8Array;
  contentType: 'image/webp' | 'image/png' | 'image/jpeg';
  /** File extension without dot. Defaults based on contentType. */
  ext?: 'webp' | 'png' | 'jpg' | 'jpeg';
};

type UploadScreenshotResult = {
  bucket: string;
  objectPath: string;
  publicUrl: string;
};

function getSupabaseAdminStorageClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || supabaseUrl.includes('placeholder')) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not properly configured.');
  }

  if (!serviceRoleKey || serviceRoleKey.includes('placeholder')) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not properly configured.');
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function extFromContentType(contentType: UploadScreenshotInput['contentType']) {
  switch (contentType) {
    case 'image/webp':
      return 'webp';
    case 'image/png':
      return 'png';
    case 'image/jpeg':
      return 'jpg';
  }
}

export function buildToolScreenshotObjectPath(input: { slug: string; ext: string }) {
  const safeSlug = input.slug.trim();
  if (!safeSlug) {
    throw new Error('slug is required to build screenshot object path');
  }

  return `${TOOL_SCREENSHOTS_BUCKET}/${safeSlug}.${input.ext}`;
}

/**
 * Upload a tool screenshot to Supabase Storage.
 *
 * Assumes `TOOL_SCREENSHOTS_BUCKET` is configured as a public bucket.
 * If you switch to a private bucket later, replace `publicUrl` usage with signed URLs.
 */
export async function uploadToolScreenshot(input: UploadScreenshotInput): Promise<UploadScreenshotResult> {
  const supabase = getSupabaseAdminStorageClient();
  const ext = input.ext ?? extFromContentType(input.contentType);
  const objectPath = `${input.slug.trim()}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from(TOOL_SCREENSHOTS_BUCKET)
    .upload(objectPath, input.bytes, {
      contentType: input.contentType,
      upsert: true,
      cacheControl: '31536000',
    });

  if (uploadError) {
    throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(TOOL_SCREENSHOTS_BUCKET).getPublicUrl(objectPath);
  const publicUrl = data.publicUrl;

  return {
    bucket: TOOL_SCREENSHOTS_BUCKET,
    objectPath: `${TOOL_SCREENSHOTS_BUCKET}/${objectPath}`,
    publicUrl,
  };
}

