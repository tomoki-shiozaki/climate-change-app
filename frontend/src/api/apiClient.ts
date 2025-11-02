import axios from "axios";
import type { AxiosInstance } from "axios";
import { extractErrorMessage } from "./errorHandler";
import { refreshToken } from "../services/refreshToken";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL,
});

// JWT 自動更新のための interceptor
apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config ;

    // 401かつまだリトライしていない場合にトークン更新
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refresh = localStorage.getItem("refreshToken");
      if (!refresh) return Promise.reject(error);

      try {
        const { access } = await refreshToken({ refresh });
        localStorage.setItem("accessToken", access);
        originalRequest.headers["Authorization"] = `Bearer ${access}`;
        return apiClient(originalRequest);
      } catch {
        // 更新失敗時はログアウト処理など
      }
    }

    // エラーメッセージ整形
    error.message = extractErrorMessage(error);
    return Promise.reject(error);
  }
);

export default apiClient;
