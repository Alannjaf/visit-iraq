import { stackServerApp } from "@/stack";
import { redirect } from "next/navigation";
import { getUserRole } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";
import { Link } from '@/i18n/routing';

export default async function NewListingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
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
          ← Back to My Listings
        </Link>
        <h1 className="text-3xl font-bold text-[var(--foreground)] mt-4">Add New Listing</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          Fill in the details below. Your listing will be reviewed before going live.
        </p>
      </div>

      <ListingForm mode="create" />
    </div>
  );
}

