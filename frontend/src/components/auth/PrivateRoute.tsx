import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";

interface PrivateRouteProps {
  element: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element }) => {
  const { currentUsername } = useAuthContext();

  // ログイン済みならそのまま element を表示
  // そうでなければ /login に飛ばす
  return currentUsername ? <>{element}</> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
