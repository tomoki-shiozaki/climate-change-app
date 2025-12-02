import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { Loading } from "../common";

interface PrivateRouteProps {
  element: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { currentUsername, authLoading } = useAuthContext();

  // 認証チェック中は読み込み表示
  if (authLoading) {
    return <Loading message="読み込み中..." />;
  }

  // 認証済みならページ表示
  if (currentUsername) {
    return <>{element}</>;
  }

  // 認証されていなければログインへリダイレクト
  return <Navigate to="/login" replace />;
};

export default PrivateRoute;
