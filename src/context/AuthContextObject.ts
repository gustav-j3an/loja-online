import { createContext } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import type { UserProfile, AuthActionResult } from '../types/auth.types';

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  isLoading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<AuthActionResult>;
  signIn: (email: string, password: string) => Promise<AuthActionResult>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<AuthActionResult>;
  updatePassword: (password: string) => Promise<AuthActionResult>;
  updateProfileName: (fullName: string) => Promise<AuthActionResult>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);
