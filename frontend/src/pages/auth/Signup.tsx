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

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { token, signup } = useAuthContext();

  // すでにログイン済みなら /todos にリダイレクト
  useEffect(() => {
    if (token) navigate("/todos");
  }, [token, navigate]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // バリデーション: 必須チェックとパスワード一致チェック
      if (!username || !email || !password1 || !password2) {
        throw new Error("すべてのフィールドを入力してください。");
      }
      if (password1 !== password2) {
        throw new Error("パスワードが一致しません。");
      }

      await signup({ username, email, password1, password2 });

      // 成功してトークンが保存されていれば遷移
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        navigate("/todos");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err.message || "登録に失敗しました。入力内容を確認してください。"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading message="登録処理中..." />;
  }

  return (
    <Container className="mt-5" style={{ maxWidth: "500px" }}>
      <h2 className="mb-4">アカウント作成</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>ユーザー名</Form.Label>
          <Form.Control
            type="text"
            placeholder="ユーザー名を入力"
            value={username}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>メールアドレス</Form.Label>
          <Form.Control
            type="email"
            placeholder="メールアドレスを入力"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>パスワード</Form.Label>
          <Form.Control
            type="password"
            placeholder="パスワードを入力"
            value={password1}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword1(e.target.value)
            }
            required
            disabled={loading}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>パスワード（確認用）</Form.Label>
          <Form.Control
            type="password"
            placeholder="確認用パスワードを入力"
            value={password2}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword2(e.target.value)
            }
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
              登録中...
            </>
          ) : (
            "登録"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Signup;
