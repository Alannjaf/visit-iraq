"use client";

import { Link } from '@/i18n/routing';
import Image from "next/image";
import { useUser, UserButton } from "@stackframe/stack";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { useState } from "react";
import { useRouter } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';

interface HeaderProps {
  userRole?: "admin" | "host" | "user" | null;
}

export function Header({ userRole }: HeaderProps) {
  const user = useUser();
  const router = useRouter();
  const t = useTranslations();
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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Visit Iraq"
              width={234}
              height={78}
              className="h-[73px] w-auto"
              priority
            />
          </Link>

          {/* Auth Section */}
          <div className="hidden md:flex items-center gap-4">
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center gap-4">
                {userRole === "user" && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleBecomeHostClick}
                  >
                    {t('common.becomeHost')}
                  </Button>
                )}
                {userRole === "admin" && (
                  <Link href="/admin">
                    <Button variant="ghost" size="sm">
                      {t('common.adminPanel')}
                    </Button>
                  </Link>
                )}
                {(userRole === "host" || userRole === "admin") && (
                  <Link href="/host">
                    <Button variant="ghost" size="sm">
                      {t('common.hostDashboard')}
                    </Button>
                  </Link>
                )}
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    {t('common.dashboard')}
                  </Button>
                </Link>
                <UserButton />
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/handler/sign-in">
                  <Button variant="ghost" size="sm">
                    {t('common.signIn')}
                  </Button>
                </Link>
                <Link href="/handler/sign-up">
                  <Button variant="primary" size="sm">
                    {t('common.signUp')}
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-background-alt"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-2">
              <div className="px-4 pb-2">
                <LanguageSwitcher />
              </div>
              {user ? (
                <>
                  {userRole === "user" && (
                    <button
                      onClick={handleBecomeHostClick}
                      className="px-4 py-2 text-center bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors"
                    >
                      {t('common.becomeHost')}
                    </button>
                  )}
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      className="px-4 py-2 text-foreground-muted hover:text-primary hover:bg-background-alt rounded-lg font-medium transition-colors"
                    >
                      {t('common.adminPanel')}
                    </Link>
                  )}
                  {(userRole === "host" || userRole === "admin") && (
                    <Link
                      href="/host"
                      className="px-4 py-2 text-foreground-muted hover:text-primary hover:bg-background-alt rounded-lg font-medium transition-colors"
                    >
                      {t('common.hostDashboard')}
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    className="px-4 py-2 text-foreground-muted hover:text-primary hover:bg-background-alt rounded-lg font-medium transition-colors"
                  >
                    {t('common.dashboard')}
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/handler/sign-in"
                    className="px-4 py-2 text-foreground-muted hover:text-primary hover:bg-background-alt rounded-lg font-medium transition-colors"
                  >
                    {t('common.signIn')}
                  </Link>
                  <Link
                    href="/handler/sign-up"
                    className="px-4 py-2 text-center bg-primary text-white rounded-lg font-medium"
                  >
                    {t('common.signUp')}
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
        title={t('header.becomeHostTitle')}
        size="lg"
      >
        <div className="space-y-6">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
              <svg
                className="w-10 h-10 text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
          </div>

          {/* Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground text-center">
              {t('header.becomeHostDescription')}
            </h3>

            <div className="space-y-3 text-foreground-muted">
              <p className="text-sm">{t('header.becomeHostInfo')}</p>

              <ul className="space-y-2 text-sm list-disc list-inside">
                <li>{t('header.becomeHostFeature1')}</li>
                <li>{t('header.becomeHostFeature2')}</li>
                <li>{t('header.becomeHostFeature3')}</li>
                <li>{t('header.becomeHostFeature4')}</li>
                <li>{t('header.becomeHostFeature5')}</li>
              </ul>

              <div className="mt-4 p-4 bg-background-alt rounded-lg">
                <p className="text-sm font-medium text-foreground mb-2">
                  {t('header.whatHappensNext')}
                </p>
                <p className="text-sm text-foreground-muted">
                  {t('header.whatHappensNextDescription')}
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
              {t('common.cancel')}
            </Button>
            <Button
              variant="secondary"
              onClick={handleConfirmUpgrade}
              isLoading={upgrading}
              className="flex-1"
            >
              {t('header.yesBecomeHost')}
            </Button>
          </div>
        </div>
      </Modal>
    </header>
  );
}
