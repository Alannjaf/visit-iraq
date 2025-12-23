"use client";

import { useState } from "react";
import Image from "next/image";
import { SafeImage } from "./SafeImage";

interface ImageGalleryProps {
  images: string[];
  title: string;
  defaultImage: string;
  fallbackSrc: string;
}

export function ImageGallery({ images, title, defaultImage, fallbackSrc }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(defaultImage);
  const [thumbnailErrors, setThumbnailErrors] = useState<Set<string>>(new Set());

  // Combine all images - main image first, then the rest, ensuring no duplicates
  const imageSet = new Set([defaultImage, ...images]);
  const allImages = Array.from(imageSet);

  const handleThumbnailError = (img: string) => {
    setThumbnailErrors((prev) => new Set(prev).add(img));
  };

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Main Image */}
      <div className="aspect-video relative">
        <SafeImage
          src={selectedImage}
          alt={title}
          className="object-cover"
          fallbackSrc={fallbackSrc}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 66vw, 800px"
        />
      </div>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="p-4 flex gap-2 overflow-x-auto">
          {allImages.slice(0, 5).map((img) => (
            <button
              key={img}
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all relative ${
                selectedImage === img
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                  : "border-transparent hover:border-[var(--border)]"
              }`}
            >
              <div className="relative w-24 h-16">
                <Image
                  src={thumbnailErrors.has(img) ? fallbackSrc : img}
                  alt={`${title} thumbnail`}
                  fill
                  className="object-cover"
                  sizes="96px"
                  onError={() => handleThumbnailError(img)}
                />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

