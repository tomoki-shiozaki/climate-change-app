import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useErrorContext } from "@/context/error";
import type { AuthContextType } from "@/features/auth/types";
import { authService } from "@/features/auth/services/authService";
import { shouldHandleGlobalError } from "@/lib/errors/shouldHandleGlobalError";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { setError } = useErrorContext();

  // 共通のグローバルエラー処理
  const handleGlobalError = (error: unknown) => {
    if (shouldHandleGlobalError(error)) {
      setError(error.message);
    }
  };

  // 自動ログイン
  useEffect(() => {
    const initAuth = async () => {
      try {
        const username = await authService.tryAutoLogin();
        setCurrentUsername(username);
      } catch (err) {
        console.warn("自動ログイン失敗:", err);
      } finally {
        setAuthLoading(false);
      }
    };

    void initAuth();
  }, []);

  // ---- Auth Functions ----

  const login: AuthContextType["login"] = async (user) => {
    try {
      await authService.login(user);
      setCurrentUsername(user.username);
      setError(null);
    } catch (e: unknown) {
      console.error("login error:", e);
      handleGlobalError(e);
      throw e;
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    try {
      await authService.logout();
      setError(null);
    } catch (e: unknown) {
      console.error("logout error:", e);
      handleGlobalError(e);
      throw e;
    } finally {
      setCurrentUsername(null);
    }
  };

  const signup: AuthContextType["signup"] = async (user) => {
    try {
      await authService.signup(user);
      setCurrentUsername(user.username);
      setError(null);
    } catch (e: unknown) {
      console.error("signup error:", e);
      handleGlobalError(e);
      throw e;
    }
  };

  const refreshAccessToken: AuthContextType["refreshAccessToken"] =
    async () => {
      try {
        await authService.refreshAccessToken();
      } catch (e: unknown) {
        console.warn("refresh failed, logging out", e);
        await logout();
      }
    };

  return (
    <AuthContext.Provider
      value={{
        currentUsername,
        authLoading,
        login,
        logout,
        signup,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
