import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface Usuario {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'user';
  full_name: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: Usuario | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (username: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Usuario>) => Promise<{ error: Error | null }>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);

  // Check if user is admin
  const isAdmin = user?.role === 'admin';

  // Fetch user from database
  const fetchUser = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user:', error);
        return;
      }

      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
    }
  };

  // Check for stored session on load
  useEffect(() => {
    const storedUserId = localStorage.getItem('laalianza_user_id');
    if (storedUserId) {
      fetchUser(storedUserId);
    }
    setLoading(false);
  }, []);

  const signIn = async (username: string, password: string) => {
    try {
      // First, check if username contains @
      let searchValue = username;
      if (!username.includes('@')) {
        // Add @laalianza.cl for display
        searchValue = username;
      }

      // Try to find user by username or email
      const { data: usuarios, error: findError } = await supabase
        .from('usuarios')
        .select('*')
        .or(`username.eq.${username},email.eq.${username}`)
        .maybeSingle();

      if (findError) {
        console.error('Error finding user:', findError);
        return { error: new Error('Error al buscar usuario') };
      }

      if (!usuarios) {
        console.error('Usuario no encontrado');
        return { error: new Error('Usuario o contraseña incorrectos') };
      }

      // Simple password check (in production, use proper hashing!)
      // For demo, we'll use plain text comparison
      if (usuarios.password_hash !== password) {
        console.error('Contraseña incorrecta');
        return { error: new Error('Usuario o contraseña incorrectos') };
      }

      // Login successful - store user ID
      localStorage.setItem('laalianza_user_id', usuarios.id);
      setUser(usuarios);
      
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('laalianza_user_id');
    setUser(null);
  };

  const refreshUser = async () => {
    if (user) {
      await fetchUser(user.id);
    }
  };

  const updateProfile = async (updates: Partial<Usuario>) => {
    if (!user) {
      return { error: new Error('No user logged in') };
    }

    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          ...updates,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) {
        return { error };
      }

      await fetchUser(user.id);
      return { error: null };
    } catch (error) {
      return { error: error as Error };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        signIn,
        signOut,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
