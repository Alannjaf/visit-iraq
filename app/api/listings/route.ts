import { NextRequest, NextResponse } from "next/server";
import { stackServerApp } from "@/stack";
import { 
  getApprovedListings, 
  getAllListings, 
  createListing, 
  getUserRole,
  type ListingType 
} from "@/lib/db";

// GET /api/listings - Get all approved listings (public) or all listings (admin)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const type = searchParams.get("type") as ListingType | null;
  const city = searchParams.get("city");
  const all = searchParams.get("all") === "true";

  try {
    // Check if admin is requesting all listings
    if (all) {
      const user = await stackServerApp.getUser();
      if (user) {
        const role = await getUserRole(user.id);
        if (role === "admin") {
          const listings = await getAllListings();
          return NextResponse.json({ listings });
        }
      }
    }

    // Return only approved listings for public access
    const listings = await getApprovedListings(
      type || undefined,
      city || undefined
    );
    return NextResponse.json({ listings });
  } catch (error) {
    console.error("Error fetching listings:", error);
    return NextResponse.json(
      { error: "Failed to fetch listings" },
      { status: 500 }
    );
  }
}

// POST /api/listings - Create a new listing (hosts only)
export async function POST(request: NextRequest) {
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
        { error: "Only hosts can create listings" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const {
      type,
      title,
      description,
      location,
      city,
      region,
      full_address,
      price_range,
      contact_phone,
      contact_email,
      external_link,
      images,
      videos,
      amenities,
    } = body;

    // Validate required fields
    if (!type || !title || !description || !location || !city || !region) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const listing = await createListing({
      host_id: user.id,
      type,
      title,
      description,
      location,
      city,
      region,
      full_address: full_address || "",
      price_range: price_range || "moderate",
      contact_phone: contact_phone || "",
      contact_email: contact_email || "",
      external_link: external_link || "",
      images: images || [],
      videos: videos || [],
      amenities: amenities || [],
    });

    return NextResponse.json({ listing }, { status: 201 });
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Failed to create listing" },
      { status: 500 }
    );
  }
}

