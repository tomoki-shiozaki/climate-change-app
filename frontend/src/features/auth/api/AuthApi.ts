import { apiClient } from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
} from "../types";

class AuthApi {
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

export default new AuthApi();
