import type { LoginRequest, SignupRequest } from "./apiTypes";

export interface AuthContextType {
  currentUsername: string | null;
  authLoading: boolean;
  login: (user: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: SignupRequest) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}
