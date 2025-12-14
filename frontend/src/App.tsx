import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuthContext } from "@/features/auth/context";
import { ErrorProvider, useErrorContext } from "./context/error";
import { createQueryClient } from "./queryClient";
import { AppRoutes } from "@/routes/AppRoutes";
import { FullScreenLoading } from "@/components/common";

// ページ遷移ごとにエラーをクリアし、初回ロード中は全画面ローディングを表示するコンポーネント
function AppContent() {
  const { authLoading } = useAuthContext();
  const { clearError } = useErrorContext();
  const location = useLocation();

  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  if (authLoading) {
    return <FullScreenLoading message="読み込み中..." />;
  }

  return <AppRoutes />;
}

// QueryClient を提供するだけのコンポーネント
function AppWithQueryClient() {
  const { setError } = useErrorContext();
  const queryClient = createQueryClient(setError);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default function App() {
  return (
    <ErrorProvider>
      {/* アプリ全体の最上位レイアウト */}
      <div className="App d-flex flex-column min-vh-100">
        <AppWithQueryClient />
      </div>
    </ErrorProvider>
  );
}
