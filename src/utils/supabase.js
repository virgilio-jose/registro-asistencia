// src/utils/supabase.js
import { createClient } from '@supabase/supabase-js';

// Las variables de entorno se acceden a través de process.env en Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Verifica que las claves existan antes de inicializar (buena práctica)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Faltan variables de entorno de Supabase. Revisa tu archivo .env.local");
}

// Inicializa el cliente de Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey);