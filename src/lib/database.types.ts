export interface Database {
  public: {
    Tables: {
      about_us: {
        Row: {
          id: string;
          vision: string;
          mision: string;
          objetivos: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          vision?: string;
          mision?: string;
          objetivos?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          vision?: string;
          mision?: string;
          objetivos?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      stores: {
        Row: {
          id: string;
          nombre: string;
          url: string;
          logo_url: string;
          orden: number;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          nombre: string;
          url: string;
          logo_url?: string;
          orden?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          nombre?: string;
          url?: string;
          logo_url?: string;
          orden?: number;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      usuarios: {
        Row: {
          id: string;
          username: string;
          password_hash: string;
          email: string;
          role: 'admin' | 'user';
          full_name: string;
          phone: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          username: string;
          password_hash: string;
          email: string;
          role?: 'admin' | 'user';
          full_name?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          password_hash?: string;
          email?: string;
          role?: 'admin' | 'user';
          full_name?: string;
          phone?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          label: string;
          type: 'text' | 'textarea' | 'image' | 'boolean' | 'number';
          category: 'general' | 'contact' | 'social' | 'seo' | 'hero' | 'delivery';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key?: string;
          value?: string;
          label?: string;
          type?: 'text' | 'textarea' | 'image' | 'boolean' | 'number';
          category?: 'general' | 'contact' | 'social' | 'seo' | 'hero' | 'delivery';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          label?: string;
          type?: 'text' | 'textarea' | 'image' | 'boolean' | 'number';
          category?: 'general' | 'contact' | 'social' | 'seo' | 'hero' | 'delivery';
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
