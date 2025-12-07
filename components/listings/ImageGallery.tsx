"use client";

import { useState } from "react";
import { SafeImage } from "./SafeImage";

interface ImageGalleryProps {
  images: string[];
  title: string;
  defaultImage: string;
  fallbackSrc: string;
}

export function ImageGallery({ images, title, defaultImage, fallbackSrc }: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(defaultImage);

  // Combine all images - main image first, then the rest, ensuring no duplicates
  const imageSet = new Set([defaultImage, ...images]);
  const allImages = Array.from(imageSet);

  return (
    <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
      {/* Main Image */}
      <div className="aspect-video relative">
        <SafeImage
          src={selectedImage}
          alt={title}
          className="w-full h-full object-cover"
          fallbackSrc={fallbackSrc}
        />
      </div>
      
      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="p-4 flex gap-2 overflow-x-auto">
          {allImages.slice(0, 5).map((img) => (
            <button
              key={img}
              onClick={() => setSelectedImage(img)}
              className={`flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
                selectedImage === img
                  ? "border-[var(--primary)] ring-2 ring-[var(--primary)]/20"
                  : "border-transparent hover:border-[var(--border)]"
              }`}
            >
              <img
                src={img}
                alt={`${title} thumbnail`}
                className="w-24 h-16 object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = fallbackSrc;
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

