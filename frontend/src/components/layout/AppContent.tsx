import { Container } from "react-bootstrap";
import { useAuthContext } from "../../context/AuthContext";
import { Loading, AppNavbar, Footer, ErrorToast } from "../common";
import AppRoutes from "../../AppRoutes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useErrorContext } from "../../context/ErrorContext";

const AppContent = () => {
  const { authLoading } = useAuthContext();
  const location = useLocation();
  const { clearError } = useErrorContext();

  // ルートが変わるたびにエラーをクリア
  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  if (authLoading) {
    return <Loading message="認証情報を確認中..." />;
  }

  return (
    <>
      <AppNavbar />
      <Container className="mt-4 flex-grow-1">
        <AppRoutes />
      </Container>
      <ErrorToast />
      <Footer />
    </>
  );
};

export default AppContent;
