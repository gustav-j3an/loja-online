import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// A integração real só é considerada válida se as variáveis do Supabase estiverem preenchidas e forem legítimas.
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  !supabaseUrl.includes('seu-projeto.supabase.co') &&
  !supabaseAnonKey.includes('sua-chave-anonima')
);

// O Modo Demonstrativo EXIGE ativação explícita via VITE_DEMO_MODE=true E somente é permitido em desenvolvimento (DEV).
// Em produção (PROD), o modo demonstrativo JAMAIS é ativado.
export const isDemoMode = Boolean(
  import.meta.env.DEV &&
  import.meta.env.VITE_DEMO_MODE === 'true'
);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
