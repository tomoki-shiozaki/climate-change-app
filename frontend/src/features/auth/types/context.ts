import type { LoginForm, SignupForm } from "@/features/auth/types";

export interface AuthContextType {
  currentUsername: string | null;
  authLoading: boolean;
  login: (user: LoginForm) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: SignupForm) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}
