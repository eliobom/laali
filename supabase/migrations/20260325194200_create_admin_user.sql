/*
  # Create Admin User
  
  This migration creates an admin user for La Alianza Carnicerías.
  The user's email is: rodrigo@laalianza.cl
  Password: Roro2692
  
  Note: The actual user will be created using Supabase Auth.
  This SQL sets up the profile after user creation.
*/

-- First, update the profile for the user with email rodrigo@laalianza.cl
-- This will be executed after the user is created in Supabase Auth
-- Uncomment and run after creating the user in Supabase Dashboard

-- UPDATE profiles 
-- SET role = 'admin', username = 'rodrigo'
-- WHERE id = (SELECT id FROM auth.users WHERE email = 'rodrigo@laalianza.cl');

-- Alternatively, create the user directly (requires service_role key)
-- This should be run in Supabase Dashboard with service_role
