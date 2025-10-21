import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/db';

// In a real-world application with a build process (like Next.js or Vite),
// these values would be loaded from environment variables.
// For this simple client-side setup, they are hardcoded.
const supabaseUrl = 'https://dkylbkyupzqbnemntgsp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWxia3l1cHpxYm5lbW50Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTUyNzYsImV4cCI6MjA3NjIzMTI3Nn0.wd6Ty8EwJ9us7jvBWGSPgOGkho4vZzO6P9Iot82wfT8';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
