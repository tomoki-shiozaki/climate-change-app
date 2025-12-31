import { useNavigate, Navigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

import {
  loginSchema,
  type LoginFormValues,
} from "@/features/auth/schemas/loginSchema";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { logError } from "@/lib/logger";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CenteredBox } from "@/components/layout";

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, currentUsername } = useAuthContext();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  // すでにログイン済みならトップページへリダイレクト
  if (currentUsername) {
    return <Navigate to="/" replace />;
  }

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await login(data);
      navigate("/"); // ログイン成功でホームへ
    } catch (err: unknown) {
      logError(err);

      if (err instanceof AxiosError) {
        setError("root", {
          message: err.message,
        });
      } else {
        setError("root", {
          message: "ログインに失敗しました。入力内容を確認してください。",
        });
      }
    }
  };

  return (
    <CenteredBox>
      <Card className="w-[360px]">
        <CardHeader>
          <CardTitle>ログイン</CardTitle>
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
              <Label htmlFor="password">パスワード</Label>
              <Input
                id="password"
                type="password"
                placeholder="パスワードを入力"
                disabled={isSubmitting}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm text-destructive">
                  {errors.password.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <div className="flex items-center justify-center gap-2">
                  <Spinner className="h-4 w-4" />
                  <span>ログイン中...</span>
                </div>
              ) : (
                "ログイン"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </CenteredBox>
  );
};

export default LoginPage;
