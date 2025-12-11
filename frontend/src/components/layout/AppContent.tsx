import { Container } from "react-bootstrap";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { FullScreenLoading, AppNavbar, Footer, ErrorToast } from "../common";
import AppRoutes from "../../AppRoutes";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useErrorContext } from "../../context/error";

const AppContent = () => {
  const { authLoading } = useAuthContext();
  const location = useLocation();
  const { clearError } = useErrorContext();

  // ルートが変わるたびにエラーをクリア
  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  if (authLoading) {
    // アプリ全体の初期ロード中は全画面で読み込み表示
    return <FullScreenLoading message="読み込み中..." />;
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
