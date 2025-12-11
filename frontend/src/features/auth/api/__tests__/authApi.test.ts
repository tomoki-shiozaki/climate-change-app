import { apiClient } from "../apiClient";
import { loginUser, logoutUser, registerUser } from "../authApi";

// apiClient の post をモック
vi.mock("../apiClient", () => ({
  apiClient: {
    post: vi.fn(),
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authApi", () => {
  const mockedPost = vi.mocked(apiClient.post);

  // ---------------------------
  // loginUser
  // ---------------------------
  it("loginUser: 正しい URL と payload で POST を呼び、レスポンスを返す", async () => {
    const mockResponse = { data: { access: "abc123", user: { id: 1 } } };
    mockedPost.mockResolvedValue(mockResponse);

    const payload = {
      username: "testuser",
      password: "pass1234",
    };

    const result = await loginUser(payload);

    expect(mockedPost).toHaveBeenCalledOnce();
    expect(mockedPost).toHaveBeenCalledWith("/dj-rest-auth/login/", payload);
    expect(result).toEqual(mockResponse.data);
  });

  // ---------------------------
  // logoutUser
  // ---------------------------
  it("logoutUser: 正しい URL と空オブジェクトで POST を呼び、レスポンスを返す", async () => {
    const mockResponse = { data: { detail: "logged out" } };
    mockedPost.mockResolvedValue(mockResponse);

    const result = await logoutUser();

    expect(mockedPost).toHaveBeenCalledOnce();
    expect(mockedPost).toHaveBeenCalledWith("/dj-rest-auth/logout/", {});
    expect(result).toEqual(mockResponse.data);
  });

  // ---------------------------
  // registerUser
  // ---------------------------
  it("registerUser: 正しい URL と payload で POST を呼び、レスポンスを返す", async () => {
    const mockResponse = { data: { user: 1, access: "aaa" } };
    mockedPost.mockResolvedValue(mockResponse);

    const payload = {
      username: "user1",
      email: "test@example.com",
      password1: "pass1234",
      password2: "pass1234",
    };

    const result = await registerUser(payload);

    expect(mockedPost).toHaveBeenCalledOnce();
    expect(mockedPost).toHaveBeenCalledWith(
      "/dj-rest-auth/registration/",
      payload
    );
    expect(result).toEqual(mockResponse.data);
  });
});
