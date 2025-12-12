import { renderHook, act, waitFor } from "@testing-library/react";
import { AuthProvider, useAuthContext } from "@/features/auth/context";
import { authService } from "@/features/auth/services/authService";
import type { SignupForm } from "@/features/auth/types";
import { useErrorContext } from "@/context/error";
import type { ErrorContextType } from "@/context/error/ErrorContext";

// モック作成
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

  it("should set currentUsername on auto login success", async () => {
    const mockedAuthService = vi.mocked(authService);
    mockedAuthService.tryAutoLogin.mockResolvedValue("alice");

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.currentUsername).toBe("alice");
      expect(result.current.authLoading).toBe(false);
    });
  });

  it("login should call authService.login and set username", async () => {
    const user = { username: "bob", password: "pass" };

    const mockedAuthService = vi.mocked(authService);
    mockedAuthService.login.mockResolvedValue({
      access: "dummyAccessToken",
      refresh: "dummyRefreshToken",
      user: {
        pk: 1,
        username: "bob",
        email: "bob@example.com",
      },
    });

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.login(user);
    });

    expect(mockedAuthService.login).toHaveBeenCalledWith(user);
    expect(result.current.currentUsername).toBe("bob");
    expect(setErrorMock).toHaveBeenCalledWith(null);
  });

  it("logout should call authService.logout and clear username", async () => {
    const mockedAuthService = vi.mocked(authService);
    mockedAuthService.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(mockedAuthService.logout).toHaveBeenCalled();
    expect(result.current.currentUsername).toBe(null);
    expect(setErrorMock).toHaveBeenCalledWith(null);
  });

  it("signup should call authService.signup and set username", async () => {
    const user: SignupForm = {
      username: "carol",
      email: "carol@example.com",
      password1: "pass",
      password2: "pass",
    };

    const mockedAuthService = vi.mocked(authService);
    mockedAuthService.signup.mockResolvedValue({
      access: "dummyAccessToken",
      refresh: "dummyRefreshToken",
      user: {
        pk: 1,
        username: "carol",
        email: "carol@example.com",
      },
    });

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.signup(user);
    });

    expect(mockedAuthService.signup).toHaveBeenCalledWith(user);
    expect(result.current.currentUsername).toBe("carol");
    expect(setErrorMock).toHaveBeenCalledWith(null);
  });

  it("refreshAccessToken should call authService.refreshAccessToken", async () => {
    const mockedAuthService = vi.mocked(authService);
    mockedAuthService.refreshAccessToken.mockResolvedValue({
      access: "dummyAccessToken",
      refresh: "dummyRefreshToken",
    });

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.refreshAccessToken();
    });

    expect(mockedAuthService.refreshAccessToken).toHaveBeenCalled();
  });

  it("refreshAccessToken failure should call logout", async () => {
    const mockedAuthService = vi.mocked(authService);
    mockedAuthService.refreshAccessToken.mockRejectedValue(new Error("fail"));
    mockedAuthService.logout.mockResolvedValue();

    const { result } = renderHook(() => useAuthContext(), {
      wrapper: AuthProvider,
    });

    await act(async () => {
      await result.current.refreshAccessToken();
    });

    expect(mockedAuthService.refreshAccessToken).toHaveBeenCalled();
    expect(mockedAuthService.logout).toHaveBeenCalled();
  });
});
