"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

export function AdminNav() {
  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/admin/login", { method: "DELETE" });
      window.location.href = "/admin/login";
    } catch (err) {
      console.error("Logout failed", err);
      setLoggingOut(false);
    }
  };

  return (
    <nav className="bg-white border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            <Link href="/admin" className="flex items-center gap-3">
              <Image
                src="/logo.svg"
                alt="Visit Iraq"
                width={234}
                height={78}
                className="h-[50px] w-auto"
                priority
              />
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link href="/admin" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/listings" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
                Listings
              </Link>
              <Link href="/admin/users" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors">
                Users
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors text-sm">
              View Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-4 py-2 bg-[var(--primary)] hover:bg-[var(--primary-dark)] text-white rounded-lg transition-colors text-sm disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


