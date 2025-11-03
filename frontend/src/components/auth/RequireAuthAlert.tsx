import Container from "react-bootstrap/Container";
import Alert from "react-bootstrap/Alert";
import { Link } from "react-router-dom";

export default function RequireAuthAlert() {
  return (
    <Container className="mt-4" style={{ maxWidth: "600px" }}>
      <Alert variant="warning">
        認証情報がありません。
        <Alert.Link as={Link} to="/login">
          ログインページへ
        </Alert.Link>
        。
      </Alert>
    </Container>
  );
}
