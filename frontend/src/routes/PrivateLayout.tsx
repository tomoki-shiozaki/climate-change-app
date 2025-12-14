import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/useAuthContext";

export function PrivateLayout() {
  const { currentUsername } = useAuthContext();

  // 未認証 → ログインページにリダイレクト
  if (!currentUsername) return <Navigate to="/login" replace />;

  // 認証済み → 子ルートを表示
  return <Outlet />;
}
