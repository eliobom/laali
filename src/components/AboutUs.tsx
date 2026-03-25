import { useEffect, useState } from 'react';
import { Eye, Target, CheckCircle, ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AboutUsData {
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

export default function AboutUs() {
  const [data, setData] = useState<AboutUsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAboutUs();
  }, []);

  const loadAboutUs = async () => {
    try {
      console.log('Loading about us from Supabase...');
      const { data: aboutData, error } = await supabase
        .from('about_us')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      console.log('About us data:', aboutData);
      if (aboutData) {
        setData(aboutData);
      }
    } catch (error) {
      console.error('Error loading about us:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="animate-pulse text-slate-400">Cargando...</div>
        </div>
      </section>
    );
  }

  if (!data) return null;

  // Render image based on position
  const renderImage = () => {
    if (!data.imagen_url) return null;
    
    return (
      <div className="relative w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-2xl">
        <img 
          src={data.imagen_url} 
          alt={data.titulo || 'Acerca de Nosotros'}
          className="w-full h-full object-cover"
          onError={(e) => { 
            (e.target as HTMLImageElement).style.display = 'none'; 
          }}
        />
      </div>
    );
  };

  // Determine layout based on image position
  const renderContentWithImage = () => {
    const position = data.posicion_imagen || 'right';
    const hasImage = data.imagen_url && data.imagen_url.trim() !== '';
    
    if (!hasImage) {
      return (
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
              <Eye size={32} className="text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Visión</h3>
            <p className="text-slate-200 leading-relaxed text-center">{data.vision}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
              <Target size={32} className="text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Misión</h3>
            <p className="text-slate-200 leading-relaxed text-center">{data.mision}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
              <CheckCircle size={32} className="text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Objetivos</h3>
            <p className="text-slate-200 leading-relaxed text-center">{data.objetivos}</p>
          </div>
        </div>
      );
    }

    // With image
    if (position === 'left') {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            {renderImage()}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50">
                {data.titulo || 'Acerca de'} <span className="text-yellow-500">Nosotros</span>
              </h2>
              <p className="text-slate-200 leading-relaxed text-lg">{data.contenido}</p>
              {data.boton_texto && data.boton_enlace && (
                <a 
                  href={data.boton_enlace}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                >
                  {data.boton_texto}
                  <ArrowRight size={20} />
                </a>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <Eye size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Visión</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.vision}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <Target size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Misión</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.mision}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <CheckCircle size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Objetivos</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.objetivos}</p>
            </div>
          </div>
        </div>
      );
    }

    if (position === 'right') {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 items-center mb-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50">
                {data.titulo || 'Acerca de'} <span className="text-yellow-500">Nosotros</span>
              </h2>
              <p className="text-slate-200 leading-relaxed text-lg">{data.contenido}</p>
              {data.boton_texto && data.boton_enlace && (
                <a 
                  href={data.boton_enlace}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                >
                  {data.boton_texto}
                  <ArrowRight size={20} />
                </a>
              )}
            </div>
            {renderImage()}
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <Eye size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Visión</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.vision}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <Target size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Misión</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.mision}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <CheckCircle size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Objetivos</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.objetivos}</p>
            </div>
          </div>
        </div>
      );
    }

    if (position === 'top') {
      return (
        <div className="max-w-6xl mx-auto">
          <div className="space-y-8 mb-12">
            {renderImage()}
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-50">
                {data.titulo || 'Acerca de'} <span className="text-yellow-500">Nosotros</span>
              </h2>
              <p className="text-slate-200 leading-relaxed text-lg">{data.contenido}</p>
              {data.boton_texto && data.boton_enlace && (
                <a 
                  href={data.boton_enlace}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
                >
                  {data.boton_texto}
                  <ArrowRight size={20} />
                </a>
              )}
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <Eye size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Visión</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.vision}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <Target size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Misión</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.mision}</p>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
              <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
                <CheckCircle size={32} className="text-gray-900" />
              </div>
              <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Objetivos</h3>
              <p className="text-slate-200 leading-relaxed text-center">{data.objetivos}</p>
            </div>
          </div>
        </div>
      );
    }

    // position === 'bottom'
    return (
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
              <Eye size={32} className="text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Visión</h3>
            <p className="text-slate-200 leading-relaxed text-center">{data.vision}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
              <Target size={32} className="text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Misión</h3>
            <p className="text-slate-200 leading-relaxed text-center">{data.mision}</p>
          </div>

          <div className="bg-slate-900/60 border border-slate-800 p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow backdrop-blur">
            <div className="flex items-center justify-center w-16 h-16 bg-yellow-400 rounded-full mb-6 mx-auto">
              <CheckCircle size={32} className="text-gray-900" />
            </div>
            <h3 className="text-2xl font-bold text-center mb-4 text-slate-50">Objetivos</h3>
            <p className="text-slate-200 leading-relaxed text-center">{data.objetivos}</p>
          </div>
        </div>
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-50">
              {data.titulo || 'Acerca de'} <span className="text-yellow-500">Nosotros</span>
            </h2>
            <p className="text-slate-200 leading-relaxed text-lg">{data.contenido}</p>
            {data.boton_texto && data.boton_enlace && (
              <a 
                href={data.boton_enlace}
                className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors"
              >
                {data.boton_texto}
                <ArrowRight size={20} />
              </a>
            )}
          </div>
          {renderImage()}
        </div>
      </div>
    );
  };

  return (
    <section id="nosotros" className="py-20 px-6">
      <div className="container mx-auto">
        {renderContentWithImage()}
      </div>
    </section>
  );
}
