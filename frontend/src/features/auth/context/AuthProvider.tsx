/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { useErrorContext } from "@/context/error";
import type { AuthContextType } from "@/features/auth/types";
import { authService } from "@/features/auth/services/authService";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { setError } = useErrorContext();

  // 共通のグローバルエラー処理
  const handleGlobalError = (error: any) => {
    if (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    ) {
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
      await authService.login(user); // ← 修正
      setCurrentUsername(user.username);
      setError(null);
    } catch (e: any) {
      console.error("login error:", e);
      handleGlobalError(e);
      throw e;
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    try {
      await authService.logout();
      setError(null);
    } catch (e: any) {
      console.error("logout error:", e);
      handleGlobalError(e);
      throw e;
    } finally {
      setCurrentUsername(null);
    }
  };

  const signup: AuthContextType["signup"] = async (user) => {
    try {
      await authService.signup(user); // ← 修正なし（正しい）
      setCurrentUsername(user.username);
      setError(null);
    } catch (e: any) {
      console.error("signup error:", e);
      handleGlobalError(e);
      throw e;
    }
  };

  const refreshAccessToken: AuthContextType["refreshAccessToken"] =
    async () => {
      try {
        await authService.refreshAccessToken();
      } catch (e: any) {
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
