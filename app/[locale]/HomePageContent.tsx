"use client";

import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Button } from "@/components/ui";
import { ListingCard } from "@/components/listings/ListingCard";
import { CategoryScroll } from "@/components/CategoryScroll";

interface Listing {
  id: string;
  title: string;
  description: string;
  type: string;
  city: string;
  images: string[];
  [key: string]: any;
}

interface HomePageContentProps {
  listings: Listing[];
  searchQuery?: string;
  typeFilter?: string;
  cityFilter?: string;
  hasUser: boolean;
}

export function HomePageContent({
  listings,
  searchQuery,
  typeFilter,
  cityFilter,
  hasUser,
}: HomePageContentProps) {
  const t = useTranslations();

  const categories = [
    { icon: "🏨", label: t('home.accommodations'), type: "accommodation" },
    { icon: "🏛️", label: t('home.attractions'), type: "attraction" },
    { icon: "🗺️", label: t('home.tours'), type: "tour" },
    { icon: "🎉", label: t('home.parties'), search: "party" },
    { icon: "🎪", label: t('home.festivals'), search: "festival" },
    { icon: "🍽️", label: t('home.restaurants'), search: "restaurant" },
    { icon: "🎭", label: t('home.events'), search: "event" },
    { icon: "🎵", label: t('home.liveMusic'), search: "live music" },
    { icon: "🎨", label: t('home.artCulture'), search: "art culture museum" },
    { icon: "🏃", label: t('home.sports'), search: "sport" },
    { icon: "🛍️", label: t('home.shopping'), search: "shopping market bazaar" },
    { icon: "🌙", label: t('home.nightlife'), search: "nightlife bar club" },
    { icon: "🏖️", label: t('home.beaches'), search: "beach" },
    { icon: "⛰️", label: t('home.mountains'), search: "mountain" },
    { icon: "🏞️", label: t('home.nature'), search: "nature park" },
  ];

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'accommodation':
        return t('home.accommodations');
      case 'attraction':
        return t('home.attractions');
      case 'tour':
        return t('home.tours');
      default:
        return type;
    }
  };

  return (
    <>
      {/* Category Filters - Horizontal Scroll */}
      <section className="bg-white py-8 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <CategoryScroll
            categories={categories}
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
                  {searchQuery && t('home.searchResults', { query: searchQuery })}
                  {!searchQuery &&
                    typeFilter &&
                    t('home.typeInIraq', { type: getTypeLabel(typeFilter) })}
                  {!searchQuery &&
                    !typeFilter &&
                    cityFilter &&
                    t('home.exploreCity', { city: cityFilter })}
                  {!searchQuery &&
                    !typeFilter &&
                    !cityFilter &&
                    t('home.allListings')}
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  {t('home.listingFound', { count: listings.length })}
                </p>
              </div>
              {(searchQuery || typeFilter || cityFilter) && (
                <Link
                  href="/"
                  className="text-sm text-primary hover:underline"
                >
                  {t('common.clearFilters')}
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
              <svg
                className="w-10 h-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('home.noListingsFound')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('home.noListingsDescription')}
            </p>
            <Link href="/">
              <Button variant="primary" size="lg">
                {t('common.viewAllListings')}
              </Button>
            </Link>
          </div>
        </section>
      ) : (
        /* Default Empty State */
        <section className="py-24 bg-white">
          <div className="max-w-2xl mx-auto text-center px-4">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {t('home.noListingsAvailable')}
            </h2>
            <p className="text-gray-600 mb-8">
              {t('home.noListingsAvailableDescription')}
            </p>
            {!hasUser && (
              <Link href="/handler/sign-up">
                <Button variant="primary" size="lg">
                  {t('common.becomeHost')}
                </Button>
              </Link>
            )}
          </div>
        </section>
      )}
    </>
  );
}

