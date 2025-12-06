import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST /api/admin/login - Admin login with env credentials
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Normalize inputs to avoid casing/whitespace issues
    const email = (body?.email || "").trim().toLowerCase();
    const password = (body?.password || "").trim();

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const adminPassword = (process.env.ADMIN_PASSWORD || "").trim();

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { error: "Admin credentials not configured" },
        { status: 500 }
      );
    }

    if (email !== adminEmail || password !== adminPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Set admin session cookie
    const cookieStore = await cookies();
    cookieStore.set("admin-session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/login - Admin logout
export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin-session");
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" },
      { status: 500 }
    );
  }
}

