"use client";

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
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
  const t = useTranslations();
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
              {t('profile.backToDashboard')}
            </Link>
          </div>

          <h1 className="text-3xl font-bold text-[var(--foreground)] mb-8">{t('profile.profileSettings')}</h1>

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
                    <p className="font-medium text-[var(--foreground)]">{t('profile.displayName')}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {user.displayName || t('profile.notSet')}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{t('profile.email')}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">{user.primaryEmail}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3 border-b border-[var(--border)]">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{t('profile.accountType')}</p>
                    <p className="text-sm text-[var(--foreground-muted)]">
                      {userRole === "host" 
                        ? t('profile.hostDescription')
                        : userRole === "admin"
                          ? t('profile.adminDescription')
                          : t('profile.userDescription')
                      }
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between py-3">
                  <div>
                    <p className="font-medium text-[var(--foreground)]">{t('profile.userId')}</p>
                    <p className="text-sm text-[var(--foreground-muted)] font-mono">{user.id}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Account Management */}
          <Card>
            <CardContent className="p-8">
              <h3 className="font-bold text-[var(--foreground)] mb-4">{t('profile.accountManagement')}</h3>
              <p className="text-[var(--foreground-muted)] mb-6">
                {t('profile.accountManagementDescription')}
              </p>
              <div className="flex gap-4">
                <UserButton />
                <Link href="/handler/sign-out">
                  <Button variant="outline">{t('profile.signOut')}</Button>
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

