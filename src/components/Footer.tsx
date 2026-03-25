import { useEffect, useState } from 'react';
import { Facebook, Instagram, Youtube, Phone, MapPin, Mail } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface SiteSettings {
  [key: string]: string;
}

export default function Footer() {
  const [settings, setSettings] = useState<SiteSettings>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('key, value');

      if (error) throw error;
      
      const settingsMap: SiteSettings = {};
      data?.forEach((item) => {
        settingsMap[item.key] = item.value;
      });
      setSettings(settingsMap);
    } catch (error) {
      console.error('Error loading settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSocial = settings.footer_show_social !== 'false';
  const showCeo = settings.footer_show_ceo !== 'false';

  const socialLinks = [
    { key: 'social_facebook', icon: Facebook, label: 'Facebook' },
    { key: 'social_instagram', icon: Instagram, label: 'Instagram' },
    { key: 'social_youtube', icon: Youtube, label: 'YouTube' },
  ];

  return (
    <footer className="bg-gray-900 text-white py-12 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Company Info */}
          <div>
            <div className="mb-4">
              <h3 className="text-2xl font-bold tracking-wider">LA ALIANZA</h3>
              <p className="text-sm tracking-widest text-gray-400">C A R N I C E R I A S</p>
            </div>
            <p className="text-gray-400 text-sm">
              {settings.footer_about_text || 'Las mejores carnes frescas en Santiago. Calidad y servicio garantizado.'}
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 text-yellow-400">Contacto</h4>
            <div className="space-y-2 text-gray-300">
              {settings.contact_phone && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-yellow-400" />
                  <a href={`tel:${settings.contact_phone}`} className="hover:text-white">
                    {settings.contact_phone}
                  </a>
                </div>
              )}
              {settings.contact_whatsapp && (
                <div className="flex items-center gap-2">
                  <Phone size={16} className="text-yellow-400" />
                  <a href={`https://wa.me/${settings.contact_whatsapp.replace(/\D/g, '')}`} className="hover:text-white">
                    WhatsApp: {settings.contact_whatsapp}
                  </a>
                </div>
              )}
              {settings.contact_email && (
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-yellow-400" />
                  <a href={`mailto:${settings.contact_email}`} className="hover:text-white">
                    {settings.contact_email}
                  </a>
                </div>
              )}
              {settings.contact_address && (
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-yellow-400" />
                  <span>{settings.contact_address}</span>
                </div>
              )}
            </div>
          </div>

          {/* CEO Section */}
          {showCeo && (
            <div>
              <h4 className="text-lg font-bold mb-4 text-yellow-400">Nuestro Líder</h4>
              <div className="flex items-start gap-4">
                {settings.ceo_imagen && (
                  <img 
                    src={settings.ceo_imagen} 
                    alt={settings.ceo_nombre || 'CEO'}
                    className="w-20 h-20 rounded-full object-cover border-2 border-yellow-400"
                    onError={(e) => { 
                      (e.target as HTMLImageElement).style.display = 'none'; 
                    }}
                  />
                )}
                <div>
                  <h5 className="font-bold text-white">{settings.ceo_nombre || 'Juan Pérez'}</h5>
                  <p className="text-sm text-gray-400">Fundador y Director General</p>
                  {settings.ceo_descripcion && (
                    <p className="text-sm text-gray-300 mt-2">{settings.ceo_descripcion}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Social Media */}
        {showSocial && (
          <div className="border-t border-gray-800 pt-8 mb-8">
            <h4 className="text-lg font-bold mb-4 text-center text-yellow-400">Síguenos en Redes Sociales</h4>
            <div className="flex justify-center gap-6">
              {socialLinks.map((social) => {
                const url = settings[social.key];
                if (!url) return null;
                
                const Icon = social.icon;
                return (
                  <a
                    key={social.key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-12 h-12 bg-gray-800 rounded-full hover:bg-yellow-400 hover:text-gray-900 transition-colors"
                    aria-label={social.label}
                  >
                    <Icon size={24} />
                  </a>
                );
              })}
            </div>
          </div>
        )}

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6">
          <p className="text-center text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} La Alianza Carnicerías. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
