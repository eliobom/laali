import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, ArrowLeft, Mail, Lock } from 'lucide-react';

interface LoginProps {
  onNavigate: (page: string) => void;
}

export default function Login({ onNavigate }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState<'success' | 'error'>('success');

  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const { error } = await signIn(email, password);
      console.log('Login result:', error ? 'error: ' + error.message : 'success');
      if (error) {
        setMessageType('error');
        setMessage(error.message);
      } else {
        setMessageType('success');
        setMessage('Inicio de sesión exitoso');
        onNavigate('home');
      }
    } catch (error) {
      console.log('Error catch:', error);
      setMessageType('error');
      setMessage('Error inesperado');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl shadow-2xl p-8 backdrop-blur">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-50 mb-2">LA ALIANZA</h2>
            <p className="text-sm text-slate-300 tracking-widest">C A R N I C E R I A S</p>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-50 text-center">Iniciar Sesión</h3>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-200 mb-2">
                Usuario
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Usuario"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-200 mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-3 bg-slate-950/40 border border-slate-700 rounded-lg text-slate-100 placeholder:text-slate-500 focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            {message && (
              <div
                className={`p-3 rounded-lg text-sm ${
                  messageType === 'error'
                    ? 'bg-red-500/10 text-red-200 border border-red-500/30'
                    : 'bg-green-500/10 text-green-200 border border-green-500/30'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-400 text-gray-900 py-3 rounded-lg font-bold hover:bg-yellow-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Procesando...' : 'Iniciar Sesión'}
            </button>
          </form>

          <button
            onClick={() => onNavigate('home')}
            className="w-full mt-4 text-slate-300 hover:text-slate-50 text-sm font-medium"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  );
}
