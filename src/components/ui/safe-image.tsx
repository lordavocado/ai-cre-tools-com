'use client';

import { useState, useEffect } from 'react';
import { useHydrationMismatchDetector, useRenderTracker, useHydrationTimer, devLog } from '@/lib/dev-debug';

interface SafeImageProps {
  src?: string;
  alt: string;
  website?: string;
  className?: string;
  fallbackText?: string;
}

// Helper function to get favicon URL from website through our proxy (only in browser)
const getFaviconUrl = (website: string): string => {
  if (!website || typeof window === 'undefined') return "/ai-cre-tools-logo.jpg";

  try {
    // Clean up the website URL
    let cleanUrl = website;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }

    const domain = new URL(cleanUrl).hostname;
    // Use Google's favicon service directly for better quality
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
  } catch {
    return "/ai-cre-tools-logo.jpg";
  }
};

export function SafeImage({
  src,
  alt,
  website,
  className = '',
  fallbackText
}: SafeImageProps) {
  const [mounted, setMounted] = useState(false);
  const [currentSrc, setCurrentSrc] = useState('/ai-cre-tools-logo.jpg'); // Start with safe default
  const [hasError, setHasError] = useState(false);

  // Development debugging utilities
  useHydrationMismatchDetector(`SafeImage-${alt}`);
  useRenderTracker(`SafeImage-${alt}`, [src, website, mounted]);
  useHydrationTimer(`SafeImage-${alt}`);

  // Prevent hydration mismatches by only setting dynamic URLs after mount
  useEffect(() => {
    setMounted(true);
    devLog.log(`🖼️ SafeImage for "${alt}" mounting`, { src, website });

    // Determine the best initial source after mount
    let initialSrc = '/ai-cre-tools-logo.jpg';

    // If we have a valid local image URL, use it
    if (src && (src.startsWith('/') || src.startsWith('./'))) {
      initialSrc = src;
    }
    // If we have an external image URL, try to use it
    else if (src && src.startsWith('http')) {
      initialSrc = src;
    }
    // If we have a website but no valid imageUrl, prioritize favicon
    else if (website && (!src || src.trim() === '')) {
      initialSrc = getFaviconUrl(website);
    }

    setCurrentSrc(initialSrc);
  }, [src, website, alt]);

  const handleError = () => {
    // Only handle errors after component is mounted to prevent SSR issues
    if (!mounted) return;

    // If current source is not the default logo, try favicon first
    if (currentSrc !== '/ai-cre-tools-logo.jpg' && website) {
      setCurrentSrc(getFaviconUrl(website));
    } else if (currentSrc !== '/ai-cre-tools-logo.jpg') {
      // If favicon also fails, fallback to default logo
      setCurrentSrc('/ai-cre-tools-logo.jpg');
    } else {
      // Show text fallback if even default logo fails
      setHasError(true);
    }
  };

  // Show loading state during hydration to prevent flashes
  if (!mounted) {
    return (
      <div className={`${className} flex items-center justify-center rounded border border-border bg-secondary motion-safe:animate-pulse`}>
        <div className="w-4 h-4 bg-slate-200 rounded"></div>
      </div>
    );
  }

  if (hasError) {
    return (
      <div className={`${className} bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-medium`}>
        {fallbackText || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    // This source is directory data and may be an arbitrary vendor logo. The component
    // falls back safely; forcing it through Next's optimizer would reject valid vendors.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
      style={{
        imageRendering: 'crisp-edges',
        backfaceVisibility: 'hidden',
        transform: 'translateZ(0)'
      } as React.CSSProperties}
    />
  );
}
