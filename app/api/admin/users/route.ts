import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { stackServerApp } from "@/stack";
import { getAllUsers, getUsersByRole, getUserRole, getUserDetailsFromStack, type UserRole } from "@/lib/db";

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

    // getAllUsers and getUsersByRole now JOIN with sync table, so data is already fetched
    // Only need to update user_roles if sync table has better data and user_roles is missing it
    const usersWithDetails = await Promise.all(
      userRoles.map(async (userRole) => {
        // Data is already fetched from JOIN, but update user_roles if sync table had better data
        // This ensures future queries don't need the JOIN
        if (userRole.email && userRole.email !== "No email" && userRole.display_name) {
          // Data is already good, no need to update
          return {
            ...userRole,
            email: userRole.email,
            displayName: userRole.display_name,
          };
        }
        
        // If data is still missing, try Stack API as last resort (should be rare now)
        if (!userRole.email || userRole.email === "No email" || !userRole.display_name) {
          const userDetails = await getUserDetailsFromStack(userRole.user_id);
          if (userDetails) {
            // Update user_roles for future queries
            try {
              const { setUserRole } = await import('@/lib/db');
              await setUserRole(userRole.user_id, userRole.role, userDetails.email || null, userDetails.displayName || null);
            } catch (error) {
              // Silently fail - will update on next check
            }
            
            return {
              ...userRole,
              email: userDetails.email || userRole.email || "No email",
              displayName: userDetails.displayName || userRole.display_name || null,
            };
          }
        }
        
        return {
          ...userRole,
          email: userRole.email || "No email",
          displayName: userRole.display_name || null,
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

