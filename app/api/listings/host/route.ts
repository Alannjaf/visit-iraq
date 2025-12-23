import { NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { getListingsByHost, getUserRole } from "@/lib/db";

// GET /api/listings/host - Get all listings for the current host
export async function GET() {
  try {
    const user = await stackServerApp.getUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const role = await getUserRole(user.id);
    if (role !== "host" && role !== "admin") {
      return NextResponse.json(
        { error: "Only hosts can access this endpoint" },
        { status: 403 }
      );
    }

    const listings = await getListingsByHost(user.id);
    return NextResponse.json(
      { listings },
      {
        headers: {
          'Cache-Control': 'private, s-maxage=30, stale-while-revalidate=60'
        }
      }
    );
  } catch (error) {
    console.error("Error fetching host listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

