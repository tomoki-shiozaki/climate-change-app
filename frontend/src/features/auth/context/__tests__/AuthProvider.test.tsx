import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuthContext } from "@/features/auth/context";
import { authService } from "@/features/auth/services/authService";
import type { SignupForm } from "@/features/auth/types";
import { useErrorContext } from "@/context/error";
import type { ErrorContextType } from "@/context/error/ErrorContext";
import { AxiosError } from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";

// ----------- モック設定 ---------------
vi.mock("@/features/auth/services/authService", () => ({
  authService: {
    tryAutoLogin: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
    signup: vi.fn(),
    refreshAccessToken: vi.fn(),
  },
}));

vi.mock("@/context/error", () => ({
  useErrorContext: vi.fn(),
}));

describe("AuthProvider (renderHook)", () => {
  const mockedAuthService = vi.mocked(authService);
  const mockedUseErrorContext = vi.mocked(useErrorContext);

  const setErrorMock: ErrorContextType["setError"] = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockedUseErrorContext.mockReturnValue({
      error: null,
      setError: setErrorMock,
      clearError: vi.fn(),
    });
  });

  const renderAuth = () =>
    renderHook(() => useAuthContext(), { wrapper: AuthProvider });

  // ----------- AxiosError 正式生成関数 -----------
  const makeAxiosError = (message: string, status?: number) => {
    // Dummy config（headers が必要）
    const dummyConfig: InternalAxiosRequestConfig = {
      headers: {},
    } as InternalAxiosRequestConfig;

    // Dummy response（AxiosResponse の required fields を満たす）
    const dummyResponse: AxiosResponse = {
      status: status ?? 0,
      data: null,
      statusText: "",
      headers: {},
      config: dummyConfig,
    };

    return new AxiosError(
      message,
      undefined,
      dummyConfig,
      undefined,
      status !== undefined ? dummyResponse : undefined
    );
  };

  // ---------- テスト本体 --------------
  it("auto login sets currentUsername", async () => {
    mockedAuthService.tryAutoLogin.mockResolvedValue("alice");

    const { result } = renderAuth();

    await waitFor(() => {
      expect(result.current.currentUsername).toBe("alice");
      expect(result.current.authLoading).toBe(false);
    });
  });

  it("login sets username", async () => {
    const user = { username: "bob", password: "pass" };

    mockedAuthService.login.mockResolvedValue({
      access: "dummyAccessToken",
      refresh: "dummyRefreshToken",
      user: {
        pk: 1,
        username: "bob",
        email: "bob@example.com",
      },
    });

    const { result } = renderAuth();

    await act(async () => {
      await result.current.login(user);
    });

    expect(mockedAuthService.login).toHaveBeenCalledWith(user);
    expect(result.current.currentUsername).toBe("bob");
    expect(setErrorMock).toHaveBeenCalledWith(null);
  });

  it("logout clears username", async () => {
    mockedAuthService.logout.mockResolvedValue();

    const { result } = renderAuth();

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedAuthService.logout).toHaveBeenCalled();
    expect(result.current.currentUsername).toBe(null);
    expect(setErrorMock).toHaveBeenCalledWith(null);
  });

  it("signup sets username", async () => {
    const user: SignupForm = {
      username: "carol",
      email: "carol@example.com",
      password1: "pass",
      password2: "pass",
    };

    mockedAuthService.signup.mockResolvedValue({
      access: "dummyAccessToken",
      refresh: "dummyRefreshToken",
      user: { pk: 1, username: "carol", email: "carol@example.com" },
    });

    const { result } = renderAuth();

    await act(async () => {
      await result.current.signup(user);
    });

    expect(mockedAuthService.signup).toHaveBeenCalledWith(user);
    expect(result.current.currentUsername).toBe("carol");
    expect(setErrorMock).toHaveBeenCalledWith(null);
  });

  it("refreshAccessToken calls service", async () => {
    mockedAuthService.refreshAccessToken.mockResolvedValue({
      access: "dummyAccessToken",
      refresh: "dummyRefreshToken",
    });

    const { result } = renderAuth();

    await act(async () => {
      await result.current.refreshAccessToken();
    });

    expect(mockedAuthService.refreshAccessToken).toHaveBeenCalled();
  });

  it("refreshAccessToken failure triggers logout", async () => {
    mockedAuthService.refreshAccessToken.mockRejectedValue(new Error("fail"));
    mockedAuthService.logout.mockResolvedValue();

    const { result } = renderAuth();

    await act(async () => {
      await result.current.refreshAccessToken();
    });

    expect(mockedAuthService.refreshAccessToken).toHaveBeenCalled();
    expect(mockedAuthService.logout).toHaveBeenCalled();
  });

  // --- Error cases -----
  it("login failure (AxiosError, no response)", async () => {
    mockedAuthService.login.mockRejectedValue(makeAxiosError("network error"));

    const { result } = renderAuth();

    await act(async () => {
      await expect(
        result.current.login({ username: "bob", password: "x" })
      ).rejects.toThrow();
    });

    expect(setErrorMock).toHaveBeenCalledWith("network error");
  });

  it("login failure (AxiosError, 500)", async () => {
    mockedAuthService.login.mockRejectedValue(
      makeAxiosError("server error", 500)
    );

    const { result } = renderAuth();

    await act(async () => {
      await expect(
        result.current.login({ username: "bob", password: "x" })
      ).rejects.toThrow();
    });

    expect(setErrorMock).toHaveBeenCalledWith("server error");
  });

  it("login failure (AxiosError, 400) does NOT set global error", async () => {
    mockedAuthService.login.mockRejectedValue(
      makeAxiosError("bad request", 400)
    );

    const { result } = renderAuth();

    await act(async () => {
      try {
        await result.current.login({ username: "bob", password: "x" });
      } catch {
        // 失敗を期待しているので何もしない
      }
    });

    expect(setErrorMock).not.toHaveBeenCalled();
  });
});
