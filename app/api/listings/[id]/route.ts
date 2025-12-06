import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { 
  getListingById, 
  updateListing, 
  deleteListing,
  getUserRole,
  type Listing
} from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/listings/[id] - Get a single listing
export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    // Admin session fallback (non-Stack Auth admin)
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-session")?.value === "true";

    const listing = await getListingById(id);
    
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    // Check if user is authenticated for full details
    let user = null;
    try {
      user = await stackServerApp.getUser();
    } catch {
      // User not authenticated via Stack Auth, but might be admin
    }
    
    const isAuthenticated = !!user || adminSession;

    // If listing is not approved, only owner or admin can see it
    if (listing.status !== "approved") {
      if (!user && !adminSession) {
        return NextResponse.json(
          { error: "Listing not found" },
          { status: 404 }
        );
      }
      if (adminSession) {
        // Admin can see any listing
        return NextResponse.json({ listing, isAuthenticated: true });
      }
      const role = await getUserRole(user!.id);
      if (listing.host_id !== user!.id && role !== "admin") {
        return NextResponse.json(
          { error: "Listing not found" },
          { status: 404 }
        );
      }
    }

    // Return full or partial listing based on auth status
    if (isAuthenticated) {
      return NextResponse.json({ listing, isAuthenticated: true });
    } else {
      // Hide sensitive info for guests
      const publicListing: Partial<Listing> = {
        id: listing.id,
        type: listing.type,
        title: listing.title,
        description: listing.description,
        location: listing.location,
        city: listing.city,
        region: listing.region,
        images: listing.images,
        videos: listing.videos || [],
        amenities: listing.amenities,
        status: listing.status,
        created_at: listing.created_at,
      };
      return NextResponse.json({ listing: publicListing, isAuthenticated: false });
    }
  } catch (error) {
    console.error("Error fetching listing:", error);
    return NextResponse.json(
      { error: "Failed to fetch listing" },
      { status: 500 }
    );
  }
}

// PATCH /api/listings/[id] - Update a listing
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-session")?.value === "true";
    let user = null;
    try {
      user = await stackServerApp.getUser();
    } catch {
      // User not authenticated via Stack Auth
    }
    if (!user && !adminSession) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const listing = await getListingById(id);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const role = adminSession ? "admin" : await getUserRole(user!.id);
    
    // Only owner or admin can update
    if (!adminSession && listing.host_id !== user!.id && role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    const body = await request.json();
    
    // Hosts can only update their listings if pending or rejected
    // Admin can update any listing
    if (role !== "admin" && listing.status === "approved") {
      return NextResponse.json(
        { error: "Cannot edit approved listings. Contact admin for changes." },
        { status: 403 }
      );
    }

    // If host is resubmitting a rejected listing, reset status to pending
    if (role !== "admin" && listing.status === "rejected") {
      body.status = "pending";
      body.rejection_reason = null;
    }

    const updatedListing = await updateListing(id, body);
    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    console.error("Error updating listing:", error);
    return NextResponse.json(
      { error: "Failed to update listing" },
      { status: 500 }
    );
  }
}

// DELETE /api/listings/[id] - Delete a listing
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-session")?.value === "true";
    let user = null;
    try {
      user = await stackServerApp.getUser();
    } catch {
      // User not authenticated via Stack Auth
    }
    if (!user && !adminSession) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const listing = await getListingById(id);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    const role = adminSession ? "admin" : await getUserRole(user!.id);
    
    // Only owner or admin can delete
    if (!adminSession && listing.host_id !== user!.id && role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }

    await deleteListing(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return NextResponse.json(
      { error: "Failed to delete listing" },
      { status: 500 }
    );
  }
}

