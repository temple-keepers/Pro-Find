-- ============================================
-- ProFind Guyana — Materials Shop Schema v2
-- Self-service: shop owners register & manage
-- ============================================

-- Drop old tables if they exist from v1 seed
DROP TABLE IF EXISTS materials CASCADE;
DROP TABLE IF EXISTS shops CASCADE;
DROP TABLE IF EXISTS material_categories CASCADE;

-- SHOPS (hardware stores, lumber yards, etc.)
CREATE TABLE IF NOT EXISTS shops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_id UUID UNIQUE,                -- links to Supabase Auth user
  name TEXT NOT NULL,
  phone TEXT,
  whatsapp TEXT,
  email TEXT,
  address TEXT,
  area TEXT,
  description TEXT,
  logo_url TEXT,
  cover_photo_url TEXT,
  hours TEXT,                          -- e.g. "Mon-Sat 7am-5pm"
  delivery_available BOOLEAN DEFAULT FALSE,
  delivery_note TEXT,                  -- e.g. "Free delivery over $50,000"
  is_verified BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- MATERIAL CATEGORIES
CREATE TABLE IF NOT EXISTS material_categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  icon TEXT,
  sort_order INTEGER DEFAULT 0
);

-- MATERIALS (products listed by shops)
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
  sku TEXT,                            -- shop's own product code
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_shops_auth_id ON shops(auth_id);
CREATE INDEX IF NOT EXISTS idx_materials_shop ON materials(shop_id);
CREATE INDEX IF NOT EXISTS idx_materials_category ON materials(category_id);
CREATE INDEX IF NOT EXISTS idx_materials_trade_tags ON materials USING GIN(trade_tags);
CREATE INDEX IF NOT EXISTS idx_materials_price ON materials(price);

-- Trigger to auto-update shop product_count
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

-- ============================================
-- SEED: Material Categories
-- ============================================

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
