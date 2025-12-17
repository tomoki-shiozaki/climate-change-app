import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { AxiosError } from "axios";
import { logError } from "@/lib/logger";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, currentUsername } = useAuthContext();

  // すでにログイン済みならトップページへリダイレクト
  if (currentUsername) {
    return <Navigate to="/" replace />;
  }

  const onChangeUsername = (e: ChangeEvent<HTMLInputElement>) =>
    setUsername(e.target.value);

  const onChangePassword = (e: ChangeEvent<HTMLInputElement>) =>
    setPassword(e.target.value);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login({ username, password });
      navigate("/"); // ログイン成功でトップへ
    } catch (err: unknown) {
      logError(err);

      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("ログインに失敗しました。入力内容を確認してください。");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 mx-auto" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">ログイン</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>ユーザー名</Form.Label>
          <Form.Control
            type="text"
            placeholder="ユーザー名を入力"
            value={username}
            onChange={onChangeUsername}
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>パスワード</Form.Label>
          <Form.Control
            type="password"
            placeholder="パスワードを入力"
            value={password}
            onChange={onChangePassword}
            required
            disabled={loading}
          />
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          className="w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              ログイン中...
            </>
          ) : (
            "ログイン"
          )}
        </Button>
      </Form>
    </div>
  );
};

export default LoginPage;
