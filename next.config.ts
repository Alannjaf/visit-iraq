import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

const nextConfig: NextConfig = {
  // Enable image optimization for external images
  images: {
    // Allow all external domains - no need to whitelist individual domains
    // unoptimized: true allows images from any domain without restrictions
    // Note: This disables Next.js automatic image optimization (WebP/AVIF conversion, resizing)
    // but you still get: lazy loading, responsive sizing, and proper image handling
    // Images will be served directly from their source URLs
    unoptimized: true,
    // Device sizes for responsive images (still used for srcset generation)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    // Image sizes for different breakpoints
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Optimize for serverless deployment
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

export default withNextIntl(nextConfig);
