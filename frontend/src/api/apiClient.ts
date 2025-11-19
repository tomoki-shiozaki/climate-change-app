import axios from "axios";
import type { AxiosInstance } from "axios";
import { extractErrorMessage } from "./errorHandler";
import { refreshToken } from "../services/refreshToken";
import {
  LOCALSTORAGE_TOKEN_KEY,
  LOCALSTORAGE_USERNAME_KEY,
} from "../constants/storage";

// AxiosRequestConfig に _retry を追加（型安全用）
declare module "axios" {
  export interface AxiosRequestConfig {
    _retry?: boolean;
  }
}

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL,
  withCredentials: true, // Cookie を送信
});

// 任意：全リクエストに access token を付与
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(LOCALSTORAGE_TOKEN_KEY);
  if (token) config.headers["Authorization"] = `Bearer ${token}`;
  return config;
});

// JWT 自動更新のための response interceptor
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 401かつまだリトライしていない場合にトークン更新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Cookie に refresh token があるため body は不要
        const { access } = await refreshToken();

        // access token を更新
        localStorage.setItem(LOCALSTORAGE_TOKEN_KEY, access);
        originalRequest.headers["Authorization"] = `Bearer ${access}`;

        // 再リクエスト
        return apiClient(originalRequest);
      } catch (err) {
        console.warn(
          "トークンリフレッシュに失敗しました。ログアウト処理を実行します。"
        );
        localStorage.removeItem(LOCALSTORAGE_TOKEN_KEY);
        localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
        return Promise.reject(err);
      }
    }

    // エラーメッセージ整形
    error.message = extractErrorMessage(error);
    return Promise.reject(error);
  }
);

export default apiClient;
