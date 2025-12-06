import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { updateListing, getUserRole, getListingById } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-session")?.value === "true";

    let user = null;
    try {
      user = await stackServerApp.getUser();
    } catch (e) {
      console.error("Stack Auth user check failed:", e);
    }

    if (!user && !adminSession) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = adminSession ? "admin" : (user ? await getUserRole(user.id) : null);
    if (role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const listing = await getListingById(id);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    if (listing.status !== "approved") {
      return NextResponse.json(
        { error: "Only approved listings can be delisted" },
        { status: 400 }
      );
    }

    const updatedListing = await updateListing(id, {
      status: "delisted",
      rejection_reason: null,
    });

    if (!updatedListing) {
      return NextResponse.json(
        { error: "Failed to delist listing" },
        { status: 500 }
      );
    }

    return NextResponse.json({ listing: updatedListing });
  } catch (error) {
    console.error("Error delisting listing:", error);
    return NextResponse.json(
      { error: "Failed to delist listing" },
      { status: 500 }
    );
  }
}

