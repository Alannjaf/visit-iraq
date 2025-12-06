import { neon } from '@neondatabase/serverless';

// Create a SQL query function using Neon serverless driver
export const sql = neon(process.env.DATABASE_URL!);

// Helper function to generate UUIDs
export function generateId(): string {
  return crypto.randomUUID();
}

// Types for database models
export type UserRole = 'admin' | 'host' | 'user';

export type ListingStatus = 'pending' | 'approved' | 'rejected';

export type ListingType = 'accommodation' | 'attraction' | 'tour';

export interface UserRoleRecord {
  user_id: string;
  role: UserRole;
  is_suspended: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Listing {
  id: string;
  host_id: string;
  type: ListingType;
  title: string;
  description: string;
  location: string;
  city: string;
  region: string;
  full_address: string;
  price_range: string;
  contact_phone: string;
  contact_email: string;
  external_link: string;
  images: string[];
  amenities: string[];
  status: ListingStatus;
  rejection_reason: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface AdminAction {
  id: string;
  listing_id: string;
  admin_id: string;
  action: 'approve' | 'reject' | 'delete' | 'edit';
  reason: string | null;
  created_at: Date;
}

// Database query helpers
export async function getUserRole(userId: string): Promise<UserRole> {
  const result = await sql`
    SELECT role FROM user_roles WHERE user_id = ${userId}
  `;
  return (result[0]?.role as UserRole) || 'user';
}

export async function setUserRole(userId: string, role: UserRole): Promise<void> {
  await sql`
    INSERT INTO user_roles (user_id, role, created_at, updated_at)
    VALUES (${userId}, ${role}, NOW(), NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET role = ${role}, updated_at = NOW()
  `;
}

export async function isUserSuspended(userId: string): Promise<boolean> {
  const result = await sql`
    SELECT is_suspended FROM user_roles WHERE user_id = ${userId}
  `;
  return result[0]?.is_suspended || false;
}

export async function suspendUser(userId: string, suspended: boolean): Promise<void> {
  await sql`
    UPDATE user_roles 
    SET is_suspended = ${suspended}, updated_at = NOW()
    WHERE user_id = ${userId}
  `;
}

// Listing queries
export async function createListing(listing: Omit<Listing, 'id' | 'created_at' | 'updated_at' | 'status' | 'rejection_reason'>): Promise<Listing> {
  const id = generateId();
  const result = await sql`
    INSERT INTO listings (
      id, host_id, type, title, description, location, city, region,
      full_address, price_range, contact_phone, contact_email, external_link,
      images, amenities, status, created_at, updated_at
    ) VALUES (
      ${id}, ${listing.host_id}, ${listing.type}, ${listing.title}, ${listing.description},
      ${listing.location}, ${listing.city}, ${listing.region}, ${listing.full_address},
      ${listing.price_range}, ${listing.contact_phone}, ${listing.contact_email},
      ${listing.external_link}, ${listing.images}, ${listing.amenities},
      'pending', NOW(), NOW()
    )
    RETURNING *
  `;
  return result[0] as Listing;
}

export async function updateListing(id: string, updates: Partial<Listing>): Promise<Listing | null> {
  // Get current listing first
  const current = await getListingById(id);
  if (!current) return null;

  // Merge updates with current data
  const updated = { ...current, ...updates, updated_at: new Date() };

  const result = await sql`
    UPDATE listings SET
      type = ${updated.type},
      title = ${updated.title},
      description = ${updated.description},
      location = ${updated.location},
      city = ${updated.city},
      region = ${updated.region},
      full_address = ${updated.full_address},
      price_range = ${updated.price_range},
      contact_phone = ${updated.contact_phone},
      contact_email = ${updated.contact_email},
      external_link = ${updated.external_link},
      images = ${updated.images},
      amenities = ${updated.amenities},
      status = ${updated.status},
      rejection_reason = ${updated.rejection_reason},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  
  return result[0] as Listing | null;
}

export async function deleteListing(id: string): Promise<boolean> {
  const result = await sql`
    DELETE FROM listings WHERE id = ${id}
    RETURNING id
  `;
  return result.length > 0;
}

export async function getListingById(id: string): Promise<Listing | null> {
  const result = await sql`
    SELECT * FROM listings WHERE id = ${id}
  `;
  return (result[0] as Listing) || null;
}

export async function getListingsByHost(hostId: string): Promise<Listing[]> {
  const result = await sql`
    SELECT * FROM listings 
    WHERE host_id = ${hostId}
    ORDER BY created_at DESC
  `;
  return result as Listing[];
}

export async function getApprovedListings(
  type?: ListingType,
  city?: string,
  searchQuery?: string
): Promise<Listing[]> {
  if (type && city && searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved' 
        AND type = ${type} 
        AND city = ${city}
        AND (
          title ILIKE ${searchPattern} OR
          description ILIKE ${searchPattern} OR
          city ILIKE ${searchPattern} OR
          region ILIKE ${searchPattern} OR
          location ILIKE ${searchPattern}
        )
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  } else if (type && city) {
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved' AND type = ${type} AND city = ${city}
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  } else if (type && searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved' 
        AND type = ${type}
        AND (
          title ILIKE ${searchPattern} OR
          description ILIKE ${searchPattern} OR
          city ILIKE ${searchPattern} OR
          region ILIKE ${searchPattern} OR
          location ILIKE ${searchPattern}
        )
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  } else if (city && searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved' 
        AND city = ${city}
        AND (
          title ILIKE ${searchPattern} OR
          description ILIKE ${searchPattern} OR
          city ILIKE ${searchPattern} OR
          region ILIKE ${searchPattern} OR
          location ILIKE ${searchPattern}
        )
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  } else if (type) {
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved' AND type = ${type}
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  } else if (city) {
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved' AND city = ${city}
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  } else if (searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved' 
        AND (
          title ILIKE ${searchPattern} OR
          description ILIKE ${searchPattern} OR
          city ILIKE ${searchPattern} OR
          region ILIKE ${searchPattern} OR
          location ILIKE ${searchPattern}
        )
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  } else {
    const result = await sql`
      SELECT * FROM listings 
      WHERE status = 'approved'
      ORDER BY created_at DESC
    `;
    return result as Listing[];
  }
}

export async function getPendingListings(): Promise<Listing[]> {
  const result = await sql`
    SELECT * FROM listings 
    WHERE status = 'pending'
    ORDER BY created_at ASC
  `;
  return result as Listing[];
}

export async function getAllListings(): Promise<Listing[]> {
  const result = await sql`
    SELECT * FROM listings 
    ORDER BY created_at DESC
  `;
  return result as Listing[];
}

export async function approveListng(id: string, adminId: string): Promise<Listing | null> {
  const result = await sql`
    UPDATE listings 
    SET status = 'approved', rejection_reason = NULL, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  
  if (result[0]) {
    await sql`
      INSERT INTO admin_actions (id, listing_id, admin_id, action, created_at)
      VALUES (${generateId()}, ${id}, ${adminId}, 'approve', NOW())
    `;
  }
  
  return (result[0] as Listing) || null;
}

export async function rejectListing(id: string, adminId: string, reason: string): Promise<Listing | null> {
  const result = await sql`
    UPDATE listings 
    SET status = 'rejected', rejection_reason = ${reason}, updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;
  
  if (result[0]) {
    await sql`
      INSERT INTO admin_actions (id, listing_id, admin_id, action, reason, created_at)
      VALUES (${generateId()}, ${id}, ${adminId}, 'reject', ${reason}, NOW())
    `;
  }
  
  return (result[0] as Listing) || null;
}

// Get all users with their roles
export async function getAllUsers(): Promise<Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date }>> {
  const result = await sql`
    SELECT user_id, role, is_suspended, created_at FROM user_roles
    ORDER BY created_at DESC
  `;
  return result as Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date }>;
}

// Get users by role
export async function getUsersByRole(role: UserRole): Promise<Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date }>> {
  const result = await sql`
    SELECT user_id, role, is_suspended, created_at FROM user_roles
    WHERE role = ${role}
    ORDER BY created_at DESC
  `;
  return result as Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date }>;
}

