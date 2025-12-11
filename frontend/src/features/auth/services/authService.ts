import {
  loginUser,
  logoutUser,
  registerUser,
  fetchMeApi, // /me API 呼び出し関数
} from "@/features/auth/api/authApi";
import { refreshToken } from "@/features/auth/api/refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "@/features/auth/constants";

import type { LoginForm, SignupForm, MeResponse } from "@/features/auth/types";

export const authService = {
  // ------------------------------------------
  // LOGIN
  // ------------------------------------------
  async login(form: LoginForm) {
    const { username, password } = form;
    const data = await loginUser({ username, password });

    // Cookie JWT を使う場合は localStorage はユーザー名だけ管理
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, username);

    return data;
  },

  // ------------------------------------------
  // LOGOUT
  // ------------------------------------------
  async logout() {
    await logoutUser();
    localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
  },

  // ------------------------------------------
  // SIGNUP
  // ------------------------------------------
  async signup(form: SignupForm) {
    await registerUser(form);

    // 登録後、自動ログイン（Django Rest Auth の一般的パターン）
    return this.login({
      username: form.username,
      password: form.password1,
    });
  },

  // ------------------------------------------
  // AUTO LOGIN
  // ------------------------------------------
  async tryAutoLogin() {
    const savedUsername = localStorage.getItem(LOCALSTORAGE_USERNAME_KEY);
    if (!savedUsername) return null;

    const data = await refreshToken();

    if (!data.access) {
      localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
      return null;
    }

    return savedUsername;
  },

  // ------------------------------------------
  // REFRESH TOKEN
  // ------------------------------------------
  async refreshAccessToken() {
    return refreshToken();
  },

  // ------------------------------------------
  // FETCH ME
  // ------------------------------------------
  async fetchMe(): Promise<MeResponse> {
    const data = await fetchMeApi();
    return data; // { username: string, email?: string, ... }
  },
};
