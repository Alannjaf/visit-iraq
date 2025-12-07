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
    <nav className="bg-[var(--primary)] text-white">
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
              <Link href="/admin" className="hover:text-[var(--secondary)] transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/listings" className="hover:text-[var(--secondary)] transition-colors">
                Listings
              </Link>
              <Link href="/admin/users" className="hover:text-[var(--secondary)] transition-colors">
                Users
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-white/70 hover:text-white transition-colors text-sm">
              View Site
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              disabled={loggingOut}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors text-sm disabled:opacity-60"
            >
              {loggingOut ? "Logging out..." : "Logout"}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}


