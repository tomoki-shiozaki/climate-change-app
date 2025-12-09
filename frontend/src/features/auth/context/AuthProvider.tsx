/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "./AuthContext";
import { loginUser, logoutUser, registerUser } from "../api/authApi";
import { refreshToken } from "../api/refreshToken";
import { useErrorContext } from "@/context/error";
import type { AuthContextType } from "@/features/auth/types";
import { LOCALSTORAGE_USERNAME_KEY } from "../constants";

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

  // ページロード時の自動ログイン処理
  useEffect(() => {
    const initAuth = async () => {
      const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
      if (savedUsername) {
        try {
          const data = await refreshToken();
          if (data.access) {
            setCurrentUsername(savedUsername);
          } else {
            localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
          }
        } catch (err) {
          console.warn("自動ログインに失敗しました:", err);
          localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
        }
      }
      setAuthLoading(false);
    };

    void initAuth();
  }, []);

  // ---- Auth Functions ----

  const login: AuthContextType["login"] = async (user) => {
    if (!user?.username || !user?.password) {
      throw new Error("ユーザー名とパスワードが必要です。");
    }

    try {
      const data = await loginUser(user);
      if (!data.access) {
        throw new Error("サーバーから access token が返されませんでした。");
      }

      setCurrentUsername(user.username);
      localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, user.username);
      setError(null);
    } catch (e: any) {
      console.error("login error:", e);
      handleGlobalError(e);
      throw e;
    }
  };

  const logout: AuthContextType["logout"] = async () => {
    try {
      await logoutUser();
      setError(null);
    } catch (e: any) {
      console.error("logout error:", e);
      handleGlobalError(e);
      throw e;
    } finally {
      setCurrentUsername(null);
      localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
    }
  };

  const signup: AuthContextType["signup"] = async (user) => {
    if (!user.username || !user.email || !user.password1 || !user.password2) {
      throw new Error("すべてのフィールドを入力してください。");
    }

    try {
      await registerUser(user);
      await login({ username: user.username, password: user.password1 });
    } catch (e: any) {
      console.error("signup error:", e);
      handleGlobalError(e);
      throw e;
    }
  };

  const refreshAccessToken: AuthContextType["refreshAccessToken"] =
    async () => {
      try {
        const data = await refreshToken();
        if (!data.access) {
          throw new Error("Access token の更新に失敗しました。");
        }
      } catch (e: any) {
        console.warn("Access token refresh failed. Logging out.", e);
        await logout();
      }
    };

  // ---- Provider ----

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
