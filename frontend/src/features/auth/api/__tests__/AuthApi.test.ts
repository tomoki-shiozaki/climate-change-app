import { authApi } from "../AuthApi";
import { apiClient } from "../apiClient";

// apiClient.post をモック可能にする
vi.mock("./apiClient", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("authApi", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("login() が正しい URL・data・withCredentials を使って POST する", async () => {
    const mockResponse = {
      data: { access: "token123", user: { id: 1, username: "test" } },
    };

    (apiClient.post as any).mockResolvedValue(mockResponse);

    const result = await authApi.login({
      email: "a@example.com",
      password: "pass",
    });

    // 呼び出し確認
    expect(apiClient.post).toHaveBeenCalledWith(
      "/dj-rest-auth/login/",
      { email: "a@example.com", password: "pass" },
      { withCredentials: true }
    );

    // 戻り値が response.data
    expect(result).toEqual(mockResponse.data);
  });

  it("logout() が正しく POST する", async () => {
    const mockResponse = { data: { detail: "Logged out" } };
    (apiClient.post as any).mockResolvedValue(mockResponse);

    const result = await authApi.logout();

    expect(apiClient.post).toHaveBeenCalledWith(
      "/dj-rest-auth/logout/",
      {},
      { withCredentials: true }
    );
    expect(result).toEqual(mockResponse.data);
  });

  it("signup() が正しいデータで POST する", async () => {
    const signupData = {
      username: "testuser",
      email: "a@example.com",
      password1: "aaa",
      password2: "aaa",
    };

    const mockResponse = {
      data: { user: { id: 1, email: "a@example.com" } },
    };
    (apiClient.post as any).mockResolvedValue(mockResponse);

    const result = await authApi.signup(signupData);

    expect(apiClient.post).toHaveBeenCalledWith(
      "/dj-rest-auth/registration/",
      signupData,
      { withCredentials: true }
    );

    expect(result).toEqual(mockResponse.data);
  });
});
