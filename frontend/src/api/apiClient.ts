import axios from "axios";
import type { AxiosInstance } from "axios";
import { extractErrorMessage } from "../lib/errors/errorHandler";
import { refreshToken } from "../services/refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "../constants/storage";

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

// response interceptor: 401 時に refresh token を使って再リクエスト
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
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
  }
);

export default apiClient;
