-- ============================================
-- ProFind Guyana — UNIFIED SYSTEM
-- Run this in Supabase SQL Editor
-- Creates: users, shops, materials, categories,
--          plans, subscriptions, quote_requests
-- Updates: providers with user_id
-- ============================================

-- ========== 1. USERS TABLE ==========

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

-- ========== 2. LINK PROVIDERS TO USERS ==========

ALTER TABLE providers ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id);
ALTER TABLE providers ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS whatsapp_taps INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_providers_user_id ON providers(user_id);
CREATE INDEX IF NOT EXISTS idx_providers_auth_id ON providers(auth_id);

-- ========== 3. SHOPS ==========

DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS material_categories CASCADE;

CREATE TABLE shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
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

CREATE INDEX IF NOT EXISTS idx_shops_user_id ON shops(user_id);

-- ========== 4. MATERIAL CATEGORIES ==========

CREATE TABLE material_categories (
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

-- ========== 5. MATERIALS ==========

CREATE TABLE materials (
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

-- Auto-update product count
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

-- ========== 6. PLANS ==========

CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL,
  price_monthly INTEGER NOT NULL,
  price_yearly INTEGER,
  features JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0
);

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

-- ========== 7. SUBSCRIPTIONS ==========

CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  plan_id TEXT REFERENCES plans(id),
  status TEXT DEFAULT 'active',
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

-- ========== 8. QUOTE REQUESTS ==========

CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  customer_area TEXT,
  customer_user_id UUID REFERENCES users(id),
  trade TEXT NOT NULL,
  job_description TEXT NOT NULL,
  budget_range TEXT,
  urgency TEXT DEFAULT 'flexible',
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open',
  claimed_by UUID REFERENCES users(id),
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_trade ON quote_requests(trade);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);

-- ========== DONE ==========
-- Run 009_unified_users.sql in Supabase SQL Editor
-- Then disable email confirmation: Auth > Providers > Email > uncheck "Confirm email"
