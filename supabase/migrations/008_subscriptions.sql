-- ============================================
-- ProFind Guyana — Subscription & Monetization
-- ============================================

-- SUBSCRIPTION PLANS (reference table)
CREATE TABLE IF NOT EXISTS plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  user_type TEXT NOT NULL,          -- 'provider' or 'shop'
  price_monthly INTEGER NOT NULL,   -- GYD per month
  price_yearly INTEGER,             -- GYD per year (discount)
  features JSONB DEFAULT '{}',
  sort_order INTEGER DEFAULT 0
);

-- SUBSCRIPTIONS (active subscriptions for providers/shops)
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_type TEXT NOT NULL,          -- 'provider' or 'shop'
  user_id UUID NOT NULL,            -- references providers.id or shops.id
  plan_id TEXT REFERENCES plans(id),
  status TEXT DEFAULT 'active',     -- active, cancelled, expired, trial
  trial_ends_at TIMESTAMPTZ,
  current_period_start TIMESTAMPTZ DEFAULT NOW(),
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_type, user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- QUOTE REQUESTS (lead generation — customers request quotes)
CREATE TABLE IF NOT EXISTS quote_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_area TEXT,
  trade TEXT NOT NULL,
  job_description TEXT NOT NULL,
  budget_range TEXT,                -- 'under_50k', '50k_100k', '100k_250k', '250k_500k', '500k_plus'
  urgency TEXT DEFAULT 'flexible', -- 'urgent', 'this_week', 'this_month', 'flexible'
  photos TEXT[] DEFAULT '{}',
  status TEXT DEFAULT 'open',       -- open, claimed, closed
  claimed_by UUID,                  -- provider who claimed it
  claimed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_quote_requests_trade ON quote_requests(trade);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);

-- Add subscription fields to providers
ALTER TABLE providers ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE providers ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS profile_views INTEGER DEFAULT 0;
ALTER TABLE providers ADD COLUMN IF NOT EXISTS whatsapp_taps INTEGER DEFAULT 0;

-- Add subscription fields to shops
ALTER TABLE shops ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE shops ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE shops ADD COLUMN IF NOT EXISTS featured_until TIMESTAMPTZ;

-- ============================================
-- SEED: Plans
-- ============================================

INSERT INTO plans (id, name, user_type, price_monthly, price_yearly, features, sort_order) VALUES
  -- Provider plans
  ('provider_free', 'Free', 'provider', 0, 0,
    '{"maxPhotos": 2, "quoteToolAccess": false, "jobTracker": false, "analytics": false, "featured": false, "proBadge": false, "respondReviews": false}'::jsonb, 1),
  ('provider_pro', 'Pro', 'provider', 5000, 48000,
    '{"maxPhotos": 8, "quoteToolAccess": true, "jobTracker": true, "analytics": true, "featured": false, "proBadge": true, "respondReviews": true}'::jsonb, 2),
  ('provider_boost', 'Pro + Boost', 'provider', 10000, 96000,
    '{"maxPhotos": 8, "quoteToolAccess": true, "jobTracker": true, "analytics": true, "featured": true, "proBadge": true, "respondReviews": true}'::jsonb, 3),

  -- Shop plans
  ('shop_free', 'Free', 'shop', 0, 0,
    '{"maxProducts": 10, "analytics": false, "featured": false, "proBadge": false}'::jsonb, 1),
  ('shop_pro', 'Pro', 'shop', 5000, 48000,
    '{"maxProducts": -1, "analytics": true, "featured": false, "proBadge": true}'::jsonb, 2),
  ('shop_boost', 'Pro + Boost', 'shop', 10000, 96000,
    '{"maxProducts": -1, "analytics": true, "featured": true, "proBadge": true}'::jsonb, 3)
ON CONFLICT (id) DO NOTHING;
