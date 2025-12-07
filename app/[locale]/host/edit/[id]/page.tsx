import { stackServerApp } from "@/stack";
import { redirect, notFound } from "next/navigation";
import { getTranslations } from 'next-intl/server';
import { getUserRole, getListingById } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";
import { Link } from '@/i18n/routing';

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const t = await getTranslations();
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect(`/${locale}/handler/sign-in?after_auth_return_to=/${locale}/host`);
  }

  const role = await getUserRole(user.id);
  if (role !== "host" && role !== "admin") {
    redirect(`/${locale}/dashboard?upgrade=true`);
  }

  const listing = await getListingById(id);
  
  if (!listing) {
    notFound();
  }

  // Check ownership (unless admin)
  if (listing.host_id !== user.id && role !== "admin") {
    redirect(`/${locale}/host`);
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
        <h1 className="text-3xl font-bold text-[var(--foreground)] mt-4">{t('host.editListingTitle')}</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          {listing.status === "rejected" 
            ? t('host.editListingRejected')
            : listing.status === "approved"
            ? t('host.editListingApproved')
            : t('host.editListingDescription')}
        </p>
        {listing.status === "rejected" && listing.rejection_reason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">{t('host.rejectionReason')}</p>
            <p className="text-red-700">{listing.rejection_reason}</p>
          </div>
        )}
        {listing.status === "approved" && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              {t('host.editListingNote')}
            </p>
          </div>
        )}
      </div>

      <ListingForm listing={listing} mode="edit" />
    </div>
  );
}

