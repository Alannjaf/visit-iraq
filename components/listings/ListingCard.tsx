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
  const typeEmoji = {
    accommodation: "🏨",
    attraction: "🏛️",
    tour: "🗺️",
  };

  const defaultImages = {
    accommodation: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop",
    attraction: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=400&h=300&fit=crop",
    tour: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
  };

  const imageUrl = listing.images?.[0] || defaultImages[listing.type];

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
              (e.target as HTMLImageElement).src = defaultImages[listing.type];
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
                {listing.price_range === "budget" && "$"}
                {listing.price_range === "mid-range" && "$$"}
                {listing.price_range === "luxury" && "$$$"}
              </span>
              <span className="text-sm text-gray-500">per night</span>
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

