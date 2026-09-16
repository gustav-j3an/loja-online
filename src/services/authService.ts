import { supabase, isSupabaseConfigured, isDemoMode } from './supabaseClient';
import type { UserProfile } from '../types/auth.types';

// Perfil de teste em memória para o modo demonstrativo
let MOCK_DEMO_PROFILE: UserProfile = {
  id: 'demo-user-id',
  full_name: 'Cliente Demonstração',
};

export async function getProfile(userId: string): Promise<UserProfile | null> {
  if (isDemoMode || !isSupabaseConfigured || !supabase) {
    return MOCK_DEMO_PROFILE;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      console.warn(`Erro ao buscar perfil do usuário (${userId}):`, error.message);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error('Falha ao consultar tabela profiles:', err);
    return null;
  }
}

export async function updateProfile(userId: string, fullName: string): Promise<UserProfile | null> {
  if (isDemoMode || !isSupabaseConfigured || !supabase) {
    MOCK_DEMO_PROFILE = { ...MOCK_DEMO_PROFILE, full_name: fullName };
    return MOCK_DEMO_PROFILE;
  }

  try {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: userId,
        full_name: fullName.trim(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error) {
      console.error('Erro ao atualizar nome do perfil:', error.message);
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.error('Falha ao atualizar perfil no Supabase:', err);
    return null;
  }
}
