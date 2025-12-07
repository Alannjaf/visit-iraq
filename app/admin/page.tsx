import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getAllListings, getPendingListings, getAllUsers, getUsersByRole, getUserDetailsFromStack } from "@/lib/db";
import { getListingTypeEmoji } from "@/lib/utils";

export default async function AdminDashboard() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get("admin-session")?.value === "true";

  if (!isAdmin) {
    redirect("/admin/login");
  }

  // Fetch stats
  const [allListings, pendingListings, allUsersRaw, hosts] = await Promise.all([
    getAllListings(),
    getPendingListings(),
    getAllUsers(),
    getUsersByRole("host"),
  ]);

  // Fetch user details - user_roles now has email/display_name
  const allUsers = await Promise.all(
    allUsersRaw.map(async (userRole) => {
      // userRole already has email and display_name from the query
      let email = userRole.email || "Unknown";
      let displayName = userRole.display_name || null;
      
      // If we don't have email/display_name in user_roles, try sync table
      if (!userRole.email || !userRole.display_name) {
        const userDetails = await getUserDetailsFromStack(userRole.user_id);
        if (userDetails) {
          email = userDetails.email || email;
          displayName = userDetails.displayName || displayName;
        }
      }
      
      return {
        ...userRole,
        email,
        displayName,
      };
    })
  );

  const approvedListings = allListings.filter(l => l.status === "approved");
  const rejectedListings = allListings.filter(l => l.status === "rejected");

  const stats = [
    {
      label: "Total Listings",
      value: allListings.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      color: "bg-blue-100 text-blue-600",
      href: "/admin/listings",
    },
    {
      label: "Pending Approval",
      value: pendingListings.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-yellow-100 text-yellow-600",
      href: "/admin/listings?status=pending",
    },
    {
      label: "Approved",
      value: approvedListings.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-green-100 text-green-600",
      href: "/admin/listings?status=approved",
    },
    {
      label: "Total Hosts",
      value: hosts.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      color: "bg-purple-100 text-purple-600",
      href: "/admin/users?role=host",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)]">Admin Dashboard</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          Manage listings, users, and monitor platform activity
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white rounded-xl p-6 border border-[var(--border)] hover:shadow-lg transition-all"
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--foreground)]">{stat.value}</p>
                <p className="text-sm text-[var(--foreground-muted)]">{stat.label}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Pending Listings */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Pending Listings</h2>
            <Link
              href="/admin/listings?status=pending"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {pendingListings.length === 0 ? (
              <div className="p-6 text-center text-[var(--foreground-muted)]">
                No pending listings
              </div>
            ) : (
              pendingListings.slice(0, 5).map((listing) => (
                <Link
                  key={listing.id}
                  href={`/admin/listings/${listing.id}`}
                  className="p-4 flex items-center gap-4 hover:bg-[var(--background-alt)] transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-[var(--background-alt)] flex items-center justify-center flex-shrink-0">
                    {getListingTypeEmoji(listing.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">
                      {listing.title}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {listing.city}, {listing.region}
                    </p>
                  </div>
                  <span className="badge badge-pending">Pending</span>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden">
          <div className="p-6 border-b border-[var(--border)] flex items-center justify-between">
            <h2 className="text-lg font-bold text-[var(--foreground)]">Recent Users</h2>
            <Link
              href="/admin/users"
              className="text-sm text-[var(--primary)] hover:underline"
            >
              View All
            </Link>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {allUsers.length === 0 ? (
              <div className="p-6 text-center text-[var(--foreground-muted)]">
                No users yet
              </div>
            ) : (
              allUsers.slice(0, 5).map((user) => (
                <div
                  key={user.user_id}
                  className="p-4 flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)] flex items-center justify-center text-white font-bold">
                    {user.displayName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[var(--foreground)] truncate">
                      {user.displayName || user.email || user.user_id}
                    </p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {user.displayName ? user.email : ""}
                      {!user.displayName && !user.email && `Joined ${new Date(user.created_at).toLocaleDateString()}`}
                    </p>
                  </div>
                  <span className={`badge ${user.role === "host" ? "badge-host" : user.role === "admin" ? "badge-admin" : ""}`}>
                    {user.role.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

