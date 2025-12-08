import axios from "axios";
import { refreshToken } from "../refreshToken";
import type { paths } from "@/types/api";

type RefreshResponse =
  paths["/api/v1/dj-rest-auth/token/refresh/"]["post"]["responses"]["200"]["content"]["application/json"];

vi.mock("axios"); // Axiosをモック

const mockedAxios = vi.mocked(axios, true); // ここでモック型を取得（深いモック）

describe("refreshToken", () => {
  const mockData: RefreshResponse = {
    access: "new-access-token",
    refresh: "new-refresh-token",
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should call axios.post with correct URL and return data", async () => {
    mockedAxios.post.mockResolvedValueOnce({ data: mockData });

    const result = await refreshToken();

    expect(mockedAxios.post).toHaveBeenCalledTimes(1);
    expect(mockedAxios.post).toHaveBeenCalledWith(
      expect.stringContaining("/dj-rest-auth/token/refresh/"),
      {},
      { withCredentials: true }
    );

    expect(result).toEqual(mockData);
  });

  it("should throw if axios.post rejects", async () => {
    mockedAxios.post.mockRejectedValueOnce(new Error("Network error"));

    await expect(refreshToken()).rejects.toThrow("Network error");
  });
});
