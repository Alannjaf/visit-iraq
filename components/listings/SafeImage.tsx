"use client";

import { useState, useEffect } from "react";

interface SafeImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc: string;
}

export function SafeImage({ src, alt, className, fallbackSrc }: SafeImageProps) {
  const [imgSrc, setImgSrc] = useState(src);

  // Update image source when src prop changes
  useEffect(() => {
    setImgSrc(src);
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={className}
      onError={() => {
        setImgSrc(fallbackSrc);
      }}
    />
  );
}

