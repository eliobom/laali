-- Create site_settings table for configurable content
-- This allows admin to manage various website content

-- Drop existing if needed
DROP TABLE IF EXISTS site_settings CASCADE;

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  value text DEFAULT '',
  label text NOT NULL,
  type text DEFAULT 'text' CHECK (type IN ('text', 'textarea', 'image', 'boolean', 'number')),
  category text DEFAULT 'general' CHECK (category IN ('general', 'contact', 'social', 'seo', 'hero', 'delivery')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Anyone can view settings (for public website)
CREATE POLICY "Public can view site settings"
  ON site_settings FOR SELECT
  TO anon, authenticated
  USING (true);

-- Only authenticated can update
CREATE POLICY "Authenticated can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can insert site settings"
  ON site_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete site settings"
  ON site_settings FOR DELETE
  TO authenticated
  USING (true);

-- Insert default settings
INSERT INTO site_settings (key, value, label, type, category) VALUES
-- Hero section
('hero_title', 'LA ALIANZA', 'Título Principal', 'text', 'hero'),
('hero_subtitle', 'CARNICERÍAS', 'Subtítulo', 'text', 'hero'),
('hero_description', 'Carnes frescas de la más alta calidad para tu hogar', 'Descripción', 'textarea', 'hero'),

-- Contact info
('contact_phone', '+56 9 1234 5678', 'Teléfono', 'text', 'contact'),
('contact_email', 'contacto@laalianza.cl', 'Correo', 'text', 'contact'),
('contact_address', 'Santiago, Chile', 'Dirección', 'text', 'contact'),
('contact_whatsapp', '+56 9 1234 5678', 'WhatsApp', 'text', 'contact'),

-- Delivery info
('delivery_enabled', 'true', 'Habilitar Delivery', 'boolean', 'delivery'),
('delivery_schedule', 'Lunes a Viernes 10:00 a 17:00 - Sábados 10:00 a 15:00', 'Horario Delivery', 'text', 'delivery'),
('delivery_min_purchase', '15000', 'Monto Mínimo ($)', 'number', 'delivery'),

-- Social media
('social_facebook', 'https://facebook.com/laalianza', 'Facebook', 'text', 'social'),
('social_instagram', 'https://instagram.com/laalianza', 'Instagram', 'text', 'social'),
('social_twitter', '', 'Twitter', 'text', 'social'),

-- SEO
('seo_title', 'La Alianza Carnicerías - Carnes Frescas en Chile', 'Título SEO', 'text', 'seo'),
('seo_description', 'Las mejores carnes frescas en Santiago. Envío a domicilio disponible.', 'Descripción SEO', 'textarea', 'seo'),
('seo_keywords', 'carnes, carnicería,antiago,delivery', 'Palabras Clave', 'text', 'seo')
ON CONFLICT (key) DO NOTHING;

-- Grant permissions
GRANT ALL ON site_settings TO authenticated;
GRANT ALL ON site_settings TO anon;
