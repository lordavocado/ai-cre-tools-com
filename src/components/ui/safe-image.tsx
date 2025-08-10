'use client';

import { useState } from 'react';

interface SafeImageProps {
  src?: string;
  alt: string;
  website?: string;
  className?: string;
  fallbackText?: string;
}

// Helper function to get favicon URL from website (same as comparison view)
const getFaviconUrl = (website: string): string => {
  if (!website) return "/ai-cre-tools-logo.png";
  
  try {
    // Clean up the website URL
    let cleanUrl = website;
    if (!cleanUrl.startsWith('http')) {
      cleanUrl = `https://${cleanUrl}`;
    }
    
    const domain = new URL(cleanUrl).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return "/ai-cre-tools-logo.png";
  }
};

export function SafeImage({ 
  src, 
  alt, 
  website, 
  className = '', 
  fallbackText 
}: SafeImageProps) {
  const [currentSrc, setCurrentSrc] = useState(() => {
    // If we have a valid image URL and it's local, use it
    if (src && (src.startsWith('/') || src.startsWith('./'))) {
      return src;
    }
    
    // If we have a website but no valid imageUrl, prioritize favicon
    if (website && (!src || src.trim() === '')) {
      return getFaviconUrl(website);
    }
    
    // If we have an external image URL, try to use it
    if (src && src.startsWith('http')) {
      return src;
    }
    
    // Final fallback to default logo
    return '/ai-cre-tools-logo.png';
  });
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    // If current source is not the default logo, try favicon first
    if (currentSrc !== '/ai-cre-tools-logo.png' && website) {
      setCurrentSrc(getFaviconUrl(website));
    } else if (currentSrc !== '/ai-cre-tools-logo.png') {
      // If favicon also fails, fallback to default logo
      setCurrentSrc('/ai-cre-tools-logo.png');
    } else {
      // Show text fallback if even default logo fails
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