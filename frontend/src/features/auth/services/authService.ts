import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/features/auth/api/authApi";
import { refreshToken } from "@/features/auth/api/refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "@/features/auth/constants";

import type { LoginForm, SignupForm } from "@/features/auth/types";

export const authService = {
  // ------------------------------------------
  // LOGIN
  // ------------------------------------------
  async login(form: LoginForm) {
    // form: { username: string; password: string }
    const { username, password } = form;

    const data = await loginUser({ username, password });

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
    // form: { username, email, password1, password2 }

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

    // 失効していたら強制ログアウト
    if (!data.access) {
      localStorage.removeItem(LOCALSTORAGE_USERNAME_KEY);
      return null;
    }

    return savedUsername; // Context 側で state にセットさせる
  },

  // ------------------------------------------
  // REFRESH TOKEN
  // ------------------------------------------
  async refreshAccessToken() {
    return refreshToken();
  },
};
