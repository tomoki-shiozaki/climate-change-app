import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/useAuthContext";

// メインリンクの配列
const mainLinks = [
  { to: "/", label: "ホーム" },
  { to: "/dashboard", label: "気温データ" },
  { to: "/co2-map", label: "CO₂排出量" },
  { to: "/renewable", label: "再エネ利用" },
];

// ドロップダウンリンクの配列
const dropdownLinks = [
  { to: "/data", label: "データ" },
  { to: "/about", label: "概要" },
  { to: "/faq", label: "FAQ" },
];

type AuthNavProps = {
  currentUsername: string | null;
  logout: () => void;
};

const AuthNav: React.FC<AuthNavProps> = ({ currentUsername, logout }) => {
  if (currentUsername) {
    return (
      <>
        <span className="text-light small">{currentUsername} さん</span>
        <Button variant="outline-light" size="sm" onClick={logout}>
          ログアウト
        </Button>
      </>
    );
  } else {
    return (
      <>
        <Nav.Link as={Link} to="/login" eventKey="/login">
          ログイン
        </Nav.Link>
        <Nav.Link as={Link} to="/signup" eventKey="/signup">
          新規登録
        </Nav.Link>
      </>
    );
  }
};

export const AppNavbar = () => {
  const location = useLocation();
  const { currentUsername, logout } = useAuthContext();

  return (
    <Navbar bg="primary" variant="dark" expand="md">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          気候変動データアプリ
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          {/* 左側：メインリンク */}
          {/* 単独リンク：主要機能 */}
          <Nav
            className="me-auto align-items-center"
            variant="pills"
            activeKey={location.pathname}
          >
            {mainLinks.map((link) => (
              <Nav.Item key={link.to}>
                <Nav.Link as={Link} to={link.to} eventKey={link.to}>
                  {link.label}
                </Nav.Link>
              </Nav.Item>
            ))}
            {/* 補助情報は折りたたみメニュー */}
            {/* ドロップダウン */}
            <NavDropdown title="データ・概要" id="nav-dropdown">
              {dropdownLinks.map((link) => (
                <NavDropdown.Item
                  key={link.to}
                  as={Link}
                  to={link.to}
                  eventKey={link.to}
                >
                  {link.label}
                </NavDropdown.Item>
              ))}
            </NavDropdown>
          </Nav>

          {/* 右側：ログイン関連 */}
          <Nav className="ms-auto align-items-center" style={{ gap: "10px" }}>
            <AuthNav currentUsername={currentUsername} logout={logout} />
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};
