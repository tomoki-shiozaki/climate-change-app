/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AuthContext } from "./AuthContext";
import { useErrorContext } from "@/context/error";
import type { AuthContextType } from "@/features/auth/types";
import { authService } from "@/features/auth/services/authService";

// /me API 呼び出し関数
const fetchMe = async () => {
  // authService 内で /me API を呼び出す想定
  const data = await authService.fetchMe();
  return data; // { username: string, email?: string, ... }
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const { setError } = useErrorContext();
  const queryClient = useQueryClient();

  // 共通のグローバルエラー処理
  const handleGlobalError = (error: any) => {
    if (
      !error.response ||
      (error.response.status >= 500 && error.response.status < 600)
    ) {
      setError(error.message);
    }
  };

  // TanStack Query で /me を取得
  const { data: me, isLoading: meLoading } = useQuery(["me"], fetchMe, {
    retry: false,
    onError: handleGlobalError,
  });

  // me が取得できたら Context の state に反映
  useEffect(() => {
    if (me) setCurrentUsername(me.username);
  }, [me]);

  // ---- Auth Functions ----
  const login: AuthContextType["login"] = async (user) => {
    try {
      await authService.login(user);
      await queryClient.invalidateQueries(["me"]); // /me を再取得
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
      queryClient.removeQueries(["me"]); // キャッシュ削除
      setCurrentUsername(null);
      setError(null);
    } catch (e: any) {
      console.error("logout error:", e);
      handleGlobalError(e);
      throw e;
    }
  };

  const signup: AuthContextType["signup"] = async (user) => {
    try {
      await authService.signup(user);
      await queryClient.invalidateQueries(["me"]); // /me を再取得
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
        await queryClient.invalidateQueries(["me"]); // トークン更新後に最新情報取得
      } catch (e: any) {
        console.warn("refresh failed, logging out", e);
        await logout();
      }
    };

  return (
    <AuthContext.Provider
      value={{
        currentUsername,
        authLoading: meLoading,
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
