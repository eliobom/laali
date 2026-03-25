import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cerdezecihevqlvqltzo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlcmRlemVjaWhldnFsdnFsdHpvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ0MDU2MTQsImV4cCI6MjA4OTk4MTYxNH0.v53Wsb2YnwoJQ7U7AHgaEwXtt40JS2yp7zWV_Qsjk84';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
