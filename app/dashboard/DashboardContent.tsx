"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Badge } from "@/components/ui";

interface DashboardContentProps {
  user: {
    id: string;
    displayName: string | null;
    primaryEmail: string;
  };
  userRole: string;
  showUpgrade: boolean;
}

export function DashboardContent({ user, userRole: initialRole, showUpgrade }: DashboardContentProps) {
  const router = useRouter();
  const [userRole, setUserRole] = useState(initialRole);
  const [upgrading, setUpgrading] = useState(false);

  const handleBecomeHost = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedRole: "host" }),
      });
      if (res.ok) {
        setUserRole("host");
        router.push("/host");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpgrading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header userRole={userRole as "admin" | "host" | "user"} />

      <main className="flex-1 bg-[var(--background-alt)] py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-8 mb-8">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white text-2xl font-bold">
                {user.displayName?.[0] || user.primaryEmail?.[0] || "U"}
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-[var(--foreground)]">
                  Welcome, {user.displayName || "Traveler"}!
                </h1>
                <p className="text-[var(--foreground-muted)]">{user.primaryEmail}</p>
              </div>
              <UserButton />
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={userRole === "host" ? "host" : userRole === "admin" ? "admin" : "default"}>
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </Badge>
              {userRole === "host" && (
                <span className="text-sm text-[var(--foreground-muted)]">
                  You can create and manage listings
                </span>
              )}
            </div>
          </div>

          {/* Upgrade Prompt */}
          {(showUpgrade || userRole === "user") && userRole !== "host" && userRole !== "admin" && (
            <Card className="mb-8 border-[var(--secondary)]">
              <CardContent className="p-8">
                <div className="flex items-start gap-6">
                  <div className="w-16 h-16 rounded-xl bg-[var(--secondary)]/20 flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-[var(--secondary-dark)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-bold text-[var(--foreground)] mb-2">
                      Become a Host
                    </h2>
                    <p className="text-[var(--foreground-muted)] mb-4">
                      Share your accommodations, attractions, or tours with travelers from around the world. 
                      As a host, you can create listings and help visitors discover the beauty of Iraq.
                    </p>
                    <Button 
                      variant="secondary" 
                      onClick={handleBecomeHost}
                      isLoading={upgrading}
                    >
                      Upgrade to Host Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <Link href="/">
              <Card className="h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--foreground)]">Explore Listings</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Discover accommodations, attractions & tours
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>

            {(userRole === "host" || userRole === "admin") && (
              <Link href="/host">
                <Card className="h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Host Dashboard</h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Manage your listings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            {userRole === "admin" && (
              <Link href="/admin">
                <Card className="h-full">
                  <CardContent className="p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-lg bg-red-100 text-red-600 flex items-center justify-center">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--foreground)]">Admin Panel</h3>
                      <p className="text-sm text-[var(--foreground-muted)]">
                        Manage users and listings
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )}

            <Link href="/profile">
              <Card className="h-full">
                <CardContent className="p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-green-100 text-green-600 flex items-center justify-center">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--foreground)]">Profile Settings</h3>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      Manage your account
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Info Section */}
          <div className="bg-white rounded-xl border border-[var(--border)] p-6">
            <h2 className="font-bold text-[var(--foreground)] mb-4">About Visit Iraq</h2>
            <p className="text-[var(--foreground-muted)] leading-relaxed">
              Visit Iraq is your gateway to discovering the rich heritage and modern wonders of Iraq. 
              As a registered user, you have full access to contact information, pricing details, 
              and booking options for all listings. Explore ancient Mesopotamian ruins, 
              vibrant cities, and warm hospitality.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

