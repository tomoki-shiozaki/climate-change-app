import { z } from "zod";

export const signupSchema = z
  .object({
    username: z.string().min(1, "ユーザー名を入力してください"),
    email: z.email("有効なメールアドレスを入力してください"),
    password1: z.string().min(6, "パスワードは6文字以上です"),
    password2: z.string().min(6, "パスワードは6文字以上です"),
  })
  .refine((data) => data.password1 === data.password2, {
    message: "パスワードが一致しません",
    path: ["password2"],
  });

export type SignupFormValues = z.infer<typeof signupSchema>;
