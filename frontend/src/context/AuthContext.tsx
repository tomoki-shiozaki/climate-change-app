/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import AuthService from "../services/auth";
import { refreshToken } from "../services/refreshToken";
import type { paths } from "../types/api";
import { useErrorContext } from "./ErrorContext";
import { LOCALSTORAGE_USERNAME_KEY } from "../constants/storage";

type LoginRequest =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["requestBody"]["content"]["application/json"];
type SignupRequest =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["requestBody"]["content"]["application/json"];

interface AuthContextType {
  currentUsername: string | null;
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
  const [authLoading, setAuthLoading] = useState(true);
  const { setError } = useErrorContext();

  // ページロード時に username を確認して refresh token で自動ログイン
  useEffect(() => {
    const initAuth = async () => {
      const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
      if (savedUsername) {
        try {
          const data = await refreshToken(); // Cookie 内 refresh token で access token を再取得
          if (data.access) {
            setCurrentUsername(savedUsername);
          } else {
            localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
          }
        } catch (err) {
          console.warn("自動ログインに失敗しました。", err);
          localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
        }
      }
      setAuthLoading(false);
    };

    initAuth();
  }, []);

  const login = async (user: LoginRequest) => {
    if (!user?.username || !user?.password) {
      throw new Error("ユーザー名とパスワードが必要です。");
    }

    try {
      const data = await AuthService.login(user);
      if (!data.access)
        throw new Error("サーバーから access token が返されませんでした。");

      setCurrentUsername(user.username);
      localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, user.username);
      setError(null);
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
      setCurrentUsername(null);
      localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
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

  const refreshAccessToken = async () => {
    try {
      const data = await refreshToken();
      if (!data.access) throw new Error("Access token の更新に失敗しました。");
      // メモリに token を持たないので何もセットしない
    } catch (e: any) {
      console.warn("Access token refresh failed. Logging out.", e);
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

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuthContext must be used within an AuthProvider");
  return context;
};
