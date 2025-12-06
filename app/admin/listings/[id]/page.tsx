"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Badge, Textarea } from "@/components/ui";
import { formatDate, getListingTypeLabel, formatPriceRange } from "@/lib/utils";
import type { Listing } from "@/lib/db";

export default function AdminListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = async () => {
    try {
      const res = await fetch(`/api/listings/${id}`, { 
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to fetch`);
      }
      
      const data = await res.json();
      setListing(data.listing);
    } catch (error) {
      console.error("Error fetching listing:", error);
      // Show error to user
      alert(`Error loading listing: ${error instanceof Error ? error.message : "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${id}/approve`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to approve`);
      }
      
      await fetchListing();
    } catch (error) {
      console.error("Error approving listing:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to approve listing"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${id}/reject`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to reject`);
      }
      
      setShowRejectForm(false);
      setRejectReason("");
      await fetchListing();
    } catch (error) {
      console.error("Error rejecting listing:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to reject listing"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelist = async () => {
    if (!confirm("Are you sure you want to delist this listing? It will be removed from public view.")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/listings/${id}/delist`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        throw new Error(errorData.error || `HTTP ${res.status}: Failed to delist`);
      }
      
      await fetchListing();
    } catch (error) {
      console.error("Error delisting:", error);
      alert(`Error: ${error instanceof Error ? error.message : "Failed to delist listing"}`);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/listings/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to delete");
      router.push("/admin/listings");
    } catch (error) {
      console.error(error);
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-[var(--background-alt)] rounded w-1/3"></div>
          <div className="h-64 bg-[var(--background-alt)] rounded"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center">
        <p className="text-[var(--foreground-muted)]">Listing not found</p>
        <Link href="/admin/listings" className="text-[var(--primary)] hover:underline mt-4 inline-block">
          ← Back to Listings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link
          href="/admin/listings"
          className="text-[var(--foreground-muted)] hover:text-[var(--primary)] transition-colors"
        >
          ← Back to Listings
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden mb-6">
        <div className="p-6 border-b border-[var(--border)]">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <Badge variant={listing.status as "pending" | "approved" | "rejected" | "delisted"}>
                  {listing.status}
                </Badge>
                <span className="text-sm text-[var(--foreground-muted)]">
                  {getListingTypeLabel(listing.type)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-[var(--foreground)]">{listing.title}</h1>
              <p className="text-[var(--foreground-muted)] mt-1">
                {listing.city}, {listing.region}
              </p>
            </div>
          </div>
        </div>

        {/* Images Gallery */}
        {listing.images && listing.images.length > 0 && (
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {listing.images.map((img, index) => (
                <div key={index} className="relative group">
                  <img
                    src={img}
                    alt={`${listing.title} image ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Invalid+URL";
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Videos */}
        {listing.videos && listing.videos.length > 0 && (
          <div className="p-6 border-b border-[var(--border)]">
            <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Videos</h2>
            <div className="space-y-4">
              {listing.videos.map((videoUrl, index) => (
                <div key={index} className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  {videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') ? (
                    <iframe
                      src={videoUrl.includes('youtube.com/watch') 
                        ? videoUrl.replace('watch?v=', 'embed/').split('&')[0]
                        : videoUrl.replace('youtu.be/', 'youtube.com/embed/')}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : videoUrl.includes('vimeo.com') ? (
                    <iframe
                      src={`https://player.vimeo.com/video/${videoUrl.split('/').pop()}`}
                      className="w-full h-full"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={videoUrl}
                      className="w-full h-full object-cover"
                      controls
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        {listing.status === "pending" && (
          <div className="p-6 bg-[var(--background-alt)]">
            {showRejectForm ? (
              <div className="space-y-4">
                <Textarea
                  label="Rejection Reason"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explain why this listing is being rejected..."
                  rows={3}
                />
                <div className="flex gap-3">
                  <Button
                    variant="danger"
                    onClick={handleReject}
                    isLoading={actionLoading}
                    disabled={!rejectReason.trim()}
                  >
                    Confirm Rejection
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectReason("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleApprove}
                  isLoading={actionLoading}
                >
                  Approve Listing
                </Button>
                <Button
                  variant="danger"
                  onClick={() => setShowRejectForm(true)}
                >
                  Reject Listing
                </Button>
              </div>
            )}
          </div>
        )}

        {listing.status === "rejected" && listing.rejection_reason && (
          <div className="p-6 bg-red-50 border-t border-red-100">
            <p className="text-sm font-medium text-red-800 mb-1">Rejection Reason:</p>
            <p className="text-red-700">{listing.rejection_reason}</p>
          </div>
        )}

        {listing.status === "approved" && (
          <div className="p-6 bg-[var(--background-alt)]">
            <div className="flex gap-3">
              <Button
                variant="danger"
                onClick={handleDelist}
                isLoading={actionLoading}
              >
                Delist Listing
              </Button>
            </div>
            <p className="text-sm text-[var(--foreground-muted)] mt-3">
              Delisting will remove this listing from public view. The host can still see and edit it.
            </p>
          </div>
        )}

        {listing.status === "delisted" && (
          <div className="p-6 bg-yellow-50 border-t border-yellow-100">
            <p className="text-sm font-medium text-yellow-800 mb-2">This listing has been delisted</p>
            <p className="text-sm text-yellow-700 mb-3">
              It is not visible to the public. You can approve it again to make it live.
            </p>
            <Button
              variant="primary"
              onClick={handleApprove}
              isLoading={actionLoading}
            >
              Re-approve Listing
            </Button>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="bg-white rounded-xl border border-[var(--border)] overflow-hidden mb-6">
        <div className="p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Description</h2>
          <p className="text-[var(--foreground)] whitespace-pre-wrap">{listing.description}</p>
        </div>
      </div>

      {/* Contact & Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Contact Information</h2>
          <div className="space-y-3">
            {listing.contact_email && (
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Email</p>
                <p className="text-[var(--foreground)]">{listing.contact_email}</p>
              </div>
            )}
            {listing.contact_phone && (
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Phone</p>
                <p className="text-[var(--foreground)]">{listing.contact_phone}</p>
              </div>
            )}
            {listing.full_address && (
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">Address</p>
                <p className="text-[var(--foreground)]">{listing.full_address}</p>
              </div>
            )}
            {listing.external_link && (
              <div>
                <p className="text-sm text-[var(--foreground-muted)]">External Link</p>
                <a
                  href={listing.external_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[var(--primary)] hover:underline"
                >
                  {listing.external_link}
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-[var(--border)] p-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Details</h2>
          <div className="space-y-3">
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Price Range</p>
              <p className="text-[var(--foreground)]">{formatPriceRange(listing.price_range)}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Location</p>
              <p className="text-[var(--foreground)]">{listing.location}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Created</p>
              <p className="text-[var(--foreground)]">{formatDate(listing.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-[var(--foreground-muted)]">Host ID</p>
              <p className="text-[var(--foreground)] font-mono text-sm">{listing.host_id}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities */}
      {listing.amenities && listing.amenities.length > 0 && (
        <div className="bg-white rounded-xl border border-[var(--border)] p-6 mb-6">
          <h2 className="text-lg font-bold text-[var(--foreground)] mb-4">Amenities / Features</h2>
          <div className="flex flex-wrap gap-2">
            {listing.amenities.map((amenity, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-[var(--background-alt)] rounded-full text-sm text-[var(--foreground)]"
              >
                {amenity}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white rounded-xl border border-red-200 p-6">
        <h2 className="text-lg font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-[var(--foreground-muted)] mb-4">
          Permanently delete this listing. This action cannot be undone.
        </p>
        <Button variant="danger" onClick={handleDelete} isLoading={actionLoading}>
          Delete Listing
        </Button>
      </div>
    </div>
  );
}

