import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { getUserRole, setUserRole, type UserRole } from "@/lib/db";
import { ensureUserRole } from "@/lib/auth";

// GET /api/user/role - Get current user's role
export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user has a role (auto-initialize if needed)
    const role = await ensureUserRole(user.id, 'user');
    return NextResponse.json({ role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    return NextResponse.json(
      { error: "Failed to fetch role" },
      { status: 500 }
    );
  }
}

// POST /api/user/role - Request to become a host
export async function POST(request: NextRequest) {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { requestedRole } = body;

    // Users can only request to become hosts
    if (requestedRole !== "host") {
      return NextResponse.json(
        { error: "Invalid role request" },
        { status: 400 }
      );
    }

    const currentRole = await getUserRole(user.id);
    
    // Don't downgrade admins
    if (currentRole === "admin") {
      return NextResponse.json(
        { error: "Cannot change admin role" },
        { status: 403 }
      );
    }

    // Set user as host (auto-approve for now)
    await setUserRole(user.id, "host" as UserRole);
    
    return NextResponse.json({ role: "host" });
  } catch (error) {
    console.error("Error updating user role:", error);
    return NextResponse.json(
      { error: "Failed to update role" },
      { status: 500 }
    );
  }
}

