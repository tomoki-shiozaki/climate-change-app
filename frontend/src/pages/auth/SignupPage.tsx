import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import {
  signupSchema,
  type SignupFormValues,
} from "@/features/auth/schemas/signupSchema";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { logError } from "@/lib/logger";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CenteredBox } from "@/components/layout";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup, currentUsername } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  // すでにログイン済みならトップページへリダイレクト
  if (currentUsername) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: SignupFormValues) => {
    try {
      await signup(data);
      navigate("/"); // 登録成功後にホームへ
    } catch (err: unknown) {
      logError(err);

      if (err instanceof AxiosError) {
        setError("root", { message: err.message });
      } else {
        setError("root", {
          message: "登録に失敗しました。入力内容を確認してください。",
        });
      }
    }
  };

  return (
    <CenteredBox>
      <Card className="w-[360px]">
        <CardHeader>
          <CardTitle>アカウント作成</CardTitle>
        </CardHeader>

        <CardContent>
          {errors.root && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{errors.root.message}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="username">ユーザー名</Label>
              <Input
                id="username"
                placeholder="ユーザー名を入力"
                disabled={isSubmitting}
                {...register("username")}
              />
              {errors.username && (
                <p className="text-sm text-destructive">
                  {errors.username.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="メールアドレスを入力"
                disabled={isSubmitting}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm text-destructive">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password1">パスワード</Label>
              <Input
                id="password1"
                type="password"
                placeholder="パスワードを入力"
                disabled={isSubmitting}
                {...register("password1")}
              />
              {errors.password1 && (
                <p className="text-sm text-destructive">
                  {errors.password1.message}
                </p>
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password2">パスワード（確認用）</Label>
              <Input
                id="password2"
                type="password"
                placeholder="確認用パスワードを入力"
                disabled={isSubmitting}
                {...register("password2")}
              />
              {errors.password2 && (
                <p className="text-sm text-destructive">
                  {errors.password2.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span>登録中...</span>
                </div>
              ) : (
                "登録"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </CenteredBox>
  );
};

export default SignupPage;
