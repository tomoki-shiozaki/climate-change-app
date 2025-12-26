import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuthContext } from "@/features/auth/context";
import { ErrorProvider, useErrorContext } from "./context/error";
import { createQueryClient } from "./queryClient";
import { AppRoutes } from "@/routes/AppRoutes";
import { FullScreenLoading } from "@/components/common";

// ページ遷移ごとにエラーをクリアし、初回ロード中は全画面ローディングを表示するコンポーネント
export function AppContent() {
  const { authLoading } = useAuthContext();
  const { clearError } = useErrorContext();
  const location = useLocation();

  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  if (authLoading) return <FullScreenLoading message="読み込み中..." />;

  return <AppRoutes />;
}

// QueryClient を提供するだけのコンポーネント
// QueryClient は ErrorContext に依存するため、ErrorProvider の内側で生成する
function AppWithQueryClient() {
  const { setError } = useErrorContext();
  const queryClient = useMemo(() => createQueryClient(setError), [setError]);

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
      <AppWithQueryClient />
    </ErrorProvider>
  );
}
