/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import AuthService from "../services/auth";
import type { paths } from "../types/api";
import {
  LOCALSTORAGE_TOKEN_KEY,
  LOCALSTORAGE_USERNAME_KEY,
} from "../constants/storage";

// 型の抽出
type LoginRequest =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["requestBody"]["content"]["application/json"];

type SignupRequest =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["requestBody"]["content"]["application/json"];

// AuthContext の型
interface AuthContextType {
  currentUsername: string | null;
  token: string | null;
  authLoading: boolean;
  login: (user: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  signup: (user: SignupRequest) => Promise<void>;
}

// Provider の props 型
interface AuthProviderProps {
  children: ReactNode;
}

// Context を作成（初期値は null にしてカスタムフックで安全に取得）
const AuthContext = createContext<AuthContextType | null>(null);

// Provider コンポーネント
export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentUsername, setCurrentUsername] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // 初期認証状態の復元
  useEffect(() => {
    const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    const savedToken = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);

    if (savedUsername && savedToken) {
      setCurrentUsername(savedUsername);
      setToken(savedToken);
    }

    setAuthLoading(false); // 認証判定が終わったことを通知
  }, []);

  // ログイン
  const login = async (user: LoginRequest) => {
    if (!user || !user.username || !user.password) {
      throw new Error("ユーザー名とパスワードが必要です。");
    }

    const data = await AuthService.login(user);
    const access = data.access;
    const refresh = data.refresh;

    setToken(access);
    setCurrentUsername(user.username);

    localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, access);
    localStorage.setItem("refreshToken", refresh);
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, user.username);
  };

  // ログアウト
  const logout = async () => {
    const refresh = localStorage.getItem("refreshToken");
    if (refresh) {
      await AuthService.logout(refresh); // 必要に応じて refresh を送信
    }
    setToken(null);
    setCurrentUsername(null);
    localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
    localStorage.removeItem("refreshToken");
    localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
  };

  // サインアップ
  const signup = async (user: SignupRequest) => {
    await AuthService.signup(user);
    // サインアップ後に自動ログイン
    await login({ username: user.username, password: user.password1 });
  };

  return (
    <AuthContext.Provider
      value={{ currentUsername, token, authLoading, login, logout, signup }}
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
