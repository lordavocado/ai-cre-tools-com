'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ToolFaviconProps {
  website: string;
  name: string;
  /** Pixel size passed to Google S2 API — should be 2× render size for retina */
  apiSize?: number;
  className?: string;
}

/**
 * Renders a tool's favicon via the Google S2 API with a text-initial fallback.
 * Avoids the hydration flash of SafeImage by rendering the img immediately.
 */
export function ToolFavicon({ website, name, apiSize = 64, className = '' }: ToolFaviconProps) {
  const [failed, setFailed] = useState(false);

  let domain = '';
  try {
    domain = new URL(website).hostname;
  } catch {
    // malformed URL — fall through to initial fallback
  }

  if (failed || !domain) {
    return (
      <span className={`flex items-center justify-center text-lg font-bold text-[#737373] ${className}`}>
        {name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <Image
      src={`https://www.google.com/s2/favicons?sz=${apiSize}&domain=${domain}`}
      alt=""
      aria-hidden="true"
      className={`object-contain ${className}`}
      onError={() => setFailed(true)}
      width={apiSize}
      height={apiSize}
      unoptimized
    />
  );
}
