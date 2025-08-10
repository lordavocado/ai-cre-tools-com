'use client';

import Image from "next/image";
import { useState } from "react";
import { getImageUrl } from "@/lib/image-utils";

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
      fallbackSrc = "/ai-cre-tools-logo.png",
  'data-ai-hint': dataAiHint,
}: ImageWithFallbackProps) {
  const [imageSrc, setImageSrc] = useState(getImageUrl(src, fallbackSrc));

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