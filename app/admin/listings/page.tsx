import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllListings } from "@/lib/db";
import { Badge } from "@/components/ui";
import { formatDate, getListingTypeLabel } from "@/lib/utils";

export default async function AdminListingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; type?: string }>;
}) {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-session")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  const params = await searchParams;
  const allListings = await getAllListings();
  
  // Filter listings based on query params
  let listings = allListings;
  if (params.status) {
    listings = listings.filter(l => l.status === params.status);
  }
  if (params.type) {
    listings = listings.filter(l => l.type === params.type);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">Listings</h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            Manage all listings across the platform
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-[var(--border)] p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">
              Status
            </label>
            <div className="flex gap-2">
              <Link
                href="/admin/listings"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  !params.status
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                }`}
              >
                All
              </Link>
              <Link
                href="/admin/listings?status=pending"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  params.status === "pending"
                    ? "bg-yellow-500 text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                }`}
              >
                Pending
              </Link>
              <Link
                href="/admin/listings?status=approved"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  params.status === "approved"
                    ? "bg-green-500 text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                }`}
              >
                Approved
              </Link>
              <Link
                href="/admin/listings?status=rejected"
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  params.status === "rejected"
                    ? "bg-red-500 text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                }`}
              >
                Rejected
              </Link>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--foreground-muted)] mb-1">
              Type
            </label>
            <div className="flex gap-2">
              <Link
                href={`/admin/listings${params.status ? `?status=${params.status}` : ""}`}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  !params.type
                    ? "bg-[var(--primary)] text-white"
                    : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                }`}
              >
                All
              </Link>
              {["accommodation", "attraction", "tour"].map((type) => (
                <Link
                  key={type}
                  href={`/admin/listings?${params.status ? `status=${params.status}&` : ""}type=${type}`}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    params.type === type
                      ? "bg-[var(--secondary)] text-[var(--primary-dark)]"
                      : "bg-[var(--background-alt)] text-[var(--foreground-muted)] hover:bg-[var(--border)]"
                  }`}
                >
                  {getListingTypeLabel(type)}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Listings Table */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
        {listings.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-[var(--background-alt)] flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <p className="text-[var(--foreground-muted)]">No listings found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[var(--background-alt)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Listing
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--foreground-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {listings.map((listing) => (
                <tr key={listing.id} className="hover:bg-[var(--background-alt)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[var(--background-alt)] flex items-center justify-center flex-shrink-0">
                        {listing.type === "accommodation" && "🏨"}
                        {listing.type === "attraction" && "🏛️"}
                        {listing.type === "tour" && "🗺️"}
                      </div>
                      <div>
                        <p className="font-medium text-[var(--foreground)]">{listing.title}</p>
                        <p className="text-sm text-[var(--foreground-muted)]">
                          Host: {listing.host_id.slice(0, 8)}...
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--foreground)]">
                      {getListingTypeLabel(listing.type)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--foreground)]">
                      {listing.city}, {listing.region}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={listing.status as "pending" | "approved" | "rejected"}>
                      {listing.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-[var(--foreground-muted)]">
                      {formatDate(listing.created_at)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/listings/${listing.id}`}
                      className="text-[var(--primary)] hover:underline font-medium text-sm"
                    >
                      Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

