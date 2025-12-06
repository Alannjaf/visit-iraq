import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getListingsByHost, getUserRole } from "@/lib/db";
import Link from "next/link";
import { Badge, Button } from "@/components/ui";
import { formatDate, getListingTypeLabel, getListingTypeEmoji } from "@/lib/utils";

export default async function HostDashboard() {
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/handler/sign-in?after_auth_return_to=/host");
  }

  const role = await getUserRole(user.id);
  if (role !== "host" && role !== "admin") {
    redirect("/dashboard?upgrade=true");
  }

  const listings = await getListingsByHost(user.id);

  const pendingCount = listings.filter(l => l.status === "pending").length;
  const approvedCount = listings.filter(l => l.status === "approved").length;
  const rejectedCount = listings.filter(l => l.status === "rejected").length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--foreground)]">My Listings</h1>
          <p className="text-[var(--foreground-muted)] mt-2">
            Manage your accommodations, attractions, and tours
          </p>
        </div>
        <Link href="/host/new">
          <Button variant="primary">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add New Listing
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-yellow-100 text-yellow-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{pendingCount}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Pending Review</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{approvedCount}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Live Listings</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold text-[var(--foreground)]">{rejectedCount}</p>
              <p className="text-sm text-[var(--foreground-muted)]">Needs Changes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Listings */}
      {listings.length === 0 ? (
        <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--background-alt)] flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-[var(--foreground-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">No listings yet</h2>
          <p className="text-[var(--foreground-muted)] mb-6">
            Start by creating your first listing to share with travelers
          </p>
          <Link href="/host/new">
            <Button variant="primary">Create Your First Listing</Button>
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="divide-y divide-[var(--border)]">
            {listings.map((listing) => (
              <div key={listing.id} className="p-6 hover:bg-[var(--background-alt)] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-[var(--background-alt)] flex items-center justify-center flex-shrink-0 text-2xl">
                    {getListingTypeEmoji(listing.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-[var(--foreground)] truncate">
                        {listing.title}
                      </h3>
                      <Badge variant={listing.status as "pending" | "approved" | "rejected"}>
                        {listing.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-[var(--foreground-muted)] mb-2">
                      {getListingTypeLabel(listing.type)} • {listing.city}, {listing.region}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Created {formatDate(listing.created_at)}
                    </p>
                    {listing.status === "rejected" && listing.rejection_reason && (
                      <div className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
                        <p className="text-sm text-red-700">{listing.rejection_reason}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/host/edit/${listing.id}`}>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </Link>
                    <Link href={`/listings/${listing.id}`}>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

