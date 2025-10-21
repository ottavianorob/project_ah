import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/db';

// Hardcoded for the execution environment, as process.env is not available.
const supabaseUrl = 'https://dkylbkyupzqbnemntgsp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRreWxia3l1cHpxYm5lbW50Z3NwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NTUyNzYsImV4cCI6MjA3NjIzMTI3Nn0.wd6Ty8EwJ9us7jvBWGSPgOGkho4vZzO6P9Iot82wfT8';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
