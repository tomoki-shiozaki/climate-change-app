import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

const AppNavbar = () => {
  const location = useLocation();
  const { currentUsername, logout } = useAuthContext();

  return (
    <Navbar bg="primary" variant="dark" expand="md">
      <div className="container-fluid">
        <Navbar.Brand as={Link} to="/">
          気候変動ダッシュボード
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className="me-auto align-items-center"
            variant="pills"
            activeKey={location.pathname}
          >
            <Nav.Item>
              <Nav.Link as={Link} to="/" eventKey="/">
                ホーム
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/dashboard" eventKey="/dashboard">
                ダッシュボード
              </Nav.Link>
            </Nav.Item>

            {/* Data と About を折りたたむ */}
            <NavDropdown title="データ・概要" id="nav-dropdown">
              <NavDropdown.Item as={Link} to="/data" eventKey="/data">
                データ
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/about" eventKey="/about">
                概要
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>

          {/* 右側：ログイン関連 */}
          <Nav className="ms-auto align-items-center" style={{ gap: "10px" }}>
            {currentUsername ? (
              <>
                <span className="text-light small">{currentUsername} さん</span>
                <Button variant="outline-light" size="sm" onClick={logout}>
                  ログアウト
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" eventKey="/login">
                  ログイン
                </Nav.Link>
                <Nav.Link as={Link} to="/signup" eventKey="/signup">
                  新規登録
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default AppNavbar;
