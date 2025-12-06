import { stackServerApp } from "@/stack";
import { redirect, notFound } from "next/navigation";
import { getUserRole, getListingById } from "@/lib/db";
import { ListingForm } from "@/components/listings/ListingForm";
import Link from "next/link";

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await stackServerApp.getUser();
  
  if (!user) {
    redirect("/handler/sign-in?after_auth_return_to=/host");
  }

  const role = await getUserRole(user.id);
  if (role !== "host" && role !== "admin") {
    redirect("/dashboard?upgrade=true");
  }

  const listing = await getListingById(id);
  
  if (!listing) {
    notFound();
  }

  // Check ownership (unless admin)
  if (listing.host_id !== user.id && role !== "admin") {
    redirect("/host");
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
        <h1 className="text-3xl font-bold text-[var(--foreground)] mt-4">Edit Listing</h1>
        <p className="text-[var(--foreground-muted)] mt-2">
          {listing.status === "rejected" 
            ? "Make the requested changes and resubmit for review."
            : listing.status === "approved"
            ? "Editing this listing will require admin re-approval before changes go live."
            : "Update your listing details."}
        </p>
        {listing.status === "rejected" && listing.rejection_reason && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
            <p className="text-red-700">{listing.rejection_reason}</p>
          </div>
        )}
        {listing.status === "approved" && (
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <p className="text-sm font-medium text-yellow-800">
              ⚠️ Note: Any changes to this approved listing will require admin review before going live again.
            </p>
          </div>
        )}
      </div>

      <ListingForm listing={listing} mode="edit" />
    </div>
  );
}

