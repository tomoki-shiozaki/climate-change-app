import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { Loading } from "../common";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { currentUsername, authLoading } = useAuthContext();

  // ① 認証状態チェック中は何もリダイレクトしない（←これが重要）
  if (authLoading) {
    return <Loading message="認証状態を確認しています..." />;
  }

  // ② 認証済みならそのまま表示
  if (currentUsername) {
    return <>{element}</>;
  }

  // ③ 認証されていない場合のみリダイレクト
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
