-- Performance Indexes Migration
-- This script adds indexes to improve query performance for the Visit Iraq application
-- Run this script against your database to optimize common query patterns

-- Index for status + type queries (most common filter combination)
CREATE INDEX IF NOT EXISTS idx_listings_status_type ON listings(status, type);

-- Index for status + city queries
CREATE INDEX IF NOT EXISTS idx_listings_status_city ON listings(status, city);

-- Index for status + created_at (for ORDER BY created_at DESC)
CREATE INDEX IF NOT EXISTS idx_listings_status_created ON listings(status, created_at DESC);

-- Composite index for common filter combinations (status + type + city)
CREATE INDEX IF NOT EXISTS idx_listings_status_type_city ON listings(status, type, city);

-- Index for host_id queries (used when fetching listings by host)
CREATE INDEX IF NOT EXISTS idx_listings_host_id ON listings(host_id);

-- Index for user_roles lookups (used frequently in authentication)
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);

-- Index for user_roles role lookups (used in admin panel)
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles(role);

-- Index for neon_auth.users_sync lookups (if table exists)
-- Note: This may fail if the table doesn't exist, which is fine
DO $$
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_schema = 'neon_auth' AND table_name = 'users_sync') THEN
        CREATE INDEX IF NOT EXISTS idx_users_sync_id ON neon_auth.users_sync(id) WHERE deleted_at IS NULL;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        -- Silently ignore if table doesn't exist
        NULL;
END $$;

