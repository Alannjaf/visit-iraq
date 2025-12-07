"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { getListingTypeLabel, truncate } from "@/lib/utils";
import type { Listing } from "@/lib/db";

interface ListingCardProps {
  listing: Listing;
  showStatus?: boolean;
}

export function ListingCard({ listing, showStatus = false }: ListingCardProps) {
  const defaultImages: Record<string, string> = {
    accommodation: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    attraction: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&h=300&fit=crop",
    tour: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
    party: "https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=300&fit=crop",
    festival: "https://images.unsplash.com/photo-1478147427282-58a87a120781?w=400&h=300&fit=crop",
    restaurant: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400&h=300&fit=crop",
    event: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=400&h=300&fit=crop",
    live_music: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    art_culture: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    sport: "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop",
    shopping: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop",
    nightlife: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=300&fit=crop",
    beach: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=300&fit=crop",
    mountain: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
    nature: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop",
  };

  // Use thumbnail if available, otherwise fall back to first image or default
  const imageUrl = listing.thumbnail || listing.images?.[0] || defaultImages[listing.type] || defaultImages.accommodation;

  return (
    <Link href={`/listings/${listing.id}`} className="block">
      <article className="group cursor-pointer">
        {/* Image */}
        <div className="relative aspect-square overflow-hidden rounded-xl mb-3">
          <img
            src={imageUrl}
            alt={listing.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLImageElement).src = defaultImages[listing.type] || defaultImages.accommodation;
            }}
          />
          {showStatus && (
            <div className="absolute top-3 right-3">
              <Badge variant={listing.status as "pending" | "approved" | "rejected"}>
                {listing.status}
              </Badge>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-[15px] text-gray-900 truncate flex-1">
              {listing.title}
            </h3>
          </div>
          
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <span>{listing.city}, {listing.region}</span>
          </div>

          {listing.price_range && (
            <div className="flex items-center gap-1 pt-1">
              <span className="font-semibold text-gray-900">
                {listing.price_range === "free" && "🆓 Free"}
                {listing.price_range === "budget" && "$"}
                {listing.price_range === "moderate" && "$$"}
                {listing.price_range === "premium" && "$$$"}
                {listing.price_range === "luxury" && "$$$$"}
              </span>
              {listing.price_range !== "free" && (
                <span className="text-sm text-gray-500">per night</span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

