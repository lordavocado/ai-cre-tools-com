"use client";

import { useState } from "react";
import Image from "next/image";

interface GuideImageProps {
  src: string;
  alt: string;
}

export function GuideImage({ src, alt }: GuideImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  return (
    <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-lg">
      <Image
        src={imgSrc}
        alt={alt}
        layout="fill"
        objectFit="cover"
        priority
        data-ai-hint="blog post hero image"
        onError={() => setImgSrc("/favicon.svg")}
      />
    </div>
  );
} 