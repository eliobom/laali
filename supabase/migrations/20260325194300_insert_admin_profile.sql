-- Script to manually create the profile for the admin user
-- Run this in Supabase SQL Editor after creating the user

-- First, check if user exists
SELECT id, email, created_at 
FROM auth.users 
WHERE email = 'rodrigo@laalianza.cl';

-- If user exists, insert the profile manually
INSERT INTO profiles (id, username, role, full_name)
SELECT 
  id, 
  'rodrigo', 
  'admin',
  'Rodrigo'
FROM auth.users 
WHERE email = 'rodrigo@laalianza.cl'
ON CONFLICT (id) DO UPDATE SET
  username = 'rodrigo',
  role = 'admin';
