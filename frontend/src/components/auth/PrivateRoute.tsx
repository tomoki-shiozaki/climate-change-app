import { Navigate } from "react-router-dom";
import { useAuthContext } from "@/features/auth/context/useAuthContext";
import { FullScreenLoading } from "../common";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { currentUsername, authLoading } = useAuthContext();

  // 認証チェック中は読み込み表示
  if (authLoading) {
    return <FullScreenLoading message="読み込み中..." />;
  }

  // 認証済みならページ表示
  if (currentUsername) {
    return <>{element}</>;
  }

  // 認証されていなければログインへリダイレクト
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
