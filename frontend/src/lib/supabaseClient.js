// Ruta: frontend/src/lib/supabaseClient.js

import { createClient } from '@supabase/supabase-js'

// Estas variables vendrán de tu archivo .env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase URL or Anon Key. Make sure to set them in your .env file.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)