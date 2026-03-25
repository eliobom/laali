import { useState } from 'react';
import { useAuth } from './contexts/AuthContext';
import Header from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Admin from './pages/Admin';
import Profile from './pages/Profile';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-50">
      {currentPage !== 'login' && currentPage !== 'profile' && currentPage !== 'admin' && (
        <Header onNavigate={setCurrentPage} currentPage={currentPage} />
      )}

      {currentPage === 'home' && <Home />}
      {currentPage === 'login' && <Login onNavigate={setCurrentPage} />}
      {currentPage === 'admin' && <Admin onNavigate={setCurrentPage} />}
      {currentPage === 'profile' && <Profile onNavigate={setCurrentPage} />}
    </div>
  );
}

export default App;
