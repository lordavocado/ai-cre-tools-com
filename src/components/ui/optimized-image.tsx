'use client';

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  fill?: boolean;
  'data-ai-hint'?: string;
}

/**
 * Optimized Image Component for SEO
 * 
 * Features:
 * - Automatic WebP/AVIF format optimization via Next.js
 * - Lazy loading by default (unless priority is set)
 * - Proper error handling with fallbacks
 * - Optimized sizes for responsive design
 * - SEO-friendly alt text handling
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  className,
  priority = false,
  quality = 85, // Optimal balance between quality and file size
  sizes,
  fill = false,
  'data-ai-hint': dataAiHint,
}: OptimizedImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
    // Fallback to a default image
    setImgSrc('/product-analytics-tools-logo.png');
  };

  // Generate optimized sizes if not provided
  const defaultSizes = sizes || `
    (max-width: 640px) 100vw,
    (max-width: 1024px) 50vw,
    33vw
  `;

  return (
    <div className={`relative ${className || ''}`}>
      {fill ? (
        <Image
          src={imgSrc}
          alt={alt}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          priority={priority}
          quality={quality}
          sizes={defaultSizes}
          data-ai-hint={dataAiHint}
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <Image
          src={imgSrc}
          alt={alt}
          width={width}
          height={height}
          className={`transition-opacity duration-300 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          } ${className || ''}`}
          priority={priority}
          quality={quality}
          sizes={defaultSizes}
          data-ai-hint={dataAiHint}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
      
      {/* Loading skeleton */}
      {isLoading && !hasError && (
        <div 
          className="absolute inset-0 bg-gray-200 animate-pulse rounded"
          style={{ width, height }}
        />
      )}
    </div>
  );
} 