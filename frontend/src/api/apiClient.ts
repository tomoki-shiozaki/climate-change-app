import axios from "axios";
import type { AxiosInstance } from "axios";
import { extractErrorMessage } from "./errorHandler";

const baseURL: string =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const apiClient: AxiosInstance = axios.create({
  baseURL,
});

// レスポンス interceptor を追加
apiClient.interceptors.response.use(
  (response) => response, // 成功時はそのまま返す
  (error) => {
    error.message = extractErrorMessage(error); // messageだけ加工
    return Promise.reject(error); // AxiosErrorのまま投げる
  }
);

export default apiClient;
