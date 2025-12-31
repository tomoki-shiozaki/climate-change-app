import { signupSchema } from "@/features/auth/schemas/signupSchema";

describe("signupSchema", () => {
  it("正しい値なら通る", () => {
    expect(() =>
      signupSchema.parse({
        username: "testuser",
        email: "testuser@example.com",
        password1: "123456",
        password2: "123456",
      })
    ).not.toThrow();
  });

  it("パスワードが一致しない場合はエラー", () => {
    expect(() =>
      signupSchema.parse({
        username: "testuser",
        email: "testuser@example.com",
        password1: "123456",
        password2: "654321",
      })
    ).toThrow(/パスワードが一致しません/);
  });

  it("email形式が不正ならエラー", () => {
    expect(() =>
      signupSchema.parse({
        username: "testuser",
        email: "invalid-email",
        password1: "123456",
        password2: "123456",
      })
    ).toThrow(/有効なメールアドレス/);
  });

  it("passwordが短い場合はエラー", () => {
    expect(() =>
      signupSchema.parse({
        username: "testuser",
        email: "testuser@example.com",
        password1: "123",
        password2: "123",
      })
    ).toThrow(/パスワードは6文字以上です/);
  });

  it("usernameが空の場合はエラー", () => {
    expect(() =>
      signupSchema.parse({
        username: "",
        email: "testuser@example.com",
        password1: "123456",
        password2: "123456",
      })
    ).toThrow(/ユーザー名を入力してください/);
  });
});
