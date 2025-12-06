import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { getAllListings, getPendingListings, getUserRole } from "@/lib/db";

// GET /api/admin/listings - Get all listings (admin only)
export async function GET(request: Request) {
  try {
    // Check for admin session cookie (non-Stack Auth admin)
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-session")?.value === "true";
    
    let isAdmin = false;

    if (adminSession) {
      isAdmin = true;
    } else {
      // Check Stack Auth user
      try {
        const user = await stackServerApp.getUser();
        if (user) {
          const role = await getUserRole(user.id);
          if (role === "admin") {
            isAdmin = true;
          }
        }
      } catch {
        // User not authenticated via Stack Auth
      }
    }

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const pending = searchParams.get("pending") === "true";

    const listings = pending ? await getPendingListings() : await getAllListings();
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Error fetching admin listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

