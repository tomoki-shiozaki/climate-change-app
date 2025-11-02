import apiClient from "../api/apiClient";
import type { paths } from "../types/api";

// 型の抽出
type LoginRequest =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["requestBody"]["content"]["application/json"];

type LoginResponse =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["responses"]["200"]["content"]["application/json"];

type RefreshRequest =
  paths["/api/v1/dj-rest-auth/token/refresh/"]["post"]["requestBody"]["content"]["application/json"];
type RefreshResponse =
  paths["/api/v1/dj-rest-auth/token/refresh/"]["post"]["responses"]["200"]["content"]["application/json"];

class AuthService {
  // ログイン
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/dj-rest-auth/login/",
      data
    );
    return response.data; // { access, refresh }
  }

  // リフレッシュ
  async refreshToken(data: RefreshRequest): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>(
      "/dj-rest-auth/token/refresh/",
      data
    );
    return response.data; // { access }
  }

  // ログアウト（サーバー側でリフレッシュを無効化したい場合）
  async logout(): Promise<void> {
    await apiClient.post("/dj-rest-auth/logout/");
  }
}

export default new AuthService();
