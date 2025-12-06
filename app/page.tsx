import Link from "next/link";
import { getApprovedListings } from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import { Button } from "@/components/ui";
import { ListingCard } from "@/components/listings/ListingCard";
import { stackServerApp } from "@/stack";
import { getUserRole } from "@/lib/db";
import { SearchBar } from "@/components/SearchBar";
import { iraqiRegions } from "@/lib/utils";
import { CityFilter } from "@/components/CityFilter";
import { CategoryScroll } from "@/components/CategoryScroll";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; type?: string; city?: string }>;
}) {
  const user = await stackServerApp.getUser();
  let userRole = null;
  if (user) {
    userRole = await getUserRole(user.id);
  }

  const params = await searchParams;
  const searchQuery = params.search;
  const typeFilter = params.type as "accommodation" | "attraction" | "tour" | undefined;
  const cityFilter = params.city;

  const listings = await getApprovedListings(typeFilter, cityFilter, searchQuery);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header userRole={userRole} />

      <main className="flex-1">
      {/* Search Bar and City Filter */}
      <section className="relative bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="flex items-center gap-4 justify-center">
            <div className="flex-1 max-w-2xl">
              <SearchBar />
            </div>
            <CityFilter />
          </div>
        </div>
      </section>

      {/* Category Filters - Horizontal Scroll */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryScroll
            categories={[
              // Listing Types
              { icon: "🏨", label: "Accommodations", type: "accommodation" },
              { icon: "🏛️", label: "Attractions", type: "attraction" },
              { icon: "🗺️", label: "Tours", type: "tour" },
              // Event & Entertainment Categories
              { icon: "🎉", label: "Parties", search: "party" },
              { icon: "🎪", label: "Festivals", search: "festival" },
              { icon: "🍽️", label: "Restaurants", search: "restaurant" },
              { icon: "🎭", label: "Events", search: "event" },
              { icon: "🎵", label: "Live Music", search: "live music" },
              { icon: "🎨", label: "Art & Culture", search: "art culture museum" },
              { icon: "🏃", label: "Sports", search: "sport" },
              { icon: "🛍️", label: "Shopping", search: "shopping market bazaar" },
              { icon: "🌙", label: "Nightlife", search: "nightlife bar club" },
              { icon: "🏖️", label: "Beaches", search: "beach" },
              { icon: "⛰️", label: "Mountains", search: "mountain" },
              { icon: "🏞️", label: "Nature", search: "nature park" },
            ]}
            typeFilter={typeFilter}
            cityFilter={cityFilter}
            searchQuery={searchQuery}
          />
        </div>
      </section>

      {/* Results Header */}
      {(searchQuery || typeFilter || cityFilter) && (
        <section className="bg-white border-b border-gray-200 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {searchQuery && `Search results for "${searchQuery}"`}
                  {!searchQuery && typeFilter && `${typeFilter.charAt(0).toUpperCase() + typeFilter.slice(1)}s in Iraq`}
                  {!searchQuery && !typeFilter && cityFilter && `Explore ${cityFilter}`}
                  {!searchQuery && !typeFilter && !cityFilter && "All Listings"}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {listings.length} {listings.length === 1 ? "listing" : "listings"} found
                </p>
              </div>
              {(searchQuery || typeFilter || cityFilter) && (
                <Link
                  href="/"
                  className="text-sm text-[var(--primary)] hover:underline"
                >
                  Clear filters
                </Link>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Listings Grid */}
      {listings.length > 0 ? (
        <section className="py-8 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </section>
      ) : searchQuery ? (
        /* Search Empty State */
        <section className="py-24 bg-white">
          <div className="max-w-2xl mx-auto text-center px-4">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No listings found</h2>
            <p className="text-gray-600 mb-8">
              Try adjusting your search or browse all listings.
            </p>
            <Link href="/">
              <Button variant="primary" size="lg">
                View All Listings
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        /* Default Empty State */
        <section className="py-24 bg-white">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">No listings available yet</h2>
            <p className="text-gray-600 mb-8">
              Be the first to share your accommodation, attraction, or tour with travelers.
            </p>
            {!user && (
              <Link href="/handler/sign-up">
                <Button variant="primary" size="lg">
                  Become a Host
                </Button>
              </Link>
            )}
          </div>
        </section>
      )}
      </main>

      <Footer />
    </div>
  );
}
