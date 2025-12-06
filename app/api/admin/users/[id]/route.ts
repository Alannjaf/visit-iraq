import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { getUserRole, setUserRole, suspendUser, type UserRole } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PATCH /api/admin/users/[id] - Update user role or suspension status
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;

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
          const adminRole = await getUserRole(user.id);
          if (adminRole === "admin") {
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

    const body = await request.json();
    const { role, is_suspended } = body;

    if (role && ["admin", "host", "user"].includes(role)) {
      await setUserRole(id, role as UserRole);
    }

    if (typeof is_suspended === "boolean") {
      await suspendUser(id, is_suspended);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

