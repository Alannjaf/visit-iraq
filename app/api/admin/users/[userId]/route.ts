import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { getUserRole, getUserDetailsFromStack } from "@/lib/db";

// GET /api/admin/users/[userId] - Get a single user's details (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ userId: string }> }
) {
  try {
    const { userId } = await params;
    
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
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Fetch user details
    const userDetails = await getUserDetailsFromStack(userId);
    
    if (!userDetails) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      email: userDetails.email,
      displayName: userDetails.displayName,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json(
      { error: "Failed to fetch user details" },
      { status: 500 }
    );
  }
}

