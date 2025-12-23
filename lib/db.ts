import { neon } from '@neondatabase/serverless';

// Create a SQL query function using Neon serverless driver
export const sql = neon(process.env.DATABASE_URL!);

// Helper function to generate UUIDs
export function generateId(): string {
  return crypto.randomUUID();
}

// Types for database models
export type UserRole = 'admin' | 'host' | 'user';

export type ListingStatus = 'pending' | 'approved' | 'rejected' | 'delisted';

export type ListingType = 
  | 'accommodation' 
  | 'attraction' 
  | 'tour'
  | 'party'
  | 'festival'
  | 'restaurant'
  | 'event'
  | 'live_music'
  | 'art_culture'
  | 'sport'
  | 'shopping'
  | 'nightlife'
  | 'beach'
  | 'mountain'
  | 'nature';

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
  videos: string[];
  thumbnail: string | null;
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

export async function setUserRole(
  userId: string, 
  role: UserRole, 
  email?: string | null, 
  displayName?: string | null
): Promise<void> {
  await sql`
    INSERT INTO user_roles (user_id, role, email, display_name, created_at, updated_at)
    VALUES (${userId}, ${role}, ${email || null}, ${displayName || null}, NOW(), NOW())
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = ${role}, 
      email = COALESCE(${email || null}, user_roles.email),
      display_name = COALESCE(${displayName || null}, user_roles.display_name),
      updated_at = NOW()
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
  // Auto-set first image as thumbnail if no thumbnail is provided and images exist
  const thumbnail = listing.thumbnail || (listing.images && listing.images.length > 0 ? listing.images[0] : null);
  const result = await sql`
    INSERT INTO listings (
      id, host_id, type, title, description, location, city, region,
      full_address, price_range, contact_phone, contact_email, external_link,
      images, videos, thumbnail, amenities, status, created_at, updated_at
    ) VALUES (
      ${id}, ${listing.host_id}, ${listing.type}, ${listing.title}, ${listing.description},
      ${listing.location}, ${listing.city}, ${listing.region}, ${listing.full_address},
      ${listing.price_range}, ${listing.contact_phone}, ${listing.contact_email},
      ${listing.external_link}, ${listing.images}, ${listing.videos || []}, ${thumbnail}, ${listing.amenities},
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

  // Auto-set first image as thumbnail if no thumbnail is provided and images exist
  const images = updates.images !== undefined ? updates.images : current.images;
  const thumbnail = updates.thumbnail !== undefined 
    ? updates.thumbnail 
    : (current.thumbnail || (images && images.length > 0 ? images[0] : null));

  // Merge updates with current data
  const updated = { ...current, ...updates, thumbnail, updated_at: new Date() };

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
      videos = ${updated.videos || []},
      thumbnail = ${thumbnail},
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
  // Build query conditions dynamically
  const conditions: any[] = [sql`status = 'approved'`];
  
  if (type) {
    conditions.push(sql`type = ${type}`);
  }
  
  if (city) {
    conditions.push(sql`city = ${city}`);
  }
  
  if (searchQuery) {
    const searchPattern = `%${searchQuery}%`;
    conditions.push(sql`(
      title ILIKE ${searchPattern} OR
      description ILIKE ${searchPattern} OR
      city ILIKE ${searchPattern} OR
      region ILIKE ${searchPattern} OR
      location ILIKE ${searchPattern}
    )`);
  }
  
  // Combine all conditions with AND
  const whereClause = conditions.reduce((acc, condition, index) => {
    if (index === 0) return condition;
    return sql`${acc} AND ${condition}`;
  });
  
  // Execute single query with LIMIT to prevent loading too many records
  const result = await sql`
    SELECT * FROM listings 
    WHERE ${whereClause}
    ORDER BY created_at DESC
    LIMIT 100
  `;
  
  return result as Listing[];
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
export async function getAllUsers(): Promise<Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date; email: string | null; display_name: string | null }>> {
  try {
    // Try to JOIN with sync table first for better performance
    const result = await sql`
      SELECT 
        ur.user_id,
        ur.role,
        ur.is_suspended,
        ur.created_at,
        COALESCE(
          us.raw_json->>'primaryEmail',
          us.raw_json->>'primary_email',
          us.email,
          ur.email,
          'No email'
        ) as email,
        COALESCE(
          us.raw_json->>'displayName',
          us.raw_json->>'display_name',
          us.name,
          ur.display_name
        ) as display_name
      FROM user_roles ur
      LEFT JOIN neon_auth.users_sync us ON ur.user_id = us.id AND us.deleted_at IS NULL
      ORDER BY ur.created_at DESC
    `;
    return result as Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date; email: string | null; display_name: string | null }>;
  } catch (error) {
    // Fallback if sync table doesn't exist or JOIN fails
    console.error("Error in getAllUsers with JOIN, falling back:", error);
    const result = await sql`
      SELECT user_id, role, is_suspended, created_at, email, display_name FROM user_roles
      ORDER BY created_at DESC
    `;
    return result as Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date; email: string | null; display_name: string | null }>;
  }
}

