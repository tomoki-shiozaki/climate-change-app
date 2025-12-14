import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { FullScreenLoading } from "@/components/common";

export function PrivateLayout() {
  const { currentUsername, authLoading } = useAuthContext();
  // 認証チェック中
  if (authLoading) return <FullScreenLoading message="読み込み中..." />;

  // 未認証
  if (!currentUsername) return <Navigate to="/login" replace />;

  // 認証済み → 子ルートを表示
  return <Outlet />;
}
