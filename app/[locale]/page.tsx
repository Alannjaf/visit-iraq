import { getApprovedListings } from "@/lib/db";
import { Header, Footer } from "@/components/layout";
import { stackServerApp } from "@/stack";
import { getUserRole } from "@/lib/db";
import { SearchBar } from "@/components/SearchBar";
import { CityFilter } from "@/components/CityFilter";
import { HomePageContent } from "./HomePageContent";

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
  const typeFilter = params.type as
    | "accommodation"
    | "attraction"
    | "tour"
    | undefined;
  const cityFilter = params.city;

  const listings = await getApprovedListings(
    typeFilter,
    cityFilter,
    searchQuery
  );

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

        <HomePageContent
          listings={listings}
          searchQuery={searchQuery}
          typeFilter={typeFilter}
          cityFilter={cityFilter}
          hasUser={!!user}
        />
      </main>

      <Footer />
    </div>
  );
}

