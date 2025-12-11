import type { paths } from "@/types/api";

export type LoginRequest =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["requestBody"]["content"]["application/json"];

export type LoginResponse =
  paths["/api/v1/dj-rest-auth/login/"]["post"]["responses"]["200"]["content"]["application/json"];

export type LogoutResponse =
  paths["/api/v1/dj-rest-auth/logout/"]["post"]["responses"]["200"]["content"]["application/json"];

export type SignupRequest =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["requestBody"]["content"]["application/json"];

export type SignupResponse =
  paths["/api/v1/dj-rest-auth/registration/"]["post"]["responses"]["201"]["content"]["application/json"];
