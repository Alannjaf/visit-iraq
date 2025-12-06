import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { approveListng, getUserRole } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST /api/admin/listings/[id]/approve - Approve a listing
export async function POST(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

  try {
    // Check for admin session cookie (non-Stack Auth admin)
    const cookieStore = await cookies();
    const adminSession = cookieStore.get("admin-session")?.value === "true";
    
    let userId = "admin";
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
            userId = user.id;
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

    const listing = await approveListng(id, userId);
    if (!listing) {
      return NextResponse.json(
        { error: "Listing not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ listing });
  } catch (error) {
    console.error("Error approving listing:", error);
    return NextResponse.json(
      { error: "Failed to approve listing" },
      { status: 500 }
    );
  }
}

