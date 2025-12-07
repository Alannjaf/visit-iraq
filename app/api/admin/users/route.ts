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

    // Fetch user details - user_roles now has email/display_name, but we'll enhance with sync table data if available
    const usersWithDetails = await Promise.all(
      userRoles.map(async (userRole) => {
        // userRole already has email and display_name from the query
        // But let's try to enhance it with sync table data if user_roles data is missing
        let email = userRole.email || "No email";
        let displayName = userRole.display_name || null;
        
        // If we don't have email/display_name in user_roles, try sync table
        if (!userRole.email || !userRole.display_name) {
          const userDetails = await getUserDetailsFromStack(userRole.user_id);
          if (userDetails) {
            email = userDetails.email || email;
            displayName = userDetails.displayName || displayName;
            
            // Update user_roles with the found data for future use
            if (userDetails.email || userDetails.displayName) {
              try {
                const { setUserRole } = await import('@/lib/db');
                await setUserRole(userRole.user_id, userRole.role, userDetails.email || null, userDetails.displayName || null);
              } catch (error) {
                // Silently fail - will update on next check
              }
            }
          }
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

