import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { ensureUserRole } from "@/lib/auth";

// POST /api/user/init - Initialize user role on first login
export async function POST() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Ensure user has a role (defaults to 'user')
    const role = await ensureUserRole(user.id, 'user');
    
    return NextResponse.json({ role, initialized: true });
  } catch (error) {
    console.error("Error initializing user:", error);
    return NextResponse.json(
      { error: "Failed to initialize user" },
      { status: 500 }
    );
  }
}

