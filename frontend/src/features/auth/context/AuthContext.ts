import { createContext } from "react";
import type { LoginRequest, SignupRequest } from "../types/apiTypes";

export interface AuthContextType {
  currentUsername: string | null;
  authLoading: boolean;
  login: (user: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: SignupRequest) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);
