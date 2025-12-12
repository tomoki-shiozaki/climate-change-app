import { authService } from "@/features/auth/services/authService";

import {
  loginUser,
  logoutUser,
  registerUser,
} from "@/features/auth/api/authApi";
import { refreshToken } from "@/features/auth/api/refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "@/features/auth/constants";

// --- 依存関数をモック ---
vi.mock("@/features/auth/api/authApi", () => ({
  loginUser: vi.fn(),
  logoutUser: vi.fn(),
  registerUser: vi.fn(),
}));

vi.mock("@/features/auth/api/refreshToken", () => ({
  refreshToken: vi.fn(),
}));

// --- localStorage のモック ---
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: mockLocalStorage,
});

beforeEach(() => {
  vi.clearAllMocks();
  mockLocalStorage.clear();
});

describe("authService", () => {
  // -------------------------------------------
  // LOGIN
  // -------------------------------------------
  it("login: loginUser を呼び出し、username を localStorage に保存する", async () => {
    const mockedLoginUser = vi.mocked(loginUser);

    mockedLoginUser.mockResolvedValue({
      access: "token123",
      refresh: "refresh123",
      user: {
        pk: 1,
        username: "alice",
        email: "alice@example.com",
      },
    });

    const form = { username: "alice", password: "pw123" };
    const result = await authService.login(form);

    expect(loginUser).toHaveBeenCalledWith({
      username: "alice",
      password: "pw123",
    });

    expect(localStorage.setItem).toHaveBeenCalledWith(
      LOCALSTORAGE_USERNAME_KEY,
      "alice"
    );

    expect(result).toEqual({
      access: "token123",
      refresh: "refresh123",
      user: {
        pk: 1,
        username: "alice",
        email: "alice@example.com",
      },
    });
  });

  // -------------------------------------------
  // LOGOUT
  // -------------------------------------------
  it("logout: logoutUser を呼び出し、localStorage の username を削除する", async () => {
    await authService.logout();

    expect(logoutUser).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      LOCALSTORAGE_USERNAME_KEY
    );
  });

  // -------------------------------------------
  // SIGNUP
  // -------------------------------------------
  it("signup: registerUser → login が呼ばれる", async () => {
    const mockedRegisterUser = vi.mocked(registerUser);
    const mockedLoginUser = vi.mocked(loginUser);

    // registerUser の返り値（SignupResponse）
    mockedRegisterUser.mockResolvedValue({
      access: "signup-access-token",
      refresh: "signup-refresh-token",
      user: {
        pk: 1,
        username: "bob",
        email: "bob@example.com",
      },
    });

    // loginUser の返り値
    mockedLoginUser.mockResolvedValue({
      access: "token123",
      refresh: "refresh123",
      user: {
        pk: 1,
        username: "bob",
        email: "bob@example.com",
      },
    });

    const form = {
      username: "bob",
      email: "bob@example.com",
      password1: "pass",
      password2: "pass",
    };

    const result = await authService.signup(form);

    // registerUser に渡されたか？
    expect(registerUser).toHaveBeenCalledWith(form);

    // registerUser の後に login が呼ばれたか？
    expect(loginUser).toHaveBeenCalledWith({
      username: "bob",
      password: "pass",
    });

    // signup() の返り値は login() の返り値
    expect(result).toEqual({
      access: "token123",
      refresh: "refresh123",
      user: {
        pk: 1,
        username: "bob",
        email: "bob@example.com",
      },
    });
  });

  // -------------------------------------------
  // AUTO LOGIN
  // -------------------------------------------
  it("tryAutoLogin: localStorage に username がなければ null を返す", async () => {
    const result = await authService.tryAutoLogin();
    expect(result).toBeNull();
    expect(refreshToken).not.toHaveBeenCalled();
  });

  it("refreshToken が失敗（例外）したら強制ログアウトして null を返す", async () => {
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, "chris");

    const mockedRefreshToken = vi.mocked(refreshToken);
    mockedRefreshToken.mockRejectedValue(new Error("Token expired"));

    const result = await authService.tryAutoLogin();

    expect(refreshToken).toHaveBeenCalled();
    expect(localStorage.removeItem).toHaveBeenCalledWith(
      LOCALSTORAGE_USERNAME_KEY
    );
    expect(result).toBeNull();
  });

  it("refreshToken が成功したら username を返す", async () => {
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, "david");

    const mockedRefreshToken = vi.mocked(refreshToken);

    // RefreshResponse 型と一致させる
    mockedRefreshToken.mockResolvedValue({
      access: "valid-token",
      refresh: "dummy-refresh",
    });

    const result = await authService.tryAutoLogin();

    expect(refreshToken).toHaveBeenCalled();
    expect(result).toBe("david");
  });

  // -------------------------------------------
  // REFRESH TOKEN
  // -------------------------------------------
  it("refreshAccessToken: refreshToken をそのまま返す", async () => {
    const mockedRefreshToken = vi.mocked(refreshToken);

    // RefreshResponse 型に合わせる（必要なら refresh フィールドも）
    mockedRefreshToken.mockResolvedValue({
      access: "new-token",
      refresh: "dummy-refresh",
    });

    const result = await authService.refreshAccessToken();

    expect(refreshToken).toHaveBeenCalled();
    expect(result).toEqual({
      access: "new-token",
      refresh: "dummy-refresh",
    });
  });
});
