-- ============================================
-- ProFind Guyana — COMPLETE MIGRATION
-- Run this in Supabase SQL Editor (one time)
-- Covers: auth, shops, materials, subscriptions,
--         unified users, quote requests
-- ============================================

-- 1. Add auth_id to providers (backward compat)
ALTER TABLE providers ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;
CREATE INDEX IF NOT EXISTS idx_providers_auth_id ON providers(auth_id);

-- 2. Shops table
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS material_categories CASCADE;

CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE,
  user_id UUID,
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  area TEXT,
  description TEXT,
  logo_url TEXT,
  cover_photo_url TEXT,
  hours TEXT,
  delivery_available BOOLEAN DEFAULT FALSE,
  delivery_note TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  plan TEXT DEFAULT 'free',
  is_featured BOOLEAN DEFAULT FALSE,
  featured_until TIMESTAMPTZ,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shops_auth_id ON shops(auth_id);

-- 3. Material categories
CREATE TABLE IF NOT EXISTS material_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

INSERT INTO material_categories (id, name, icon, sort_order) VALUES
  ('pipes-fittings', 'Pipes & Fittings', '🔧', 1),
  ('electrical', 'Electrical', '⚡', 2),
  ('lumber', 'Lumber & Wood', '🪵', 3),
  ('cement-concrete', 'Cement & Concrete', '🧱', 4),
  ('paint', 'Paint & Finishes', '🎨', 5),
  ('roofing', 'Roofing & Gutters', '🏠', 6),
  ('fasteners', 'Fasteners & Hardware', '🔩', 7),
  ('plumbing', 'Plumbing Fixtures', '🚿', 8),
  ('ac-cooling', 'AC & Cooling', '❄️', 9),
  ('welding', 'Welding Supplies', '🔥', 10),
  ('tools', 'Tools & Equipment', '🛠️', 11),
  ('safety', 'Safety Gear', '🦺', 12)
ON CONFLICT (id) DO NOTHING;

-- 4. Materials (products)
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  shop_id UUID REFERENCES shops(id) ON DELETE CASCADE,
  category_id TEXT REFERENCES material_categories(id),
  name TEXT NOT NULL,
  description TEXT,
  brand TEXT,
  unit TEXT NOT NULL DEFAULT 'each',
  price INTEGER NOT NULL,
  price_was INTEGER,
  in_stock BOOLEAN DEFAULT TRUE,
  photo_url TEXT,
  trade_tags TEXT[] DEFAULT '{}',
  is_popular BOOLEAN DEFAULT FALSE,
  sku TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_materials_shop ON materials(shop_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_trade_tags ON materials USING GIN(trade_tags);
CREATE INDEX IF NOT EXISTS idx_materials_price ON materials(price);

-- Product count trigger
CREATE OR REPLACE FUNCTION update_shop_product_count() RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE shops SET product_count = product_count + 1, updated_at = NOW() WHERE id = NEW.shop_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE shops SET product_count = product_count - 1, updated_at = NOW() WHERE id = OLD.shop_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_material_count ON materials;
CREATE TRIGGER trg_material_count
  AFTER INSERT OR DELETE ON materials
  FOR EACH ROW EXECUTE FUNCTION update_shop_product_count();

-- 5. UNIFIED USERS TABLE
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE NOT NULL,
  email TEXT NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  area TEXT,
  avatar_url TEXT,
  roles TEXT[] DEFAULT '{customer}',
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);

-- Link providers and shops to users table
ALTER TABLE providers ADD COLUMN IF NOT EXISTS user_id UUID;
CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);

ALTER TABLE shops ADD COLUMN IF NOT EXISTS user_id UUID;
CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);

-- 6. Subscriptions
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER,
  features JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT NOT NULL,
  user_id UUID NOT NULL,
  plan_id TEXT REFERENCES plans(id),
  status TEXT DEFAULT 'active',
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_type, user_id);

-- 7. Quote requests (lead generation)
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_area TEXT,
  trade TEXT NOT NULL,
  job_description TEXT NOT NULL,
  budget_range TEXT,
  urgency TEXT DEFAULT 'flexible',
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open',
  claimed_by UUID,
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_trade ON quote_requests(trade);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);

-- 8. Monetization columns on providers
ALTER TABLE providers ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS whatsapp_taps INTEGER DEFAULT 0;

-- 9. Seed plans
INSERT INTO plans (id, name, user_type, price_monthly, price_yearly, features, sort_order) VALUES
  ('provider_free', 'Free', 'provider', 0, 0,
    '{"maxPhotos": 2, "quoteToolAccess": false, "jobTracker": false, "analytics": false, "featured": false, "proBadge": false, "respondReviews": false}'::jsonb, 1),
  ('provider_pro', 'Pro', 'provider', 5000, 48000,
    '{"maxPhotos": 8, "quoteToolAccess": true, "jobTracker": true, "analytics": true, "featured": false, "proBadge": true, "respondReviews": true}'::jsonb, 2),
  ('provider_boost', 'Pro + Boost', 'provider', 10000, 96000,
    '{"maxPhotos": 8, "quoteToolAccess": true, "jobTracker": true, "analytics": true, "featured": true, "proBadge": true, "respondReviews": true}'::jsonb, 3),
  ('shop_free', 'Free', 'shop', 0, 0,
    '{"maxProducts": 10, "analytics": false, "featured": false, "proBadge": false}'::jsonb, 1),
  ('shop_pro', 'Pro', 'shop', 5000, 48000,
    '{"maxProducts": -1, "analytics": true, "featured": false, "proBadge": true}'::jsonb, 2),
  ('shop_boost', 'Pro + Boost', 'shop', 10000, 96000,
    '{"maxProducts": -1, "analytics": true, "featured": true, "proBadge": true}'::jsonb, 3)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- DONE! Now go to:
-- 1. Auth → Providers → Email → disable "Confirm email"
-- 2. Auth → Users → delete any orphan test users
-- 3. Test signup at /signup
-- ============================================
