import React, { useEffect, useState } from 'react';
import type { User, AuthChangeEvent, Session } from '@supabase/supabase-js';
import { supabase } from '../services/supabaseClient';
import { getProfile, updateProfile } from '../services/authService';
import type { UserProfile } from '../types/auth.types';
import { AuthContext, type AuthContextType } from './AuthContextObject';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchProfile = async (userId: string) => {
    try {
      const p = await getProfile(userId);
      setProfile(p);
    } catch {
      setProfile(null);
    }
  };

  useEffect(() => {
    let mounted = true;

    async function initAuth() {
      try {
        if (!supabase) {
          if (mounted) setIsLoading(false);
          return;
        }
        const { data } = await supabase.auth.getSession();
        if (!mounted) return;
        const currentSession = data.session;
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        if (currentSession?.user) {
          await fetchProfile(currentSession.user.id);
        }
      } catch (err) {
        console.error('Error fetching initial session:', err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    initAuth();

    if (!supabase) return;

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, currentSession: Session | null) => {
        if (!mounted) return;
        const currentUser = currentSession?.user ?? null;
        setSession(currentSession);
        setUser(currentUser);
        if (currentUser) {
          await fetchProfile(currentUser.id);
        } else {
          setProfile(null);
        }
        setIsLoading(false);
      }
    );

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signUp: AuthContextType['signUp'] = async (email, password, fullName) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    const sessionUser = data.user;
    if (sessionUser) {
      await updateProfile(sessionUser.id, fullName).catch(() => {});
    }

    return {
      success: true,
      requiresEmailConfirmation: !data.session,
    };
  };

  const signIn: AuthContextType['signIn'] = async (email, password) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const signOut: AuthContextType['signOut'] = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  const requestPasswordReset: AuthContextType['requestPasswordReset'] = async (email) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    const redirectTo = `${window.location.origin}/redefinir-senha`;
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      console.warn('Password reset request error:', error.message);
    }

    return { success: true };
  };

  const updatePassword: AuthContextType['updatePassword'] = async (newPassword) => {
    if (!supabase) {
      return { success: false, error: 'Supabase não está configurado.' };
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  };

  const updateProfileName: AuthContextType['updateProfileName'] = async (fullName) => {
    if (!user) {
      return { success: false, error: 'Usuário não autenticado' };
    }

    try {
      const updated = await updateProfile(user.id, fullName);
      setProfile(updated);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Erro ao atualizar perfil' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        isLoading,
        signUp,
        signIn,
        signOut,
        requestPasswordReset,
        updatePassword,
        updateProfileName,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
