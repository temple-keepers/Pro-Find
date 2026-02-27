-- ============================================
-- ProFind Guyana — Database Schema
-- Run this in your Supabase SQL Editor
-- ============================================

-- TRADES (reference table)
CREATE TABLE IF NOT EXISTS trades (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  local_name TEXT,
  icon TEXT,
  description TEXT,
  common_problems TEXT[],
  sort_order INTEGER DEFAULT 0
);

-- AREAS (reference table)
CREATE TABLE IF NOT EXISTS areas (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  region TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- PROVIDERS
CREATE TABLE IF NOT EXISTS providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_verified BOOLEAN DEFAULT FALSE,
  trades TEXT[] NOT NULL,
  areas TEXT[] NOT NULL,
  description TEXT,
  photo_url TEXT,
  work_photos TEXT[] DEFAULT '{}',
  is_claimed BOOLEAN DEFAULT FALSE,
  is_verified BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  available_now BOOLEAN DEFAULT FALSE,
  available_now_updated_at TIMESTAMPTZ,
  bit_certified BOOLEAN DEFAULT FALSE,
  bit_certificate_url TEXT,
  bit_trade TEXT,
  avg_rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  response_time TEXT,
  price_range_low INTEGER,
  price_range_high INTEGER,
  years_experience INTEGER,
  services_offered TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  claimed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  source TEXT DEFAULT 'seed',
  source_detail TEXT
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  reviewer_name TEXT NOT NULL,
  reviewer_area TEXT,
  reviewer_phone_hash TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  review_text TEXT,
  photos TEXT[] DEFAULT '{}',
  price_paid INTEGER,
  job_description TEXT,
  provider_response TEXT,
  would_recommend BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  verified BOOLEAN DEFAULT FALSE
);

-- SUGGESTIONS (crowdsourced provider additions)
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_name TEXT NOT NULL,
  trade TEXT NOT NULL,
  area TEXT NOT NULL,
  phone TEXT,
  description TEXT,
  suggested_by_name TEXT,
  suggested_by_area TEXT,
  suggested_by_phone_hash TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  notes TEXT
);

-- CONTACTS LOG (WhatsApp taps — north star metric)
CREATE TABLE IF NOT EXISTS contact_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id),
  contact_type TEXT DEFAULT 'whatsapp',
  source_page TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- QUOTES (provider-generated, shareable via WhatsApp)
CREATE TABLE IF NOT EXISTS quotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  customer_name TEXT,
  customer_phone TEXT,
  job_description TEXT NOT NULL,
  materials_items JSONB DEFAULT '[]',
  materials_total INTEGER DEFAULT 0,
  labour_cost INTEGER DEFAULT 0,
  total_cost INTEGER DEFAULT 0,
  notes TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','sent','accepted','declined')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  sent_at TIMESTAMPTZ
);

-- JOB TRACKER (milestone log for both parties)
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_id UUID REFERENCES providers(id) ON DELETE CASCADE,
  quote_id UUID REFERENCES quotes(id),
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  job_description TEXT NOT NULL,
  total_agreed INTEGER,
  status TEXT DEFAULT 'deposit_paid' CHECK (status IN (
    'deposit_paid','materials_purchased','work_started',
    'half_complete','final_inspection','complete','disputed'
  )),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- JOB MILESTONES (timestamped updates with photos)
CREATE TABLE IF NOT EXISTS job_milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES jobs(id) ON DELETE CASCADE,
  milestone TEXT NOT NULL,
  note TEXT,
  photos TEXT[] DEFAULT '{}',
  logged_by TEXT DEFAULT 'provider',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- SEARCH LOGS (track what people search for — feeds demand signals)
CREATE TABLE IF NOT EXISTS search_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  query TEXT,
  trade TEXT,
  area TEXT,
  results_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_providers_trades ON providers USING GIN (trades);
CREATE INDEX IF NOT EXISTS idx_providers_areas ON providers USING GIN (areas);
CREATE INDEX IF NOT EXISTS idx_providers_rating ON providers (avg_rating DESC);
CREATE INDEX IF NOT EXISTS idx_providers_available ON providers (available_now) WHERE available_now = TRUE;
CREATE INDEX IF NOT EXISTS idx_reviews_provider ON reviews (provider_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created ON reviews (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_events_provider ON contact_events (provider_id);
CREATE INDEX IF NOT EXISTS idx_contact_events_created ON contact_events (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotes_provider ON quotes (provider_id);
CREATE INDEX IF NOT EXISTS idx_jobs_provider ON jobs (provider_id);
CREATE INDEX IF NOT EXISTS idx_search_logs_created ON search_logs (created_at DESC);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE search_logs ENABLE ROW LEVEL SECURITY;

-- Public read access
CREATE POLICY "Providers viewable by everyone" ON providers FOR SELECT USING (true);
CREATE POLICY "Reviews viewable by everyone" ON reviews FOR SELECT USING (true);

-- Public insert access (no auth required for MVP)
CREATE POLICY "Anyone can submit a review" ON reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can submit a suggestion" ON suggestions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can log a contact" ON contact_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can log a search" ON search_logs FOR INSERT WITH CHECK (true);

-- Quotes and jobs — public for MVP, will restrict later
CREATE POLICY "Quotes viewable by everyone" ON quotes FOR SELECT USING (true);
CREATE POLICY "Anyone can create a quote" ON quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Jobs viewable by everyone" ON jobs FOR SELECT USING (true);
CREATE POLICY "Anyone can create a job" ON jobs FOR INSERT WITH CHECK (true);
CREATE POLICY "Milestones viewable by everyone" ON job_milestones FOR SELECT USING (true);
CREATE POLICY "Anyone can add milestone" ON job_milestones FOR INSERT WITH CHECK (true);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Auto-update provider rating when a review is added
CREATE OR REPLACE FUNCTION update_provider_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE providers
  SET 
    avg_rating = (
      SELECT ROUND(AVG(rating)::numeric, 1)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    ),
    review_count = (
      SELECT COUNT(*)
      FROM reviews
      WHERE provider_id = NEW.provider_id
    ),
    updated_at = NOW()
  WHERE id = NEW.provider_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger: recalculate rating after review insert
DROP TRIGGER IF EXISTS trigger_update_rating ON reviews;
CREATE TRIGGER trigger_update_rating
  AFTER INSERT ON reviews
  FOR EACH ROW
  EXECUTE FUNCTION update_provider_rating();

-- Auto-update updated_at on providers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_providers_updated ON providers;
CREATE TRIGGER trigger_providers_updated
  BEFORE UPDATE ON providers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();
