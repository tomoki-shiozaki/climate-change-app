import { apiClient } from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
} from "../types";

/**
 * ログイン
 */
export async function login(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/dj-rest-auth/login/",
    data
  );
  return response.data;
}

/**
 * ログアウト
 */
export async function logout(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>(
    "/dj-rest-auth/logout/",
    {}
  );
  return response.data;
}

/**
 * 新規登録
 */
export async function signup(data: SignupRequest): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>(
    "/dj-rest-auth/registration/",
    data
  );
  return response.data;
}
