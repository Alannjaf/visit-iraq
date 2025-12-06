"use client";

import Link from "next/link";
import { useUser, UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface HeaderProps {
  userRole?: "admin" | "host" | "user" | null;
}

export function Header({ userRole }: HeaderProps) {
  const user = useUser();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const handleBecomeHostClick = () => {
    setShowConfirmModal(true);
  };

  const handleConfirmUpgrade = async () => {
    setUpgrading(true);
    try {
      const res = await fetch("/api/user/role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestedRole: "host" }),
      });
      if (res.ok) {
        setShowConfirmModal(false);
        router.push("/host");
        router.refresh();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUpgrading(false);
    }
  };

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


          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {userRole === "user" && (
                  <Button 
                    variant="secondary" 
                    size="sm"
                    onClick={handleBecomeHostClick}
                  >
                    Become a Host
                  </Button>
                )}
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
              {user ? (
                <>
                  {userRole === "user" && (
                    <button
                      onClick={handleBecomeHostClick}
                      className="px-4 py-2 text-center bg-[var(--secondary)] text-white rounded-lg font-medium hover:bg-[var(--secondary-dark)] transition-colors"
                    >
                      Become a Host
                    </button>
                  )}
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

      {/* Become a Host Confirmation Modal */}
      <Modal
        isOpen={showConfirmModal}
        onClose={() => !upgrading && setShowConfirmModal(false)}
        title="Become a Host"
        size="lg"
      >
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-[var(--secondary)]/20 flex items-center justify-center">
              <svg className="w-10 h-10 text-[var(--secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[var(--foreground)] text-center">
              Ready to share your place with travelers?
            </h3>
            
            <div className="space-y-3 text-[var(--foreground-muted)]">
              <p className="text-sm">
                As a host on Visit Iraq, you can:
              </p>
              
              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>Create and manage listings for accommodations, attractions, or tours</li>
                <li>Share your space with travelers from around the world</li>
                <li>Help visitors discover the beauty and heritage of Iraq</li>
                <li>Set your own pricing and availability</li>
                <li>Receive inquiries directly from interested travelers</li>
              </ul>

              <div className="mt-4 p-4 bg-[var(--background-alt)] rounded-lg">
                <p className="text-sm font-medium text-[var(--foreground)] mb-2">
                  What happens next?
                </p>
                <p className="text-sm text-[var(--foreground-muted)]">
                  After upgrading, you&apos;ll be redirected to your Host Dashboard where you can create your first listing. 
                  All listings are reviewed by our admin team before being published to ensure quality.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => setShowConfirmModal(false)}
              disabled={upgrading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleConfirmUpgrade}
              isLoading={upgrading}
              className="flex-1"
            >
              Yes, Become a Host
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}

