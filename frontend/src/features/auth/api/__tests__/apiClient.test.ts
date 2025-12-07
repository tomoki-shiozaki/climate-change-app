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
      config: {},
    };

    mockedRefreshToken.mockResolvedValueOnce({
      access: "new-access-token",
      refresh: "new-refresh-token",
    });

    // apiClient.request の呼び出しを spy
    const requestSpy = vi
      .spyOn(apiClient, "request")
      .mockResolvedValue({ data: "ok" });

    const result = await handle401(error as any);

    expect(mockedRefreshToken).toHaveBeenCalledTimes(1);
    expect(requestSpy).toHaveBeenCalled();
    expect(result.data).toBe("ok");

    // _retry が true にセットされていること
    expect(error.config._retry).toBe(true);
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
