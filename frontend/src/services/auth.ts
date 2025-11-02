import apiClient from "../api/apiClient";
import type { paths } from "../types/api";

// 型の抽出
type LoginRequest =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["requestBody"]["content"]["application/json"];

type LoginResponse =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["responses"]["200"]["content"]["application/json"];

type LogoutResponse =
  paths["/api/v1/dj-rest-auth/logout/"]["post"]["responses"]["200"]["content"]["application/json"];

type SignupRequest =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["requestBody"]["content"]["application/json"];

type SignupResponse =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["responses"]["201"]["content"]["application/json"];

class AuthService {
  // ログイン
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/dj-rest-auth/login/",
      data
    );
    return response.data; // { access, refresh }
  }

  // ログアウト
  async logout(accessToken: string): Promise<LogoutResponse> {
    const response = await apiClient.post<LogoutResponse>(
      "/dj-rest-auth/logout/",
      {},
      {
        headers: {
          Authorization: accessToken ? `Bearer ${accessToken}` : "",
        },
      }
    );
    return response.data;
  }

  // 新規登録
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<SignupResponse>(
      "/dj-rest-auth/registration/",
      data
    );
    return response.data;
  }
}

export default new AuthService();
