-- ============================================
-- ProFind Guyana — Storage Buckets
-- Run this in Supabase SQL Editor
-- ============================================

-- Create storage bucket for provider photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'provider-photos',
  'provider-photos', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for review photos
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'review-photos',
  'review-photos',
  true,
  5242880,
  ARRAY['image/jpeg', 'image/png', 'image/webp']
) ON CONFLICT (id) DO NOTHING;

-- Allow public read access to both buckets
CREATE POLICY "Public read provider photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'provider-photos');

CREATE POLICY "Public read review photos" ON storage.objects
  FOR SELECT USING (bucket_id = 'review-photos');

-- Allow anonymous uploads (our API handles auth)
CREATE POLICY "Allow uploads to provider photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'provider-photos');

CREATE POLICY "Allow uploads to review photos" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'review-photos');

-- Allow updates (overwrite existing photos)
CREATE POLICY "Allow update provider photos" ON storage.objects
  FOR UPDATE USING (bucket_id = 'provider-photos');

-- Allow deletes
CREATE POLICY "Allow delete provider photos" ON storage.objects
  FOR DELETE USING (bucket_id = 'provider-photos');
