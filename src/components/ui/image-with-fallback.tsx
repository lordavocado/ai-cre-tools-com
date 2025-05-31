'use client';

import Image from "next/image";
import { useState } from "react";

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackSrc?: string;
  'data-ai-hint'?: string;
}

export function ImageWithFallback({
  src,
  alt,
  width,
  height,
  className,
  fallbackSrc = "/product-analytics-tools-logo.png",
  'data-ai-hint': dataAiHint,
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(src);

  return (
    <Image
      src={imageSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      data-ai-hint={dataAiHint}
      onError={() => {
        setImageSrc(fallbackSrc);
      }}
    />
  );
} 