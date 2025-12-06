import { getApprovedListings, type ListingType } from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import { ListingCard } from "@/components/listings/ListingCard";
import { stackServerApp } from "@/stack";
import { getUserRole } from "@/lib/db";
import Link from "next/link";
import { getListingTypeLabel, iraqiRegions } from "@/lib/utils";

function buildQueryString(params: { type?: string; city?: string; search?: string; skipType?: boolean }): string {
  const queryParams: string[] = [];
  if (params.type && !params.skipType) queryParams.push(`type=${encodeURIComponent(params.type)}`);
  if (params.city) queryParams.push(`city=${encodeURIComponent(params.city)}`);
  if (params.search) queryParams.push(`search=${encodeURIComponent(params.search)}`);
  return queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
}

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string; city?: string; search?: string }>;
}) {
  const user = await stackServerApp.getUser();
  let userRole = null;
  if (user) {
    userRole = await getUserRole(user.id);
  }

  const params = await searchParams;
  const listings = await getApprovedListings(
    params.type as ListingType | undefined,
    params.city || undefined,
    params.search || undefined
  );

  const types = ["accommodation", "attraction", "tour"] as const;

  return (
    <div className="min-h-screen flex flex-col">
      <Header userRole={userRole} />

      {/* Hero */}
      <section className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl lg:text-4xl font-display font-bold text-white mb-2">
            {params.search
              ? `Search results for "${params.search}"`
              : params.type 
                ? `${getListingTypeLabel(params.type)}s in Iraq`
                : params.city
                  ? `Explore ${params.city}`
                  : "Explore All Listings"
            }
          </h1>
          <p className="text-white/80">
            {listings.length} {listings.length === 1 ? "listing" : "listings"} found
          </p>
        </div>
      </section>

      <main className="flex-1 bg-[var(--background)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-white rounded-xl border border-[var(--border)] p-6 sticky top-24">
                {/* Type Filter */}
                <div className="mb-6">
                  <h3 className="font-bold text-[var(--foreground)] mb-3">Type</h3>
                  <div className="space-y-2">
                    <Link
                      href={`/listings${buildQueryString({ city: params.city, search: params.search })}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        !params.type
                          ? "bg-[var(--primary)] text-white"
                          : "hover:bg-[var(--background-alt)]"
                      }`}
                    >
                      All Types
                    </Link>
                    {types.map((type) => (
                      <Link
                        key={type}
                        href={`/listings?type=${type}${buildQueryString({ city: params.city, search: params.search, skipType: true })}`}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          params.type === type
                            ? "bg-[var(--primary)] text-white"
                            : "hover:bg-[var(--background-alt)]"
                        }`}
                      >
                        {getListingTypeLabel(type)}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* City Filter */}
                <div>
                  <h3 className="font-bold text-[var(--foreground)] mb-3">Region</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    <Link
                      href={`/listings${buildQueryString({ type: params.type, search: params.search })}`}
                      className={`block px-3 py-2 rounded-lg transition-colors ${
                        !params.city
                          ? "bg-[var(--primary)] text-white"
                          : "hover:bg-[var(--background-alt)]"
                      }`}
                    >
                      All Regions
                    </Link>
                    {iraqiRegions.slice(0, 10).map((region) => (
                      <Link
                        key={region}
                        href={`/listings?${params.type ? `type=${params.type}&` : ""}city=${region.split(" ")[0]}${params.search ? `&search=${encodeURIComponent(params.search)}` : ""}`}
                        className={`block px-3 py-2 rounded-lg transition-colors ${
                          params.city === region.split(" ")[0]
                            ? "bg-[var(--primary)] text-white"
                            : "hover:bg-[var(--background-alt)]"
                        }`}
                      >
                        {region}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            </aside>

            {/* Listings Grid */}
            <div className="flex-1">
              {listings.length === 0 ? (
                <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center">
                  <div className="w-20 h-20 rounded-full bg-[var(--background-alt)] flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">No listings found</h2>
                  <p className="text-[var(--foreground-muted)]">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <ListingCard key={listing.id} listing={listing} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

