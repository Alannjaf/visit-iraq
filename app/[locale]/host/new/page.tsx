import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import { getUserRole } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";
import { Link } from '@/i18n/routing';

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations();
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect(`/${locale}/handler/sign-in?after_auth_return_to=/${locale}/host/new`);
  }

  const role = await getUserRole(user.id);
  if (role !== "host" && role !== "admin") {
    redirect(`/${locale}/dashboard?upgrade=true`);
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <Link
          href="/host"
          className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
        >
          {t('host.backToListings')}
        </Link>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mt-4">{t('host.addNewListingTitle')}</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          {t('host.addNewListingDescription')}
        </p>
      </div>

      <ListingForm mode="create" />
    </div>
  );
}

