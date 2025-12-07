import type { AxiosRequestConfig } from "axios";
import apiClient from "../apiClient";
import { refreshToken } from "../refreshToken";
import { LOCALSTORAGE_USERNAME_KEY } from "@/constants/storage";

// axios と refreshToken をモック
vi.mock("axios");
vi.mock("../refreshToken");

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
    let capturedConfig: AxiosRequestConfig;
    apiClient.interceptors.request.use((config) => {
      capturedConfig = config;
      return config;
    });

    await apiClient.get("/dummy"); // 実際のリクエストはモック
    expect(capturedConfig.headers["X-CSRFToken"]).toBe("test-csrf");
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

    const retryMock = vi.fn();
    // axios(originalRequest) の呼び出しをモック
    apiClient.defaults.adapter = async (config: any) => {
      retryMock();
      return { status: 200, data: { success: true } };
    };

    // 呼び出し
    await apiClient.interceptors.response.handlers[0].rejected(error);

    expect(mockedRefreshToken).toHaveBeenCalledTimes(1);
    expect(retryMock).toHaveBeenCalledTimes(1);
  });

  it("should remove username from localStorage if refresh fails", async () => {
    localStorage.setItem(LOCALSTORAGE_USERNAME_KEY, "user1");

    const error = {
      response: { status: 401 },
      config: {},
    };

    mockedRefreshToken.mockRejectedValueOnce(new Error("fail"));

    await expect(
      apiClient.interceptors.response.handlers[0].rejected(error)
    ).rejects.toThrow("fail");
    expect(localStorage.getItem(LOCALSTORAGE_USERNAME_KEY)).toBeNull();
  });
});
