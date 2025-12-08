import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { useAuthContext } from "../../features/auth/context/AuthContext";

const AppNavbar = () => {
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
          <Nav
            className="me-auto align-items-center"
            variant="pills"
            activeKey={location.pathname}
          >
            {/* 単独リンク：主要機能 */}
            <Nav.Item>
              <Nav.Link as={Link} to="/" eventKey="/">
                ホーム
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/dashboard" eventKey="/dashboard">
                気温データ
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/co2-map" eventKey="/co2-map">
                CO₂排出量
              </Nav.Link>
            </Nav.Item>

            <Nav.Item>
              <Nav.Link as={Link} to="/renewable" eventKey="/renewable">
                再エネ利用
              </Nav.Link>
            </Nav.Item>

            {/* 補助情報は折りたたみメニュー */}
            <NavDropdown title="データ・概要" id="nav-dropdown">
              <NavDropdown.Item as={Link} to="/data" eventKey="/data">
                データ
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/about" eventKey="/about">
                概要
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/faq" eventKey="/faq">
                FAQ
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
