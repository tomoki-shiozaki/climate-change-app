import { useState, useEffect } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Alert from "react-bootstrap/Alert";
import Spinner from "react-bootstrap/Spinner";
import { useAuthContext } from "../../context/AuthContext";
import { Loading } from "../../components/common";
import apiClient from "../../api/apiClient";
import { AxiosError } from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthContext();

  // 既にログイン済みならトップページへ
  useEffect(() => {
    const checkLogin = async () => {
      try {
        await apiClient.get("/dj-rest-auth/user/"); // ログイン済みなら 200
        navigate("/");
      } catch {
        // 未ログインなら何もしない
      }
    };
    checkLogin();
  }, [navigate]);

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
      navigate("/"); // 成功したら遷移
    } catch (err: unknown) {
      console.error(err);

      if (err instanceof AxiosError) {
        setError(err.message);
      } else {
        setError("ログインに失敗しました。入力内容を確認してください。");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="ログイン処理中..." />;
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
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
    </Container>
  );
};

export default Login;
