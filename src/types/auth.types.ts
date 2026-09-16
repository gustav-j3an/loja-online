export interface UserProfile {
  id: string;
  full_name: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresEmailConfirmation?: boolean;
}
