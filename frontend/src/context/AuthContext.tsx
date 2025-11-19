/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import AuthService from "../services/auth";
import { refreshToken } from "../services/refreshToken";
import type { paths } from "../types/api";
import { useErrorContext } from "./ErrorContext";

// 型定義
type LoginRequest =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["requestBody"]["content"]["application/json"];
type SignupRequest =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["requestBody"]["content"]["application/json"];

interface AuthContextType {
  currentUsername: string | null;
  token: string | null;
  authLoading: boolean;
  login: (user: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: SignupRequest) => Promise<void>;
  refreshAccessToken: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { setError } = useErrorContext();

  // 認証情報の初期化（必要ならユーザー情報を取得）
  useEffect(() => {
    setAuthLoading(false);
  }, []);

  const login = async (user: LoginRequest) => {
    if (!user?.username || !user?.password) {
      throw new Error("ユーザー名とパスワードが必要です。");
    }

    try {
      const data = await AuthService.login(user);
      const { access } = data;
      if (!access)
        throw new Error("サーバーから access token が返されませんでした。");

      setToken(access);
      setCurrentUsername(user.username);
      setError(null); // 成功したのでグローバルエラーはクリア
    } catch (e: any) {
      console.error("login error:", e);
      if (
        !e.response ||
        (e.response.status >= 500 && e.response.status < 600)
      ) {
        setError(e.message);
      }
      throw e;
    }
  };

  const logout = async () => {
    try {
      await AuthService.logout();
      setError(null);
    } catch (e: any) {
      console.error("logout error:", e);
      if (
        !e.response ||
        (e.response.status >= 500 && e.response.status < 600)
      ) {
        setError(e.message);
      }
      throw e;
    } finally {
      setToken(null);
      setCurrentUsername(null);
    }
  };

  const signup = async (user: SignupRequest) => {
    if (!user.username || !user.email || !user.password1 || !user.password2) {
      throw new Error("すべてのフィールドを入力してください。");
    }

    try {
      await AuthService.signup(user);
      await login({ username: user.username, password: user.password1 });
    } catch (e: any) {
      console.error("signup error:", e);
      if (
        !e.response ||
        (e.response.status >= 500 && e.response.status < 600)
      ) {
        setError(e.message);
      }
      throw e;
    }
  };

  /**
   * Access token を refresh して更新
   */
  const refreshAccessToken = async () => {
    try {
      const data = await refreshToken(); // Cookie 内 refresh token を利用
      if (!data.access) throw new Error("Access token の更新に失敗しました。");
      setToken(data.access);
    } catch (e: any) {
      console.warn("Access token refresh failed. Logging out.", e);
      await logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUsername,
        token,
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

// カスタムフック
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};
