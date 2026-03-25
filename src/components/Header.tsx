import { Store } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export default function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, signOut } = useAuth();

  return (
    <>
      <div className="bg-yellow-400 text-gray-900 py-3 px-4 flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <Store size={18} />
            <span className="font-medium">Despacho a domicilio</span>
          </div>
          <span>Lunes a Viernes 10:00 a 17:00 - Sábados 10:00 a 15:00</span>
        </div>
      </div>

      <header className="bg-gray-900 text-white py-4 px-6 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="text-2xl font-bold tracking-wider">
              <div className="text-white">LA ALIANZA</div>
              <div className="text-sm tracking-widest text-gray-300">C A R N I C E R I A S</div>
            </div>
          </button>

          <nav className="flex items-center gap-6">
            <button
              onClick={() => onNavigate('home')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                currentPage === 'home'
                  ? 'bg-yellow-400 text-gray-900'
                  : 'text-white hover:bg-gray-800'
              }`}
            >
              Inicio
            </button>
            {user && (
              <>
                <button
                  onClick={() => onNavigate('admin')}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    currentPage === 'admin'
                      ? 'bg-yellow-400 text-gray-900'
                      : 'text-white hover:bg-gray-800'
                  }`}
                >
                  Admin
                </button>
                <button
                  onClick={signOut}
                  className="px-6 py-2 rounded-lg font-medium text-white hover:bg-red-600 transition-all"
                >
                  Salir
                </button>
              </>
            )}
            {!user && (
              <button
                onClick={() => onNavigate('login')}
                className={`px-6 py-2 rounded-lg font-medium transition-all ${
                  currentPage === 'login'
                    ? 'bg-yellow-400 text-gray-900'
                    : 'text-white hover:bg-gray-800'
                }`}
              >
                Login
              </button>
            )}
          </nav>
        </div>
      </header>
    </>
  );
}
