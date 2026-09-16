import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
// Suporta VITE_SUPABASE_PUBLISHABLE_KEY ou VITE_SUPABASE_ANON_KEY
const supabasePublicKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  '';

// Trava de segurança: detectar se a chave fornecida é acidentalmente a service_role
const isServiceRoleKey = Boolean(
  supabasePublicKey &&
  (supabasePublicKey.includes('service_role') ||
    (() => {
      try {
        const parts = supabasePublicKey.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(atob(parts[1]));
          return payload.role === 'service_role';
        }
      } catch {
        return false;
      }
      return false;
    })())
);

// A integração pública só é considerada válida se as variáveis estiverem preenchidas E NÃO forem a chave privileged service_role
export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabasePublicKey &&
  !isServiceRoleKey &&
  !supabaseUrl.includes('seu-projeto.supabase.co') &&
  !supabasePublicKey.includes('sua-chave-publica')
);

export const isDemoMode = Boolean(
  import.meta.env.DEV &&
  import.meta.env.VITE_DEMO_MODE === 'true'
);

if (isServiceRoleKey) {
  console.error(
    '🚨 ALERTA CRÍTICO DE SEGURANÇA: A chave service_role foi inserida no frontend. Substitua pela chave pública (VITE_SUPABASE_PUBLISHABLE_KEY) no arquivo .env.'
  );
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabasePublicKey)
  : null;
