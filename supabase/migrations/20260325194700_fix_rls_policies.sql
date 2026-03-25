-- Fix RLS policies to allow authenticated users to update site_settings
-- Run this in Supabase SQL Editor

-- Drop existing policies
DROP POLICY IF EXISTS "Public can view site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated can insert site settings" ON site_settings;
DROP POLICY IF EXISTS "Authenticated can delete site settings" ON site_settings;

-- Create more permissive policies for development
CREATE POLICY "Anyone can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can update site settings"
  ON site_settings FOR UPDATE
  TO anon, authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Anyone can insert site settings"
  ON site_settings FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Grant permissions
GRANT ALL ON site_settings TO anon, authenticated, service_role;
