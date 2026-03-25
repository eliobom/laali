import { useEffect, useState } from 'react';
import { ExternalLink, Store as StoreIcon } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Store {
  id: string;
  nombre: string;
  url: string;
  logo_url: string;
  orden: number;
}

export default function Stores() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStores();
  }, []);

  const loadStores = async () => {
    try {
      console.log('Loading stores from Supabase...');
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('activo', true)
        .order('orden', { ascending: true });

      if (error) {
        console.error('Supabase error loading stores:', error);
        throw error;
      }
      console.log('Stores data:', data);
      if (data) {
        setStores(data);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-pulse text-slate-400">Cargando tiendas...</div>
        </div>
      </section>
    );
  }

  if (stores.length === 0) return null;

  return (
    <section id="tiendas" className="py-20 px-6">
      <div className="container mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-slate-50">
          Nuestras <span className="text-yellow-500">Tiendas</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {stores.map((store) => (
            <a
              key={store.id}
              href={store.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 group backdrop-blur"
            >
              <div className="flex items-center justify-center w-20 h-20 bg-yellow-400 rounded-full mb-6 mx-auto group-hover:bg-yellow-500 transition-colors">
                {store.logo_url ? (
                  <img
                    src={store.logo_url}
                    alt={store.nombre}
                    className="w-12 h-12 object-contain"
                  />
                ) : (
                  <StoreIcon size={40} className="text-gray-900" />
                )}
              </div>

              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50 group-hover:text-yellow-400 transition-colors">
                {store.nombre}
              </h3>

              <div className="flex items-center justify-center gap-2 text-slate-300 group-hover:text-yellow-400 transition-colors">
                <span className="text-sm">Visitar sitio</span>
                <ExternalLink size={16} />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
