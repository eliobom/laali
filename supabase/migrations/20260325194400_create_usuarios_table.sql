-- Create usuarios (users) table with simpler structure
-- This table stores user profiles directly without relying on auth.users

-- Drop existing tables if they exist (be careful!)
DROP TABLE IF EXISTS profiles CASCADE;

-- Create usuarios table
CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  password_hash text NOT NULL,
  email text NOT NULL UNIQUE,
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name text DEFAULT '',
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Anyone can view usuarios (for login check - we check username exists)
CREATE POLICY "Public can view usuarios"
  ON usuarios FOR SELECT
  TO anon, authenticated
  USING (true);

-- Users can update their own profile
CREATE POLICY "Users can update own usuario"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Create index
CREATE INDEX IF NOT EXISTS usuarios_username_idx ON usuarios(username);

-- Grant permissions
GRANT ALL ON usuarios TO authenticated;
GRANT ALL ON usuarios TO anon;
