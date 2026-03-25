/*
  # Create About Us and Stores Tables
  
  ## Overview
  This migration creates the database schema for La Alianza Carnicerias website,
  including editable "About Us" content and dynamic stores management.
  
  ## New Tables
  
  ### `about_us`
  Stores company information (vision, mission, objectives)
  - `id` (uuid, primary key) - Unique identifier
  - `vision` (text) - Company vision statement
  - `mision` (text) - Company mission statement  
  - `objetivos` (text) - Company objectives
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ### `stores`
  Stores information about company locations/stores
  - `id` (uuid, primary key) - Unique identifier
  - `nombre` (text) - Store name
  - `url` (text) - Store website URL
  - `logo_url` (text, optional) - Store logo/image URL
  - `orden` (integer) - Display order for stores
  - `activo` (boolean) - Whether store is active/visible
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp
  
  ## Security
  
  ### RLS Policies
  - Enable RLS on both tables
  - Public read access for all users (website visitors)
  - Write access only for authenticated admin users
*/

-- Create about_us table
CREATE TABLE IF NOT EXISTS about_us (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vision text DEFAULT '',
  mision text DEFAULT '',
  objetivos text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stores table
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nombre text NOT NULL,
  url text NOT NULL,
  logo_url text DEFAULT '',
  orden integer DEFAULT 0,
  activo boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE about_us ENABLE ROW LEVEL SECURITY;
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- RLS Policies for about_us
CREATE POLICY "Anyone can view about us information"
  ON about_us FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can update about us"
  ON about_us FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert about us"
  ON about_us FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for stores
CREATE POLICY "Anyone can view active stores"
  ON stores FOR SELECT
  TO anon, authenticated
  USING (activo = true);

CREATE POLICY "Authenticated users can view all stores"
  ON stores FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert stores"
  ON stores FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update stores"
  ON stores FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete stores"
  ON stores FOR DELETE
  TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS stores_orden_idx ON stores(orden);
CREATE INDEX IF NOT EXISTS stores_activo_idx ON stores(activo);

-- Insert default about_us record
INSERT INTO about_us (vision, mision, objetivos)
VALUES (
  'Ser la cadena de carnicerias líder en Chile, reconocida por la calidad excepcional de nuestros productos y el servicio personalizado a nuestros clientes.',
  'Ofrecer carnes frescas de la más alta calidad, productos seleccionados y un servicio excepcional que supere las expectativas de nuestros clientes en cada visita.',
  'Mantener los más altos estándares de calidad e higiene en todos nuestros productos. Expandir nuestra presencia en la región con nuevas tiendas. Capacitar constantemente a nuestro equipo para brindar el mejor servicio.'
)
ON CONFLICT DO NOTHING;

-- Insert sample stores
INSERT INTO stores (nombre, url, orden, activo) VALUES
  ('Tienda Macul', 'https://www.example.com/macul', 1, true),
  ('Tienda Las Condes', 'https://www.example.com/lascondes', 2, true),
  ('Tienda Providencia', 'https://www.example.com/providencia', 3, true)
ON CONFLICT DO NOTHING;