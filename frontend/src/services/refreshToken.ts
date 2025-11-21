import axios from "axios";
import type { paths } from "../types/api";

type RefreshResponse =
  paths["/api/v1/dj-rest-auth/token/refresh/"]["post"]["responses"]["200"]["content"]["application/json"];

// API の base URL
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

/**
 * Refresh token による access token 更新
 * Cookie に refresh token が格納されている場合、body は不要
 */
export const refreshToken = async (): Promise<RefreshResponse> => {
  const response = await axios.post<RefreshResponse>(
    `${baseURL}/dj-rest-auth/token/refresh/`,
    {}, // body は空
    {
      withCredentials: true, // Cookie を送信
    }
  );
  return response.data;
};
