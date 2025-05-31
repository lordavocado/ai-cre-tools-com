'use client';

import { useState } from 'react';
import { getImageUrl, getFaviconUrl } from '@/lib/image-utils';

interface SafeImageProps {
  src?: string;
  alt: string;
  website?: string;
  className?: string;
  fallbackText?: string;
}

export function SafeImage({ 
  src, 
  alt, 
  website, 
  className = '', 
  fallbackText 
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => {
    if (src) return getImageUrl(src);
    if (website) return getFaviconUrl(website);
    return '/product-analytics-tools-logo.png';
  });
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const handleError = () => {
    if (retryCount === 0 && website) {
      // First fallback: try favicon if we haven't already
      setCurrentSrc(getFaviconUrl(website));
      setRetryCount(1);
    } else if (retryCount === 1) {
      // Second fallback: try default logo
      setCurrentSrc('/product-analytics-tools-logo.png');
      setRetryCount(2);
    } else {
      // Final fallback: show text or empty state
      setHasError(true);
    }
  };

  if (hasError) {
    return (
      <div className={`${className} bg-slate-100 border border-slate-200 rounded flex items-center justify-center text-slate-500 text-xs font-medium`}>
        {fallbackText || alt.charAt(0).toUpperCase()}
      </div>
    );
  }

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={handleError}
    />
  );
} 