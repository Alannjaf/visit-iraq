"use client";

import Link from "next/link";
import { UserButton } from "@stackframe/stack";
import { Header, Footer } from "@/components/layout";
import { Button, Card, CardContent, Badge } from "@/components/ui";

interface ProfileContentProps {
  user: {
    id: string;
    displayName: string | null;
    primaryEmail: string;
  };
  userRole: string;
}

export function ProfileContent({ user, userRole }: ProfileContentProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userRole={userRole as "admin" | "host" | "user"} />

      <main className="flex-1 bg-[var(--background-alt)] py-8">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Link
              href="/dashboard"
              className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
            >
              ← Back to Dashboard
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">Profile Settings</h1>

          {/* Profile Card */}
          <Card className="mb-6">
            <CardContent className="p-8">
              <div className="flex items-center gap-6 mb-8">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center text-white text-3xl font-bold">
                  {user.displayName?.[0] || user.primaryEmail?.[0] || "U"}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[var(--foreground)]">
                    {user.displayName || "User"}
                  </h2>
                  <p className="text-[var(--foreground-muted)]">{user.primaryEmail}</p>
                  <div className="mt-2">
                    <Badge variant={userRole === "host" ? "host" : userRole === "admin" ? "admin" : "default"}>
                      {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Display Name</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {user.displayName || "Not set"}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Email</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{user.primaryEmail}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">Account Type</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {userRole === "host" 
                        ? "Host - Can create and manage listings"
                        : userRole === "admin"
                          ? "Admin - Full platform access"
                          : "User - Can browse and view listings"
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">User ID</p>
                    <p className="text-sm text-[var(--foreground-muted)] font-mono">{user.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardContent className="p-8">
              <h3 className="font-bold text-[var(--foreground)] mb-4">Account Management</h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                Manage your account settings and authentication options.
              </p>
              <div className="flex gap-4">
                <UserButton />
                <Link href="/handler/sign-out">
                  <Button variant="outline">Sign Out</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

