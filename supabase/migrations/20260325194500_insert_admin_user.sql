-- Insert admin user directly into usuarios table
-- Run this in Supabase SQL Editor

INSERT INTO usuarios (username, password_hash, email, role, full_name)
VALUES (
  'rodrigo',
  'Roro2692',
  'rodrigo@laalianza.cl',
  'admin',
  'Rodrigo'
)
ON CONFLICT (username) DO UPDATE SET
  role = 'admin',
  email = 'rodrigo@laalianza.cl';
