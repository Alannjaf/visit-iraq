"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
}

export function SafeImage({ src, alt, className, fallbackSrc, fill = false, priority = false, sizes }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  // Update image source when src prop changes
  useEffect(() => {
    setImgSrc(src);
    setHasError(false);
  }, [src]);

  // If using fill, render with fill prop
  if (fill) {
    return (
      <Image
        src={hasError ? fallbackSrc : imgSrc}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        onError={() => {
          if (!hasError) {
            setHasError(true);
            setImgSrc(fallbackSrc);
          }
        }}
      />
    );
  }

  // Otherwise, use width/height (default to 800x600 for aspect-video)
  return (
    <Image
      src={hasError ? fallbackSrc : imgSrc}
      alt={alt}
      width={800}
      height={600}
      className={className}
      priority={priority}
      sizes={sizes}
      onError={() => {
        if (!hasError) {
          setHasError(true);
          setImgSrc(fallbackSrc);
        }
      }}
    />
  );
}

