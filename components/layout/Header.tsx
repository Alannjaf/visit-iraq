"use client";

import Link from "next/link";
import { useUser, UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/Button";
import { useState } from "react";

interface HeaderProps {
  userRole?: "admin" | "host" | "user" | null;
}

export function Header({ userRole }: HeaderProps) {
  const user = useUser();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-[var(--primary-light)] flex items-center justify-center">
              <svg className="w-6 h-6 text-[var(--secondary)]" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <span className="font-display text-xl font-bold text-[var(--primary)]">
              Visit Iraq
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="text-[var(--foreground-muted)] hover:text-[var(--primary)] font-medium transition-colors"
            >
              Explore
            </Link>
            <Link
              href="/?type=accommodation"
              className="text-[var(--foreground-muted)] hover:text-[var(--primary)] font-medium transition-colors"
            >
              Accommodations
            </Link>
            <Link
              href="/?type=attraction"
              className="text-[var(--foreground-muted)] hover:text-[var(--primary)] font-medium transition-colors"
            >
              Attractions
            </Link>
            <Link
              href="/?type=tour"
              className="text-[var(--foreground-muted)] hover:text-[var(--primary)] font-medium transition-colors"
            >
              Tours
            </Link>
          </nav>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {userRole === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">Admin Panel</Button>
                  </Link>
                )}
                {(userRole === "host" || userRole === "admin") && (
                  <Link href="/host">
                    <Button variant="ghost" size="sm">Host Dashboard</Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">Dashboard</Button>
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/handler/sign-in">
                  <Button variant="ghost" size="sm">Sign In</Button>
                </Link>
                <Link href="/handler/sign-up">
                  <Button variant="primary" size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-[var(--background-alt)]"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-[var(--border)]">
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
              >
                Explore
              </Link>
              <Link
                href="/?type=accommodation"
                className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
              >
                Accommodations
              </Link>
              <Link
                href="/?type=attraction"
                className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
              >
                Attractions
              </Link>
              <Link
                href="/?type=tour"
                className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
              >
                Tours
              </Link>
              <hr className="my-2 border-[var(--border)]" />
              {user ? (
                <>
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
                    >
                      Admin Panel
                    </Link>
                  )}
                  {(userRole === "host" || userRole === "admin") && (
                    <Link
                      href="/host"
                      className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
                    >
                      Host Dashboard
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
                  >
                    Dashboard
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/handler/sign-in"
                    className="px-4 py-2 text-[var(--foreground-muted)] hover:text-[var(--primary)] hover:bg-[var(--background-alt)] rounded-lg font-medium transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/handler/sign-up"
                    className="px-4 py-2 text-center bg-[var(--primary)] text-white rounded-lg font-medium"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}

