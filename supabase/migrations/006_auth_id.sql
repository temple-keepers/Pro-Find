-- ============================================
-- ProFind Guyana — Add auth_id to providers
-- Links Supabase Auth users to provider records
-- Run this in Supabase SQL Editor
-- ============================================

ALTER TABLE providers ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;

-- Index for fast lookup by auth_id
CREATE INDEX IF NOT EXISTS idx_providers_auth_id ON providers(auth_id);
