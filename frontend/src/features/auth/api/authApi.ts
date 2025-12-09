import { apiClient } from "./apiClient";
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  SignupRequest,
  SignupResponse,
} from "../types";

/**
 * ユーザーのログイン
 */
export async function loginUser(data: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>(
    "/dj-rest-auth/login/",
    data
  );
  return response.data;
}

/**
 * ユーザーのログアウト
 */
export async function logoutUser(): Promise<LogoutResponse> {
  const response = await apiClient.post<LogoutResponse>(
    "/dj-rest-auth/logout/",
    {}
  );
  return response.data;
}

/**
 * ユーザーの新規登録
 */
export async function registerUser(
  data: SignupRequest
): Promise<SignupResponse> {
  const response = await apiClient.post<SignupResponse>(
    "/dj-rest-auth/registration/",
    data
  );
  return response.data;
}
