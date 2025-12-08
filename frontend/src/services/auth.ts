import apiClient from "../features/auth/api/apiClient";
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
    // withCredentials:true で Cookie を自動送信
    const response = await apiClient.post<LoginResponse>(
      "/dj-rest-auth/login/",
      data,
      { withCredentials: true }
    );
    return response.data; // { access, user }
  }

  // ログアウト
  async logout(): Promise<LogoutResponse> {
    // withCredentials:true でサーバの Cookie を送る
    const response = await apiClient.post<LogoutResponse>(
      "/dj-rest-auth/logout/",
      {},
      { withCredentials: true }
    );
    return response.data;
  }

  // 新規登録
  async signup(data: SignupRequest): Promise<SignupResponse> {
    const response = await apiClient.post<SignupResponse>(
      "/dj-rest-auth/registration/",
      data,
      { withCredentials: true }
    );
    return response.data;
  }
}

export default new AuthService();
