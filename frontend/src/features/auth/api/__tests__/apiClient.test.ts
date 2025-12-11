/* eslint-disable @typescript-eslint/no-explicit-any */
import { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import { apiClient, addCsrfToken, handle401 } from "../apiClient";
import { refreshToken } from "../refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "@/features/auth/constants";
import { extractErrorMessage } from "@/lib/errors/extractErrorMessage";

// refreshToken と extractErrorMessage をモック
vi.mock("../refreshToken", () => ({
  __esModule: true,
  refreshToken: vi.fn(),
}));
vi.mock("@/lib/errors/extractErrorMessage", () => ({
  __esModule: true,
  extractErrorMessage: vi.fn(),
}));

describe("apiClient", () => {
  // vi.mocked を使うと型安全にモックを扱える
  const mockedExtractErrorMessage = vi.mocked(extractErrorMessage);
  const mockedRefreshToken = vi.mocked(refreshToken);

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.cookie = "csrftoken=test-csrf";

    // Axios の adapter を置き換えてネットワークに行かないようにする
    apiClient.defaults.adapter = async (config) => {
      return {
        status: 200,
        statusText: "OK",
        headers: {},
        config,
        data: { success: true },
      };
    };
  });

  it("should add CSRF token header in request interceptor", async () => {
    const config: InternalAxiosRequestConfig = await addCsrfToken({
      headers: new AxiosHeaders(),
    });

    expect(config.headers?.["X-CSRFToken"]).toBe("test-csrf");
  });

  it("should call refreshToken and retry request on 401", async () => {
    const error = {
      response: { status: 401 },
      config: { _retry: false } as any,
    };

    mockedRefreshToken.mockResolvedValueOnce({
      access: "new-access-token",
      refresh: "new-refresh-token",
    });

    const result = await handle401(error as any);

    expect(mockedRefreshToken).toHaveBeenCalledTimes(1);
    expect(result.data).toEqual({ success: true }); // adapter の返り値
    expect(error.config._retry).toBe(true);
  });

  it("should remove username from localStorage if refresh fails", async () => {
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, "user1");

    const error = {
      response: { status: 401 },
      config: {} as any,
    };

    mockedRefreshToken.mockRejectedValueOnce(new Error("fail"));

    await expect(handle401(error as any)).rejects.toThrow("fail");

    expect(localStorage.getItem(LOCALSTORAGE_USERNAME_KEY)).toBeNull();
  });

  it("should format error message for non-401 errors", async () => {
    const error = { response: { status: 500 }, config: {} as any };
    mockedExtractErrorMessage.mockReturnValue("formatted error");

    await expect(handle401(error as any)).rejects.toEqual(
      expect.objectContaining({ message: "formatted error" })
    );

    expect(mockedExtractErrorMessage).toHaveBeenCalledWith(error);
  });

  it("should not retry if _retry is already true", async () => {
    const error = {
      response: { status: 401 },
      config: { _retry: true } as any,
    };

    mockedRefreshToken.mockResolvedValueOnce({
      access: "dummy-access",
      refresh: "dummy-refresh",
    }); // 呼ばれないはず
    mockedExtractErrorMessage.mockReturnValue("already retried");

    await expect(handle401(error as any)).rejects.toEqual(
      expect.objectContaining({ message: "already retried" })
    );

    expect(mockedRefreshToken).not.toHaveBeenCalled();
  });
});
