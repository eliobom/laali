-- Add new fields to about_us table for enhanced "Acerca de Nosotros" section
-- This allows more flexible content management with image positioning and call-to-action

-- Add new columns to about_us table
ALTER TABLE about_us 
ADD COLUMN IF NOT EXISTS titulo text DEFAULT '',
ADD COLUMN IF NOT EXISTS contenido text DEFAULT '',
ADD COLUMN IF NOT EXISTS imagen_url text DEFAULT '',
ADD COLUMN IF NOT EXISTS posicion_imagen text DEFAULT 'right' CHECK (posicion_imagen IN ('left', 'right', 'top', 'bottom')),
ADD COLUMN IF NOT EXISTS boton_texto text DEFAULT '',
ADD COLUMN IF NOT EXISTS boton_enlace text DEFAULT '';

-- Update existing record with default values
UPDATE about_us SET 
  titulo = 'Acerca de Nosotros',
  contenido = 'Conoce más sobre La Alianza Carnicerías, tu destino número uno para las mejores carnes frescas en Santiago.',
  posicion_imagen = 'right',
  boton_texto = 'Ver más',
  boton_enlace = '#'
WHERE titulo = '';

-- Add CEO information to site_settings
INSERT INTO site_settings (key, value, label, type, category) VALUES
('ceo_nombre', 'Juan Pérez', 'Nombre del CEO', 'text', 'general'),
('ceo_descripcion', 'Fundador y Director General de La Alianza Carnicerías con más de 20 años de experiencia en el sector cárnico.', 'Descripción del CEO', 'textarea', 'general'),
('ceo_imagen', '', 'Foto del CEO', 'image', 'general')
ON CONFLICT (key) DO NOTHING;

-- Add additional social media options
INSERT INTO site_settings (key, value, label, type, category) VALUES
('social_youtube', '', 'YouTube', 'text', 'social'),
('social_tiktok', '', 'TikTok', 'text', 'social'),
('social_whatsapp', '+56 9 1234 5678', 'WhatsApp', 'text', 'social')
ON CONFLICT (key) DO NOTHING;

-- Add footer settings
INSERT INTO site_settings (key, value, label, type, category) VALUES
('footer_about_text', 'La Alianza Carnicerías te ofrece las mejores carnes frescas y servicio de calidad en Santiago.', 'Texto breve del footer', 'textarea', 'general'),
('footer_show_social', 'true', 'Mostrar redes sociales', 'boolean', 'general'),
('footer_show_ceo', 'true', 'Mostrar información del CEO', 'boolean', 'general')
ON CONFLICT (key) DO NOTHING;