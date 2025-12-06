import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { getAllUsers, getUsersByRole, getUserRole, sql, type UserRole } from "@/lib/db";

// GET /api/admin/users - Get all users (admin only)
export async function GET(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams;
    const roleFilter = searchParams.get("role") as UserRole | null;

    const userRoles = roleFilter 
      ? await getUsersByRole(roleFilter)
      : await getAllUsers();

    // Fetch user details from neon_auth.users_sync table
    const usersWithDetails = await Promise.all(
      userRoles.map(async (userRole) => {
        let email = "No email";
        let displayName: string | null = null;
        
        try {
          // Query neon_auth.users_sync table (Stack Auth sync table)
          const userDetails = await sql`
            SELECT 
              id,
              email,
              name
            FROM neon_auth.users_sync
            WHERE id = ${userRole.user_id}
            LIMIT 1
          `;
          
          if (userDetails && Array.isArray(userDetails) && userDetails.length > 0) {
            const user = userDetails[0] as { id: string; email: string | null; name: string | null };
            email = user.email || "No email";
            displayName = user.name || null;
          }
        } catch (error: any) {
          console.error(`Error fetching user details for ${userRole.user_id}:`, error?.message || error);
        }
        
        return {
          ...userRole,
          email,
          displayName,
        };
      })
    );

    return NextResponse.json({ users: usersWithDetails });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

