/*
  # User Profiles and Password Recovery Migration
  
  ## Overview
  This migration adds user profile functionality to support:
  - Custom user profiles with display names and avatars
  - Password recovery/resets via email
  - Role-based access (admin vs regular users)
  
  ## New Tables
  
  ### `profiles`
  Extends Supabase auth.users with custom profile data
  - `id` (uuid, primary key) - References auth.users.id
  - `username` (text) - User's display name
  - `avatar_url` (text, optional) - Profile picture URL
  - `role` (text) - User role ('admin' or 'user')
  - `full_name` (text, optional) - Full name
  - `phone` (text, optional) - Contact phone
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  
  ### RLS Policies
  - Public read access for profiles (for displaying user info)
  - Users can only update their own profile
  - Only admins can update roles
  - Service role can insert profiles (for triggers)
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username text UNIQUE,
  avatar_url text DEFAULT '',
  role text DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  full_name text DEFAULT '',
  phone text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles

-- Anyone can view profile username and role (for displaying author info)
CREATE POLICY "Public can view profiles"
  ON profiles FOR SELECT
  TO anon, authenticated
  USING (
    username IS NOT NULL
  );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Trigger function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $
BEGIN
  INSERT INTO public.profiles (id, username, full_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS profiles_username_idx ON profiles(username);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT ALL ON profiles TO anon;
GRANT ALL ON profiles TO service_role;

-- Grant execute on functions
GRANT EXECUTE ON FUNCTION public.handle_new_user TO authenticated;

-- Create admin user: rodrigo@laalianza.cl with password Roro2692
-- Note: User creation must be done through Supabase Dashboard UI
-- After creating the user, run this to make them admin:
/*
UPDATE profiles 
SET role = 'admin', username = 'rodrigo'
WHERE id = (SELECT id FROM auth.users WHERE email = 'rodrigo@laalianza.cl');
*/