// Helper function to get user details from Stack Auth
// First tries the sync table, then falls back to user_roles table, then Stack Auth API
export async function getUserDetailsFromStack(userId: string): Promise<{ email: string; displayName: string | null } | null> {
  try {
    // First, try neon_auth.users_sync table (Stack Auth sync table)
    const result = await sql`
      SELECT 
        email,
        name,
        raw_json
      FROM neon_auth.users_sync
      WHERE id = ${userId}
        AND deleted_at IS NULL
      LIMIT 1
    `;
    
    if (result && Array.isArray(result) && result.length > 0) {
      const user = result[0] as { 
        email: string | null; 
        name: string | null;
        raw_json: any;
      };
      
      // Extract from raw_json if available (contains primaryEmail, displayName)
      const primaryEmail = user.raw_json?.primaryEmail || user.raw_json?.primary_email;
      const displayName = user.raw_json?.displayName || user.raw_json?.display_name;
      
      return {
        email: primaryEmail || user.email || "No email",
        displayName: displayName || user.name || null,
      };
    }
  } catch (error) {
    // Table might not exist or have different structure - continue to fallback
    console.error(`Error fetching user details from sync table for ${userId}:`, error);
  }
  
  // Fallback: Try user_roles table which might have email and display_name
  try {
    const roleResult = await sql`
      SELECT email, display_name
      FROM user_roles
      WHERE user_id = ${userId}
      LIMIT 1
    `;
    
    if (roleResult && Array.isArray(roleResult) && roleResult.length > 0) {
      const user = roleResult[0] as { 
        email: string | null; 
        display_name: string | null;
      };
      
      if (user.email) {
        return {
          email: user.email,
          displayName: user.display_name || null,
        };
      }
    }
  } catch (error) {
    console.error(`Error fetching user details from user_roles table for ${userId}:`, error);
  }
  
  // Final fallback: Use Stack Auth API to fetch user details
  try {
    const { stackServerApp } = await import('@/stack');
    
    // Stack Auth doesn't have getUserById in server SDK, so we'll use the REST API
    // For now, return null and let the calling code handle it
    // The sync table should populate eventually, or we can enhance this later
  } catch (error) {
    console.error(`Error in Stack Auth API fallback for ${userId}:`, error);
  }
  
  return null;
}

// Get users by role
export async function getUsersByRole(role: UserRole): Promise<Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date; email: string | null; display_name: string | null }>> {
  try {
    // Try to JOIN with sync table first for better performance
    const result = await sql`
      SELECT 
        ur.user_id,
        ur.role,
        ur.is_suspended,
        ur.created_at,
        COALESCE(
          us.raw_json->>'primaryEmail',
          us.raw_json->>'primary_email',
          us.email,
          ur.email,
          'No email'
        ) as email,
        COALESCE(
          us.raw_json->>'displayName',
          us.raw_json->>'display_name',
          us.name,
          ur.display_name
        ) as display_name
      FROM user_roles ur
      LEFT JOIN neon_auth.users_sync us ON ur.user_id = us.id AND us.deleted_at IS NULL
      WHERE ur.role = ${role}
      ORDER BY ur.created_at DESC
    `;
    return result as Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date; email: string | null; display_name: string | null }>;
  } catch (error) {
    // Fallback if sync table doesn't exist or JOIN fails
    console.error("Error in getUsersByRole with JOIN, falling back:", error);
    const result = await sql`
      SELECT user_id, role, is_suspended, created_at, email, display_name FROM user_roles
      WHERE role = ${role}
      ORDER BY created_at DESC
    `;
    return result as Array<{ user_id: string; role: UserRole; is_suspended: boolean; created_at: Date; email: string | null; display_name: string | null }>;
  }
}

