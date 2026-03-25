import { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { 
  Save, Plus, Trash2, Edit2, X, 
  Home, Store, Settings, User, Phone, 
  Facebook, Instagram, Twitter, Truck,
  ChevronRight, ChevronDown, UserCircle, Globe
} from 'lucide-react';

interface AboutUsData {
  id: string;
  vision: string;
  mision: string;
  objetivos: string;
  titulo: string;
  contenido: string;
  imagen_url: string;
  posicion_imagen: string;
  boton_texto: string;
  boton_enlace: string;
}

interface Store {
  id: string;
  nombre: string;
  url: string;
  logo_url: string;
  orden: number;
  activo: boolean;
}

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  label: string;
  type: 'text' | 'textarea' | 'image' | 'boolean' | 'number';
  category: string;
}

interface AdminProps {
  onNavigate: (page: string) => void;
}

type AdminSection = 'about' | 'stores' | 'settings' | 'profile';

export default function Admin({ onNavigate }: AdminProps) {
  const { user, updateProfile } = useAuth();
  const [activeSection, setActiveSection] = useState<AdminSection>('about');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  // Data states
  const [aboutUs, setAboutUs] = useState<AboutUsData | null>(null);
  const [stores, setStores] = useState<Store[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSetting[]>([]);
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isAddingStore, setIsAddingStore] = useState(false);

  // Profile state
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');

  useEffect(() => {
    if (!user) {
      onNavigate('login');
      return;
    }
    loadData();
  }, [user, onNavigate]);

  const loadData = async () => {
    try {
      const [aboutUsResult, storesResult, settingsResult] = await Promise.all([
        supabase.from('about_us').select('*').maybeSingle(),
        supabase.from('stores').select('*').order('orden', { ascending: true }),
        supabase.from('site_settings').select('*'),
      ]);

      if (aboutUsResult.data) setAboutUs(aboutUsResult.data);
      if (storesResult.data) setStores(storesResult.data);
      if (settingsResult.data) setSiteSettings(settingsResult.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  // About Us handlers
  const saveAboutUs = async () => {
    if (!aboutUs) return;
    setLoading(true);
    try {
      const { error } = await supabase
        .from('about_us')
        .update({
          vision: aboutUs.vision,
          mision: aboutUs.mision,
          objetivos: aboutUs.objetivos,
          titulo: aboutUs.titulo,
          contenido: aboutUs.contenido,
          imagen_url: aboutUs.imagen_url,
          posicion_imagen: aboutUs.posicion_imagen,
          boton_texto: aboutUs.boton_texto,
          boton_enlace: aboutUs.boton_enlace,
          updated_at: new Date().toISOString(),
        })
        .eq('id', aboutUs.id);
      if (error) {
        console.error('Error saving about_us:', error);
        throw error;
      }
      showMessage('Información guardada correctamente');
      // Reload data
      await loadData();
    } catch (error) {
      showMessage('Error al guardar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Stores handlers
  const saveStore = async (store: Partial<Store>) => {
    setLoading(true);
    try {
      if (store.id) {
        const { error } = await supabase
          .from('stores')
          .update({
            nombre: store.nombre,
            url: store.url,
            logo_url: store.logo_url,
            orden: store.orden,
            activo: store.activo,
            updated_at: new Date().toISOString(),
          })
          .eq('id', store.id);
        if (error) {
          console.error('Error updating store:', error);
          throw error;
        }
      } else {
        const { error } = await supabase.from('stores').insert({
          nombre: store.nombre!,
          url: store.url!,
          logo_url: store.logo_url || '',
          orden: store.orden || stores.length,
          activo: store.activo !== false,
        });
        if (error) {
          console.error('Error inserting store:', error);
          throw error;
        }
      }
      setEditingStore(null);
      setIsAddingStore(false);
      showMessage('Tienda guardada correctamente');
      // Reload to verify
      await loadData();
    } catch (error) {
      showMessage('Error al guardar tienda', 'error');
    } finally {
      setLoading(false);
    }
  };

  const deleteStore = async (id: string) => {
    if (!confirm('¿Eliminar esta tienda?')) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('stores').delete().eq('id', id);
      if (error) {
        console.error('Error deleting store:', error);
        throw error;
      }
      showMessage('Tienda eliminada');
      await loadData();
    } catch (error) {
      showMessage('Error al eliminar', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Site Settings handlers
  const saveSetting = async (key: string, value: string) => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .update({ value, updated_at: new Date().toISOString() })
        .eq('key', key);
      if (error) {
        console.error('Error saving setting:', key, error);
      }
    } catch (error) {
      console.error('Error saving setting:', key, error);
    }
  };

  const saveAllSettings = async () => {
    setLoading(true);
    try {
      for (const setting of siteSettings) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: setting.value, updated_at: new Date().toISOString() })
          .eq('key', setting.key);
        if (error) {
          console.error('Error saving setting:', setting.key, error);
        }
      }
      showMessage('Configuración guardada correctamente');
      // Reload to get fresh data
      await loadData();
    } catch (error) {
      showMessage('Error al guardar configuración', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Profile handlers
  const saveProfile = async () => {
    setLoading(true);
    try {
      const { error } = await updateProfile({ username, full_name: fullName, phone });
      if (error) {
        console.error('Error saving profile:', error);
        throw error;
      }
      showMessage('Perfil guardado correctamente');
      await loadData();
    } catch (error) {
      showMessage('Error al guardar perfil', 'error');
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { id: 'about', label: 'Nosotros', icon: Home },
    { id: 'stores', label: 'Tiendas', icon: Store },
    { id: 'settings', label: 'Configuración', icon: Settings },
    { id: 'profile', label: 'Mi Perfil', icon: User },
  ];

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex-shrink-0">
        <div className="p-6 border-b border-slate-800">
          <h2 className="text-xl font-bold text-yellow-400">ADMIN</h2>
          <p className="text-sm text-slate-400">La Alianza Carnicerías</p>
        </div>
        
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id as AdminSection)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-all ${
                activeSection === item.id
                  ? 'bg-yellow-400 text-gray-900 font-bold'
                  : 'text-slate-300 hover:bg-slate-800'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 mt-auto border-t border-slate-800">
          <button
            onClick={() => onNavigate('home')}
            className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white"
          >
            ← Volver al Inicio
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              messageType === 'error'
                ? 'bg-red-500/10 text-red-200 border border-red-500/30'
                : 'bg-green-500/10 text-green-200 border border-green-500/30'
            }`}
          >
            {message}
          </div>
        )}

        {/* About Us Section */}
        {activeSection === 'about' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-50 mb-6">Acerca de Nosotros</h2>
            {aboutUs && (
              <div className="space-y-6">
                {/* Título Principal */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Título Principal</label>
                  <input
                    type="text"
                    value={aboutUs.titulo || ''}
                    onChange={(e) => setAboutUs({ ...aboutUs, titulo: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                    placeholder="Acerca de Nosotros"
                  />
                </div>

                {/* Contenido */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Contenido</label>
                  <textarea
                    value={aboutUs.contenido || ''}
                    onChange={(e) => setAboutUs({ ...aboutUs, contenido: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                    placeholder="Descripción de la empresa..."
                  />
                </div>

                {/* Imagen y Posición */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">URL de Imagen</label>
                    <input
                      type="url"
                      value={aboutUs.imagen_url || ''}
                      onChange={(e) => setAboutUs({ ...aboutUs, imagen_url: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                    {aboutUs.imagen_url && (
                      <div className="mt-2 relative w-full h-32 bg-slate-800 rounded-lg overflow-hidden">
                        <img 
                          src={aboutUs.imagen_url} 
                          alt="Preview" 
                          className="w-full h-full object-cover"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Posición de la Imagen</label>
                    <select
                      value={aboutUs.posicion_imagen || 'right'}
                      onChange={(e) => setAboutUs({ ...aboutUs, posicion_imagen: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                    >
                      <option value="left">Izquierda</option>
                      <option value="right">Derecha</option>
                      <option value="top">Arriba</option>
                      <option value="bottom">Abajo</option>
                    </select>
                  </div>
                </div>

                {/* Botón */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Texto del Botón</label>
                    <input
                      type="text"
                      value={aboutUs.boton_texto || ''}
                      onChange={(e) => setAboutUs({ ...aboutUs, boton_texto: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                      placeholder="Ver más"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-200 mb-2">Enlace del Botón</label>
                    <input
                      type="url"
                      value={aboutUs.boton_enlace || ''}
                      onChange={(e) => setAboutUs({ ...aboutUs, boton_enlace: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                      placeholder="https://ejemplo.com/nosotros"
                    />
                  </div>
                </div>

                <div className="border-t border-slate-700 pt-6 mt-6">
                  <h3 className="text-lg font-bold text-slate-50 mb-4">Información Adicional</h3>
                </div>

                {/* Visión */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Visión</label>
                  <textarea
                    value={aboutUs.vision}
                    onChange={(e) => setAboutUs({ ...aboutUs, vision: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                {/* Misión */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Misión</label>
                  <textarea
                    value={aboutUs.mision}
                    onChange={(e) => setAboutUs({ ...aboutUs, mision: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                {/* Objetivos */}
                <div>
                  <label className="block text-sm font-medium text-slate-200 mb-2">Objetivos</label>
                  <textarea
                    value={aboutUs.objetivos}
                    onChange={(e) => setAboutUs({ ...aboutUs, objetivos: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
                  />
                </div>

                <button
                  onClick={saveAboutUs}
                  disabled={loading}
                  className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
                >
                  <Save size={20} />
                  {loading ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Stores Section */}
        {activeSection === 'stores' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-slate-50">Nuestras Tiendas</h2>
              <button
                onClick={() => setIsAddingStore(true)}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500"
              >
                <Plus size={20} />
                Agregar
              </button>
            </div>

            {isAddingStore && (
              <StoreForm
                onSave={saveStore}
                onCancel={() => setIsAddingStore(false)}
                saving={loading}
                siteSettings={siteSettings}
              />
            )}

            <div className="space-y-4">
              {stores.map((store) => (
                <div key={store.id}>
                  {editingStore?.id === store.id ? (
                    <StoreForm
                      store={editingStore}
                      onSave={saveStore}
                      onCancel={() => setEditingStore(null)}
                      saving={loading}
                      siteSettings={siteSettings}
                    />
                  ) : (
                    <div className="flex items-center justify-between p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
                      <div>
                        <h3 className="font-bold text-slate-50">{store.nombre}</h3>
                        <p className="text-sm text-slate-300">{store.url}</p>
                        <p className="text-xs text-slate-400">
                          Orden: {store.orden} | {store.activo ? 'Activo' : 'Inactivo'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setEditingStore(store)} className="p-2 bg-blue-500 rounded-lg">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteStore(store.id)} className="p-2 bg-red-500 rounded-lg">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Settings Section */}
        {activeSection === 'settings' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-50">Configuración del Sitio</h2>
              <button
                onClick={saveAllSettings}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Guardando...' : 'Guardar Todo'}
              </button>
            </div>

            {/* Hero Settings */}
            <SettingsCategory title="Sección Principal" icon={Home}>
              {siteSettings.filter(s => s.category === 'hero').map(setting => (
                <SettingInput
                  key={setting.key}
                  setting={setting}
                  onChange={(value) => {
                    setSiteSettings(siteSettings.map(s => 
                      s.key === setting.key ? { ...s, value } : s
                    ));
                  }}
                  onBlur={(value) => saveSetting(setting.key, value)}
                />
              ))}
            </SettingsCategory>

            {/* Contact Settings */}
            <SettingsCategory title="Información de Contacto" icon={Phone}>
              {siteSettings.filter(s => s.category === 'contact').map(setting => (
                <SettingInput
                  key={setting.key}
                  setting={setting}
                  onChange={(value) => {
                    setSiteSettings(siteSettings.map(s => 
                      s.key === setting.key ? { ...s, value } : s
                    ));
                  }}
                  onBlur={(value) => saveSetting(setting.key, value)}
                />
              ))}
            </SettingsCategory>

            {/* Delivery Settings */}
            <SettingsCategory title="Delivery" icon={Truck}>
              {siteSettings.filter(s => s.category === 'delivery').map(setting => (
                <SettingInput
                  key={setting.key}
                  setting={setting}
                  onChange={(value) => {
                    setSiteSettings(siteSettings.map(s => 
                      s.key === setting.key ? { ...s, value } : s
                    ));
                  }}
                  onBlur={(value) => saveSetting(setting.key, value)}
                />
              ))}
            </SettingsCategory>

            {/* Social Settings */}
            <SettingsCategory title="Redes Sociales" icon={Facebook}>
              {siteSettings.filter(s => s.category === 'social').map(setting => (
                <SettingInput
                  key={setting.key}
                  setting={setting}
                  onChange={(value) => {
                    setSiteSettings(siteSettings.map(s => 
                      s.key === setting.key ? { ...s, value } : s
                    ));
                  }}
                  onBlur={(value) => saveSetting(setting.key, value)}
                />
              ))}
            </SettingsCategory>

            {/* Footer Settings */}
            <SettingsCategory title="Footer y CEO" icon={Globe}>
              {siteSettings.filter(s => s.category === 'general' && 
                ['ceo_nombre', 'ceo_descripcion', 'ceo_imagen', 'footer_about_text', 'footer_show_social', 'footer_show_ceo'].includes(s.key)).map(setting => (
                <SettingInput
                  key={setting.key}
                  setting={setting}
                  onChange={(value) => {
                    setSiteSettings(siteSettings.map(s => 
                      s.key === setting.key ? { ...s, value } : s
                    ));
                  }}
                  onBlur={(value) => saveSetting(setting.key, value)}
                />
              ))}
            </SettingsCategory>

            {/* SEO Settings */}
            <SettingsCategory title="SEO" icon={Settings}>
              {siteSettings.filter(s => s.category === 'seo').map(setting => (
                <SettingInput
                  key={setting.key}
                  setting={setting}
                  onChange={(value) => {
                    setSiteSettings(siteSettings.map(s => 
                      s.key === setting.key ? { ...s, value } : s
                    ));
                  }}
                  onBlur={(value) => saveSetting(setting.key, value)}
                />
              ))}
            </SettingsCategory>
          </div>
        )}

        {/* Profile Section */}
        {activeSection === 'profile' && (
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
            <h2 className="text-2xl font-bold text-slate-50 mb-6">Mi Perfil</h2>
            <div className="space-y-6 max-w-md">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Usuario</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Nombre Completo</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Teléfono</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">Email</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-900/40 border border-slate-700 rounded-lg text-slate-400"
                />
              </div>
              <button
                onClick={saveProfile}
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Guardando...' : 'Guardar Perfil'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Settings Category Component
function SettingsCategory({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-6 hover:bg-slate-800/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <Icon className="text-yellow-400" size={24} />
          <h3 className="text-xl font-bold text-slate-50">{title}</h3>
        </div>
        {expanded ? <ChevronDown /> : <ChevronRight />}
      </button>
      {expanded && (
        <div className="p-6 pt-0 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
}

// Setting Input Component
function SettingInput({ 
  setting, 
  onChange, 
  onBlur 
}: { 
  setting: SiteSetting; 
  onChange: (value: string) => void;
  onBlur: (value: string) => void;
}) {
  if (setting.type === 'boolean') {
    return (
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={setting.value === 'true'}
          onChange={(e) => {
            onChange(e.target.checked ? 'true' : 'false');
            onBlur(e.target.checked ? 'true' : 'false');
          }}
          className="w-5 h-5 rounded text-yellow-400"
        />
        <label className="text-slate-200">{setting.label}</label>
      </div>
    );
  }
  
  if (setting.type === 'textarea') {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{setting.label}</label>
        <textarea
          value={setting.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          rows={3}
          className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    );
  }
  
  if (setting.type === 'number') {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{setting.label}</label>
        <input
          type="number"
          value={setting.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
        />
      </div>
    );
  }
  
  if (setting.type === 'image') {
    return (
      <div>
        <label className="block text-sm font-medium text-slate-200 mb-2">{setting.label}</label>
        <input
          type="url"
          value={setting.value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => onBlur(e.target.value)}
          className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
          placeholder="https://ejemplo.com/imagen.jpg"
        />
        {setting.value && (
          <div className="mt-2 relative w-full h-32 bg-slate-800 rounded-lg overflow-hidden">
            <img 
              src={setting.value} 
              alt="Preview" 
              className="w-full h-full object-cover"
              onError={(e) => { 
                (e.target as HTMLImageElement).style.display = 'none'; 
              }}
            />
          </div>
        )}
      </div>
    );
  }
  
  return (
    <div>
      <label className="block text-sm font-medium text-slate-200 mb-2">{setting.label}</label>
      <input
        type="text"
        value={setting.value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => onBlur(e.target.value)}
        className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400"
      />
    </div>
  );
}

// Store Form Component
interface StoreFormProps {
  store?: Store;
  onSave: (store: Partial<Store>) => void;
  onCancel: () => void;
  saving: boolean;
  siteSettings?: SiteSetting[];
}

function StoreForm({ store, onSave, onCancel, saving, siteSettings }: StoreFormProps) {
  const [formData, setFormData] = useState<Partial<Store>>(
    store || { nombre: '', url: '', logo_url: '', orden: 0, activo: true }
  );

  // Get site settings for preview
  const heroTitle = siteSettings?.find((s: SiteSetting) => s.key === 'hero_title')?.value || 'LA ALIANZA';
  const heroSubtitle = siteSettings?.find((s: SiteSetting) => s.key === 'hero_subtitle')?.value || 'CARNICERÍAS';

  return (
    <div className="space-y-4">
      <form
        onSubmit={(e) => { e.preventDefault(); onSave(formData); }}
        className="p-4 bg-slate-950/30 border border-slate-800 rounded-xl space-y-4"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Nombre de la Tienda</label>
            <input
              type="text"
              value={formData.nombre}
              onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
              required
              className="w-full px-4 py-2 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100"
              placeholder="Tienda Santiago Centro"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">URL del Logo</label>
            <input
              type="url"
              value={formData.logo_url}
              onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100"
              placeholder="https://ejemplo.com/logo.png"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">URL del Sitio</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData({ ...formData, url: e.target.value })}
              required
              className="w-full px-4 py-2 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100"
              placeholder="https://tienda.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Orden de Visualización</label>
            <input
              type="number"
              value={formData.orden}
              onChange={(e) => setFormData({ ...formData, orden: parseInt(e.target.value) })}
              className="w-full px-4 py-2 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={formData.activo}
              onChange={(e) => setFormData({ ...formData, activo: e.target.checked })}
              className="w-4 h-4"
            />
            <label htmlFor="activo" className="text-sm font-medium text-slate-200">Tienda Activa</label>
          </div>
        </div>
        <div className="flex gap-2">
          <button type="submit" disabled={saving} className="px-4 py-2 bg-yellow-400 text-gray-900 rounded-lg font-bold">
            {saving ? 'Guardando...' : 'Guardar'}
          </button>
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-slate-700 text-slate-200 rounded-lg">
            Cancelar
          </button>
        </div>
      </form>

      {/* Vista Previa */}
      <div className="p-4 bg-slate-950/30 border border-slate-800 rounded-xl">
        <h4 className="text-sm font-medium text-slate-400 mb-3">Vista Previa</h4>
        <div className="bg-gray-900 rounded-lg overflow-hidden">
          {/* Header Preview */}
          <div className="bg-yellow-400 text-gray-900 py-2 px-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span>🛒</span>
              <span className="font-medium">Despacho a domicilio</span>
            </div>
            <span>Lunes a Viernes 10:00 a 17:00</span>
          </div>
          <div className="bg-gray-900 text-white py-3 px-4">
            <div className="text-xl font-bold">
              <div className="text-white">{heroTitle}</div>
              <div className="text-sm text-gray-300 tracking-widest">{heroSubtitle}</div>
            </div>
          </div>
          {/* Store Card Preview */}
          <div className="p-4 bg-slate-800">
            <div className="flex items-center gap-4">
              {formData.logo_url ? (
                <img 
                  src={formData.logo_url} 
                  alt="Logo" 
                  className="w-16 h-16 rounded-lg object-cover border-2 border-yellow-400"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-slate-700 flex items-center justify-center text-2xl">
                  🏪
                </div>
              )}
              <div>
                <h3 className="font-bold text-white text-lg">
                  {formData.nombre || 'Nombre de la Tienda'}
                </h3>
                <p className="text-sm text-yellow-400">
                  {formData.url || 'https://tu-tienda.com'}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.activo ? '✅ Disponible' : '❌ No disponible'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
