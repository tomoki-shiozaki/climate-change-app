import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/features/auth/context/AuthProvider";
import { ErrorProvider, useErrorContext } from "./context/error";
import { createQueryClient } from "./queryClient";
import { AppRoutes } from "@/routes/AppRoutes";

function AppWithQueryClient() {
  const { setError, clearError } = useErrorContext();
  const queryClient = createQueryClient(setError);
  const location = useLocation();

  // ページ遷移時にエラーをクリア
  useEffect(() => {
    clearError();
  }, [location.pathname, clearError]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export function App() {
  return (
    <ErrorProvider>
      {/* アプリ全体の最上位レイアウト */}
      <div className="App d-flex flex-column min-vh-100">
        <AppWithQueryClient />
      </div>
    </ErrorProvider>
  );
}
