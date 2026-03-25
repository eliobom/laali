import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Save, User, Mail, Phone, LogOut } from 'lucide-react';

interface ProfileProps {
  onNavigate: (page: string) => void;
}

export default function Profile({ onNavigate }: ProfileProps) {
  const { user, signOut, updateProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || '');
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  if (!user) {
    onNavigate('login');
    return null;
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await updateProfile({
        username,
        full_name: fullName,
        phone,
      });

      if (error) {
        setMessageType('error');
        setMessage('Error al guardar: ' + error.message);
      } else {
        setMessageType('success');
        setMessage('Perfil actualizado correctamente');
      }
    } catch (error) {
      setMessageType('error');
      setMessage('Error inesperado');
    } finally {
      setLoading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onNavigate('home');
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl p-6 mb-6 backdrop-blur">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-slate-50">Mi Perfil</h1>
            <button
              onClick={() => onNavigate('home')}
              className="px-4 py-2 bg-slate-800/60 text-slate-200 rounded-lg hover:bg-slate-800 transition-colors"
            >
              Volver al Inicio
            </button>
          </div>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg ${
                messageType === 'error'
                  ? 'bg-red-500/10 text-red-200 border border-red-500/30'
                  : 'bg-green-500/10 text-green-200 border border-green-500/30'
              }`}
            >
              {message}
            </div>
          )}
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl p-6 mb-6 backdrop-blur">
          <h2 className="text-2xl font-bold text-slate-50 mb-6">Información Personal</h2>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  <Mail className="inline mr-2" size={16} />
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  value={user.email || ''}
                  disabled
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-400 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  <User className="inline mr-2" size={16} />
                  Nombre de Usuario
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-200 mb-2">
                  <Phone className="inline mr-2" size={16} />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50"
              >
                <Save size={20} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>

              <button
                type="button"
                onClick={handleSignOut}
                className="flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
              >
                <LogOut size={20} />
                Cerrar Sesión
              </button>
            </div>
          </form>
        </div>

        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl p-6 backdrop-blur">
          <h2 className="text-xl font-bold text-slate-50 mb-4">Información de la Cuenta</h2>
          <div className="space-y-2 text-slate-300">
            <p><span className="text-slate-400">ID de usuario:</span> {user.id}</p>
            <p><span className="text-slate-400">Rol:</span> {user.role === 'admin' ? 'Administrador' : 'Usuario'}</p>
            <p><span className="text-slate-400">Fecha de registro:</span> {new Date(user.created_at).toLocaleDateString('es-CL')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
