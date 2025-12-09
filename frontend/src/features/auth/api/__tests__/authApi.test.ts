import { apiClient } from "../apiClient";
import { loginUser, logoutUser, registerUser } from "../authApi";

// axios の post メソッドをモック
vi.mock("../apiClient", () => {
  return {
    apiClient: {
      post: vi.fn(),
    },
  };
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("authApi", () => {
  // ---------------------------
  // loginUser
  // ---------------------------
  it("loginUser: 正しい URL と payload で POST を呼び、レスポンスを返す", async () => {
    const mockResponse = { data: { access: "abc123", user: { id: 1 } } };

    (apiClient.post as any).mockResolvedValue(mockResponse);

    const result = await loginUser({
      username: "testuser",
      password: "pass1234",
    });

    // URL / payload が正しく渡されていること
    expect(apiClient.post).toHaveBeenCalledWith("/dj-rest-auth/login/", {
      username: "testuser",
      password: "pass1234",
    });

    // 戻り値
    expect(result).toEqual(mockResponse.data);
  });

  // ---------------------------
  // logoutUser
  // ---------------------------
  it("logoutUser: 正しい URL と空オブジェクトで POST を呼び、レスポンスを返す", async () => {
    const mockResponse = { data: { detail: "logged out" } };

    (apiClient.post as any).mockResolvedValue(mockResponse);

    const result = await logoutUser();

    expect(apiClient.post).toHaveBeenCalledWith("/dj-rest-auth/logout/", {});

    expect(result).toEqual(mockResponse.data);
  });

  // ---------------------------
  // registerUser
  // ---------------------------
  it("registerUser: 正しい URL と payload で POST を呼び、レスポンスを返す", async () => {
    const mockResponse = { data: { user: 1, access: "aaa" } };

    (apiClient.post as any).mockResolvedValue(mockResponse);

    const payload = {
      username: "user1",
      email: "test@example.com",
      password1: "pass1234",
      password2: "pass1234",
    };

    const result = await registerUser(payload);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/dj-rest-auth/registration/",
      payload
    );

    expect(result).toEqual(mockResponse.data);
  });
});
