// __tests__/apiClient.test.ts
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AxiosHeaders } from "axios";
import type { InternalAxiosRequestConfig } from "axios";
import apiClient, { addCsrfToken, handle401 } from "../apiClient";
import { refreshToken } from "../refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "@/constants/storage";
import { extractErrorMessage } from "@/lib/errors/extractErrorMessage";

// refreshToken と extractErrorMessage をモック
vi.mock("../refreshToken");
vi.mock("../../../lib/errors/extractErrorMessage");

describe("apiClient", () => {
  const mockedRefreshToken = refreshToken as unknown as ReturnType<
    typeof vi.fn
  >;

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    document.cookie = "csrftoken=test-csrf";

    // ここで Axios の adapter をモック
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
      headers: new AxiosHeaders(), // ← ここを {} ではなく AxiosHeaders にする
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

    // adapter が置き換え済みなのでネットワークは行かない
    const result = await handle401(error as any);

    expect(mockedRefreshToken).toHaveBeenCalledTimes(1);
    expect(result.data).toEqual({ success: true }); // adapter の返り値
    expect(error.config._retry).toBe(true);

    // requestSpy をチェックする必要はない
  });

  it("should remove username from localStorage if refresh fails", async () => {
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, "user1");

    const error = {
      response: { status: 401 },
      config: {},
    };

    mockedRefreshToken.mockRejectedValueOnce(new Error("fail"));

    await expect(handle401(error as any)).rejects.toThrow("fail");

    expect(localStorage.getItem(LOCALSTORAGE_USERNAME_KEY)).toBeNull();
  });

  it("should format error message for non-401 errors", async () => {
    const error = { response: { status: 500 }, config: {} };
    (extractErrorMessage as any).mockReturnValue("formatted error");

    await expect(handle401(error as any)).rejects.toEqual(
      expect.objectContaining({ message: "formatted error" })
    );

    expect(extractErrorMessage).toHaveBeenCalledWith(error);
  });
});
