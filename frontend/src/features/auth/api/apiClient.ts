import axios from "axios";
import type {
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";
import { extractErrorMessage } from "../../../lib/errors/extractErrorMessage";
import { refreshToken } from "./refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "../constants";

// AxiosRequestConfig に _retry を追加（型安全用）
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Cookie を送信
});

// --- interceptor 関数を切り出し ---
// CSRF トークンをヘッダに追加
export const addCsrfToken = (config: InternalAxiosRequestConfig) => {
  // Cookie から csrftoken を取得
  const csrfToken = document.cookie
    .split("; ")
    .find((row) => row.startsWith("csrftoken="))
    ?.split("=")[1];

  // CSRF トークンをヘッダに追加
  if (csrfToken) {
    config.headers = config.headers || {};
    config.headers["X-CSRFToken"] = csrfToken;
  }
  return config;
};

// 401 時に refresh token を使って再リクエスト
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handle401 = async (error: AxiosError | any) => {
  const originalRequest = error.config;

  if (error.response?.status === 401 && !originalRequest._retry) {
    originalRequest._retry = true;

    try {
      // refreshToken() が新しい access token を返す場合
      await refreshToken();
      // 再リクエスト
      return apiClient(originalRequest);
    } catch (err) {
      console.warn("トークンリフレッシュに失敗しました。");
      localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
      return Promise.reject(err);
    }
  }

  // エラーメッセージ整形
  error.message = extractErrorMessage(error);
  return Promise.reject(error);
};

// --- interceptor 登録 ---
apiClient.interceptors.request.use(addCsrfToken);
apiClient.interceptors.response.use((res) => res, handle401);
