import type { paths } from "@/types/api";

/** ログイン関連 */
export type LoginRequest =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["requestBody"]["content"]["application/json"];

export type LoginResponse =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["responses"]["200"]["content"]["application/json"];

/** ログアウト関連 */
export type LogoutResponse =
  paths["/api/v1/dj-rest-auth/logout/"]["post"]["responses"]["200"]["content"]["application/json"];

/** サインアップ関連 */
export type SignupRequest =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["requestBody"]["content"]["application/json"];

export type SignupResponse =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["responses"]["201"]["content"]["application/json"];

/** 現在ログイン中のユーザー情報 (/me 相当) */
export type MeResponse =
  paths["/api/v1/dj-rest-auth/user/"]["get"]["responses"]["200"]["content"]["application/json"];
